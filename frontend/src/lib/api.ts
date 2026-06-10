const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://byapari-ai-production.up.railway.app";
// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface KpiData {
  total_orders: number;
  total_sales: number;
  total_profit: number;
  average_rating: number;
  returned_orders: number;
  top_category: string;
  most_used_payment_method: string;
  low_stock_products: number;
}

export interface AiRecommendation {
  type:
    | "growth"
    | "warning"
    | "risk"
    | "inventory"
    | "success";

  title: string;

  message: string;

  priority:
    | "low"
    | "medium"
    | "high";

  confidence: number;
}

export interface HealthScoreBreakdown {
  score: number;
  max: number;
  value: string | number;
  label: string;
}

export interface HealthScore {
  score: number;
  label: string;
  color: string;
  breakdown?: {
    rating?: HealthScoreBreakdown;
    returns?: HealthScoreBreakdown;
    stock?: HealthScoreBreakdown;
    profit?: HealthScoreBreakdown;
  };
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductData {
  name: string;
  revenue: number;
  units: number;
}

export interface AnalyzeResponse {
  kpis: KpiData;
  insights: AiRecommendation[];
  health_score: HealthScore;
  sales_trend: SalesDataPoint[];
  top_products: ProductData[];

    forecast: {
    date: string;
    predicted_sales: number;
  }[];
}

export interface UploadResponse {
  message?: string;
  rows: number;
  columns: string[];

  kpis: KpiData;
  insights: AiRecommendation[];
  health_score: HealthScore;
  sales_trend: SalesDataPoint[];
  top_products: ProductData[];

  raw_data?: Record<string, string | number>[];

  error?: string;

  data_quality?: {
    rows_uploaded: number;
    rows_analyzed: number;
    rows_dropped: number;
    fixes_applied: string[];
    warnings: string[];
  };
}

export interface RagTip {
  id: string;
  text: string;
  category: string;
  relevance: number | null;
}

// Knowledge-graph reasoning results (GraphRAG layer)
export interface GraphInsights {
  graph_stats: {
    nodes: number;
    edges: number;
    node_types: Record<string, number>;
  };
  cross_sell: { product_a: string; product_b: string; strength: number }[];
  city_opportunities: {
    city: string;
    category: string;
    global_share_pct: number;
    local_share_pct: number;
    gap_pct: number;
  }[];
  payment_preferences: {
    category: string;
    top_payment_method: string;
    share_pct: number;
  }[];
  recommendations: AiRecommendation[];
  facts: string[];
}

// Live external market signals (scraped/parsed real-world data)
export interface MarketSignals {
  exchange_rate: {
    available: boolean;
    usd_bdt?: number;
    source?: string;
    fetched_at?: string;
  };
  news: {
    available: boolean;
    headlines: { title: string; link: string; published: string }[];
    source?: string;
  };
}

// Merchant personalization profile
export interface MerchantProfile {
  business_type: string;
  scale_tier: string;
  category_mix: { category: string; share_pct: number }[];
  digital_payment_pct: number;
  top_city: string | null;
  city_concentration_pct: number;
  risk_flags: string[];
  strengths: string[];
  summary: string;
}

// NEW: InsightResponse for the /api/ai-insights endpoint
export interface InsightResponse {
  insights: AiRecommendation[];
  rag_recommendations?: RagTip[];

  health_score: number;

  top_performer: {
    product: string;
    revenue: number;
  } | null;

  worst_performer: {
    product: string;
    revenue: number;
  } | null;

  period_analyzed: string;

  confidence: number;

  generated_at: string;

  data_points: number;

  forecast?: ForecastItem[];

  ai_summary?: string;

  graph_insights?: GraphInsights;

  merchant_profile?: MerchantProfile;

  market_signals?: MarketSignals;
}
export interface ForecastItem {
  date: string;
  predicted_sales: number;
  product?: string;
  lower_bound?: number;
  upper_bound?: number;

}

export interface PricingSuggestion {
  product: string;
  current_metrics: {
    total_sales: number;
    profit_margin: number;
    avg_rating: number;
    return_rate: number;
    stock_days_remaining: number;
    velocity: number;
  };
  suggestion: string;
  reason: string;
  price_change_percent: number;
  priority: "high" | "medium" | "low";
  expected_impact: string;
  display_text: string;
}

export interface PricingSummary {
  total_opportunities: number;
  revenue_at_risk: number;
  potential_uplift: number;
  top_priority: string | null;
  stable_products: number;
  total_products: number;
}

export interface PricingResponse {
  suggestions: PricingSuggestion[];
  summary: PricingSummary;
  generated_at: string;
}


// ─────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────

export async function fetchAnalytics(): Promise<AnalyzeResponse> {
  const res = await fetch(`${BASE_URL}/analyze`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
}

export async function uploadCsv(file: File, lang: string = "en"): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("lang", lang);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  console.log("UPLOAD STATUS:", res.status);

  const text = await res.text();

  console.log("RAW RESPONSE:", text);

  return JSON.parse(text);
}

// NEW: Analyze CSV via /api/ai-insights endpoint
export async function analyzeCSV(
  data: Record<string, string | number>[],
  lang: "bn" | "en" = "bn"
): Promise<InsightResponse> {
  const res = await fetch(`${BASE_URL}/api/ai-insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ csv_data: data, lang }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(error.detail || `Analysis failed: ${res.status}`);
  }
  return res.json();
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getPricingSuggestions(
  data: Record<string, string | number>[],
  lang: "bn" | "en" = "bn"
): Promise<PricingResponse> {
  const res = await fetch(`${BASE_URL}/api/pricing-suggestions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ csv_data: data, lang }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Pricing analysis failed" }));
    throw new Error(error.detail || `Pricing failed: ${res.status}`);
  }
  return res.json();
}