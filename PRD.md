# Product Requirements Document (PRD)
## Byapari AI (B-AI) — AI-Powered Business Intelligence for Bangladeshi Merchants

| | |
|---|---|
| **Product** | Byapari AI ("B-AI · Byapari Intelligence") |
| **Document Type** | Product Requirements Document |
| **Version** | 1.0 |
| **Status** | Live (MVP shipped, in active iteration) |
| **Author** | S M Mohaiminul Islam — Team Nexion |
| **Affiliation** | CloudCamp Bangladesh |
| **Context** | Infinity AI BuildFest — Hackathon Submission |
| **Last Updated** | 2026-06-07 |
| **Live Product** | https://byapari-ai.vercel.app |
| **Documentation Hub** | https://byapari-ai.vercel.app/docs |
| **Contact** | blueberry.poison.1309@gmail.com |

---

## 1. Executive Summary

**Byapari AI** ("ব্যাপারী" — *Byapari* — means **"merchant"** in Bengali) is an AI-powered business intelligence platform that converts a single sales spreadsheet into a complete decision-support system for small and medium merchants in Bangladesh.

A user uploads a CSV export of their sales data — something nearly every shop owner already has, whether from a POS system, a marketplace dashboard (Daraz, Facebook Shop), or a manually maintained spreadsheet — and within seconds receives:

- A live **KPI dashboard** (revenue, profit, orders, ratings, returns, stock health)
- A composite **Business Health Score** (0–100) with an explained breakdown
- **AI-generated recommendations** in natural Bengali or English, grounded in the merchant's own numbers
- A **30–90 day sales forecast** tuned to Bangladeshi seasonal patterns (Eid, weekly cycles)
- **Dynamic pricing suggestions** per product, with a stated rationale and expected impact
- **Locally-relevant business tips** pulled from a curated Bengali knowledge base via retrieval-augmented generation (RAG)

The product requires no setup, no database, no integration work, and no technical knowledge — the entire value proposition is "drop a CSV in, walk out with a plan."

This document describes the problem Byapari AI solves, who it serves, what it does today (the shipped MVP), how it is built, and how it is intended to grow.

---

## 2. Problem Statement & Opportunity

### 2.1 The problem

Bangladesh has a massive and fast-growing population of small and medium online/offline merchants — Facebook-page shop owners, Daraz sellers, neighborhood retailers digitizing their records, and small wholesalers. Almost all of them **already produce sales data** (order exports, spreadsheets, POS reports), but almost none of them can act on it, because:

1. **Enterprise BI tools are not built for them.** Platforms like Tableau, Power BI, or even mid-market analytics SaaS assume a data team, an English-speaking analyst, and budgets that are an order of magnitude beyond what a small merchant can justify.
2. **Generic AI tools require a prompt-engineering mindset.** Pasting a spreadsheet into a chatbot and asking "what should I do?" produces generic, non-actionable advice that ignores local context (Eid demand spikes, bKash payment behavior, return-rate norms, monsoon stock risk, etc.).
3. **Language is a real barrier.** Most analytics tooling is English-only. A merchant who thinks and operates in Bengali has to mentally translate both the question and the answer — friction that causes most owners to simply not use the tool at all.
4. **Setup cost kills adoption.** Anything that requires creating an account, connecting a database, installing a plugin, or configuring a dashboard loses the audience this product is for. The barrier to the *first moment of value* has to be near zero.

### 2.2 The opportunity

If a merchant can get from "I have a spreadsheet" to "I know exactly which three products to discount this week, and why" in under sixty seconds — in their own language — the tool becomes something they actually open every week, not a novelty they try once.

Byapari AI is built around that single insight: **remove every layer between raw sales data and a confident business decision.**

---

## 3. Goals & Objectives

### 3.1 Product goals

| Goal | Description |
|---|---|
| **Zero-friction onboarding** | No signup wall to try the core experience. Upload a CSV → see results. A sample CSV is provided for instant testing. |
| **Localization as a first-class feature** | Full Bengali language support is not a translation layer bolted on top — insights, recommendations, and tips are generated and curated specifically for the Bangladeshi market (currency in ৳, Eid/Ramadan seasonality, bKash payments, local product categories). |
| **Actionability over dashboards** | Every screen answers "so what should I do?" rather than just "here are your numbers." KPIs are paired with AI recommendations, a health score, and pricing actions — not left as raw charts for the user to interpret alone. |
| **Affordability** | Priced in BDT at a level appropriate for a small merchant's budget (Free tier with no card required; Pro at **৳499/month**), not at SaaS-for-enterprises rates. |
| **Trustworthy AI** | AI output is grounded in the merchant's own uploaded numbers and a curated local knowledge base (RAG), reducing hallucination and making recommendations traceable back to real data points. |
| **Operational simplicity** | The system is intentionally stateless — no database, no user data retention, no infrastructure burden — so it can run reliably on free/low-cost hosting tiers and scale horizontally without migration concerns. |

### 3.2 Success criteria for the MVP

- A first-time user can go from landing on the homepage to seeing a populated dashboard with AI insights in **under two minutes**, using only the provided sample CSV.
- The platform correctly produces KPIs, a health score, a forecast, and at least 3 AI recommendations for any well-formed CSV matching the documented schema.
- The experience is fully usable in **both Bengali and English** with no missing translations in the core flow.
- The product is publicly deployed and reachable (frontend on Vercel, backend on Railway) with a visible, accurate connection-status indicator.

