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

// ── Custom Tooltip for Revenue Chart ──────────────────────────
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ color: "#3b82f6", fontWeight: 700, fontFamily: "Syne, sans-serif" }}>
        ৳{Number(payload[0].value).toLocaleString()}
      </p>
      {payload[1] && (
        <p style={{ color: "#10b981", fontWeight: 600, fontSize: 13 }}>
          {payload[1].value} orders
        </p>
      )}
    </div>
  );
}

// ── Custom Tooltip for Products Bar Chart ─────────────────────
function ProductTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ color: "#6366f1", fontWeight: 700, fontFamily: "Syne, sans-serif" }}>
        ৳{Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
}

// ── Sales Trend Chart (Area) ──────────────────────────────────
interface SalesChartProps {
  data: SalesDataPoint[];
}

export function SalesTrendChart({ data }: SalesChartProps) {
  const safeData = data ?? [];
  
  if (!safeData.length) {
    return (
      <div className="glow-card p-5 fade-in fade-in-delay-2" style={{ height: 340 }}>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
          Revenue Trend
        </h3>
        <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          Upload data to see revenue trends
        </div>
      </div>
    );
  }

  return (
    <div className="glow-card p-5 fade-in fade-in-delay-2" style={{ height: 340 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text-primary)",
            }}
          >
            Revenue Trend
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Monthly revenue over time
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#3b82f6", display: "inline-block" }} />
            Revenue
          </span>
          <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#10b981", display: "inline-block" }} />
            Orders
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={safeData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
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
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#3b82f6" }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#ordersGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#10b981" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Top Products Chart (Bar) ──────────────────────────────────
interface ProductsChartProps {
  data: ProductData[];
}

export function TopProductsChart({ data }: ProductsChartProps) {
  const chartData = (data || []).map((p) => ({
    ...p,
    shortName: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name,
  }));

  if (!chartData.length) {
    return (
      <div className="glow-card p-5 fade-in fade-in-delay-3" style={{ height: 340 }}>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
          Top Products
        </h3>
        <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          Upload data to see top products
        </div>
      </div>
    );
  }

  return (
    <div className="glow-card p-5 fade-in fade-in-delay-3" style={{ height: 340 }}>
      <div className="mb-5">
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-primary)",
          }}
        >
          Top Products
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
          Revenue by product
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          barCategoryGap="30%"
        >
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
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
          <Tooltip content={<ProductTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}