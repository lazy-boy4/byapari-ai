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
  Activity,
  Users,
  Star,
  Zap,
  ExternalLink,
  Upload,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { PaperCard } from "@/components/paper-card";
import { MonoLabel } from "@/components/mono-label";
import { SectionHeading } from "@/components/section-heading";
import { HealthGauge } from "@/components/health-gauge";
import { KpiTile } from "@/components/kpi-tile";
import { ForecastChart } from "@/components/forecast-chart";

import { SalesTrendChart, TopProductsChart } from "@/components/AnalyticsChart";
import CsvUpload from "@/components/CsvUpload";
import SalesTrendPage from "@/components/SalesTrendPage";
import ProductsPage from "@/components/ProductsPage";
import {
  checkApiHealth,
  analyzeCSV,
  KpiData,
  AiRecommendation,
  HealthScore,
  SalesDataPoint,
  ProductData,
  InsightResponse,
  getPricingSuggestions,
  PricingResponse,
} from "@/lib/api";

import InsightsPanel from "@/components/InsightsPanel";
import PricingPanel from "@/components/PricingPanel";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Alert {
  severity: "critical" | "warning" | "info";
  message: string;
}

// ─────────────────────────────────────────────
// ALERT CONFIG
// ─────────────────────────────────────────────
const ALERT_CONFIG = {
  critical: {
    color: "var(--danger)",
    bg: "bg-danger/15",
    border: "border-danger",
    label: "Critical",
  },
  warning: {
    color: "var(--warning)",
    bg: "bg-warning/15",
    border: "border-warning",
    label: "Warning",
  },
  info: {
    color: "var(--color-coffee)",
    bg: "bg-secondary/60",
    border: "border-rule",
    label: "Info",
  },
};

// ─────────────────────────────────────────────
// DELTA COMPUTATION HELPERS
// ─────────────────────────────────────────────
function computeDelta(prev: number | undefined | null, curr: number): string | undefined {
  if (prev === undefined || prev === null || prev === 0) return undefined;
  const change = ((curr - prev) / prev) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
}

function computeAbsDelta(prev: number | undefined | null, curr: number): string | undefined {
  if (prev === undefined || prev === null) return undefined;
  const change = curr - prev;
  return `${change >= 0 ? '+' : ''}${change}`;
}

// ─────────────────────────────────────────────
// AI ALERT GENERATOR (rule-based, zero API cost)
// ─────────────────────────────────────────────
function generateAlerts(kpis: KpiData | null, health: HealthScore | null): Alert[] {
  if (!kpis || !health) return [];

  const alerts: Alert[] = [];

  // ── Health score ──
  if (health.score < 50) {
    alerts.push({
      severity: "critical",
      message: "Business health is critically low. Immediate action required.",
    });
  } else if (health.score < 70) {
    alerts.push({
      severity: "warning",
      message: "Business health is below optimal level. Review key metrics.",
    });
  }

  // ── Profit margin ──
  if (kpis.total_sales > 0 && kpis.total_profit < kpis.total_sales * 0.1) {
    alerts.push({
      severity: "warning",
      message: "Profit margin is very low compared to sales. Consider reducing costs or adjusting pricing.",
    });
  }

  // ── Return rate ──
  if (kpis.total_orders > 0 && kpis.returned_orders > kpis.total_orders * 0.2) {
    alerts.push({
      severity: "critical",
      message: "High return rate detected (>20% of orders). Check product quality and descriptions.",
    });
  } else if (kpis.total_orders > 0 && kpis.returned_orders > kpis.total_orders * 0.1) {
    alerts.push({
      severity: "warning",
      message: "Return rate is above 10%. Monitor closely for product issues.",
    });
  }

  // ── Low stock ──
  if (kpis.low_stock_products > 5) {
    alerts.push({
      severity: "warning",
      message: `${kpis.low_stock_products} products are running low on stock. Restock soon to avoid lost sales.`,
    });
  } else if (kpis.low_stock_products > 0) {
    alerts.push({
      severity: "info",
      message: `${kpis.low_stock_products} product(s) are low in stock.`,
    });
  }

  // ── Customer rating ──
  if (kpis.average_rating < 3.0) {
    alerts.push({
      severity: "critical",
      message: "Customer satisfaction is critically low (rating < 3.0). Urgent review needed.",
    });
  } else if (kpis.average_rating < 3.5) {
    alerts.push({
      severity: "warning",
      message: "Customer satisfaction is dropping. Consider improving product quality or service.",
    });
  }

  return alerts;
}