---

## 4. Target Users & Personas

### 4.1 Primary persona — "Rafiq, the Online Shop Owner"
- Runs a small fashion/electronics/grocery business through a Facebook page or Daraz storefront.
- Has 1–3 months of order history exported as a spreadsheet (from the marketplace, a POS tool, or manual entry).
- Is comfortable with basic spreadsheets but has never used an analytics or BI product.
- Thinks and communicates primarily in Bengali; reads English with effort.
- Wants concrete answers: *Which product should I restock? Which one should I discount? Is my business doing okay?*
- Price-sensitive — will not pay for something whose value isn't obvious within minutes.

### 4.2 Secondary persona — "Shirin, the Growing Retailer"
- Has scaled past a one-person operation; manages multiple product categories and a small team.
- Wants recurring, not one-off, insight — checks the dashboard weekly to plan promotions, restocking, and pricing.
- Cares about trends over time (forecasts, seasonal prep for Eid/Ramadan/wedding season) more than a single snapshot.
- A natural candidate for the **Pro tier**.

### 4.3 Tertiary persona — "Hackathon Judge / Evaluator"
- Needs to assess the product's technical depth, originality, and execution quickly.
- Values a clear architecture explanation, a working live demo, sample data to test with, and visible API documentation.
- This persona is directly served by the dedicated **`/docs`** page (see §7.12).

---

## 5. Product Scope

### 5.1 In scope (shipped in current MVP)
- CSV upload, validation, and automatic data-quality correction
- KPI computation and display
- Business Health Score with breakdown
- AI-generated insights and recommendations (Bengali + English)
- Rule-based real-time alerts (zero AI cost)
- Sales trend visualization and top-product analytics
- Time-series sales forecasting (Prophet, Bangladesh-aware)
- Dynamic per-product pricing suggestions
- RAG-powered local business tips (Bengali knowledge base)
- Knowledge-graph reasoning over merchant data (cross-sell bundles, city expansion gaps, payment-behavior patterns)
- Merchant personalization engine (explicit business profile conditioning all AI output)
- Live market-signal ingestion (USD/BDT exchange rate + Bangladesh business headlines, scraped/parsed at request time)
- Bilingual UI and AI output (Bengali ⇄ English)
- Public documentation hub (`/docs`)
- Pricing/plan presentation and contact routing
- Production deployment (Vercel + Railway) with live health monitoring

### 5.2 Out of scope (not in current MVP — see §15 Roadmap)
- User accounts, authentication, and saved history across sessions
- Persistent storage of uploaded data (the system is intentionally stateless)
- Payment processing / subscription billing integration
- Direct marketplace integrations (Daraz API, Facebook Commerce API, etc.)
- Multi-user / team collaboration features
- Mobile native applications
- Real-time data sync (current flow is upload-and-analyze, not live-connected)

---

## 6. Core User Journey

```
 ┌──────────────┐      ┌───────────────┐      ┌──────────────────┐
 │  1. UPLOAD   │ ───▶ │  2. ANALYZE   │ ───▶ │     3. ACT       │
 │              │      │               │      │                  │
 │ Drag & drop  │      │ KPIs, health  │      │ AI insights,     │
 │ a sales CSV  │      │ score, trends,│      │ pricing moves,   │
 │ (or use the  │      │ forecast      │      │ RAG tips —       │
 │ sample file) │      │ generated     │      │ in Bengali or    │
 │              │      │ instantly     │      │ English          │
 └──────────────┘      └───────────────┘      └──────────────────┘
```

**Step-by-step:**

1. **Land & evaluate** — The user arrives at the dashboard, sees the "About B-AI" overview, and can immediately download a ready-made sample CSV (10 realistic rows, all required columns populated) if they don't have their own data handy.
2. **Upload** — The user drags a CSV onto the Upload panel. The backend validates structure, repairs common data issues (missing values, type mismatches, malformed dates), and reports exactly what it changed via a **data quality report** (rows uploaded vs. analyzed vs. dropped, fixes applied, warnings).
3. **Instant analysis** — Within seconds, the dashboard populates with KPIs, a health score, a sales-trend chart, a top-products breakdown, and a forecast — no further action required.
4. **AI-driven action layer** — The user opens **AI Insights** to receive natural-language recommendations (in Bengali or English) that reference their actual numbers — e.g., *"আপনার Cats Eye Jeans পণ্যের রিটার্ন রেট ১৮% — পণ্যের বিবরণ ও সাইজ গাইড উন্নত করুন"* ("Your Cats Eye Jeans return rate is 18% — improve the product description and size guide"). Each recommendation carries a type (growth / warning / risk / inventory / success), a priority, and a confidence score.
5. **Pricing action** — The user opens **Pricing** insights to see which specific products should have prices raised, lowered, or held — each suggestion paired with the data that justifies it (sales velocity, return rate, days of stock remaining, profit margin) and an estimate of the expected impact.
6. **Plan ahead** — The user checks the **forecast** to anticipate the next 7–90 days of sales, including modeled effects of upcoming Eid demand spikes, and adjusts stock and marketing plans accordingly.

---

## 7. Features & Functional Requirements

