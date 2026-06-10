"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SalesDataPoint, ProductData } from "@/lib/api";
import { useLang } from "@/lib/language-context";

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="paper-panel" style={{ padding: "10px 14px" }}>
      <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ color: "var(--primary)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
        ৳{Number(payload[0].value).toLocaleString()}
      </p>
      {payload[1] && (
        <p style={{ color: "var(--green)", fontWeight: 600, fontSize: 13 }}>
          {payload[1].value} orders
        </p>
      )}
    </div>
  );
}

function ProductTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="paper-panel" style={{ padding: "10px 14px" }}>
      <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ color: "var(--secondary)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
        ৳{Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
}

interface SalesChartProps {
  data: SalesDataPoint[];
}

export function SalesTrendChart({ data }: SalesChartProps) {
  const { t } = useLang();
  const safeData = data ?? [];

  if (!safeData.length) {
    return (
      <div className="paper-panel p-5 fade-in" style={{ height: 340 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
          {t("analytics.revenue")}
        </h3>
        <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          {t("analytics.empty_revenue")}
        </div>
      </div>
    );
  }

  return (
    <div className="paper-panel p-5 fade-in" style={{ height: 340 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
            {t("analytics.revenue")}
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {t("analytics.revenue_desc")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--primary)", display: "inline-block" }} />
            {t("analytics.revenue_label")}
          </span>
          <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--green)", display: "inline-block" }} />
            {t("analytics.orders_label")}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={safeData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<RevenueTooltip />} />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="oklch(0.205 0.010 280 / 0.08)"
            dot={false}
            activeDot={{ r: 5, fill: "var(--primary)" }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="var(--green)"
            strokeWidth={2}
            fill="oklch(0.627 0.194 142 / 0.08)"
            dot={false}
            activeDot={{ r: 4, fill: "var(--green)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ProductsChartProps {
  data: ProductData[];
}

export function TopProductsChart({ data }: ProductsChartProps) {
  const { t } = useLang();
  const chartData = (data || []).map((p) => ({
    ...p,
    shortName: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name,
  }));

  if (!chartData.length) {
    return (
      <div className="paper-panel p-5 fade-in" style={{ height: 340 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
          {t("analytics.top_products")}
        </h3>
        <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          {t("analytics.empty_products")}
        </div>
      </div>
    );
  }

  return (
    <div className="paper-panel p-5 fade-in" style={{ height: 340 }}>
      <div className="mb-5">
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
          {t("analytics.top_products")}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
          {t("analytics.top_products_desc")}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="shortName"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<ProductTooltip />} cursor={{ fill: "var(--accent-soft)" }} />
          <Bar dataKey="revenue" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
