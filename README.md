# Byapari AI (B-AI) — ব্যাপারী

**AI-powered business intelligence for Bangladeshi merchants.**
Upload one sales CSV → get a full decision-support system: KPIs, health score, AI recommendations in Bengali, demand forecast, dynamic pricing, knowledge-graph insights, and live market signals — in under 60 seconds, with zero setup.

> 🏆 Built for **THE INFINITY AI BUILDFEST 2026** — Track 4: Online Commerce (AI-Driven Marketplace Optimization)
> 👤 S M Mohaiminul Islam — **Team Nexion**

| | |
|---|---|
| 🌐 **Live app** | https://byapari-ai.vercel.app |
| 📚 **Docs hub** | https://byapari-ai.vercel.app/docs |
| ⚙️ **Backend API** | https://byapari-ai-production.up.railway.app |
| ❤️ **Health check** | https://byapari-ai-production.up.railway.app/health |
| ✉️ **Contact** | blueberry.poison.1309@gmail.com |

---

## The problem

Bangladesh has millions of small merchants — Facebook-page sellers, Daraz storefronts, neighborhood retailers — who **already produce sales data** but can't act on it:

- Enterprise BI (Tableau, Power BI) assumes data teams and budgets they don't have
- Generic chatbots give generic advice that ignores Eid seasonality, bKash behavior, and monsoon stock risk
- Almost everything is **English-only** — a real adoption barrier
- Any setup step (accounts, databases, integrations) loses this audience

**Byapari AI removes every layer between a raw spreadsheet and a confident business decision — in the merchant's own language.**

## What it does

```
   UPLOAD CSV  ──▶  ANALYZE  ──▶  ACT
   drag & drop      KPIs, health   AI recommendations (বাংলা/EN),
   (sample          score, trends, pricing moves, bundles,
   provided)        forecast       city expansion, market context
```

1. **KPI dashboard** — revenue, profit, orders, ratings, returns, stock health
2. **Business Health Score** (0–100) with an explained breakdown
3. **AI recommendations** in fluent Bengali or English, grounded in the merchant's own numbers
4. **Sales forecast** (Prophet) tuned to Bangladeshi seasonality — Eid demand spikes are modeled explicitly
5. **Dynamic pricing engine** — per-product raise/lower/hold suggestions with stated reasons and expected impact
6. **🕸️ Knowledge-graph reasoning** — builds a typed graph (products ↔ categories ↔ cities ↔ payment methods) from the merchant's data and mines it for cross-sell bundles, under-served city markets, and payment-behavior patterns (GraphRAG grounding for the LLM)
7. **📡 Live market signals** — scrapes and parses real-world data at request time: USD/BDT exchange rate (import-cost pressure) and Bangladesh business headlines (Google News RSS)
8. **👤 Merchant personalization engine** — explicit profile (business type, scale tier, digital-payment adoption, geographic concentration, risk flags) that conditions every AI output
9. **📚 RAG knowledge base** — 35 hand-curated Bengali business tips (pricing, inventory, seasonal, digital) retrieved by context and injected into the LLM prompt
10. **Rule-based real-time alerts** — instant, zero-AI-cost critical/warning/info triage

## AI-native architecture

```
 ┌──────────┐  HTTPS  ┌──────────┐   REST/JSON   ┌─────────────────────────────────┐
 │ Browser  │ ──────▶ │ Next.js  │ ────────────▶ │            FastAPI              │
 │ (UI)     │ ◀────── │ (Vercel) │ ◀──────────── │           (Railway)             │
 └──────────┘         └──────────┘               └───────────────┬─────────────────┘
                                                                 │
        ┌──────────────┬─────────────────┬───────────────┬───────┴────────┬──────────────────┐
        ▼              ▼                 ▼               ▼                ▼                  ▼
 ┌────────────┐ ┌─────────────┐ ┌───────────────┐ ┌────────────┐ ┌───────────────┐ ┌───────────────┐
 │  Prophet   │ │ Knowledge   │ │  Keyword RAG  │ │ Personali- │ │ Market Intel  │ │   Groq LLM    │
 │ forecasting│ │ Graph       │ │ (Bengali tips │ │ zation     │ │ (FX rate +    │ │ llama-3.3-70b │
 │ (Eid-aware)│ │ (GraphRAG)  │ │  KB, 35 tips) │ │ Engine     │ │ news scraper) │ │   -instant    │
 └────────────┘ └─────────────┘ └───────────────┘ └────────────┘ └───────┬───────┘ └───────────────┘
                                                                         │
                                                              live external data
                                                       (open.er-api.com, Google News RSS)
```