This section documents each shipped capability, its purpose, and its expected behavior.

### 7.1 CSV Upload & Intelligent Ingestion
**Purpose:** Make "I have a spreadsheet" sufficient to start — no formatting gymnastics required.

- Accepts CSV files via drag-and-drop or file picker (`POST /upload`, multipart form data).
- Validates the file against the expected schema (see §10 Data Requirements).
- **Auto-corrects common data problems** rather than rejecting the file outright — e.g., normalizes inconsistent boolean representations (`Yes/yes/YES/1/True` for returns), coerces types, and handles malformed dates.
- Returns a **Data Quality Report** alongside the analysis:
  - `rows_uploaded` / `rows_analyzed` / `rows_dropped`
  - `fixes_applied` — a list of the specific corrections the system made
  - `warnings` — issues that didn't block analysis but the user should know about
- This transparency builds trust: the user can see exactly what the system did to their data and why a row may have been excluded.

### 7.2 KPI Dashboard
**Purpose:** Surface the numbers that matter most, the moment data lands.

Computed instantly from the uploaded data:

| KPI | Description |
|---|---|
| Total Orders | Count of all order rows |
| Total Sales | Sum of revenue across all orders |
| Total Profit | Sum of profit across all orders |
| Average Rating | Mean customer rating (out of 5) |
| Returned Orders | Count of orders marked as returned |
| Top Category | Most frequent product category (statistical mode) |
| Most-Used Payment Method | Most common payment method (e.g., Cash on Delivery, bKash, Bank Transfer) |
| Low-Stock Products | Count of products with stock below the healthy threshold (< 30 units) |

### 7.3 Business Health Score
**Purpose:** Compress many signals into one number a non-analyst can act on instantly.

- A composite **0–100 score** with a qualitative label (e.g., "Excellent," "Needs Attention") and an associated color for at-a-glance reading.
- Backed by a **breakdown** across the dimensions that drive it — rating, returns, stock health, and profit — each shown with its own sub-score, raw value, and label, so the user can see *why* the score is what it is, not just *what* it is.
- Designed to be the single number a busy merchant checks first thing.

### 7.4 AI-Generated Insights & Recommendations
**Purpose:** Translate raw numbers into specific, written guidance — in the user's language.

- Powered by **Groq's `llama-3.3-70b-versatile`** model (with automatic fallback to `llama-3.1-8b-instant` if rate-limited) via the Groq API — chosen for very low latency (critical for a "results in seconds" experience), low operating cost (essential for a free-tier-friendly product), and noticeably more fluent Bengali output from the 70B model.
- Each recommendation includes:
  - `type` — `growth`, `warning`, `risk`, `inventory`, or `success`
  - `title` and `message` — human-readable, written in fluent Bengali or English depending on the user's language preference
  - `priority` — `low`, `medium`, or `high`
  - `confidence` — a numeric confidence score
- Recommendations are **grounded**: the model is given the user's actual computed KPIs, detected patterns, and (when relevant) retrieved tips from the local knowledge base (see §7.7 RAG), which substantially reduces generic or hallucinated advice.
- An **AI Summary** — a short natural-language synthesis of the overall business state — is generated alongside the structured recommendation list.
- Served via `POST /api/ai-insights`, accepting a `lang` parameter (`"bn"` or `"en"`) so the same data can be analyzed in either language on demand.

### 7.5 Rule-Based Real-Time Alerts
**Purpose:** Surface urgent issues instantly, with zero AI/API cost.

- Computed entirely client-side from KPIs and the health score — no network round-trip, no token cost.
- Three severity levels — **Critical**, **Warning**, **Info** — each with distinct styling (color, background, border) for immediate visual triage.
- Current rules include:
  - Health score below 50 → critical; below 70 → warning
  - Profit margin under 10% of total sales → warning
  - Return rate above 20% of orders → critical; above 10% → warning
- This hybrid approach (cheap deterministic rules + selective AI calls) keeps the product fast and inexpensive to run at scale.

### 7.6 Sales Forecasting
**Purpose:** Let merchants plan ahead, not just look back.

- Built on **Meta's Prophet** time-series forecasting library.
- Aggregates historical daily sales and projects forward (default ~7 days, extendable to 90 days on the Pro plan), returning predicted sales with **lower and upper confidence bounds** for each forecasted date.
- **Tuned for the Bangladeshi market specifically**:
  - A custom **holiday calendar for Eid-al-Fitr** is built into the model (with a configurable window before/after each date), so forecasts reflect the demand spikes merchants actually experience.
  - Weekly and yearly seasonality are enabled; the model's flexibility parameters (`changepoint_prior_scale`, `seasonality_prior_scale`, `holidays_prior_scale`) are tuned to surface visible, meaningful trend shifts rather than flat-line predictions — important for a market with sharp seasonal cycles.
- Gracefully degrades for sparse data: if fewer than two data points exist, the system returns a reasonable flat-trend projection instead of failing.

### 7.7 RAG-Powered Local Business Knowledge Base
**Purpose:** Make AI advice *locally relevant*, not generically correct.