// ─────────────────────────────────────────────
// AI ALERTS BANNER
// ─────────────────────────────────────────────
function AlertsBanner({ alerts }: { alerts: Alert[] }) {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLang();

  if (alerts.length === 0 || dismissed) return null;

  // Show highest severity first
  const sorted = [...alerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  const topSeverity = sorted[0].severity;
  const cfg = ALERT_CONFIG[topSeverity];

  return (
    <div
      className={cn(
        "fade-up mb-8 border relative p-6",
        topSeverity === "critical"
          ? "bg-danger/10 border-danger text-danger"
          : topSeverity === "warning"
            ? "bg-warning/10 border-warning text-warning"
            : "bg-secondary/60 border-rule text-ink"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wider">
          <AlertTriangle className="size-4" />
          <span>{t("dashboard.alerts_title")}</span>
          <span className="bg-ink/10 border border-ink/20 px-2 py-0.5 text-xs font-mono">
            {alerts.length}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-ink text-xl font-mono cursor-pointer"
          aria-label={t("dashboard.dismiss")}
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        {sorted.map((alert, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className="font-mono text-xs uppercase px-2 py-0.5 bg-ink/5 border border-ink/10 rounded-none shrink-0 mt-0.5">
              {alert.severity}
            </span>
            <span className="leading-relaxed">{alert.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HEALTH SCORE CARD (Compact representation)
// ─────────────────────────────────────────────
function HealthScoreCard({ health }: { health: HealthScore }) {
  const { t } = useLang();
  return (
    <PaperCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-coffee" />
          <MonoLabel>{t("health.score_label")}</MonoLabel>
        </div>
        <span className="mono-caps text-xs px-2.5 py-1 bg-secondary/50 border border-rule text-ink font-semibold">
          {health.label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="flex flex-col items-center justify-center shrink-0">
          <HealthGauge score={health.score} />
        </div>

        {health.breakdown && Object.values(health.breakdown).length > 0 && (
          <div className="flex-1 w-full space-y-4">
            {Object.values(health.breakdown).filter(Boolean).map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-mono text-xs text-ink">{item.label}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {item.score} / {item.max}
                  </span>
                </div>
                <div className="h-2 bg-secondary/50 border border-rule">
                  <div
                    className="h-full bg-ink"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PaperCard>
  );
}

// ─────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────
function AboutPage() {
  const { t } = useLang();
  const features = [
    { icon: <BarChart3 size={18} />, color: "text-ink", title: t("about.feat1_title"), desc: t("about.feat1_desc") },
    { icon: <Sparkles size={18} />, color: "text-coffee", title: t("about.feat2_title"), desc: t("about.feat2_desc") },
    { icon: <Activity size={18} />, color: "text-ink", title: t("about.feat3_title"), desc: t("about.feat3_desc") },
    { icon: <TrendingUp size={18} />, color: "text-coffee", title: t("about.feat4_title"), desc: t("about.feat4_desc") },
    { icon: <Package size={18} />, color: "text-ink", title: t("about.feat5_title"), desc: t("about.feat5_desc") },
    { icon: <Zap size={18} />, color: "text-coffee", title: t("about.feat6_title"), desc: t("about.feat6_desc") },
  ];

  return (
    <div className="fade-up max-w-4xl space-y-16">
      <PaperCard className="p-10 flex flex-col md:flex-row gap-8 items-start">
        <div className="size-16 shrink-0 bg-ink text-[color:var(--color-paper)] flex items-center justify-center font-display font-extrabold text-2xl">
          B-AI
        </div>
        <div className="space-y-4">
          <SectionHeading index="01" eyebrow={t("about.eyebrow")} title={t("about.title")} />
          <p className="text-base leading-relaxed text-ink/90 max-w-2xl">
            <strong className="font-semibold text-ink">{t("about.title")}</strong> {t("about.desc1")}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-2xl">
            {t("about.desc2")}
          </p>
        </div>
      </PaperCard>

      <div className="space-y-8">
        <SectionHeading index="02" eyebrow={t("about.features_eyebrow")} title={t("about.features_title")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <PaperCard key={idx} className="p-6 space-y-4">
              <div className={cn("size-10 bg-secondary/50 border border-rule flex items-center justify-center rounded-none", feat.color)}>
                {feat.icon}
              </div>
              <div className="font-display font-bold text-sm text-ink">{feat.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</div>
            </PaperCard>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PaperCard className="p-8 space-y-6">
                    <SectionHeading index="03" eyebrow={t("about.team_eyebrow")} title={t("about.team_title")} />
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full border border-rule bg-secondary flex items-center justify-center font-mono font-bold text-sm text-ink shrink-0">
              SM
            </div>
            <div>
              <div className="font-display font-bold text-sm text-ink">{t("about.team_name")}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="mono-caps text-[9px] bg-secondary/50 border border-rule px-2 py-0.5 text-muted-foreground">{t("about.team_team")}</span>
                <span className="mono-caps text-[9px] bg-coffee/15 border border-coffee/30 px-2 py-0.5 text-coffee">{t("about.team_builder")}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-rule">
            {t("about.team_built")} {" "}
            <a
              href="https://cloudcampbd.com/the-infinity-ai-buildfest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coffee hover:underline font-semibold"
            >
              The Infinity AI BuildFest 2026
            </a>{" "}
            {t("about.team_organized")}
          </p>
        </PaperCard>

        <PaperCard className="p-8 space-y-6">
          <SectionHeading index="04" eyebrow={t("about.stack_eyebrow")} title={t("about.stack_title")} />
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              "Next.js 16",
              "TypeScript",
              "Python FastAPI",
              "Recharts",
              "Tailwind CSS",
              "Lucide Icons",
              "Groq LLM",
            ].map((name) => (
              <span key={name} className="mono-caps text-[10px] bg-secondary/50 border border-rule px-3 py-1.5 text-ink">
                {name}
              </span>
            ))}
          </div>
          <div className="pt-4 border-t border-rule">
            <a
              href="https://github.com/Arik09013/byapari-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-caps inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-[color:var(--color-paper)] text-xs transition-colors hover:bg-transparent hover:text-ink cursor-pointer"
            >
              <ExternalLink size={12} />
              {t("about.stack_github")}
            </a>
          </div>
        </PaperCard>
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
  const { t } = useLang();
  return (
    <div className="space-y-12">
      <SectionHeading index="01" eyebrow={t("dashboard.analytics_eyebrow")} title={t("dashboard.analytics_title")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
  const { t } = useLang();
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center size-16 bg-ink text-[color:var(--color-paper)] font-display text-2xl font-bold rounded-none mb-4">
          B-AI
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="mono-caps text-xs text-coffee font-semibold tracking-wider">{t("empty.ready")}</span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
          {t("empty.title")}
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
          {t("empty.desc")}
        </p>
      </div>

      <PaperCard className="p-8">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink mb-5 flex items-center gap-2">
          <Sparkles className="size-4 text-coffee" />
          {t("empty.columns_title")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "date",
            "product_name",
            "product_category",
            "sales",
            "profit",
            "quantity",
            "rating",
            "returned",
            "stock",
            "payment_method",
          ].map((field) => (
            <div key={field} className="bg-secondary/40 border border-rule px-3 py-2 text-xs text-ink font-mono rounded-none">
              {field}
            </div>
          ))}
        </div>
      </PaperCard>

      <div className="text-center">
        <button
          onClick={onUpload}
          className="mono-caps inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-[color:var(--color-paper)] text-sm transition-colors hover:bg-transparent hover:text-ink cursor-pointer"
        >
          <Upload className="size-4" />
          {t("empty.cta")}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const { t, lang, setLang } = useLang();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [initialized, setInitialized] = useState(false);

  // Read ?section= from URL on first mount
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (section) setActiveSection(section);
  }, [initialized]);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [insights, setInsights] = useState<AiRecommendation[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<ProductData[]>([]);
  const [aiInsights, setAiInsights] = useState<InsightResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [rawCsvData, setRawCsvData] = useState<Record<string, string | number>[]>([]);
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null);
  const [previousKpis, setPreviousKpis] = useState<KpiData | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>(undefined);
  // ── AI Alerts state ──
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    checkApiHealth().then((ok) => {
      setApiOnline(ok);
      setLoading(false);
    });
  }, []);

  // ── Re-generate alerts whenever KPIs or health score change ──
  useEffect(() => {
    const newAlerts = generateAlerts(kpis, healthScore);
    setAlerts(newAlerts);
  }, [kpis, healthScore]);

  const handleUploadSuccess = (
    newKpis: KpiData,
    newInsights: AiRecommendation[],
    newHealthScore: HealthScore,
    newSalesTrend: SalesDataPoint[],
    newTopProducts: ProductData[],
    rawData?: Record<string, string | number>[],
    fileName?: string
  ) => {
    setPreviousKpis(kpis);
    setKpis(newKpis);
    if (fileName) setUploadedFileName(fileName);
    setInsights(newInsights);
    setHealthScore(newHealthScore);
    setSalesTrend(newSalesTrend);
    setTopProducts(newTopProducts);

    if (rawData && rawData.length > 0) {
      setRawCsvData(rawData);
      handleGetInsights(lang, rawData);
      fetchPricing(rawData);
    }

    setLastUpdated(new Date());
  };

  const handleGetInsights = async (
    lang: "bn" | "en" = "bn",
    dataOverride?: Record<string, string | number>[]
  ) => {
    const dataToAnalyze = dataOverride || rawCsvData;
    if (dataToAnalyze.length === 0) return;

    setAnalyzing(true);
    try {
      const response = await analyzeCSV(dataToAnalyze, lang);
      setAiInsights(response);
      setLang(lang);
    } catch (err) {
      console.error("Insights error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchPricing = async (data: Record<string, string | number>[]) => {
    try {
      const response = await getPricingSuggestions(data, lang);
      setPricingData(response);
    } catch (err) {
      console.error("Pricing error:", err);
    }
  };

  // ── DASHBOARD ──
  const renderDashboard = () => {
    if (!kpis || !healthScore) {
      return <EmptyState onUpload={() => setActiveSection("upload")} />;
    }

    return (
      <div className="space-y-12">
        {/* AI Alerts Banner */}
        <AlertsBanner alerts={alerts} />

        {/* 01 — KPI OVERVIEW */}
        <section>
          <SectionHeading index="01" eyebrow={t("kpi.eyebrow")} title={t("kpi.title")} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiTile label={t("kpi.total_sales")} value={`৳${(kpis.total_sales ?? 0).toLocaleString()}`} delta={previousKpis ? computeDelta(previousKpis.total_sales, kpis.total_sales) : undefined} index="A" />
            <KpiTile label={t("kpi.total_orders")} value={(kpis.total_orders ?? 0).toLocaleString()} delta={previousKpis ? computeAbsDelta(previousKpis.total_orders, kpis.total_orders) : undefined} index="B" />
            <KpiTile label={t("kpi.total_profit")} value={`৳${(kpis.total_profit ?? 0).toLocaleString()}`} delta={previousKpis ? computeDelta(previousKpis.total_profit, kpis.total_profit) : undefined} index="C" />
            <KpiTile label={t("kpi.top_category")} value={kpis.top_category ?? "N/A"} index="D" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KpiTile label={t("kpi.avg_rating")} value={`⭐ ${kpis.average_rating ?? 0}`} delta={previousKpis ? computeAbsDelta(previousKpis.average_rating, kpis.average_rating) : undefined} index="E" />
            <KpiTile label={t("kpi.returned_orders")} value={(kpis.returned_orders ?? 0).toLocaleString()} delta={previousKpis ? computeDelta(previousKpis.returned_orders, kpis.returned_orders) : undefined} index="F" />
            <KpiTile label={t("kpi.top_payment")} value={kpis.most_used_payment_method ?? "N/A"} index="G" />
            <KpiTile label={t("kpi.low_stock")} value={(kpis.low_stock_products ?? 0).toLocaleString()} delta={previousKpis ? computeAbsDelta(previousKpis.low_stock_products, kpis.low_stock_products) : undefined} index="H" />
          </div>
        </section>

        {/* 02 — BUSINESS HEALTH */}
          <section className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5">
              <SectionHeading index="02" eyebrow={t("health.eyebrow")} title={t("health.title")} />
              <PaperCard className="p-8 flex flex-col items-center justify-center text-center">
                <HealthGauge score={healthScore.score} />
                <div className="mt-4">
                  <span className="mono-caps text-[10px] text-muted-foreground">{t("health.status_label")}</span>
                  <div className="font-display text-xl font-bold text-ink mt-0.5">{healthScore.label}</div>
                </div>
              </PaperCard>
            </div>

            {healthScore.breakdown && Object.values(healthScore.breakdown).length > 0 && (
              <div className="md:col-span-7">
                <SectionHeading index="02.1" eyebrow={t("health.breakdown_eyebrow")} title={t("health.breakdown_title")} />
              <PaperCard className="p-6 divide-y divide-rule">
                {Object.values(healthScore.breakdown).filter(Boolean).map((item) => (
                  <div key={item.label} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-mono text-sm text-ink">{item.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.score} / {item.max}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary/50 border border-rule">
                      <div
                        className="h-full bg-ink"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </PaperCard>
            </div>
          )}
        </section>

        {/* Get AI Insights & Pricing suggestion buttons */}
        <section className="flex flex-wrap gap-4 border-y border-rule py-6">
          <button
            onClick={() => handleGetInsights(lang)}
            disabled={analyzing || rawCsvData.length === 0}
            className="mono-caps inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-[color:var(--color-paper)] transition-colors hover:bg-transparent hover:text-ink cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <><Loader2 className="size-4 animate-spin" /> {t("dashboard.analyzing")}</>
            ) : (
              <><Sparkles className="size-4" /> {t("dashboard.get_insights")}</>
            )}
          </button>

          <button
            onClick={() => rawCsvData.length > 0 && fetchPricing(rawCsvData)}
            disabled={rawCsvData.length === 0}
            className="mono-caps inline-flex items-center gap-2 border border-rule bg-transparent px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-[color:var(--color-paper)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💰 {t("dashboard.get_pricing")}
          </button>
        </section>

        {/* AI Insights & Forecast */}
        {aiInsights && (
          <section className="space-y-12">
              <div>
                <SectionHeading index="03" eyebrow={t("dashboard.ai_eyebrow")} title={t("dashboard.ai_title")} />
              <InsightsPanel
                insights={aiInsights}
                lang={lang}
                isLoading={analyzing}
                onLanguageChange={(lang) => handleGetInsights(lang)}
              />
            </div>

            {aiInsights.forecast && (
              <div>
                <SectionHeading index="04" eyebrow={t("dashboard.forecast_eyebrow")} title={t("dashboard.forecast_title")} />
                <PaperCard className="p-6">
                  <ForecastChart data={aiInsights.forecast} />
                  <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground">
                    {t("dashboard.forecast_caption")}
                  </p>
                </PaperCard>
              </div>
            )}
          </section>
        )}

        {/* Pricing Suggestions */}
        {pricingData && (
          <section>
            <SectionHeading index="05" eyebrow={t("pricing.suggested_eyebrow")} title={t("pricing.suggested_title")} />
            <PricingPanel data={pricingData} lang={lang} />
          </section>
        )}

        {/* Analytics Charts */}
        <section className="grid md:grid-cols-2 gap-8">
          <div>
            <SectionHeading index="06" eyebrow={t("dashboard.trend_eyebrow")} title={t("dashboard.trend_title")} />
            <PaperCard className="p-6">
              <SalesTrendChart data={salesTrend} />
            </PaperCard>
          </div>
          <div>
            <SectionHeading index="07" eyebrow={t("dashboard.product_eyebrow")} title={t("dashboard.product_title")} />
            <PaperCard className="p-6">
              <TopProductsChart data={topProducts} />
            </PaperCard>
          </div>
        </section>
      </div>
    );
  };

  // ── UPLOAD ──
  const renderUpload = () => (
    <div className="max-w-4xl space-y-6">
      <SectionHeading index="01" eyebrow={t("upload.eyebrow")} title={t("upload.title")} lead={t("upload.lead")} />
      <CsvUpload onDataLoaded={handleUploadSuccess} />
    </div>
  );

  // ── INSIGHTS ──
  const renderInsights = () => (
    <div className="space-y-8">
      <SectionHeading index="01" eyebrow={t("insights.eyebrow")} title={t("insights.title")} lead={t("insights.lead")} />
      {healthScore && (
        <div className="max-w-2xl">
          <HealthScoreCard health={healthScore} />
        </div>
      )}
      {aiInsights && (
        <InsightsPanel
          insights={aiInsights}
          lang={lang}
          isLoading={analyzing}
          onLanguageChange={(lang) => handleGetInsights(lang)}
        />
      )}
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
    dashboard: t("nav.dashboard"),
    analytics: t("nav.analytics"),
    sales: t("nav.sales"),
    products: t("nav.products"),
    upload: t("nav.upload"),
    insights: t("nav.insights"),
    about: t("nav.about"),
    settings: t("nav.settings"),
  };

  return (
    <div className="flex-1 flex min-h-screen bg-background text-foreground">
      <AppSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        fileName={uploadedFileName}
        rowCount={rawCsvData.length > 0 ? rawCsvData.length : undefined}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* ── Sub-header ── */}
        <header className="flex flex-wrap items-center justify-between gap-1 border-b border-rule px-4 sm:px-8 py-2 bg-background/85 backdrop-blur-sm sticky top-[65px] z-20">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-ink">
              {sectionTitle[activeSection] ?? activeSection}
            </h1>
            {lastUpdated && (
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                {t("dashboard.updated")} {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Health mini badge */}
            {healthScore && (
              <div className="flex items-center gap-2 rounded-none px-3 py-1.5 bg-secondary/50 border border-rule text-xs font-mono text-ink">
                <Heart className="size-3 text-coffee" />
                {healthScore.score}/100 · {healthScore.label}
              </div>
            )}

            {/* Alert count badge in header */}
            {alerts.length > 0 && (
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center gap-2 rounded-none px-3 py-1.5 bg-danger/10 border border-danger text-xs font-mono text-danger cursor-pointer"
              >
                <AlertTriangle className="size-3" />
                {alerts.length} {t("dashboard.alerts")}
              </button>
            )}

            {/* API status */}
            <div className={cn(
              "flex items-center gap-2 rounded-none px-3 py-1.5 text-xs font-mono border",
              apiOnline
                ? "bg-[color:var(--color-success)]/10 border-[color:var(--color-success)] text-[color:var(--color-success)]"
                : "bg-danger/10 border-danger text-danger"
            )}>
              {apiOnline ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
              {apiOnline === null ? t("dashboard.checking") : apiOnline ? t("dashboard.online") : t("dashboard.offline")}
            </div>

            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              disabled={loading}
              className="mono-caps flex items-center gap-2 border border-rule px-3 py-1.5 text-xs text-ink bg-transparent transition-colors hover:bg-ink hover:text-[color:var(--color-paper)] cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={cn("size-3", loading && "animate-spin")} />
              {t("dashboard.refresh")}
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              {[90, 200, 200].map((h, i) => (
                <div key={i} className="shimmer bg-secondary/35 border border-rule opacity-60" style={{ height: h }} />
              ))}
            </div>
          ) : (
            renderSection()
          )}
        </div>
      </main>
    </div>
  );
}