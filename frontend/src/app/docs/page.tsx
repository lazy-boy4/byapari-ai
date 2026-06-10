"use client";

import { useState } from "react";
import Link from "next/link";
import {
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

import { PaperCard } from "@/components/paper-card";
import { MonoLabel } from "@/components/mono-label";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

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


// ─── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useLang();
  return (
    <PaperCard className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-rule bg-secondary/30">
        <span className="font-mono text-[10px] text-muted-foreground font-semibold tracking-wider">
          {lang.toUpperCase()}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }).catch(() => {
              // Clipboard write failed — silently ignore
            });
          }}
          className="font-mono text-[10px] text-muted-foreground hover:text-ink cursor-pointer"
        >
          {copied ? t("docs.code_copied") : t("docs.code_copy")}
        </button>
      </div>
      <pre className="m-0 p-5 text-xs leading-relaxed text-ink overflow-x-auto font-mono bg-transparent">
        <code>{code}</code>
      </pre>
    </PaperCard>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="pt-20 -mt-20 scroll-mt-20">
      {children}
    </section>
  );
}

export default function DocsPage() {
  const { t, lang } = useLang();
  const NAV = [
    { id: "about",        label: t("docs.nav_about") },
    { id: "how-it-works", label: t("docs.nav_how")    },
    { id: "api",          label: t("docs.nav_api")     },
    { id: "architecture", label: t("docs.nav_arch")   },
    { id: "rag",          label: t("docs.nav_rag")     },
    { id: "sample-csv",   label: t("docs.nav_sample") },
    { id: "pricing",      label: t("docs.nav_pricing") },
  ];
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
    <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col lg:flex-row gap-12 bg-background text-foreground">
      {/* ── Sidebar Nav ── */}
      <aside className="w-full lg:w-60 shrink-0">
        <nav className="sticky top-24 space-y-1">
          <MonoLabel className="block mb-4">{t("docs.on_this_page")}</MonoLabel>
          {NAV.map((item) => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs mono-caps border-l-2 transition-colors cursor-pointer block",
                  active
                    ? "border-ink text-ink font-semibold bg-secondary/50"
                    : "border-transparent text-muted-foreground hover:text-ink hover:border-ink"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-3xl space-y-20 min-w-0">
        {/* ── Hero ── */}
        <div className="fade-up space-y-4">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink leading-tight">
            {t("docs.title")}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("docs.subtitle")}
          </p>
        </div>

        {/* ── What is Byapari AI ── */}
        <Section id="about">
          <SectionHeading index="01" eyebrow={t("docs.eyebrow")} title={t("docs.nav_about")} />

          <div className="grid gap-6">
            {/* English */}
            <PaperCard className="p-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="mono-caps text-[9px] bg-coffee/15 border border-coffee/30 px-2 py-0.5 text-coffee font-semibold">EN</span>
                <MonoLabel>{t("docs.desc_en")}</MonoLabel>
              </div>
              <p className="text-sm text-ink leading-relaxed">
                {t("docs.about_en")}
              </p>
            </PaperCard>

            {/* Bengali */}
            <PaperCard className="p-8 space-y-3 bg-secondary/20">
              <div className="flex items-center gap-3">
                <span className="mono-caps text-[9px] bg-ink/10 border border-ink/20 px-2 py-0.5 text-ink font-semibold">{t("docs.lang_bn")}</span>
                <MonoLabel>{t("docs.desc_bn")}</MonoLabel>
              </div>
              <p className="text-sm text-ink leading-relaxed">
                {t("docs.about_bn")}
              </p>
            </PaperCard>

            {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(lang === "bn"
              ? ["KPI ড্যাশবোর্ড", "৩০-দিনের পূর্বাভাস", "ডাইনামিক প্রাইসিং", "AI ইনসাইট", "স্বাস্থ্য স্কোর", "RAG নলেজ বেস", "বাংলা + ইংরেজি"]
              : ["KPI Dashboard", "30-Day Forecast", "Dynamic Pricing", "AI Insights", "Health Score", "RAG Knowledge Base", "Bengali + English"]
            ).map((f) => (
              <span key={f} className="mono-caps text-[9px] bg-secondary/50 border border-rule px-2.5 py-1 text-ink flex items-center gap-1.5">
                <CheckCircle size={10} className="text-coffee shrink-0" /> {f}
              </span>
            ))}
          </div>
          </div>
        </Section>

        {/* ── How It Works ── */}
        <Section id="how-it-works">
          <SectionHeading index="02" eyebrow={t("docs.how_eyebrow")} title={t("docs.how_title")} lead={t("docs.how_lead")} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: <Upload size={22} />, step: "01", title: t("docs.step1_title"), sub: t("docs.step1_sub"), desc: t("docs.step1_desc"), color: "text-ink" },
              { icon: <BarChart3 size={22} />, step: "02", title: t("docs.step2_title"), sub: t("docs.step2_sub"), desc: t("docs.step2_desc"), color: "text-coffee" },
              { icon: <Lightbulb size={22} />, step: "03", title: t("docs.step3_title"), sub: t("docs.step3_sub"), desc: t("docs.step3_desc"), color: "text-ink" },
            ].map((item, i) => (
              <PaperCard key={i} className="p-6 text-center space-y-3">
                <div className={cn("size-12 rounded-none bg-secondary/50 border border-rule flex items-center justify-center mx-auto", item.color)}>
                  {item.icon}
                </div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">{t("docs.step_label")} {item.step}</div>
                <div className="font-display text-sm font-bold text-ink">{item.title}</div>
                <div className="font-mono text-[10px] text-coffee font-semibold">{item.sub}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
              </PaperCard>
            ))}
          </div>

          {/* Required columns */}
          <PaperCard className="p-6">
            <MonoLabel className="block mb-4">{t("docs.required_cols")}</MonoLabel>
            <div className="flex flex-wrap gap-2">
              {["date", "product_name", "product_category", "sales", "profit", "quantity", "rating", "returned", "stock", "payment_method", "customer_city"].map((col) => (
                <code key={col} className="font-mono text-xs bg-secondary/50 border border-rule px-2 py-1 text-ink">{col}</code>
              ))}
            </div>
          </PaperCard>
        </Section>

        {/* ── API Documentation ── */}
        <Section id="api">
          <SectionHeading index="03" eyebrow={t("docs.api_eyebrow")} title={t("docs.api_title")} lead={t("docs.api_lead")} />

          {/* Endpoint list */}
          <div className="space-y-4 mb-8">
            {[
              { method: "POST", path: "/api/ai-insights",        color: "bg-secondary text-ink border-rule", desc: t("docs.api_desc_insights")  },
              { method: "POST", path: "/api/pricing-suggestions", color: "bg-coffee/10 text-coffee border-coffee/20", desc: t("docs.api_desc_pricing") },
              { method: "POST", path: "/upload",                  color: "bg-secondary text-ink border-rule", desc: t("docs.api_desc_upload") },
              { method: "GET",  path: "/health",                  color: "bg-secondary text-ink border-rule", desc: t("docs.api_desc_health") },
            ].map((ep) => (
              <PaperCard key={ep.path} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className={cn("font-mono text-[10px] font-bold px-2.5 py-1 border uppercase tracking-wider shrink-0", ep.color)}>
                  {ep.method}
                </span>
                <code className="font-mono text-xs text-ink flex-1 truncate">{ep.path}</code>
                <span className="text-xs text-muted-foreground">{ep.desc}</span>
              </PaperCard>
            ))}
          </div>

          {/* /api/ai-insights detail */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-secondary border border-rule text-ink uppercase tracking-wider">POST</span>
              <code className="font-mono text-sm text-ink">/api/ai-insights</code>
            </div>

            <p className="text-xs text-muted-foreground">{t("docs.api_req_body")}</p>
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

            <p className="text-xs text-muted-foreground mt-4">{t("docs.api_res_body")}</p>
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
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-coffee/10 border border-coffee/20 text-coffee uppercase tracking-wider">POST</span>
              <code className="font-mono text-sm text-ink">/api/pricing-suggestions</code>
            </div>
            <p className="text-xs text-muted-foreground">{t("docs.api_res_body")}</p>
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
          <SectionHeading index="04" eyebrow={t("docs.arch_eyebrow")} title={t("docs.arch_title")} lead={t("docs.arch_lead")} />

          {/* Diagram */}
          <PaperCard className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* User */}
              <div className="text-center space-y-2">
                <div className="size-16 rounded-none bg-secondary/50 border border-rule flex items-center justify-center mx-auto text-xl">
                  👤
                </div>
                <div className="font-display font-bold text-xs text-ink">{t("docs.arch_browser")}</div>
                <div className="text-[10px] text-muted-foreground">{t("docs.arch_browser_desc")}</div>
              </div>

              <ChevronRight size={18} className="text-muted-foreground hidden md:block" />

              {/* Frontend */}
              <div className="text-center space-y-2">
                <div className="size-16 rounded-none bg-secondary/50 border border-rule flex items-center justify-center mx-auto">
                  <Globe size={26} className="text-coffee" />
                </div>
                <div className="font-display font-bold text-xs text-ink">{t("docs.arch_frontend")}</div>
                <div className="text-[10px] text-muted-foreground">{t("docs.arch_frontend_desc")}</div>
              </div>

              <ChevronRight size={18} className="text-muted-foreground hidden md:block" />

              {/* Backend */}
              <div className="text-center space-y-2">
                <div className="size-16 rounded-none bg-secondary/50 border border-rule flex items-center justify-center mx-auto">
                  <Server size={26} className="text-ink" />
                </div>
                <div className="font-display font-bold text-xs text-ink">{t("docs.arch_backend")}</div>
                <div className="text-[10px] text-muted-foreground">{t("docs.arch_backend_desc")}</div>
              </div>
            </div>
          </PaperCard>

          {/* Stack details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: t("docs.arch_front_stack"),
                items: lang === "bn"
                  ? ["Next.js 16 (App Router)", "TypeScript + Tailwind CSS 4", "Recharts ডেটা ভিজ্যুয়ালাইজেশন", "Lucide React আইকন", "Vercel-এ ডিপ্লয়েড"]
                  : ["Next.js 16 (App Router)", "TypeScript + Tailwind CSS 4", "Recharts for data viz", "Lucide React icons", "Deployed on Vercel"],
              },
              {
                title: t("docs.arch_back_stack"),
                items: lang === "bn"
                  ? ["Python 3.11 + FastAPI", "Facebook Prophet (পূর্বাভাস)", "কিওয়ার্ড RAG (বাংলা টিপস)", "Groq LLM (llama-3.1-8b-instant)", "Railway-এ ডিপ্লয়েড"]
                  : ["Python 3.11 + FastAPI", "Facebook Prophet (forecasting)", "Keyword RAG (Bengali tips)", "Groq LLM (llama-3.1-8b-instant)", "Deployed on Railway"],
              },
            ].map((stack) => (
              <PaperCard key={stack.title} className="p-6">
                <p className="font-display font-bold text-sm text-ink mb-4">{stack.title}</p>
                <div className="space-y-2">
                  {stack.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle size={12} className="text-coffee shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </PaperCard>
            ))}
          </div>
        </Section>

        {/* ── RAG Knowledge Base ── */}
        <Section id="rag">
          <SectionHeading index="05" eyebrow={t("docs.rag_eyebrow")} title={t("docs.rag_title")} lead={t("docs.rag_lead")} />

          <div className="space-y-6">
            <PaperCard className="p-8">
              <p className="text-sm text-ink leading-relaxed mb-6">
                {t("docs.rag_desc")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: t("docs.rag_size_label"), value: t("docs.rag_size_val"), color: "text-ink" },
                  { label: t("docs.rag_model_label"), value: t("docs.rag_model_val"), color: "text-coffee" },
                  { label: t("docs.rag_top_label"), value: t("docs.rag_top_val"), color: "text-ink" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 bg-secondary/30 border border-rule text-center">
                    <div className={cn("font-display font-extrabold text-lg mb-1", stat.color)}>{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </PaperCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PaperCard className="p-6 space-y-4">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-ink">{t("docs.rag_how_title")}</p>
                {(lang === "bn"
                  ? [
                    "আপলোড করা CSV থেকে ব্যবসায়িক প্রসঙ্গ বের করা হয় (ক্যাটাগরি, ট্রেন্ড, স্টক লেভেল)",
                    "প্রসঙ্গ paraphrase-multilingual-MiniLM-L12-v2 দিয়ে এম্বেড করা হয় (বাংলা সাপোর্ট)",
                    "ভেক্টর ইন্ডেক্সের বিরুদ্ধে cosine similarity সার্চ",
                    "শীর্ষ-৩ ফলাফল AI ইনসাইট রেসপন্সে যুক্ত করা হয়"
                  ]
                  : [
                    "Business context extracted from uploaded CSV (categories, trends, stock levels)",
                    "Context embedded via paraphrase-multilingual-MiniLM-L12-v2 (supports Bengali)",
                    "Cosine similarity search against vector index",
                    "Top-3 results appended to AI insights response"
                  ]
                ).map((step, i) => (
                  <div key={i} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                    <span className="size-5 rounded-full bg-secondary/80 border border-rule text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </PaperCard>

              <PaperCard className="p-6 space-y-4">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-ink">{t("docs.rag_cat_title")}</p>
                {[
                  { cat: t("docs.rag_cat1"),       count: t("docs.rag_cat1_count"),  color: "text-coffee" },
                  { cat: t("docs.rag_cat2"),  count: t("docs.rag_cat2_count"),  color: "text-ink" },
                  { cat: t("docs.rag_cat3"),      count: t("docs.rag_cat3_count"),  color: "text-coffee" },
                  { cat: t("docs.rag_cat4"),    count: t("docs.rag_cat4_count"),  color: "text-ink" },
                  { cat: t("docs.rag_cat5"),   count: t("docs.rag_cat5_count"),  color: "text-coffee" },
                ].map((c) => (
                  <div key={c.cat} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{c.cat}</span>
                    <span className={cn("font-mono font-bold text-[10px]", c.color)}>{c.count}</span>
                  </div>
                ))}
              </PaperCard>
            </div>

            {/* Sample tip */}
            <PaperCard className="p-6 bg-secondary/20 border border-rule">
              <MonoLabel className="block mb-2">{t("docs.rag_sample_title")}</MonoLabel>
              <p className="text-sm text-ink leading-relaxed font-semibold italic">
                {t("docs.rag_sample")}
              </p>
              <p className="text-xs text-muted-foreground mt-2 border-t border-rule/60 pt-2 font-mono">
                {t("docs.rag_sample_trans")}
              </p>
            </PaperCard>
          </div>
        </Section>

        {/* ── Sample CSV ── */}
        <Section id="sample-csv">
          <SectionHeading index="06" eyebrow={t("docs.sample_eyebrow")} title={t("docs.sample_title")} lead={t("docs.sample_lead")} />

          <div className="space-y-6">
            <CodeBlock lang="csv" code={SAMPLE_CSV} />

            <div className="flex gap-4">
              <button
                onClick={downloadCSV}
                className="mono-caps inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-[color:var(--color-paper)] text-xs transition-colors hover:bg-transparent hover:text-ink cursor-pointer"
              >
                <Download size={14} />
                {t("docs.sample_download")}
              </button>
              <Link
                href="/dashboard?section=upload"
                className="mono-caps inline-flex items-center gap-2 border border-rule bg-transparent px-4 py-2 text-ink text-xs transition-colors hover:bg-ink hover:text-[color:var(--color-paper)]"
              >
                <Upload size={14} />
                {t("docs.sample_upload")}
              </Link>
            </div>

            <PaperCard className="p-5 bg-secondary/10">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("docs.sample_tip")}
              </p>
            </PaperCard>
          </div>
        </Section>

        {/* ── Pricing ── */}
        <Section id="pricing">
          <SectionHeading index="07" eyebrow={t("docs.pricing_eyebrow")} title={t("docs.pricing_title")} lead={t("docs.pricing_lead")} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                plan: t("pricing.free_name"),
                price: t("pricing.free_price"),
                period: t("pricing.free_period"),
                color: "text-ink",
                badge: null,
                features: (lang === "bn"
                  ? ["প্রতি আপলোডে ৫০০ সারি পর্যন্ত", "KPI ড্যাশবোর্ড", "৩০-দিনের পূর্বাভাস", "৫ টি AI ইনসাইট", "বেসিক হেলথ স্কোর", "শুধুমাত্র ইংরেজি"]
                  : ["Up to 500 rows per upload", "KPI dashboard", "30-day forecast", "5 AI insights", "Basic health score", "English only"]) as string[],
                cta: t("pricing.free_cta"),
              },
              {
                plan: t("pricing.pro_name"),
                price: t("pricing.pro_price"),
                period: t("pricing.pro_period"),
                color: "text-coffee",
                badge: t("pricing.most_popular"),
                features: (lang === "bn"
                  ? ["আনলিমিটেড সারি", "সম্পূর্ণ KPI ড্যাশবোর্ড", "৯০-দিনের পূর্বাভাস", "আনলিমিটেড AI ইনসাইট", "ডাইনামিক প্রাইসিং ইঞ্জিন", "বাংলা + ইংরেজি", "RAG সুপারিশ", "অগ্রাধিকার সমর্থন"]
                  : ["Unlimited rows", "Full KPI dashboard", "90-day forecast", "Unlimited AI insights", "Dynamic pricing engine", "Bengali + English", "RAG recommendations", "Priority support"]) as string[],
                cta: `${t("docs.pricing_get")} ${t("pricing.pro_name")}`,
              },
              {
                plan: t("pricing.enterprise_name"),
                price: t("pricing.enterprise_price"),
                period: t("pricing.enterprise_period"),
                color: "text-muted-foreground",
                badge: null,
                features: (lang === "bn"
                  ? ["প্রো-এর সবকিছু", "মাল্টি-ইউজার অ্যাক্সেস", "API অ্যাক্সেস", "কাস্টম ইন্টিগ্রেশন", "ডেডিকেটেড সাপোর্ট", "SLA গ্যারান্টি"]
                  : ["Everything in Pro", "Multi-user access", "API access", "Custom integrations", "Dedicated support", "SLA guarantee"]) as string[],
                cta: t("docs.pricing_contact"),
              },
            ].map((tier) => (
              <PaperCard
                key={tier.plan}
                className={cn(
                  "p-6 relative flex flex-col justify-between min-h-[400px]",
                  tier.plan === t("pricing.pro_name") && "border-coffee border-2"
                )}
              >
                {tier.badge && (
                  <span className="absolute top-4 right-4 text-[9px] font-mono uppercase bg-coffee text-[color:var(--color-paper)] px-2 py-0.5">
                    {tier.badge}
                  </span>
                )}
                <div>
                  <div className="mb-4">
                    <div className={cn("font-display font-bold text-sm uppercase tracking-wider mb-2", tier.color)}>{tier.plan}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-extrabold text-2xl text-ink">{tier.price}</span>
                      <span className="text-[10px] text-muted-foreground">{tier.period}</span>
                    </div>
                  </div>
                  <div className="h-px bg-rule mb-4" />
                  <div className="space-y-2.5 mb-6">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <CheckCircle size={10} className="text-coffee shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href={tier.plan === t("pricing.enterprise_name") ? "mailto:blueberry.poison.1309@gmail.com" : "/dashboard?section=pricing"}
                  className={cn(
                    "block text-center py-2 text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer",
                    tier.plan === t("pricing.pro_name")
                      ? "bg-coffee border-coffee text-[color:var(--color-paper)] hover:bg-transparent hover:text-coffee"
                      : "bg-transparent border-ink text-ink hover:bg-ink hover:text-[color:var(--color-paper)]"
                  )}
                >
                  {tier.cta}
                </Link>
              </PaperCard>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