- A curated knowledge base of **35 Bengali-language business tips**, hand-written for the Bangladeshi merchant context and organized into seven categories:

  | Category | Example focus |
  |---|---|
  | Pricing | Seasonal markup strategy, discount psychology, wholesale negotiation |
  | Inventory | Stock cycles, Ramadan demand planning, dead-stock prevention |
  | Customer Service | Complaint resolution windows, WhatsApp communication, loyalty programs |
  | Marketing | Facebook Ads framing, micro-influencer ROI, weekly offer cadence |
  | Seasonal | Pohela Boishakh, Puja, wedding season, monsoon/winter demand shifts |
  | Operations | Stock auditing cadence, delivery incentives, staff retention |
  | Digital | bKash cashback strategy, SMS vs. email open rates, QR payments |

- **Retrieval mechanism:** a lightweight, dependency-free **keyword-matching engine** (pure Python `re`, no ML model, no external downloads). User context is normalized and tokenized, matched against a keyword → tip-ID map, scored, and ranked — returning the top-N most relevant tips with a computed relevance score. If no keyword matches are found, the system falls back to a representative random sample so the experience never returns empty.
- These retrieved tips are injected into the LLM prompt as grounding context, and are also surfaced directly to the user as standalone recommendations (`rag_recommendations`) with category and relevance metadata.
- **Why keyword-based instead of vector/embedding search:** an earlier iteration used ChromaDB with a sentence-transformer embedding model, but the embedding model's ~90MB first-run download from Hugging Face caused cold-start timeouts on free-tier hosting. The keyword-based approach delivers comparable practical relevance for this fixed, curated tip set — with **zero model downloads, instant startup, and no external runtime dependencies** — a deliberate engineering trade-off favoring reliability and operational simplicity over marginal retrieval sophistication.

### 7.8 Dynamic Pricing Engine
**Purpose:** Turn "what should I price this at?" from a guess into a data-backed recommendation.

- Analyzes each product individually using four computed signals:
  - **Sales velocity** — average daily sales over a trailing window, relative to the dataset's own date range
  - **Return rate** — proportion of orders returned (robust to inconsistent boolean encodings)
  - **Stock turnover** — estimated days of remaining stock at the current sales rate
  - **Profit margin** — profitability relative to revenue
- Produces, per product:
  - A `suggestion` (e.g., raise price, lower price, hold) and a plain-language `reason`
  - A specific `price_change_percent`
  - A `priority` (high / medium / low)
  - An `expected_impact` description and a ready-to-display `display_text`
- Also returns a portfolio-level **summary**: total pricing opportunities found, estimated revenue at risk, potential uplift, the single top-priority product, and counts of stable vs. total products — giving the user both the micro (per-product) and macro (whole-business) view.
- Served via `POST /api/pricing-suggestions`, also language-aware (`bn` / `en`).

### 7.9 Sales Trend & Product Analytics
**Purpose:** Visual, explorable views beneath the headline numbers.

- **Sales Trend** — time-series line/area charts (via Recharts) showing revenue, profit, and order volume over time, with month-level aggregation for readability.
- **Top Products** — ranked breakdown of best-performing products by revenue and units sold.
- **Product Intelligence** — identification of top performers, weak/underperforming products, low-stock alerts, and "dead inventory" risk (high stock, low sales velocity).
- Dedicated, full views for **Sales Trend** and **Products** are reachable from the sidebar, in addition to the summarized dashboard widgets.

### 7.10 Bilingual Experience (Bengali ⇄ English)
**Purpose:** Meet merchants in the language they actually think in.

- Every AI-generated insight, recommendation, alert label, and RAG tip is available in **fluent Bengali** as well as English — not machine-translated as an afterthought, but generated/curated natively in both languages.
- The language preference (`lang: "bn" | "en"`) is passed through to both the AI insights and pricing-suggestion endpoints, so the user can switch perspectives on the same underlying data at will.
- This is treated as core product infrastructure, not a "nice to have" — it is the difference between a tool a Bangladeshi merchant tries once and one they trust weekly.

### 7.11 Connection & System Status
**Purpose:** Be transparent about whether the AI backend is reachable — especially important for a product that depends on a live API.

- A persistent **connection indicator** in the UI reflects real-time backend reachability via a lightweight health check (`GET /health`, with a 3-second timeout).
- States: *Checking…* (on load) → **Online** (green, backend healthy) or **Offline** (backend unreachable).
- This avoids the worst failure mode for this kind of product — a user staring at a blank dashboard with no idea whether to wait, retry, or give up.

### 7.12 Documentation Hub (`/docs`)
**Purpose:** Give evaluators (and future integrators) a complete, self-contained reference without leaving the product.

A standalone, anchor-navigable page covering:
1. **What is Byapari AI** — plain-language overview in both English and Bengali, plus feature highlight pills
2. **How It Works** — the visual Upload → Analyze → Act journey (§6), plus the required CSV column list
3. **API Reference** — full endpoint table with complete request/response JSON samples for the AI-insights and pricing-suggestions endpoints
4. **Architecture** — a visual diagram of the request path (Browser → Next.js → FastAPI → \[Prophet / RAG / Groq LLM\])
5. **RAG Knowledge Base** — stats (35 tips, keyword-based retrieval, top-3 results), category breakdown, and a sample tip in Bengali
6. **Sample CSV** — a visible 10-row, schema-correct example with a one-click download (generated client-side via the Blob API, no server round-trip) and a direct link to the upload flow
7. **Pricing** — the same three-tier plan structure as the main pricing page, kept in sync

