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
import { SalesDataPoint } from "@/lib/api";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "10px 14px",
      }}
    >
      <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ color: "#3b82f6", fontWeight: 700, fontFamily: "Syne, sans-serif" }}>
        ৳{Number(payload[0]?.value).toLocaleString()}
      </p>
      {payload[1] && (
        <p style={{ color: "#10b981", fontWeight: 600, fontSize: 13 }}>
          {payload[1].value} orders
        </p>
      )}
    </div>
  );
}

interface SalesTrendPageProps {
  data?: SalesDataPoint[];
}

export default function SalesTrendPage({ data }: SalesTrendPageProps) {
  const safeData = data ?? [];

  const totalRevenue = safeData.reduce((s, d) => s + (d.revenue || 0), 0);
  const totalOrders = safeData.reduce((s, d) => s + (d.orders || 0), 0);
  const bestMonth =
    safeData.length > 0
      ? safeData.reduce((a, b) => (a.revenue > b.revenue ? a : b))
      : null;
  const avgRevenue = safeData.length > 0 ? totalRevenue / safeData.length : 0;

  if (!safeData.length) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl"
            style={{
              height: 220,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        {[
          {
            label: "Total Revenue",
            value: `৳${totalRevenue.toLocaleString()}`,
            color: "#3b82f6",
          },
          {
            label: "Total Orders",
            value: totalOrders.toLocaleString(),
            color: "#6366f1",
          },
          {
            label: "Best Month",
            value: bestMonth?.date || "N/A",
            color: "#10b981",
          },
          {
            label: "Monthly Avg",
            value: `৳${Math.round(avgRevenue).toLocaleString()}`,
            color: "#f59e0b",
          },
        ].map((s) => (
          <div key={s.label} className="glow-card p-4">
            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Area chart — Revenue */}
      <div className="glow-card p-5">
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          Monthly Revenue
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={safeData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revGrad)"
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart — Orders */}
      <div className="glow-card p-5">
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          Monthly Orders
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={safeData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="30%">
            <defs>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
              }}
              labelStyle={{ color: "var(--text-muted)", fontSize: 12 }}
              itemStyle={{ color: "#10b981", fontWeight: 700 }}
            />
            <Bar dataKey="orders" fill="url(#ordGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}