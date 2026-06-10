# BuildFest Demo Script — Byapari AI (Team Nexion)

**Format:** 3-minute structured demo, per the official BuildFest timeline.
**Setup before you're called:** app open at https://byapari-ai.vercel.app, backend status showing **Online** (green), sample CSV already downloaded to the desktop, `/docs` page open in a second tab. Have the local dev environment running as backup in case venue Wi-Fi fails the live deployment.

---

## ⏱️ 0:00 – 0:30 — Problem (the vibe)

> "Bangladesh has millions of small merchants — Daraz sellers, Facebook-page shops, neighborhood retailers. Almost all of them already have sales data in a spreadsheet. Almost none of them can act on it. Enterprise BI is too expensive and assumes an analyst. Chatbots give generic advice that doesn't know what Eid does to demand. And nearly everything is English-only.
>
> **Byapari AI** — *byapari* means merchant in Bengali — turns one CSV upload into a complete business decision system, in the merchant's own language, in under sixty seconds."

**Key message:** *This problem matters.* (Judges look for: clarity, relevance.)

## ⏱️ 0:30 – 1:00 — Solution

> "No signup. No database. No integration. The merchant drags in the spreadsheet they already have — exported from Daraz, a POS, or typed by hand — and gets: live KPIs, a Business Health Score, AI recommendations in fluent Bengali, an Eid-aware sales forecast, per-product pricing actions, and cross-sell opportunities mined from a knowledge graph of their own data. Every insight answers 'so what should I do?', not just 'here are your numbers.'"

**Key message:** *This is how we solve it.* (Simplicity, uniqueness.)

## ⏱️ 1:00 – 2:00 — Live demo

**Do, while narrating:**

1. Drag the sample CSV into the upload panel → point at the **data-quality report**: "It auto-repaired the messy rows and tells the merchant exactly what it fixed — transparency builds trust."
2. Dashboard populates → point at KPIs and the **Health Score ring**: "One number a busy shop owner checks first, with a full explained breakdown."
3. Open **AI Insights** → switch language to **বাংলা** live: "Same data, fluent Bengali — generated, not translated."
4. Point at the **Merchant Profile chips**: "The system profiled this business — small-scale, multi-category, 80% digital payments, Dhaka-concentrated — and every recommendation is conditioned on that profile."
5. Point at **Knowledge Graph Intelligence**: "From their own data we build a graph of products, categories, cities, and payment methods — these two products sell together, so bundle them; Fashion is 30% of revenue nationally but 0% in Khulna — an expansion target."
6. Point at **Live Market Signals**: "And this is live, real-world data fetched right now — today's USD/BDT rate feeding import-cost pressure into pricing advice, plus current Bangladesh business headlines."
7. Open **Pricing** → one product: "Raise, lower, or hold — with the reason and expected impact stated."

**Key message:** *This is how it works.* (Feasibility, logic.)

## ⏱️ 2:00 – 2:30 — AI approach

> "Under the hood this is an AI-native pipeline, not a chatbot wrapper. The intelligence core has five layers: a deterministic rule engine for instant zero-cost alerts; Prophet time-series forecasting with a custom Eid holiday calendar; an in-memory **knowledge graph** mined for cross-sell and city-gap reasoning; a curated Bengali **RAG knowledge base** of 35 local business tactics; and a **personalization engine** that profiles the merchant. All five ground a low-latency LLM — Groq's llama-3.3-70b, with automatic fallback to the 8B model — so the natural-language advice is constrained by real data, real local knowledge, and live market signals. That's how we keep hallucination down and relevance up.
>
> The whole system is stateless: nothing the merchant uploads is ever stored. Privacy by architecture."

**Key message:** *This is real AI thinking.* (Depth, structure.)

## ⏱️ 2:30 – 3:00 — Impact & next step

> "Target outcomes for a typical merchant: act on dead stock weeks earlier, recover the 15–30% revenue that poor pricing and stock-outs eat, and plan Eid inventory with a forecast instead of a guess. Business model: free tier with real value, Pro at ৳499 a month — priced for this market, in taka. And it's deployed and public today — you can upload your own CSV right now at byapari-ai.vercel.app.
>
> The architecture is a template for every emerging market where merchants live in spreadsheets: swap the language pack, the holiday calendar, and the knowledge base — the engine stays. Build locally, lead globally."