**Intelligence flow (input → intelligence core → output → feedback):** uploaded CSV → KPI/insight engine → knowledge graph + merchant profile + RAG retrieval + live market signals → all four injected as grounding context into the LLM prompt → structured recommendations with type, priority, and **confidence score** → data-quality report and explainable breakdowns close the loop with the user.

### Why these engineering choices

- **Stateless by design** — uploaded data is processed in-memory per request and never persisted. Privacy by architecture, not policy; scales horizontally with zero migration concerns.
- **Keyword RAG over vector DB** — an earlier ChromaDB + sentence-transformers build caused cold-start timeouts on free-tier hosting (~90MB model download). For a fixed, curated 35-tip KB, keyword retrieval delivers equivalent relevance with instant startup. A deliberate, documented trade-off.
- **In-memory knowledge graph** — pure Python, built per-request from the merchant's own data. No graph database to operate; same reasoning patterns (typed nodes/edges, affinity queries) without infrastructure cost.
- **Groq `llama-3.3-70b-versatile` (auto-fallback to `llama-3.1-8b-instant`)** — Groq's inference speed keeps the "results in seconds" promise; the 70B model writes markedly more fluent Bengali, and the fallback keeps the product alive under rate limits.
- **Hybrid intelligence** — deterministic rules for alerts (zero token cost), ML for forecasting, graph for relationships, LLM only where natural language matters.

## Responsible AI

- **No data retention** — uploads live only for the duration of one request
- **Explainability** — every recommendation carries a type, priority, confidence score, and the data that justifies it; the health score ships with its full breakdown
- **Grounding over generation** — the LLM is constrained by real KPIs, graph facts, retrieved local knowledge, and live market data, which materially reduces hallucination
- **Transparent ingestion** — the data-quality report shows exactly which rows were fixed/dropped and why
- **Graceful degradation** — if the LLM or any external source is unreachable, deterministic analysis still works and the UI says so honestly

## Run it locally

### Backend (FastAPI, Python 3.11)

```bash
cd backend
python -m venv venv && venv\Scripts\activate   # or source venv/bin/activate
pip install -r requirements.txt
echo GROQ_API_KEY=your_key_here > .env
uvicorn app.main:app --reload --port 8000
```

### Frontend (Next.js 16, React 19)

```bash
cd frontend
npm install
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
npm run dev
```

Open http://localhost:3000, download the sample CSV from the upload panel or `/docs`, and drop it in.

## Expected CSV schema

`date, product_name, product_category, sales, profit, quantity, rating, returned, stock, payment_method, customer_city`

The ingestion pipeline auto-corrects common messiness (mixed boolean encodings, malformed dates, type mismatches) and reports every fix it makes.

## Business model

| Plan | Price | For |
|---|---|---|
| **Free** | ৳0 forever | 500 rows/upload, KPI dashboard, 30-day forecast, 5 AI insights |
| **Pro** | **৳499/month** | Unlimited rows, 90-day forecast, unlimited insights, pricing engine, Bengali + English, RAG tips |
| **Enterprise** | Custom | Multi-user, API access, integrations, SLA |

Priced in BDT for the market it serves. The same architecture generalizes to any emerging market with spreadsheet-first merchants — swap the knowledge base, holiday calendar, and language pack (the localization layer is modular by design).

## Tech stack

**Frontend:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Recharts — deployed on Vercel
**Backend:** FastAPI · Python 3.11 · pandas · scikit-learn · Prophet · Groq SDK — deployed on Railway
**Built with:** Claude Code (AI-native development workflow — architecture-as-markdown, prompt-driven iteration)

## Roadmap

Accounts & history → Daraz/Facebook Commerce integrations → scheduled WhatsApp digests → bKash/Nagad billing → stock-out prediction → PWA for mobile-first merchants.

---

*Byapari (ব্যাপারী) means "merchant" in Bengali. Built locally. Designed to lead globally.*
