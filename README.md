# EstateCanvas — Property Post Maker

**EstateCanvas** is a responsive, production-ready web application designed for real estate agents to instantly generate beautifully designed, social-media-ready 1080×1080 property advertisement cards from four simple inputs.

Built by **Pranav Attarde**.

---

## ✨ Features (Task 1 — Core Property Post Maker)

- **Exactly 4 Input Fields**:
  1. *Property & Type* (e.g., `4 BHK Luxury Villa, Ansal Golf City`)
  2. *Location* (e.g., `Sushant Golf City, Lucknow`)
  3. *Price* (e.g., `₹2.5 Cr onwards`)
  4. *Highlights* (e.g., `3000 sq.ft · Corner plot · Ready to move`)
- **Automatic Branding**: "NS REALTY" branding and contact line ("Schedule a Visit · +91 98765 43210") automatically included.
- **Visual Design Templates**:
  - **Luxury**: Editorial serif typography with architectural line drawings and structured metadata layout.
  - **Minimal**: High-contrast, Swiss-inspired typographic layout with bold price emphasis.
  - **Midnight**: Deep charcoal aesthetic with warm ivory typography and subtle gold accents.
- **Smart Highlight Parsing**: Multi-separator support (`·`, `•`, `|`, commas, spaced hyphens/slashes) rendering clean visual chips.
- **Fluid Layout**: Precision container queries and responsive design scaling smoothly from mobile (~360px) to wide 4K screens.
- **High-Resolution PNG Export**: 3× pixel ratio (~3240×3240 px) export using `html-to-image` for crisp social media sharing.
- **Zero-Dependency Architecture**: Pure React, Vite, vanilla CSS, and Lucide icons.

---

## 🤖 AI Innovation — Task 2: AI Property Copy Enhancer

EstateCanvas includes an optional **AI Property Copy Enhancer** powered by **Groq** (`openai/gpt-oss-20b` / Groq OpenAI-compatible chat completions).

It converts the same four required property fields into a full marketing kit:
1. **Marketing Headline** (concise, high-impact headline, max 10 words)
2. **Refined Highlights** (3–5 truthful, refined bullet highlights)
3. **Call-to-Action (CTA)** (persuasive visit invitation, max 12 words)
4. **Social Media Caption** (40–70 word polished Instagram/WhatsApp copy)
5. **Relevant Hashtags** (5 curated real-estate hashtags)

### Core Innovation Principles
- **No Extra Required Fields**: Works exclusively with the existing 4 fields.
- **Truthful Copywriting**: Strict prompt guardrails ensure no hallucinated amenities, fake ROI, or unverified claims.
- **Original / AI Enhanced Mode Switcher**: Seamlessly toggle between raw values and AI-enhanced copy with instant visual comparison.
- **Non-Destructive**: Applying AI copy enhances the headline, highlight chips, and CTA while strictly preserving the original property name, location, and price.
- **One-Click Copy**: Copy caption and hashtags directly to clipboard with visual feedback.
- **Works Without AI (Graceful Degradation)**: If no API key is provided, Groq is down, or rate-limited, the core Property Post Maker remains 100% functional with helpful inline notices.

---

## 🔒 Security Architecture

- **Zero Client-Side Exposure**: The Groq API key is **never** bundled or exposed to client-side code (`VITE_*` is NOT used).
- **Serverless API Layer**: Requests route through `/api/enhance.js` (Vercel Serverless Function) which accesses `process.env.GROQ_API_KEY` exclusively on the server side.
- **Input Validation & Sanitization**: Server-side string trimming, length bounds (300 chars max per field), and JSON validation prevent prompt injection or payload abuse.

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Mani-Group
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

*(Note: The core Property Post Maker works completely even without an API key!)*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
npm run build
```

---

## 🌐 Deployment (Vercel)

1. Connect the repository to **Vercel**.
2. Add the Environment Variable in Vercel Project Settings:
   - **Key**: `GROQ_API_KEY`
   - **Value**: `gsk_your_groq_api_key_here`
3. Deploy! Vercel automatically deploys the frontend and the `/api/enhance.js` serverless function.
