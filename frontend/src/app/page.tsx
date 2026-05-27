"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  RefreshCw,
  Wifi,
  WifiOff,
  Lightbulb,
  Heart,
  BarChart3,
  Sparkles,
  ArrowRight,
  Activity,
  Users,
  Star,
  Zap,
  ExternalLink,
  Link2,
  Upload,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import KpiCard from "@/components/KpiCard";
import { SalesTrendChart, TopProductsChart } from "@/components/AnalyticsChart";
import CsvUpload from "@/components/CsvUpload";
import SalesTrendPage from "@/components/SalesTrendPage";
import ProductsPage from "@/components/ProductsPage";
import {
  fetchAnalytics,
  checkApiHealth,
  KpiData,
  AiRecommendation,
  HealthScore,
  SalesDataPoint,
  ProductData,
} from "@/lib/api";

// ─────────────────────────────────────────────
// HEALTH SCORE CARD
// ─────────────────────────────────────────────
function HealthScoreCard({ health }: { health: HealthScore }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = (health.score / 100) * circumference;

  return (
    <div className="glass-card fade-up delay-1" style={{ padding: "22px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <Activity size={16} style={{ color: health.color }} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            color: "var(--text-primary)",
          }}
        >
          Business Health Score
        </span>
        <span
          className="badge"
          style={{
            background: `${health.color}18`,
            color: health.color,
            border: `1px solid ${health.color}30`,
            padding: "2px 8px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginLeft: "auto",
          }}
        >
          {health.label}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Circular progress */}
        <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
          <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="48" cy="48" r={radius} fill="none"
              stroke="var(--border)" strokeWidth="7" />
            <circle cx="48" cy="48" r={radius} fill="none"
              stroke={health.color} strokeWidth="7"
              strokeDasharray={`${progress} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.16,1,.3,1)" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span className="stat-number" style={{
              fontSize: 24, fontWeight: 800,
              color: health.color, lineHeight: 1,
            }}>
              {health.score}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>/100</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.values(health.breakdown).map((item) => (
            <div key={item.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.label}</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>
                  {item.score}/{item.max}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(item.score / item.max) * 100}%`,
                    background: health.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// INSIGHT CARD
// ─────────────────────────────────────────────
function InsightCard({ rec, index }: { rec: AiRecommendation; index: number }) {
  return (
    <div
      className={`insight-card ${rec.impact} fade-up delay-${(index % 5) + 1}`}
      style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span className={`badge badge-${rec.impact}`} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "3px 9px" }}>
          {rec.impact.toUpperCase()} IMPACT
        </span>
        <span className="chip" style={{
          background: "rgba(255,255,255,0.04)",
          color: "var(--text-muted)",
          border: "1px solid var(--border)",
          fontSize: 10,
        }}>
          {rec.category}
        </span>
      </div>

      <h4 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 14.5,
        color: "var(--text-primary)",
        lineHeight: 1.45,
      }}>
        {rec.title}
      </h4>

      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
        {rec.description}
      </p>

      {rec.metric && (
        <div style={{
          padding: "8px 12px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          fontSize: 12,
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <BarChart3 size={12} style={{ opacity: 0.6 }} />
          {rec.metric}
        </div>
      )}

      {rec.action && (
        <button style={{
          display: "flex", alignItems: "center", gap: 4,
          fontSize: 13, fontWeight: 600,
          color: "var(--accent)",
          background: "none", border: "none",
          cursor: "pointer", padding: 0, marginTop: 2,
        }}>
          {rec.action}
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────
function AboutPage() {
  return (
    <div
      className="fade-up"
      style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 780 }}
    >
      {/* Hero block */}
      <div
        className="about-section"
        style={{ padding: "40px 40px 36px" }}
      >
        {/* B-AI logo large */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div
            className="logo-mark float"
            style={{ width: 56, height: 56, fontSize: 16, borderRadius: 14 }}
          >
            B-AI
          </div>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: "-0.05em",
              color: "var(--text-primary)",
              lineHeight: 1.1,
            }}>
              Byapari AI
            </h1>
            <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 500, marginTop: 2 }}>
              Business Intelligence Platform
            </p>
          </div>
        </div>

        <p style={{
          fontSize: 15.5, lineHeight: 1.75,
          color: "var(--text-secondary)",
          maxWidth: 620,
          marginBottom: 24,
        }}>
          <strong style={{ color: "var(--text-primary)" }}>Byapari AI</strong> is an AI-powered
          business analytics platform designed for modern merchants. Upload your sales data as a
          CSV and instantly receive deep KPIs, trend forecasts, AI-generated recommendations,
          product insights, and a real-time business health score — all without writing a single
          line of code.
        </p>

        <p style={{
          fontSize: 14.5, lineHeight: 1.7,
          color: "var(--text-muted)",
          maxWidth: 620,
        }}>
          Built for Bangladeshi merchants and small businesses who deserve enterprise-grade
          intelligence without enterprise-level complexity. "ব্যাপারী" (Byapari) means
          <em style={{ color: "var(--text-secondary)" }}> merchant</em> in Bengali — this tool
          was made for you.
        </p>
      </div>

      {/* Feature highlights */}
      <div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 18,
          color: "var(--text-primary)",
          marginBottom: 16,
          letterSpacing: "-0.03em",
        }}>
          What B-AI Does
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}>
          {[
            { icon: <BarChart3 size={18} />, color: "#529dff", title: "Instant KPIs", desc: "Sales, profit, orders, ratings, returns — computed the moment you upload." },
            { icon: <Sparkles size={18} />, color: "#e8b84b", title: "AI Insights", desc: "Claude-powered recommendations tailored to your specific business data." },
            { icon: <Activity size={18} />, color: "#34d399", title: "Health Score", desc: "A holistic 0–100 score rating your business performance across key dimensions." },
            { icon: <TrendingUp size={18} />, color: "#a78bfa", title: "Sales Trends", desc: "Time-series charts showing revenue, profit, and volume over time." },
            { icon: <Package size={18} />, color: "#f87171", title: "Product Intelligence", desc: "Top performers, low stock alerts, and category-level breakdowns." },
            { icon: <Zap size={18} />, color: "#fbbf24", title: "Zero Config", desc: "No database, no setup. Just drop in a CSV and get answers in seconds." },
          ].map((feat) => (
            <div
              key={feat.title}
              className="glass-card"
              style={{ padding: "18px 20px" }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: `${feat.color}14`,
                border: `1px solid ${feat.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: feat.color, marginBottom: 12,
              }}>
                {feat.icon}
              </div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700, fontSize: 14,
                color: "var(--text-primary)", marginBottom: 5,
              }}>
                {feat.title}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
                {feat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team & Creator */}
      <div
        className="glass-card"
        style={{ padding: "28px 32px" }}
      >
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 17,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          marginBottom: 20,
        }}>
          The Team
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{
            width: 56, height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #529dff, #7c6fef, #e8b84b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 800, fontSize: 20, color: "white",
            flexShrink: 0,
            boxShadow: "0 0 0 3px rgba(82,157,255,0.2)",
          }}>
            SM
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800, fontSize: 18,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: 3,
            }}>
              S M Mohaiminul Islam
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="chip" style={{
                background: "var(--accent-dim)",
                color: "var(--accent)",
                border: "1px solid rgba(82,157,255,0.2)",
                fontSize: 11,
              }}>
                <Users size={11} /> Team Nexion
              </span>
              <span className="chip" style={{
                background: "var(--gold-dim)",
                color: "var(--gold)",
                border: "1px solid rgba(232,184,75,0.2)",
                fontSize: 11,
              }}>
                <Star size={11} /> Builder
              </span>
            </div>
          </div>

          <a
            href="https://github.com/Arik09013/byapari-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ textDecoration: "none" }}
          >
            <ExternalLink size={14} />
            GitHub
          </a>
        </div>

        <div
          style={{
            marginTop: 20,
            paddingTop: 18,
            borderTop: "1px solid var(--border)",
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.7,
          }}
        >
          Built with ❤️ for{" "}
          <a
            href="https://cloudcampbd.com/the-infinity-ai-buildfest"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}
          >
            The Infinity AI BuildFest 2026
          </a>{" "}
          · CloudCamp Bangladesh · Team Nexion
        </div>
      </div>

      {/* Tech stack */}
      <div
        className="glass-card"
        style={{ padding: "24px 28px" }}
      >
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: 16,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          marginBottom: 14,
        }}>
          Tech Stack
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            ["Next.js 14", "#529dff"],
            ["TypeScript", "#529dff"],
            ["Python FastAPI", "#34d399"],
            ["Recharts", "#a78bfa"],
            ["Tailwind CSS", "#38bdf8"],
            ["Lucide Icons", "#f87171"],
            ["Claude AI", "#e8b84b"],
          ].map(([name, color]) => (
            <span key={name} className="chip" style={{
              background: `${color}10`,
              color,
              border: `1px solid ${color}22`,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 500,
            }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ANALYTICS SECTION
// ─────────────────────────────────────────────
function AnalyticsSection({
  salesTrend,
  topProducts,
  healthScore,
}: {
  salesTrend: SalesDataPoint[];
  topProducts: ProductData[];
  healthScore: HealthScore | null;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <BarChart3 size={19} style={{ color: "var(--accent)" }} />
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: 20,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
        }}>
          Analytics Overview
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {healthScore && <HealthScoreCard health={healthScore} />}
        <SalesTrendChart data={salesTrend} />
      </div>
      <TopProductsChart data={topProducts} />
    </div>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="fade-up" style={{ maxWidth: 700 }}>
      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div
            className="logo-mark float"
            style={{ width: 44, height: 44, fontSize: 13, borderRadius: 11 }}
          >
            B-AI
          </div>
          <span className="section-label" style={{ color: "var(--accent)", letterSpacing: "0.1em" }}>
            Ready to analyze
          </span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "-0.05em",
          color: "var(--text-primary)",
          lineHeight: 1.15,
          marginBottom: 12,
        }}>
          Upload Your Business Data
        </h1>
        <p style={{
          fontSize: 15.5,
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          maxWidth: 560,
        }}>
          Drop in a CSV with your sales data and Byapari AI will instantly generate
          KPIs, sales forecasts, AI-powered recommendations, product insights, and
          a full business health score.
        </p>
      </div>

      {/* Required columns */}
      <div
        className="glass-card"
        style={{ padding: "24px 28px", marginBottom: 20 }}
      >
        <div style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: 15,
          color: "var(--text-primary)",
          marginBottom: 14,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Sparkles size={14} style={{ color: "var(--gold)" }} />
          Required CSV Columns
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 8,
        }}>
          {[
            "date", "product_name", "product_category", "sales",
            "profit", "quantity", "rating", "returned",
            "stock", "payment_method",
          ].map((field) => (
            <div key={field} style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "var(--accent-soft)",
              border: "1px solid rgba(82,157,255,0.12)",
              fontSize: 12.5,
              color: "var(--accent)",
              fontWeight: 500,
              fontFamily: "monospace",
            }}>
              {field}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onUpload}
        className="btn-primary"
        style={{ fontSize: 14, padding: "11px 22px", gap: 8 }}
      >
        <Upload size={15} />
        Upload CSV to Get Started
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [insights, setInsights] = useState<AiRecommendation[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    checkApiHealth().then((ok) => {
      setApiOnline(ok);
      setLoading(false);
    });
  }, []);

  const handleUploadSuccess = (
    newKpis: KpiData,
    newInsights: AiRecommendation[],
    newHealthScore: HealthScore,
    newSalesTrend: SalesDataPoint[],
    newTopProducts: ProductData[]
  ) => {
    setKpis(newKpis);
    setInsights(newInsights);
    setHealthScore(newHealthScore);
    setSalesTrend(newSalesTrend);
    setTopProducts(newTopProducts);
    setLastUpdated(new Date());
  };

  // ── DASHBOARD ──
  const renderDashboard = () => {
    if (!kpis || !healthScore) {
      return <EmptyState onUpload={() => setActiveSection("upload")} />;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* KPI Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <KpiCard title="Total Sales"   value={`৳${(kpis.total_sales ?? 0).toLocaleString()}`}
            icon={<DollarSign size={17} />}  accentColor="#529dff" delay={1} />
          <KpiCard title="Total Orders"  value={(kpis.total_orders ?? 0).toLocaleString()}
            icon={<ShoppingCart size={17} />} accentColor="#7c6fef" delay={2} />
          <KpiCard title="Total Profit"  value={`৳${(kpis.total_profit ?? 0).toLocaleString()}`}
            icon={<TrendingUp size={17} />}  accentColor="#34d399" delay={3} />
          <KpiCard title="Top Category"  value={kpis.top_category ?? "N/A"}
            icon={<Package size={17} />}    accentColor="#e8b84b" delay={4} />
        </div>

        {/* KPI Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <KpiCard title="Avg Rating"    value={`⭐ ${kpis.average_rating ?? 0}`}
            icon={<Star size={17} />}       accentColor="#fbbf24" delay={1} />
          <KpiCard title="Returned Orders" value={(kpis.returned_orders ?? 0).toLocaleString()}
            icon={<ShoppingCart size={17} />} accentColor="#f87171" delay={2} />
          <KpiCard title="Top Payment"   value={kpis.most_used_payment_method ?? "N/A"}
            icon={<DollarSign size={17} />}  accentColor="#7c6fef" delay={3} />
          <KpiCard title="Low Stock Items" value={(kpis.low_stock_products ?? 0).toLocaleString()}
            icon={<Package size={17} />}    accentColor="#f87171" delay={4} />
        </div>

        {/* Health + Sales Trend */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {healthScore && <HealthScoreCard health={healthScore} />}
          <SalesTrendChart data={salesTrend} />
        </div>

        {/* Top Products */}
        <TopProductsChart data={topProducts} />

        {/* AI Insights */}
        <div className="fade-up delay-4">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Lightbulb size={17} style={{ color: "var(--gold)" }} />
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700, fontSize: 17,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}>
              AI Recommendations
            </h2>
            <span className="badge badge-gold" style={{ marginLeft: 4 }}>
              {insights.length} insights
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {insights.map((rec, i) => (
              <InsightCard key={i} rec={rec} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── UPLOAD ──
  const renderUpload = () => (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700, fontSize: 24,
          color: "var(--text-primary)",
          letterSpacing: "-0.04em",
        }}>
          Upload Data
        </h2>
        <p style={{ color: "var(--text-muted)", marginTop: 5, fontSize: 14 }}>
          Upload a CSV — KPIs, insights and health score all update instantly
        </p>
      </div>
      <CsvUpload onDataLoaded={handleUploadSuccess} />
    </div>
  );

  // ── INSIGHTS ──
  const renderInsights = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700, fontSize: 24,
            color: "var(--text-primary)",
            letterSpacing: "-0.04em",
          }}>
            AI Insights
          </h2>
          <span className="badge badge-gold">{insights.length} total</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Real business intelligence generated from your data
        </p>
      </div>
      {healthScore && (
        <div style={{ maxWidth: 500, marginBottom: 24 }}>
          <HealthScoreCard health={healthScore} />
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
        {insights.map((rec, i) => (
          <InsightCard key={i} rec={rec} index={i} />
        ))}
      </div>
    </div>
  );

  // ── ROUTER ──
  const renderSection = () => {
    if (activeSection === "upload")    return renderUpload();
    if (activeSection === "insights")  return renderInsights();
    if (activeSection === "sales")     return <SalesTrendPage data={salesTrend} />;
    if (activeSection === "products")  return <ProductsPage products={topProducts} />;
    if (activeSection === "about")     return <AboutPage />;
    if (activeSection === "analytics") return (
      <AnalyticsSection salesTrend={salesTrend} topProducts={topProducts} healthScore={healthScore} />
    );
    return renderDashboard();
  };

  // ── PAGE TITLE ──
  const sectionTitle: Record<string, string> = {
    dashboard: "Business Dashboard",
    analytics: "Analytics",
    sales: "Sales Trend",
    products: "Products",
    upload: "Upload Data",
    insights: "AI Insights",
    about: "About B-AI",
    settings: "Settings",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* ── Header ── */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          height: 64,
          borderBottom: "1px solid var(--border)",
          background: "rgba(5,11,24,0.85)",
          backdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 20,
          gap: 16,
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 17,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}>
              {sectionTitle[activeSection] ?? activeSection}
            </h1>
            {lastUpdated && (
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Health mini badge */}
            {healthScore && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                borderRadius: 99,
                padding: "5px 12px",
                background: `${healthScore.color}12`,
                border: `1px solid ${healthScore.color}28`,
                fontSize: 12,
                color: healthScore.color,
                fontWeight: 600,
              }}>
                <Heart size={12} />
                {healthScore.score}/100
                <span style={{ color: `${healthScore.color}90`, fontWeight: 400 }}>
                  · {healthScore.label}
                </span>
              </div>
            )}

            {/* API status */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              borderRadius: 99,
              padding: "5px 12px",
              background: apiOnline ? "var(--green-dim)" : "var(--red-dim)",
              border: `1px solid ${apiOnline ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
              fontSize: 12,
              color: apiOnline ? "var(--green)" : "var(--red)",
              fontWeight: 500,
            }}>
              {apiOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
              {apiOnline === null ? "Checking…" : apiOnline ? "Online" : "Offline"}
            </div>

            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              disabled={loading}
              className="btn-ghost"
              style={{ opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <div style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[90, 200, 200].map((h, i) => (
                <div key={i} className="shimmer" style={{ height: h, opacity: 0.6 }} />
              ))}
            </div>
          ) : (
            renderSection()
          )}
        </div>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: "1px solid var(--border)",
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="logo-mark" style={{ width: 22, height: 22, fontSize: 8, borderRadius: 5 }}>
              B-AI
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Byapari AI · Built by{" "}
              <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                S M Mohaiminul Islam
              </strong>
              {" "}· Team Nexion
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a
              href="https://cloudcampbd.com/the-infinity-ai-buildfest"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11, color: "var(--accent)", textDecoration: "none",
                fontWeight: 500, display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <Link2 size={11} />
              Infinity AI BuildFest 2026
            </a>
            <a
              href="https://github.com/Arik09013/byapari-ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11, color: "var(--text-muted)", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <ExternalLink size={11} />
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}