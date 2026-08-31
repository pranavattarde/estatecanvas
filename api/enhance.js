// api/enhance.js — Vercel serverless function
// The GROQ_API_KEY is only accessible here, server-side. It is never sent to the browser.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'openai/gpt-oss-20b';
const MAX_LEN      = 300; // max characters per input field

function err(res, status, message) {
  return res.status(status).json({ error: message });
}

function sanitise(val) {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, MAX_LEN);
}

export default async function handler(req, res) {
  // ── CORS pre-flight (harmless for Vercel but safe to include) ──
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
  const isMock = apiKey === 'mock' || body?.mock === true;

  if (!apiKey && !isMock) {
    return err(res, 503, 'AI enhancement is not configured on this server.');
  }

  // ── Dev/Mock Response for testing without live Groq API key ──
  if (isMock) {
    const locMain = location.split(',')[0].trim();
    return res.status(200).json({
      headline: `Exclusive Living in ${locMain}`,
      enhancedHighlights: [
        `Spacious residence in ${locMain}`,
        'Premium corner plot location',
        'Ready for immediate possession',
      ],
      cta: 'Your dream residence awaits — schedule a visit today.',
      caption: `Experience premium living with this exquisite ${propertyType} in ${location}. Offered at ${price}. Book your private viewing today.`,
      hashtags: [
        `#${locMain.replace(/\s+/g, '')}RealEstate`,
        '#LuxuryLiving',
        '#PropertyForSale',
        '#DreamHome',
        '#PremiumHomes',
      ],
    });
  }

  // ── Build prompt ─────────────────────────────────────────────
  const systemPrompt = `You are an expert Indian real-estate marketing copywriter.
Your job is to transform raw property information into concise, premium and truthful marketing copy suitable for Instagram, WhatsApp and real-estate advertisements.

STRICT RULES:
- Never invent property facts.
- Never invent amenities.
- Never change the supplied price.
- Never change the supplied location.
- Never claim metro connectivity, schools, hospitals, ROI, appreciation, security, clubhouse, swimming pool, possession dates, certifications or developer reputation unless explicitly supplied.
- Do not use excessive hype.
- Keep the copy concise.
- Maintain a premium professional tone.
- Preserve numerical information accurately.
- Indian real estate context should be respected.

Generate:
- headline: Maximum 10 words.
- enhancedHighlights: Exactly 3 to 5 concise highlights based ONLY on supplied information.
- cta: Maximum 12 words.
- caption: Approximately 40-70 words.
- hashtags: Exactly 5 relevant hashtags.

Return ONLY valid JSON. No markdown. No code fences. No commentary.
Required structure:
{
  "headline": "string",
  "enhancedHighlights": ["string","string","string"],
  "cta": "string",
  "caption": "string",
  "hashtags": ["#Tag","#Tag","#Tag","#Tag","#Tag"]
}`;

  const userPrompt = `Property & Type: ${propertyType}
Location: ${location}
Price: ${price}
Highlights: ${highlights}`;

  // ── Call Groq ────────────────────────────────────────────────
  let groqRes;
  try {
    groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
        temperature:  0.6,
        max_tokens:   700,
        response_format: { type: 'json_object' },
      }),
    });
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
    return err(res, 502, 'AI returned an unexpected response.');
  }

  const rawContent = groqBody?.choices?.[0]?.message?.content;
  if (!rawContent) {
    return err(res, 502, 'AI returned an empty response.');
  }

  // ── Parse AI JSON ─────────────────────────────────────────────
  let aiData;
  try {
    // Strip accidental markdown fences the model might still output
    const cleaned = rawContent.replace(/```json|```/g, '').trim();
    aiData = JSON.parse(cleaned);
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
    headline:           headline.slice(0, 120),
    enhancedHighlights: enhancedHighlights.slice(0, 5).map(String),
    cta:                cta.slice(0, 120),
    caption:            caption.slice(0, 600),
    hashtags:           hashtags.slice(0, 5).map(String),
  });
}
