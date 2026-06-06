"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  BookOpen,
  Zap,
  Database,
  Server,
  Globe,
  Brain,
  TrendingUp,
  FileText,
  DollarSign,
  CheckCircle,
  ChevronRight,
  Upload,
  BarChart3,
  Lightbulb,
} from "lucide-react";

// ─── Sample CSV ───────────────────────────────────────────────────────────────
const SAMPLE_CSV = [
  "date,product_name,product_category,sales,profit,quantity,rating,returned,stock,payment_method,customer_city",
  "2025-01-01,Cats Eye Jeans,Fashion,202608,64023.51,28,4.2,No,252,Cash on Delivery,Comilla",
  "2025-01-03,Bashundhara Tissue Box,Home & Kitchen,669935,260869.93,35,4.6,No,221,Bank Transfer,Rangpur",
  "2025-01-04,Awei Bluetooth Headset,Mobile Accessories,327761,121497.59,49,4.1,No,318,Bank Transfer,Chittagong",
  "2025-01-09,Kiam Pressure Cooker,Home & Kitchen,370790,75429.26,35,4.5,No,64,Bank Transfer,Chittagong",
  "2025-01-12,Samsung Galaxy A54,Electronics,1250000,312500.00,5,4.8,No,15,Mobile Banking,Dhaka",
  "2025-01-15,Nike Running Shoes,Fashion,450000,135000.00,12,4.3,Yes,88,Cash on Delivery,Sylhet",
  "2025-01-18,Walton Refrigerator,Home Appliances,980000,196000.00,3,4.7,No,22,Bank Transfer,Dhaka",
  "2025-01-20,RFL Plastic Chair,Furniture,45000,13500.00,60,3.9,No,400,Cash on Delivery,Mymensingh",
  "2025-01-22,Singer Sewing Machine,Home Appliances,320000,80000.00,8,4.4,No,35,Mobile Banking,Rajshahi",
].join("\n");

// ─── Nav sections ─────────────────────────────────────────────────────────────
const NAV = [
  { id: "about",        label: "What is Byapari AI" },
  { id: "how-it-works", label: "How It Works"       },
  { id: "api",          label: "API Reference"      },
  { id: "architecture", label: "Architecture"       },
  { id: "rag",          label: "RAG Knowledge Base" },
  { id: "sample-csv",   label: "Sample CSV"         },
  { id: "pricing",      label: "Pricing"            },
];

