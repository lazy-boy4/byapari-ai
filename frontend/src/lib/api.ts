const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  metric?: string;
  action?: string;
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
  breakdown: {
    rating: HealthScoreBreakdown;
    returns: HealthScoreBreakdown;
    stock: HealthScoreBreakdown;
    profit: HealthScoreBreakdown;
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
  error?: string;
  data_quality?: {           // ← ADD THIS
    rows_uploaded: number;
    rows_analyzed: number;
    rows_dropped: number;
    fixes_applied: string[];
    warnings: string[];
  };
}

// ─────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────

export async function fetchAnalytics(): Promise<AnalyzeResponse> {
  const res = await fetch(`${BASE_URL}/analyze`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
}

export async function uploadCsv(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(error.detail || `Upload failed: ${res.status}`);
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