**Key message:** *We can build and scale this.* (Vision, potential.)

---

# Judge Q&A preparation

Mapped to the six scoring criteria. Practice each answer out loud once.

### Innovation (20%)
**Q: What's novel here vs. an LLM wrapper over a spreadsheet?**
A: Five grounding layers the wrapper doesn't have — knowledge-graph reasoning over the merchant's own relationships, curated local RAG, an explicit personalization profile, live external market signals, and an Eid-aware forecast. The LLM is the *last* layer, not the product.

### Technical Execution (20%)
**Q: Walk me through input → intelligence core → output.**
A: CSV → validated/repaired ingestion with a transparency report → KPI engine → in parallel: rules, Prophet forecast, graph build + reasoning queries, profile build, RAG retrieval, live FX/news fetch → all serialized as grounding context into one LLM prompt → structured recommendations (type, priority, confidence) + graph insights + market signals returned as one JSON response → rendered bilingually. Feedback loop: data-quality report and explainable score breakdowns.

**Q: Why keyword RAG instead of vector embeddings?**
A: We shipped vector RAG first (ChromaDB + sentence-transformers). The 90MB model download caused cold-start 502s on free-tier hosting. For a fixed 35-tip curated KB, keyword retrieval is functionally equivalent with instant startup — an engineering trade-off we made deliberately and documented. At scale (1000+ community tips), we'd move back to PGVector.

**Q: Why no graph database?**
A: The graph is per-merchant and per-request — typically tens of nodes. Building it in memory keeps the stateless architecture and free-tier viability while delivering real graph reasoning (typed edges, affinity queries, share-gap analysis). Neo4j/PGVector is the documented path once accounts and persistence land.

### Business Model (20%)
**Q: Will a merchant pay ৳499?**
A: The free tier proves value first (full dashboard + forecast + 5 insights). ৳499 is less than one day of a typical shop's profit and an order of magnitude below any BI seat. Conversion driver is the weekly habit: pricing actions and restock alerts that pay for themselves once.

**Q: Cross-border story?**
A: The localization layer is modular — language pack, holiday calendar, knowledge base, currency. The same engine serves Indonesia, Nigeria, Pakistan: huge spreadsheet-first merchant populations, same enterprise-BI gap.

### Real-World Impact + Ethics (20%)
**Q: How do you measure impact?**
A: Time-to-first-insight (target < 2 min), upload-return rate, Bengali usage share, free→Pro conversion. For merchants: revenue uplift from pricing actions, stock-out and dead-stock reduction, forecast accuracy vs. naive baseline.

**Q: Ethical safeguards?**
A: No data retention (stateless by design), explainable outputs (confidence + reasons + breakdowns), grounded generation to limit hallucination, transparent data repair, honest degradation when AI is unavailable. No misleading demos — everything shown is live.

### Scalability (10%)
**Q: What happens at 10,000 merchants?**
A: Stateless request model scales horizontally behind a load balancer with zero session affinity. The expensive call (LLM) is one prompt per analysis on a low-cost model; rules and graph reasoning are CPU-cheap. Bottleneck plan: queue + cache layer, then move RAG to PGVector and add accounts.

### Presentation (10%)
- Open with the merchant's pain, not the tech.
- Switch to Bengali on screen at least once — it's the differentiator judges will remember.
- Say "this is fetched live right now" when showing market signals.
- End on the live URL.

---

# Pre-demo checklist (morning of June 12)

- [ ] Railway backend awake (hit /health from your phone before your slot — free tier may sleep)
- [ ] Vercel app loads; status indicator green
- [ ] Sample CSV on desktop + a second messier CSV to show auto-repair if asked
- [ ] Phone hotspot ready as Wi-Fi backup
- [ ] Local dev stack running as last-resort backup
- [ ] `/docs` page open in tab 2 (architecture diagram for Q&A)
- [ ] One team member rehearsed on the 60-second architecture explanation
- [ ] If you have an NRB/international advisor: their contribution documented honestly in team docs (it's scored under Scalability) — do not claim one you don't have
