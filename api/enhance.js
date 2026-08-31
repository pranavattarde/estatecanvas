// api/enhance.js — Vercel serverless function
// The GROQ_API_KEY is only accessible here, server-side. It is never sent to the browser.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'openai/gpt-oss-20b';
const FALLBACK_MODEL = 'qwen/qwen3.8-27b';
const MAX_LEN      = 300; // max characters per input field

function err(res, status, message) {
  return res.status(status).json({ error: message });
}

function sanitise(val) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, MAX_LEN);
}

export default async function handler(req, res) {
  // ── CORS pre-flight ───────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // ── Method guard ──────────────────────────────────────────────
  if (req.method !== 'POST') {
    return err(res, 405, 'Method not allowed.');
  }

  // ── Parse & validate inputs ──────────────────────────────────
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return err(res, 400, 'Invalid request body.');
  }

  const propertyType = sanitise(body?.propertyType);
  const location     = sanitise(body?.location);
  const price        = sanitise(body?.price);
  const highlights   = sanitise(body?.highlights);

  if (!propertyType || !location || !price || !highlights) {
    return err(res, 400, 'All four fields are required.');
  }

  // ── Validate API key present ──────────────────────────────────
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return err(res, 503, 'AI enhancement is not configured on this server.');
  }

  // ── Build prompt ─────────────────────────────────────────────
  const systemPrompt = `You are an expert Indian real-estate marketing copywriter.
Transform the provided property information into concise, premium marketing copy.
Strict rules:
- Strictly adhere to supplied property facts. Never invent unmentioned amenities.
- Output ONLY a valid JSON object. No explanations, no markdown code blocks, no surrounding text.

Required JSON structure:
{
  "headline": "Marketing Headline (max 10 words)",
  "enhancedHighlights": ["Refined highlight 1", "Refined highlight 2", "Refined highlight 3"],
  "cta": "Call to action (max 12 words)",
  "caption": "Social media caption (40-70 words)",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`;

  const userPrompt = `Property & Type: ${propertyType}\nLocation: ${location}\nPrice: ${price}\nHighlights: ${highlights}`;

  // ── Call Groq ────────────────────────────────────────────────
  async function callGroq(modelToUse) {
    return await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
        temperature: 0.5,
        max_tokens:  800,
      }),
    });
  }

  let groqRes;
  try {
    groqRes = await callGroq(MODEL);
    if (!groqRes.ok && groqRes.status !== 429) {
      console.warn(`[enhance] Primary model ${MODEL} returned ${groqRes.status}. Trying fallback model ${FALLBACK_MODEL}...`);
      groqRes = await callGroq(FALLBACK_MODEL);
    }
  } catch (fetchErr) {
    console.error('[enhance] Groq fetch error:', fetchErr.message);
    return err(res, 502, 'AI enhancement is temporarily unavailable.');
  }

  // ── Rate limit ────────────────────────────────────────────────
  if (groqRes.status === 429) {
    return err(res, 429, 'AI limit reached for now. Please try again shortly.');
  }

  if (!groqRes.ok) {
    console.error('[enhance] Groq non-OK status:', groqRes.status);
    return err(res, 502, 'AI enhancement is temporarily unavailable.');
  }

  // ── Parse Groq response ───────────────────────────────────────
  let groqBody;
  try {
    groqBody = await groqRes.json();
  } catch {
    return err(res, 502, 'AI returned an unexpected response format.');
  }

  const rawContent = groqBody?.choices?.[0]?.message?.content;
  if (!rawContent) {
    return err(res, 502, 'AI returned an empty response.');
  }

  // ── Parse AI JSON ─────────────────────────────────────────────
  let aiData;
  try {
    // Extract JSON object enclosed in curly braces
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }
    aiData = JSON.parse(jsonMatch[0]);
  } catch {
    console.error('[enhance] Failed to parse AI JSON:', rawContent.slice(0, 200));
    return err(res, 502, 'AI returned malformed data. Please try again.');
  }

  // ── Validate required fields ──────────────────────────────────
  const { headline, enhancedHighlights, cta, caption, hashtags } = aiData;
  if (
    typeof headline !== 'string' ||
    !Array.isArray(enhancedHighlights) ||
    typeof cta !== 'string' ||
    typeof caption !== 'string' ||
    !Array.isArray(hashtags)
  ) {
    return err(res, 502, 'AI returned incomplete data. Please try again.');
  }

  // ── Return clean result ──────────────────────────────────────
  return res.status(200).json({
    headline:           headline.slice(0, 150),
    enhancedHighlights: enhancedHighlights.slice(0, 5).map(String),
    cta:                cta.slice(0, 150),
    caption:            caption.slice(0, 700),
    hashtags:           hashtags.slice(0, 5).map(String),
  });
}