### 7.13 Knowledge Graph Reasoning (GraphRAG)
**Purpose:** Reason over *relationships* in the merchant's data, not just aggregates.

- Builds an in-memory typed knowledge graph per analysis request: `(Product)→(Category)`, `(Product)→(City)` weighted by revenue, `(Product)↔(Product)` co-demand edges (same-city/same-week basket proxy), `(Category)→(PaymentMethod)`.
- Runs three reasoning queries over the graph:
  - **Cross-sell pairs** — strongest co-demand product pairs → concrete bundle suggestions
  - **City expansion opportunities** — categories under-indexed in the merchant's strong cities (global revenue share vs. local share gap)
  - **Payment preferences** — dominant payment method per category, informing offer design (e.g., bKash cashback where digital adoption is already high)
- Graph findings are returned to the UI (`graph_insights`, with node/edge stats) **and** serialized into natural-language facts that ground the LLM prompt — a GraphRAG pattern.
- Implemented in pure Python with no graph database: the per-merchant graph is small (tens of nodes), so in-memory construction preserves the stateless architecture and free-tier startup time while delivering genuine graph reasoning. A persistent graph store (Neo4j/PGVector) is the documented path once user accounts land (§16).

### 7.14 Merchant Personalization Engine
**Purpose:** The same numbers mean different things for a micro fashion seller in Khulna and a growing electronics retailer in Dhaka — make the advice *theirs*.

- Builds an explicit profile from the uploaded data: business type (dominant category mix), scale tier (micro/small/growing), digital-payment adoption %, geographic concentration (top city + share), risk flags (high returns, low ratings, cash dependence), and strengths.
- The profile is surfaced to the user (`merchant_profile`, rendered as chips in the AI Insights panel) and serialized into the LLM prompt so every recommendation is conditioned on who this merchant actually is.

### 7.15 Live Market Intelligence (External Data Ingestion)
**Purpose:** Ground advice in what is happening *outside* the merchant's spreadsheet.

- Fetches and parses two real-world signals at request time (stdlib-only HTTP + XML parsing, no added dependencies):
  - **USD→BDT exchange rate** (open.er-api.com) — import-cost pressure, fed into pricing context for imported goods such as electronics
  - **Bangladesh business headlines** (Google News RSS, scraped and parsed) — live market awareness surfaced directly to the merchant
- Both signals are cached in-memory with a 1-hour TTL and degrade gracefully: if the outside world is unreachable, analysis proceeds and the response marks the signal unavailable — never a hard failure.

### 7.16 Pricing & Plan Presentation
**Purpose:** Communicate value and provide a clear upgrade/contact path.

- Three tiers are presented consistently across the main app and the docs hub: **Free**, **Pro (৳499/month)**, and **Enterprise (custom)**.
- The **Enterprise "Contact Us"** action opens a pre-addressed email (`mailto:blueberry.poison.1309@gmail.com`) — routing potential larger customers directly to the team rather than into a dead-end form.
- Full tier breakdown is documented in §13.

---

## 8. System Architecture & Technical Stack

### 8.1 High-level architecture

```
 ┌────────────┐     HTTPS      ┌───────────────┐     REST / JSON    ┌──────────────────────┐
 │  Browser   │ ─────────────▶ │   Next.js     │ ─────────────────▶ │      FastAPI         │
 │ (user UI)  │ ◀───────────── │  (Vercel)     │ ◀───────────────── │     (Railway)        │
 └────────────┘    JSON/HTML   └───────────────┘                    └──────────┬───────────┘
                                                                               │
        ┌───────────────┬────────────────┬────────────────┬───────────────────┼──────────────┐
        ▼               ▼                ▼                ▼                   ▼              ▼
 ┌─────────────┐ ┌─────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────┐ ┌─────────────┐
 │   Prophet   │ │  Knowledge  │ │  Keyword RAG  │ │ Personalizati │ │ Market Intel │ │  Groq LLM   │
 │ forecasting │ │    Graph    │ │ (Bengali tips │ │  -on Engine   │ │ (live FX +   │ │ llama-3.1-  │
 │ (Eid-aware) │ │ (GraphRAG)  │ │  KB, 35 tips) │ │ (profiling)   │ │ news scrape) │ │ 8b-instant  │
 └─────────────┘ └─────────────┘ └───────────────┘ └───────────────┘ └──────┬───────┘ └─────────────┘
                                                                            │
                                                                 live external real-world data
                                                              (open.er-api.com · Google News RSS)
```

All non-LLM intelligence layers (graph facts, merchant profile, RAG tips, market context) are serialized
into the LLM prompt as grounding context — the LLM is the *last* layer of the pipeline, not the product.

The system is **stateless by design**: uploaded CSV data is processed entirely in-memory for the duration of a single request and is never persisted to disk or a database. This keeps the architecture simple, removes an entire category of data-privacy and storage-cost concerns, and lets both tiers run comfortably on free/low-cost hosting.

### 8.2 Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, custom CSS variables (dark theme, glass-morphism design language) |
| Charts | Recharts |
| Icons | lucide-react |
| Hosting | Vercel |
| Live URL | https://byapari-ai.vercel.app |

