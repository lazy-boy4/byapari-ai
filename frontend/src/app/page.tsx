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
// CONSTANTS
// ─────────────────────────────────────────────
const IMPACT_COLORS = {
  high:   { bg: "rgba(239,68,68,0.1)",   text: "#ef4444", border: "rgba(239,68,68,0.2)"   },
  medium: { bg: "rgba(245,158,11,0.1)",  text: "#f59e0b", border: "rgba(245,158,11,0.2)"  },
  low:    { bg: "rgba(16,185,129,0.1)",  text: "#10b981", border: "rgba(16,185,129,0.2)"  },
};

// ─────────────────────────────────────────────
// HEALTH SCORE CARD COMPONENT
// ─────────────────────────────────────────────
function HealthScoreCard({ health }: { health: HealthScore }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (health.score / 100) * circumference;

  return (
    <div className="glow-card p-5 fade-in fade-in-delay-1">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={18} style={{ color: health.color }} />
        <h3 style={{
          fontFamily: "Syne, sans-serif", fontWeight: 700,
          fontSize: 16, color: "var(--text-primary)",
        }}>
          Business Health Score
        </h3>
      </div>

      <div className="flex items-center gap-6">
        <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
          <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r={radius} fill="none"
              stroke="var(--border)" strokeWidth="8" />
            <circle cx="50" cy="50" r={radius} fill="none"
              stroke={health.color} strokeWidth="8"
              strokeDasharray={`${progress} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", textAlign: "center",
          }}>
            <div style={{
              fontFamily: "Syne, sans-serif", fontWeight: 800,
              fontSize: 22, color: health.color, lineHeight: 1,
            }}>
              {health.score}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>/ 100</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <div style={{
            fontFamily: "Syne, sans-serif", fontWeight: 700,
            fontSize: 18, color: health.color, marginBottom: 2,
          }}>
            {health.label}
          </div>
          {Object.values(health.breakdown).map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-0.5">
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.label}</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                  {item.score}/{item.max}
                </span>
              </div>
              <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}>
                <div style={{
                  height: "100%",
                  width: `${(item.score / item.max) * 100}%`,
                  background: health.color,
                  borderRadius: 2,
                  transition: "width 1s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// INSIGHT CARD COMPONENT
// ─────────────────────────────────────────────
function InsightCard({ rec }: { rec: AiRecommendation }) {
  const colors = IMPACT_COLORS[rec.impact] ?? IMPACT_COLORS.medium;
  return (
    <div className="glow-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
          {rec.impact.toUpperCase()} IMPACT
        </span>
        <span className="rounded-full px-2.5 py-0.5 text-xs"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>
          {rec.category}
        </span>
      </div>

      <h4 style={{
        fontFamily: "Syne, sans-serif", fontWeight: 700,
        fontSize: 15, color: "var(--text-primary)", lineHeight: 1.4,
      }}>
        {rec.title}
      </h4>

      <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
        {rec.description}
      </p>

      {rec.metric && (
        <div className="rounded-lg px-3 py-1.5" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          fontSize: 12, color: "var(--text-secondary)",
        }}>
          📊 {rec.metric}
        </div>
      )}

      {rec.action && (
        <button className="flex items-center gap-1 text-sm font-semibold mt-auto pt-1"
          style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          → {rec.action}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ANALYTICS SECTION (Combined charts view)
// ─────────────────────────────────────────────
function AnalyticsSection({ salesTrend, topProducts, healthScore }: {
  salesTrend: SalesDataPoint[];
  topProducts: ProductData[];
  healthScore: HealthScore | null;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 size={20} style={{ color: "var(--accent)" }} />
        <h2 style={{
          fontFamily: "Syne, sans-serif", fontWeight: 700,
          fontSize: 20, color: "var(--text-primary)",
        }}>
          Analytics Overview
        </h2>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {healthScore && <HealthScoreCard health={healthScore} />}
        <SalesTrendChart data={salesTrend} />
      </div>
      
      <TopProductsChart data={topProducts} />
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

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkApiHealth();
      setApiOnline(isHealthy);
      setLoading(false);
    };
    checkHealth();
  }, []);

  // Called when CSV upload succeeds
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

  // ── DASHBOARD SECTION ──
  const renderDashboard = () => {
    if (!kpis || !healthScore) {
      return (
        <div className="glow-card p-10 text-center">
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            Upload Your Business Data
          </h1>
          <p style={{
            color: "var(--text-muted)",
            marginBottom: 24,
            maxWidth: 600,
            marginInline: "auto",
            lineHeight: 1.7,
          }}>
            Upload a CSV file containing your sales, products,
            inventory, ratings, and payment data.
            Byapari AI will automatically generate:
            analytics, forecasts, AI recommendations,
            business health scores, and product insights.
          </p>

          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            textAlign: "left",
            maxWidth: 720,
            margin: "0 auto",
          }}>
            <h3 style={{ marginBottom: 14, fontSize: 18, fontWeight: 700 }}>
              Required CSV Columns
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}>
              {[
                "date", "product_name", "product_category", "sales",
                "profit", "quantity", "rating", "returned",
                "stock", "payment_method",
              ].map((field) => (
                <div key={field} style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.15)",
                  fontSize: 14,
                }}>
                  {field}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {/* KPI Row 1 */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <KpiCard title="Total Sales"
            value={`৳${(kpis.total_sales ?? 0).toLocaleString()}`}
            icon={<DollarSign size={18} />} accentColor="#3b82f6" delay={1} />
          <KpiCard title="Total Orders"
            value={(kpis.total_orders ?? 0).toLocaleString()}
            icon={<ShoppingCart size={18} />} accentColor="#6366f1" delay={2} />
          <KpiCard title="Total Profit"
            value={`৳${(kpis.total_profit ?? 0).toLocaleString()}`}
            icon={<TrendingUp size={18} />} accentColor="#10b981" delay={3} />
          <KpiCard title="Top Category"
            value={kpis.top_category ?? "N/A"}
            icon={<Package size={18} />} accentColor="#f59e0b" delay={4} />
        </div>

        {/* KPI Row 2 */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <KpiCard title="Avg Rating"
            value={`⭐ ${kpis.average_rating ?? 0}`}
            icon={<TrendingUp size={18} />} accentColor="#f59e0b" delay={1} />
          <KpiCard title="Returned Orders"
            value={(kpis.returned_orders ?? 0).toLocaleString()}
            icon={<ShoppingCart size={18} />} accentColor="#ef4444" delay={2} />
          <KpiCard title="Top Payment"
            value={kpis.most_used_payment_method ?? "N/A"}
            icon={<DollarSign size={18} />} accentColor="#6366f1" delay={3} />
          <KpiCard title="Low Stock Items"
            value={(kpis.low_stock_products ?? 0).toLocaleString()}
            icon={<Package size={18} />} accentColor="#ef4444" delay={4} />
        </div>

        {/* Health Score + Sales Trend */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          {healthScore && <HealthScoreCard health={healthScore} />}
          <SalesTrendChart data={salesTrend} />
        </div>

        {/* Top Products */}
        <TopProductsChart data={topProducts} />

        {/* AI Insights */}
        <div className="fade-in fade-in-delay-4">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={18} style={{ color: "#f59e0b" }} />
            <h2 style={{
              fontFamily: "Syne, sans-serif", fontWeight: 700,
              fontSize: 18, color: "var(--text-primary)",
            }}>
              AI Recommendations
            </h2>
            <span className="rounded-full px-2 py-0.5 text-xs font-bold"
              style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
              {insights.length} insights
            </span>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {insights.map((rec, i) => (
              <InsightCard key={i} rec={rec} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── UPLOAD SECTION ──
  const renderUpload = () => (
    <div style={{ maxWidth: 560 }}>
      <div className="mb-6">
        <h2 style={{
          fontFamily: "Syne, sans-serif", fontWeight: 700,
          fontSize: 24, color: "var(--text-primary)",
        }}>
          Upload Data
        </h2>
        <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
          Upload a CSV — KPIs, insights and health score all update instantly
        </p>
      </div>
      <CsvUpload onDataLoaded={handleUploadSuccess} />
    </div>
  );

  // ── AI INSIGHTS SECTION ──
  const renderInsights = () => (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h2 style={{
            fontFamily: "Syne, sans-serif", fontWeight: 700,
            fontSize: 24, color: "var(--text-primary)",
          }}>
            AI Insights
          </h2>
          <span className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
            {insights.length} total
          </span>
        </div>
        <p style={{ color: "var(--text-muted)" }}>
          Real business intelligence generated from your data
        </p>
      </div>

      <div className="mb-6" style={{ maxWidth: 480 }}>
        {healthScore && <HealthScoreCard health={healthScore} />}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {insights.map((rec, i) => (
          <InsightCard key={i} rec={rec} />
        ))}
      </div>
    </div>
  );

  // ── ROUTE ──
  const renderSection = () => {
    if (activeSection === "upload") return renderUpload();
    if (activeSection === "insights") return renderInsights();
    if (activeSection === "sales") return <SalesTrendPage data={salesTrend} />;
    if (activeSection === "products") return <ProductsPage products={topProducts} />;
    if (activeSection === "analytics") return (
      <AnalyticsSection 
        salesTrend={salesTrend} 
        topProducts={topProducts} 
        healthScore={healthScore} 
      />
    );
    return renderDashboard();
  };

  // ── LAYOUT ──
  return (
    <div className="flex" style={{ minHeight: "100vh" }}>
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: "1px solid var(--border)",
            background: "rgba(10,15,30,0.8)",
            backdropFilter: "blur(12px)",
            position: "sticky", top: 0, zIndex: 10,
          }}>
          <div>
            <h1 style={{
              fontFamily: "Syne, sans-serif", fontWeight: 700,
              fontSize: 20, color: "var(--text-primary)", textTransform: "capitalize",
            }}>
              {activeSection === "dashboard" ? "Business Dashboard" : activeSection}
            </h1>
            {lastUpdated && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Health score mini badge */}
            {healthScore && (
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  background: `${healthScore.color}18`,
                  border: `1px solid ${healthScore.color}35`,
                  fontSize: 12, color: healthScore.color,
                }}>
                <Heart size={12} />
                {healthScore.score}/100 · {healthScore.label}
              </div>
            )}

            {/* API status */}
            <div className="flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                background: apiOnline ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${apiOnline ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                fontSize: 12,
                color: apiOnline ? "var(--accent-green)" : "var(--accent-red)",
              }}>
              {apiOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              {apiOnline === null ? "Checking..." : apiOnline ? "Backend Online" : "Backend Offline"}
            </div>

            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-sm"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl" style={{
                  height: i === 1 ? 90 : 200,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  opacity: 0.5,
                }} />
              ))}
            </div>
          ) : renderSection()}
        </div>
      </main>
    </div>
  );
}