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
import { useLang } from "@/lib/language-context";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="paper-panel" style={{ padding: "10px 14px" }}>
      <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ color: "var(--primary)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
        ৳{Number(payload[0]?.value).toLocaleString()}
      </p>
      {payload[1] && (
        <p style={{ color: "var(--green)", fontWeight: 600, fontSize: 13 }}>
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
  const { t } = useLang();
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
            className="paper-panel shimmer"
            style={{ height: 220, opacity: 0.6 }}
          />
        ))}
      </div>
    );
  }

  const stats = [
    { label: t("sales.total_revenue"), value: `৳${totalRevenue.toLocaleString()}`, color: "var(--primary)" },
    { label: t("sales.total_orders"), value: totalOrders.toLocaleString(), color: "var(--secondary)" },
    { label: t("sales.best_month"), value: bestMonth?.date || "N/A", color: "var(--green)" },
    { label: t("sales.monthly_avg"), value: `৳${Math.round(avgRevenue).toLocaleString()}`, color: "var(--amber)" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        {stats.map((s) => (
          <div key={s.label} className="paper-panel p-4">
            <p className="section-label" style={{ marginBottom: 6 }}>
              {s.label}
            </p>
            <p
              className="stat-number"
              style={{ fontWeight: 700, fontSize: 22, color: s.color }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="paper-panel p-5">
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 16 }}>
            {t("sales.monthly_revenue")}
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={safeData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
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
              stroke="var(--primary)"
              strokeWidth={2}
              fill="oklch(0.205 0.010 280 / 0.08)"
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="paper-panel p-5">
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 16 }}>
            {t("sales.monthly_orders")}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={safeData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
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
              cursor={{ fill: "var(--accent-soft)" }}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
              labelStyle={{ color: "var(--text-muted)", fontSize: 12 }}
              itemStyle={{ color: "var(--green)", fontWeight: 700 }}
            />
            <Bar dataKey="orders" fill="var(--green)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