// ─── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", background: "#030711" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.08em" }}>{lang.toUpperCase()}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ fontSize: 11, color: copied ? "var(--green)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "20px", fontSize: 12.5, lineHeight: 1.7, color: "#c9d1d9", overflowX: "auto", fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ paddingTop: 80, scrollMarginTop: 80 }}>
      {children}
    </section>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ color: "var(--accent)", display: "flex" }}>{icon}</span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0, paddingLeft: 34 }}>{subtitle}</p>}
      <div style={{ height: 1, background: "linear-gradient(90deg, var(--accent-dim), transparent)", marginTop: 16 }} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [activeNav, setActiveNav] = useState("about");

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadCSV = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "byapari_sample_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>

      {/* ── Top Bar ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,11,24,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", textDecoration: "none", fontSize: 13 }}>
              <ArrowLeft size={15} />
              Dashboard
            </Link>
            <span style={{ color: "var(--border-bright)" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 11 }}>B</div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
                Byapari AI <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/ Docs</span>
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="badge badge-gold">Infinity AI BuildFest 2026</span>
            <span className="badge badge-accent">v1.0</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", gap: 40 }}>

        {/* ── Sidebar Nav ── */}
        <aside style={{ width: 200, flexShrink: 0, paddingTop: 48 }}>
          <nav style={{ position: "sticky", top: 80 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>On this page</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  style={{
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: "pointer",
                    color: activeNav === item.id ? "var(--accent)" : "var(--text-muted)",
                    background: activeNav === item.id ? "var(--accent-dim)" : "transparent",
                    fontWeight: activeNav === item.id ? 600 : 400,
                    transition: "all 0.15s",
                    borderLeft: activeNav === item.id ? "2px solid var(--accent)" : "2px solid transparent",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, paddingTop: 48, paddingBottom: 120, minWidth: 0 }}>

          {/* ── Hero ── */}
          <div className="fade-up" style={{ marginBottom: 16 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 12, background: "linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 60%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Byapari AI Documentation
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 600 }}>
              Everything judges and developers need to understand the platform — architecture, APIs, the ML stack, and how to get started.
            </p>
          </div>

          {/* ── What is Byapari AI ── */}
          <Section id="about">
            <SectionHeading icon={<BookOpen size={18} />} title="What is Byapari AI" />

            <div style={{ display: "grid", gap: 16 }}>
              {/* English */}
              <div className="glass-card" style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: "var(--accent-dim)", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.05em" }}>EN</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>English</span>
                </div>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Byapari AI</strong> is an AI-powered business intelligence platform designed for Bangladeshi merchants — upload your sales CSV and instantly receive KPIs, a 30-day Prophet forecast, AI-generated recommendations, a dynamic pricing engine, and a full business health score.
                  Built for <strong style={{ color: "var(--accent)" }}>Infinity AI BuildFest 2026</strong> by Team Nexion, it combines a FastAPI backend with a Next.js frontend to deliver real-time insights with zero manual configuration.
                </p>
              </div>

              {/* Bengali */}
              <div className="glass-card" style={{ padding: "24px 28px", background: "rgba(232,184,75,0.04)", borderColor: "rgba(232,184,75,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: "var(--gold-dim)", color: "var(--gold)", fontWeight: 700, letterSpacing: "0.05em" }}>বাংলা</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Bengali</span>
                </div>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.9 }}>
                  <strong style={{ color: "var(--gold)" }}>ব্যাপারী AI</strong> বাংলাদেশি ব্যবসায়ীদের জন্য একটি এআই-চালিত বিজনেস ইন্টেলিজেন্স প্ল্যাটফর্ম — আপনার সেলস CSV আপলোড করুন এবং সাথে সাথে পান KPI, ৩০-দিনের বিক্রয় পূর্বাভাস, AI পরামর্শ, ডাইনামিক প্রাইসিং ইঞ্জিন এবং সম্পূর্ণ বিজনেস হেলথ স্কোর।
                  টিম নেক্সিয়নের তৈরি এই প্ল্যাটফর্ম ব্যবহারকারীকে কোনো কনফিগারেশন ছাড়াই রিয়েল-টাইম ব্যবসায়িক অন্তর্দৃষ্টি দেয়।
                </p>
              </div>

              {/* Feature pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 4 }}>
                {["KPI Dashboard", "30-Day Forecast", "Dynamic Pricing", "AI Insights", "Health Score", "RAG Knowledge Base", "Bengali + English"].map((f) => (
                  <span key={f} className="chip" style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent-dim)" }}>
                    <CheckCircle size={10} /> {f}
                  </span>
                ))}
              </div>
            </div>
          </Section>

          {/* ── How It Works ── */}
          <Section id="how-it-works">
            <SectionHeading icon={<Zap size={18} />} title="How It Works" subtitle="Three steps from raw CSV to actionable intelligence" />

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr", alignItems: "center", gap: 12, marginBottom: 32 }}>
              {[
                { icon: <Upload size={22} />, step: "01", title: "Upload", sub: "Drop your sales CSV", desc: "Supports any CSV with date, product, sales, profit, quantity, rating, stock columns. Auto-detects and fixes encoding issues.", color: "var(--accent)" },
                null,
                { icon: <BarChart3 size={22} />, step: "02", title: "Analyze", sub: "ML processes your data", desc: "Prophet forecasts 30 days ahead. Rule-based engine scores health. RAG retrieves relevant business tips from 35-tip knowledge base.", color: "var(--purple)" },
                null,
                { icon: <Lightbulb size={22} />, step: "03", title: "Act", sub: "Get prioritized actions", desc: "Dynamic pricing suggestions per product, high-priority AI alerts, Bengali/English insights, and a downloadable action plan.", color: "var(--green)" },
              ].map((item, i) => {
                if (item === null) {
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "center" }}>
                      <ArrowRight size={20} color="var(--text-muted)" />
                    </div>
                  );
                }
                return (
                  <div key={i} className="glass-card" style={{ padding: "24px 20px", textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: item.color }}>
                      {item.icon}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>STEP {item.step}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: item.color, fontWeight: 600, marginBottom: 10 }}>{item.sub}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* Required columns */}
            <div className="glass-card" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Required CSV Columns</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["date", "product_name", "product_category", "sales", "profit", "quantity", "rating", "returned", "stock", "payment_method", "customer_city"].map((col) => (
                  <code key={col} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "monospace" }}>{col}</code>
                ))}
              </div>
            </div>
          </Section>

          {/* ── API Documentation ── */}
          <Section id="api">
            <SectionHeading icon={<Server size={18} />} title="API Reference" subtitle="REST endpoints — all accept JSON, return JSON" />

            {/* Endpoint list */}
            <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
              {[
                { method: "POST", path: "/api/ai-insights",        color: "#529dff", desc: "Full AI analysis: KPIs, insights, health score, forecast, RAG tips"  },
                { method: "POST", path: "/api/pricing-suggestions", color: "#34d399", desc: "Per-product dynamic pricing suggestions with priority ranking"         },
                { method: "POST", path: "/upload",                  color: "#fbbf24", desc: "Upload CSV file (multipart/form-data), returns parsed data + quick KPIs" },
                { method: "GET",  path: "/health",                  color: "#a78bfa", desc: "Backend health check — used by frontend connection indicator"          },
              ].map((ep) => (
                <div key={ep.path} className="glass-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: `${ep.color}15`, color: ep.color, border: `1px solid ${ep.color}25`, fontFamily: "monospace", flexShrink: 0 }}>
                    {ep.method}
                  </span>
                  <code style={{ fontSize: 13, color: "var(--text-primary)", fontFamily: "monospace", flex: 1 }}>{ep.path}</code>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{ep.desc}</span>
                </div>
              ))}
            </div>

            {/* /api/ai-insights detail */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: "rgba(82,157,255,0.12)", color: "#529dff", border: "1px solid rgba(82,157,255,0.2)", fontFamily: "monospace" }}>POST</span>
                <code style={{ fontFamily: "monospace", fontSize: 15, color: "var(--text-primary)" }}>/api/ai-insights</code>
              </div>

              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Request body (Content-Type: application/json):</p>
              <CodeBlock lang="json" code={`{
  "csv_data": [
    {
      "date": "2025-01-01",
      "product_name": "Samsung Galaxy A54",
      "product_category": "Electronics",
      "sales": 1250000,
      "profit": 312500,
      "quantity": 5,
      "rating": 4.8,
      "returned": "No",
      "stock": 15,
      "payment_method": "Mobile Banking",
      "customer_city": "Dhaka"
    }
  ],
  "lang": "en"
}`} />

              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "20px 0 16px" }}>Response (200 OK):</p>
              <CodeBlock lang="json" code={`{
  "insights": [
    {
      "type": "warning",
      "title": "Low Stock Alert",
      "message": "Samsung Galaxy A54 has only 15 units — reorder urgently.",
      "priority": "high",
      "confidence": 0.91
    },
    {
      "type": "growth",
      "title": "Top Performer Identified",
      "message": "Galaxy A54 leading revenue with ৳1,250,000 in sales.",
      "priority": "low",
      "confidence": 0.85
    }
  ],
  "rag_recommendations": [
    {
      "id": "tip_12",
      "text": "রমজান মাসে ইলেকট্রনিক্স পণ্যের চাহিদা ৩০% বাড়ে — আগে স্টক করুন।",
      "category": "seasonal",
      "relevance": 0.78
    }
  ],
  "health_score": 82,
  "top_performer": { "product": "Samsung Galaxy A54", "revenue": 1250000 },
  "worst_performer": null,
  "forecast": [
    { "date": "2025-02-01", "predicted_sales": 1312500, "lower_bound": 1150000, "upper_bound": 1475000 }
  ],
  "period_analyzed": "2025-01-01 to 2025-01-31",
  "confidence": 0.87,
  "data_points": 1,
  "generated_at": "2025-01-31T14:32:00"
}`} />
            </div>

            {/* /api/pricing-suggestions detail */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)", fontFamily: "monospace" }}>POST</span>
                <code style={{ fontFamily: "monospace", fontSize: 15, color: "var(--text-primary)" }}>/api/pricing-suggestions</code>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Response (200 OK):</p>
              <CodeBlock lang="json" code={`{
  "suggestions": [
    {
      "product": "Samsung Galaxy A54",
      "suggestion": "increase_price",
      "reason": "scarcity_premium",
      "price_change_percent": 10,
      "priority": "high",
      "display_text": "Increase price by 10% — low stock with strong demand",
      "current_metrics": {
        "total_sales": 1250000,
        "profit_margin": 25.0,
        "avg_rating": 4.8,
        "return_rate": 0.0,
        "stock_days_remaining": 3.0,
        "velocity": 41.67
      }
    }
  ],
  "summary": {
    "total_opportunities": 1,
    "revenue_at_risk": 1250000,
    "potential_uplift": 125000,
    "top_priority": "Samsung Galaxy A54",
    "stable_products": 0,
    "total_products": 1
  },
  "generated_at": "2025-01-31T14:32:00"
}`} />
            </div>
          </Section>

          {/* ── Architecture ── */}
          <Section id="architecture">
            <SectionHeading icon={<Globe size={18} />} title="Architecture" subtitle="Fully serverless — frontend on Vercel, backend on Railway" />

            {/* Diagram */}
            <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>

                {/* User */}
                <div style={{ textAlign: "center", padding: "0 8px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(82,157,255,0.1)", border: "1px solid rgba(82,157,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 26 }}>
                    👤
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Browser</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>User uploads CSV</div>
                </div>

                <ChevronRight size={18} color="var(--text-muted)" style={{ margin: "0 4px", flexShrink: 0 }} />

                {/* Frontend */}
                <div style={{ textAlign: "center", padding: "0 8px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(82,157,255,0.1)", border: "2px solid rgba(82,157,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <Globe size={26} color="var(--accent)" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>Next.js 14</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Vercel · TypeScript</div>
                </div>

                <ChevronRight size={18} color="var(--text-muted)" style={{ margin: "0 4px" }} />
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 20, whiteSpace: "nowrap" }}>HTTPS / JSON</div>
                <ChevronRight size={18} color="var(--text-muted)" style={{ margin: "0 4px" }} />

                {/* Backend */}
                <div style={{ textAlign: "center", padding: "0 8px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(167,139,250,0.1)", border: "2px solid rgba(167,139,250,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <Server size={26} color="var(--purple)" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--purple)" }}>FastAPI</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Railway · Python 3.11</div>
                </div>

                <ChevronRight size={18} color="var(--text-muted)" style={{ margin: "0 4px" }} />

                {/* AI Stack */}
                <div style={{ textAlign: "center", padding: "0 8px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[
                      { icon: <TrendingUp size={14} />, label: "Prophet ML",   sub: "Forecasting",   color: "#fbbf24" },
                      { icon: <Database size={14} />,   label: "ChromaDB",     sub: "RAG Vector DB", color: "#34d399" },
                      { icon: <Brain size={14} />,      label: "Claude AI",    sub: "Summarization", color: "#f87171" },
                      { icon: <Zap size={14} />,        label: "SentenceXFMR", sub: "Embeddings",    color: "#a78bfa" },
                    ].map((s) => (
                      <div key={s.label} style={{ width: 72, padding: "8px 6px", borderRadius: 10, background: `${s.color}10`, border: `1px solid ${s.color}25`, textAlign: "center" }}>
                        <span style={{ color: s.color, display: "block", marginBottom: 3 }}>{s.icon}</span>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-primary)" }}>{s.label}</div>
                        <div style={{ fontSize: 8, color: "var(--text-muted)" }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>AI / ML Services</div>
                </div>
              </div>
            </div>

            {/* Stack details */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                {
                  title: "Frontend Stack", color: "var(--accent)",
                  items: ["Next.js 14 (App Router)", "TypeScript + Tailwind CSS", "Recharts for data viz", "Lucide React icons", "Deployed on Vercel"],
                },
                {
                  title: "Backend Stack", color: "var(--purple)",
                  items: ["Python 3.11 + FastAPI", "Facebook Prophet (forecasting)", "ChromaDB (vector store)", "SentenceTransformer (multilingual)", "Deployed on Railway"],
                },
              ].map((stack) => (
                <div key={stack.title} className="glass-card" style={{ padding: "20px 22px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: stack.color, marginBottom: 12 }}>{stack.title}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {stack.items.map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                        <CheckCircle size={12} color="var(--green)" style={{ flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── RAG Knowledge Base ── */}
          <Section id="rag">
            <SectionHeading icon={<Database size={18} />} title="RAG Knowledge Base" subtitle="Retrieval-Augmented Generation — Bengali business intelligence built in" />

            <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
              <div className="glass-card" style={{ padding: "24px 28px" }}>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
                  Byapari AI ships with <strong style={{ color: "var(--text-primary)" }}>35 hand-curated Bengali business tips</strong> stored in a ChromaDB vector database.
                  When you upload your CSV, the system computes semantic similarity between your business context and the knowledge base, then surfaces the 3 most relevant tips — entirely offline, zero per-request API cost.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Knowledge base size", value: "35 tips", color: "var(--accent)" },
                    { label: "Embedding model", value: "MiniLM-L12", color: "var(--purple)" },
                    { label: "Tips returned per query", value: "Top 3", color: "var(--green)" },
                  ].map((stat) => (
                    <div key={stat.label} style={{ padding: "14px 16px", borderRadius: 10, background: "var(--bg-elevated)", textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="glass-card" style={{ padding: "20px 22px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 }}>How retrieval works</p>
                  {[
                    "Business context extracted from uploaded CSV (categories, trends, stock levels)",
                    "Context embedded via paraphrase-multilingual-MiniLM-L12-v2 (supports Bengali)",
                    "Cosine similarity search against ChromaDB vector index",
                    "Top-3 results appended to AI insights response",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--accent-dim)", color: "var(--accent)", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                      {step}
                    </div>
                  ))}
                </div>

                <div className="glass-card" style={{ padding: "20px 22px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 }}>Tip categories</p>
                  {[
                    { cat: "Seasonal demand",       count: "8 tips",  color: "var(--amber)" },
                    { cat: "Inventory management",  count: "9 tips",  color: "var(--accent)" },
                    { cat: "Pricing strategy",      count: "8 tips",  color: "var(--green)" },
                    { cat: "Customer retention",    count: "6 tips",  color: "var(--purple)" },
                    { cat: "Payment & cash flow",   count: "4 tips",  color: "#f87171"       },
                  ].map((c) => (
                    <div key={c.cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{c.cat}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "var(--bg-elevated)", color: c.color, fontWeight: 700 }}>{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample tip */}
              <div className="glass-card" style={{ padding: "20px 24px", background: "rgba(232,184,75,0.04)", borderColor: "rgba(232,184,75,0.15)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Sample tip from knowledge base</p>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, fontStyle: "italic" }}>
                  "রমজান মাসে ইলেকট্রনিক্স ও ফ্যাশন পণ্যের চাহিদা ৩০-৪০% বৃদ্ধি পায় — ঈদের ৩ সপ্তাহ আগে স্টক বাড়ান এবং বিশেষ বান্ডেল অফার তৈরি করুন।"
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                  Translation: "Electronics and fashion demand rises 30-40% in Ramadan — stock up 3 weeks before Eid and create bundle deals."
                </p>
              </div>
            </div>
          </Section>

          {/* ── Sample CSV ── */}
          <Section id="sample-csv">
            <SectionHeading icon={<FileText size={18} />} title="Sample CSV" subtitle="Use this to test the platform instantly — 10 rows, all required columns" />

            <div style={{ marginBottom: 20 }}>
              <CodeBlock lang="csv" code={SAMPLE_CSV} />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={downloadCSV}
                className="btn-primary"
                style={{ fontSize: 14, padding: "12px 24px", borderRadius: 10 }}
              >
                <Download size={16} />
                Download Sample CSV
              </button>
              <Link
                href="/"
                className="btn-ghost"
                style={{ fontSize: 14, padding: "12px 24px", borderRadius: 10, textDecoration: "none" }}
              >
                <Upload size={16} />
                Upload to Dashboard
              </Link>
            </div>

            <div className="glass-card" style={{ padding: "16px 20px", marginTop: 16, background: "rgba(82,157,255,0.04)" }}>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                <strong style={{ color: "var(--accent)" }}>Tip:</strong> The platform auto-detects and handles missing values, inconsistent casing in the <code style={{ fontFamily: "monospace", fontSize: 12 }}>returned</code> column (Yes/yes/YES/1/true), and date format variations. Minimum 3 rows per product for pricing analysis.
              </p>
            </div>
          </Section>

          {/* ── Pricing ── */}
          <Section id="pricing">
            <SectionHeading icon={<DollarSign size={18} />} title="Pricing" subtitle="Start free — upgrade when you need more" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                {
                  plan: "Free",
                  price: "৳0",
                  period: "forever",
                  color: "var(--text-secondary)",
                  badge: null,
                  features: [
                    "Up to 500 rows per upload",
                    "KPI dashboard",
                    "30-day forecast",
                    "5 AI insights",
                    "Basic health score",
                    "English only",
                  ],
                },
                {
                  plan: "Pro",
                  price: "৳499",
                  period: "/ month",
                  color: "var(--accent)",
                  badge: "Most Popular",
                  features: [
                    "Unlimited rows",
                    "Full KPI dashboard",
                    "90-day forecast",
                    "Unlimited AI insights",
                    "Dynamic pricing engine",
                    "Bengali + English",
                    "RAG recommendations",
                    "Priority support",
                  ],
                },
                {
                  plan: "Enterprise",
                  price: "Custom",
                  period: "",
                  color: "var(--gold)",
                  badge: null,
                  features: [
                    "Everything in Pro",
                    "Multi-user access",
                    "API access",
                    "Custom integrations",
                    "Dedicated support",
                    "SLA guarantee",
                  ],
                },
              ].map((tier) => (
                <div
                  key={tier.plan}
                  className="glass-card"
                  style={{
                    padding: "24px 22px",
                    borderColor: tier.plan === "Pro" ? "rgba(82,157,255,0.3)" : undefined,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {tier.badge && (
                    <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, padding: "3px 9px", borderRadius: 99, background: "var(--accent)", color: "white", fontWeight: 700 }}>
                      {tier.badge}
                    </span>
                  )}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: tier.color, marginBottom: 6 }}>{tier.plan}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>{tier.price}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{tier.period}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
                    {tier.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-secondary)" }}>
                        <CheckCircle size={11} color={tier.color} style={{ flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={tier.plan === "Enterprise" ? "mailto:blueberry.poison.1309@gmail.com" : "/"}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "10px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: "none",
                      background: tier.plan === "Pro" ? "linear-gradient(135deg, rgba(82,157,255,0.2), rgba(124,111,239,0.2))" : "var(--bg-elevated)",
                      border: `1px solid ${tier.plan === "Pro" ? "rgba(82,157,255,0.3)" : "var(--border)"}`,
                      color: tier.plan === "Pro" ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    {tier.plan === "Enterprise" ? "Contact Us" : `Get ${tier.plan}`}
                  </Link>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Footer ── */}
          <div style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="logo-mark" style={{ width: 28, height: 28, fontSize: 11 }}>B</div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-secondary)" }}>
                Byapari AI · Team Nexion
              </span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
              <span>Built for Infinity AI BuildFest 2026</span>
              <span style={{ color: "var(--border-bright)" }}>·</span>
              <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>Back to Dashboard →</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