Key frontend structures:
- `src/app/page.tsx` — main single-page dashboard shell, switching between sections (Dashboard, Analytics, Sales Trend, Products, Upload, AI Insights, About, Pricing, Settings) via client-side state
- `src/app/docs/page.tsx` — standalone documentation hub (see §7.12)
- `src/components/` — `Sidebar`, `KpiCard`, `AnalyticsChart`, `CsvUpload`, `InsightsPanel`, `PricingPanel`, `SalesTrendPage`, `ProductsPage`
- `src/lib/api.ts` — typed API client layer; defines all request/response interfaces and wraps every backend call

### 8.3 Backend

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| Language | Python 3.11 |
| Server | Uvicorn (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`) |
| Data processing | pandas, NumPy, scikit-learn |
| Forecasting | Prophet (`prophet>=1.1.5`), with `plotly` for full compatibility |
| LLM | Groq SDK (`groq`), model `llama-3.3-70b-versatile` with `llama-3.1-8b-instant` fallback |
| Config | `python-dotenv` |
| CORS | Fully open (`allow_origins=["*"]`, `allow_credentials=False`) — appropriate for a stateless, cookie-free public API |
| Hosting | Railway |
| Live URL | https://byapari-ai-production.up.railway.app |

Key backend structure (`backend/app/`):
- `main.py` — FastAPI app instance, CORS configuration, router registration, `/` and `/health` endpoints
- `routes/` — `upload.py`, `analyze.py`, `ai_insights.py`, `pricing.py`
- `services/` — `csv_service.py` (KPI/trend computation), `analyze_service.py`, `forecast.py` (Prophet integration), `insight_engine.py` (rule-based + bilingual insight templates), `pricing_engine.py` (dynamic pricing logic), `rag_service.py` (knowledge base + keyword retrieval), `graph_service.py` (knowledge-graph construction + reasoning queries), `personalization.py` (merchant profile engine), `market_service.py` (live FX + news ingestion with TTL cache), `gemini_service.py` (Groq LLM client and grounded prompt construction), `template_generator.py`

### 8.4 Engineering decisions worth calling out

- **Keyword-based RAG over vector search**: deliberately replaced an earlier ChromaDB + sentence-transformers implementation after discovering that the embedding model's mandatory first-run download (~90MB from Hugging Face) caused cold-start timeouts (502 errors) on free-tier hosting. The fixed, curated nature of the 35-tip knowledge base made a lightweight keyword-matching approach a better engineering trade-off — instant startup, zero external dependencies, equivalent practical relevance.
- **Groq + `llama-3.3-70b-versatile` (with `llama-3.1-8b-instant` fallback)**: Groq's inference speed delivers the low latency required for a "results in seconds" UX; the 70B model produces markedly more fluent Bengali, and the automatic fallback keeps the product responsive even when the larger model is rate-limited.
- **Stateless processing**: no database, no persisted user data. Removes data-retention/privacy concerns entirely and avoids infrastructure that the team would need to operate, secure, and pay for.
- **Open CORS policy**: `allow_origins=["*"]` was adopted after discovering that Starlette's CORS middleware does not reliably support wildcard subdomain patterns (e.g., `https://*.vercel.app`) for individual origin entries — a fully open policy is both simpler and more robust for a public, read-mostly, cookie-free API.

---

## 9. API Specification

| Method | Endpoint | Purpose | Body |
|---|---|---|---|
| `GET` | `/` | Liveness greeting | — |
| `GET` | `/health` | Health/connection check — polled by the frontend's status indicator | — |
| `POST` | `/upload` | Upload a CSV; returns full first-pass analysis (KPIs, insights, health score, sales trend, top products, data-quality report) | `multipart/form-data` (file) |
| `GET` | `/analyze` | Retrieve analytics for the most recently processed dataset | — |
| `POST` | `/api/ai-insights` | Generate AI-written recommendations, RAG tips, forecast, and an AI summary for a given dataset and language | `{ "csv_data": [...], "lang": "bn" \| "en" }` |
| `POST` | `/api/pricing-suggestions` | Generate per-product dynamic pricing suggestions and a portfolio summary | `{ "csv_data": [...], "lang": "bn" \| "en" }` |

Full request/response JSON examples for `/api/ai-insights` and `/api/pricing-suggestions` are published on the live **[API Reference](https://byapari-ai.vercel.app/docs#api)** section of the documentation hub.

---

## 10. Data Requirements — Expected CSV Schema

Byapari AI expects a CSV with the following columns (a ready-to-use sample is downloadable from the `/docs` page and the Upload panel):

| Column | Type | Description |
|---|---|---|
| `date` | date | Order date (`YYYY-MM-DD`) |
| `product_name` | text | Name of the product sold |
| `product_category` | text | Product category (e.g., Fashion, Electronics, Home & Kitchen) |
| `sales` | number | Revenue generated by the order |
| `profit` | number | Profit generated by the order |
| `quantity` | integer | Units sold in the order |
| `rating` | number | Customer rating (out of 5) |
| `returned` | text/boolean | Whether the order was returned (`Yes`/`No`, also tolerant of `yes`/`YES`/`1`/`True` variants) |
| `stock` | integer | Current stock level for the product |
| `payment_method` | text | Payment method used (e.g., Cash on Delivery, bKash, Bank Transfer) |
| `customer_city` | text | City of the customer (used for geographic context) |

The ingestion pipeline (§7.1) is tolerant of common real-world messiness in this data — inconsistent capitalization, missing values, and type mismatches are detected, corrected where possible, and reported transparently rather than causing a hard failure.

---

## 11. UI/UX & Design Requirements

- **Visual language**: a cohesive dark theme built on CSS custom properties, with "glass-card" surfaces (subtle translucency, soft borders, blur) consistent across the dashboard and the documentation hub.
- **Navigation**: a collapsible left sidebar exposing Dashboard, Analytics, Sales Trend, Products, Upload Data, AI Insights (with a live badge count), About, Pricing, Docs, and Settings — collapsible to an icon-only rail for smaller viewports or user preference.
- **Status transparency**: every async or AI-driven surface communicates its state clearly — shimmer/skeleton placeholders while loading, an explicit Online/Offline/Checking backend indicator, and (for uploads) a detailed data-quality report rather than a silent pass/fail.
- **Bilingual rendering**: Bengali text is rendered natively (not transliterated), and language switching is immediate and scoped to AI-generated content so the user can compare both perspectives on demand.
- **Information hierarchy**: every analytical surface (KPIs, health score, forecasts, pricing) is paired with an explanation of *why* the number is what it is and *what to do about it* — never a bare chart with no interpretive layer.
- **Branding**: consistent "B-AI / Byapari AI — Intelligence Platform" identity, with visible attribution to **S M Mohaiminul Islam / Team Nexion** and the BuildFest context, reinforcing both trust and the product's origin story.

---

## 12. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | First analytical results should appear within seconds of upload completing; the AI-insights and pricing endpoints should respond fast enough to feel conversational (a primary reason for choosing Groq's low-latency inference). |
| **Reliability** | The backend must start reliably on a constrained free-tier host with no cold-start timeouts — directly informed by the ChromaDB/embedding-model incident that previously caused recurring 502s (§8.4). |
| **Availability** | A visible, accurate connection-status indicator must reflect true backend reachability at all times, with a bounded health-check timeout (3s) so the UI never hangs indeterminately. |
| **Localization** | Bengali must be a fully native, first-class language throughout the AI-facing surface — not a fallback or partial translation layer. |
| **Data privacy** | No uploaded data is persisted; all processing is in-memory and scoped to a single request — by design, not by configuration. |
| **Portability** | The system must run identically in local development (`localhost`) and production (Vercel + Railway) with environment-based configuration only (`NEXT_PUBLIC_API_URL`), with a safe production fallback baked into the client so a missing environment variable never breaks the deployed app. |
| **Cost-efficiency** | The architecture must be operable on free or near-free hosting tiers — driving decisions like the keyword-based RAG, the lightweight LLM choice, and the stateless design. |
| **Encoding integrity** | All text assets (notably `requirements.txt` and any file containing Bengali text) must remain UTF-8; an `.editorconfig` is enforced project-wide to prevent editor-induced encoding corruption (a real issue previously encountered on Windows). |

### 12.1 Ethics & Responsible AI

Responsible AI is enforced by architecture, not just policy:

| Safeguard | Implementation |
|---|---|
| **No data retention** | Uploaded sales data is processed entirely in-memory per request and never written to disk or a database — there is nothing to breach, leak, or subpoena. |
| **Explainability** | Every AI recommendation carries a `type`, `priority`, and numeric `confidence`; the health score ships with a per-dimension breakdown; pricing suggestions state the signals (velocity, returns, margin, stock days) that justify them. |
| **Grounded generation** | The LLM is constrained by the merchant's real KPIs, knowledge-graph facts, curated local knowledge (RAG), an explicit merchant profile, and live market data — substantially reducing hallucinated or generic advice. |
| **Transparent ingestion** | The data-quality report discloses every fix applied and every row dropped, and why. |
| **Honest degradation** | If the LLM or any external source is unreachable, deterministic analysis still completes and the UI states plainly that AI analysis is unavailable — no silent failures, no fabricated output. |
| **Lawful data sources** | External signals come from public, legally accessible sources (a public exchange-rate API and public RSS feeds), fetched with identified user-agent headers and hourly caching to be a polite client. |
| **Bias considerations** | Recommendations are derived from the merchant's own data distribution rather than population-level assumptions; the curated knowledge base is human-written and reviewable, category by category. |

---

## 13. Pricing & Monetization Model

| Plan | Price | Target | Included |
|---|---|---|---|
| **Free** | ৳0 / forever | First-time users, casual sellers, evaluators | Up to 500 rows per upload · KPI dashboard · 30-day forecast · 5 AI insights · Basic health score · English |
| **Pro** | **৳499 / month** | Active merchants who check in regularly | Unlimited rows · Full KPI dashboard · 90-day forecast · Unlimited AI insights · Dynamic pricing engine · Bengali + English · RAG recommendations · Priority support |
| **Enterprise** | Custom | Larger sellers, agencies, multi-brand operators | Everything in Pro · Multi-user access · API access · Custom integrations · Dedicated support · SLA guarantee |

- Pricing is displayed consistently in **BDT (৳)** — a deliberate localization choice reinforcing that this product is built *for* the Bangladeshi market, not adapted to it.
- The **Enterprise** tier routes directly to a contact email (`blueberry.poison.1309@gmail.com`) via a `mailto:` action — a pragmatic, low-overhead lead-capture mechanism appropriate for the current stage.
- The Free tier is intentionally generous enough to let a skeptical merchant experience genuine value (a full KPI dashboard, a forecast, and several AI insights) before any payment conversation begins.

---

## 14. Success Metrics (Product KPIs)

While the MVP does not yet include analytics instrumentation, the following metrics are the natural measures of product-market fit going forward:

- **Time-to-first-insight**: elapsed time from landing on the page to viewing a populated, AI-annotated dashboard (target: under 2 minutes using the sample CSV).
- **Upload-to-return rate**: proportion of users who upload more than one CSV (a strong signal of perceived ongoing value vs. one-time curiosity).
- **Language split**: proportion of sessions using Bengali vs. English output — validates the localization thesis.
- **Insight engagement**: proportion of users who open AI Insights / Pricing panels after viewing the base dashboard (validates that the "action layer," not just the KPIs, is the draw).
- **Free → Pro conversion rate**: the ultimate validation that the value proposition justifies ৳499/month.
- **Backend availability**: percentage of health checks returning healthy — directly reflects the reliability work described in §8.4.

---

## 15. Assumptions, Constraints & Risks

| Item | Type | Notes / Mitigation |
|---|---|---|
| Users have *some* sales data export capability | Assumption | Validated by the prevalence of marketplace order-export tools and POS systems; the sample CSV and documented schema lower the bar further. |
| Free-tier hosting limits (Railway/Vercel) | Constraint | Directly shaped the architecture — stateless design, lightweight LLM, dependency-free RAG, and aggressive startup-time optimization all trace back to this constraint. |
| Groq API availability & rate limits | Risk | The product's core "instant insight" experience depends on a third-party LLM provider; sustained growth would require monitoring usage against Groq's rate limits and potentially negotiating higher throughput. |
| CSV quality varies widely in the real world | Risk | Mitigated by the auto-correction and transparent data-quality reporting in the ingestion pipeline (§7.1) — the system is designed to *handle* messiness, not assume clean input. |
| Encoding corruption on Windows dev environments | Risk (realized) | A recurring issue where VS Code re-saved UTF-8 files (notably `requirements.txt`) as UTF-16, breaking the Railway build. Resolved by writing affected files via a UTF-8-safe path and adding a project-wide `.editorconfig`. |
| Stateless design limits longitudinal analysis | Trade-off | A deliberate choice for MVP simplicity, privacy, and cost — revisited in the roadmap (§16) if persistent accounts become a priority. |

---

## 16. Roadmap & Future Enhancements

Potential directions beyond the current MVP, in rough priority order:

1. **Optional accounts & history** — let returning users save past uploads and track health-score trends over time, without compromising the no-signup-required first experience.
2. **Marketplace integrations** — direct data pulls from Daraz, Facebook Commerce, or common POS systems, removing the manual export step entirely.
3. **Scheduled / recurring analysis** — automatic weekly re-analysis and digest delivery (e.g., via WhatsApp or email) for Pro subscribers.
4. **Expanded RAG knowledge base** — grow beyond 35 curated tips, potentially community-sourced and regionally specialized (e.g., by district or product category).
5. **Billing integration** — connect the existing Pro/Enterprise tiers to a real payment flow (e.g., bKash/Nagad merchant APIs, given the audience).
6. **Deeper forecasting** — extend beyond sales volume to stock-out prediction, seasonal procurement planning, and multi-product demand correlation.
7. **Team / multi-user support** — formalize the Enterprise tier's "multi-user access" promise with real role-based access.
8. **Native mobile experience** — given that the target audience is highly mobile-first, a lightweight mobile or PWA experience could meaningfully expand reach.

---

## 17. Glossary

| Term | Meaning |
|---|---|
| **Byapari (ব্যাপারী)** | Bengali word for "merchant" — the product's namesake and core identity |
| **B-AI** | Short brand form of "Byapari AI" |
| **KPI** | Key Performance Indicator — the core business metrics computed from uploaded data |
| **Health Score** | A composite 0–100 rating of overall business performance |
| **RAG** | Retrieval-Augmented Generation — retrieving relevant curated knowledge to ground AI-generated output |
| **Prophet** | Meta's open-source time-series forecasting library, used here for sales forecasting |
| **Groq** | The LLM inference provider used for AI-generated insights (`llama-3.3-70b-versatile`, falling back to `llama-3.1-8b-instant`) |
| **bKash** | A leading mobile financial service in Bangladesh, referenced throughout as a payment-method context |
| **Eid-al-Fitr** | A major Islamic holiday associated with significant retail demand spikes in Bangladesh — explicitly modeled in the forecasting engine |

---

## 18. Appendix — Live References

- **Production app**: https://byapari-ai.vercel.app
- **Documentation hub**: https://byapari-ai.vercel.app/docs
- **Backend API**: https://byapari-ai-production.up.railway.app
- **Backend health check**: https://byapari-ai-production.up.railway.app/health
- **Contact (Enterprise inquiries)**: blueberry.poison.1309@gmail.com
- **Built by**: S M Mohaiminul Islam — Team Nexion — CloudCamp Bangladesh
- **Submission context**: Infinity AI BuildFest

---

*This PRD reflects the product as currently implemented and deployed. It is intended as a living document — sections (particularly §15 Risks and §16 Roadmap) should be revisited as the product evolves beyond its MVP stage.*
