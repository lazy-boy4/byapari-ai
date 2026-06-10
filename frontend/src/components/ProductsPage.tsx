"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { ProductData } from "@/lib/api";
import { useLang } from "@/lib/language-context";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PIE_COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--green)",
  "var(--amber)",
  "var(--red)",
];

interface CategoryRow {
  name: string;
  revenue: number;
  orders: number;
  profit: number;
  avg_rating: number;
}

interface ProductsPageProps {
  products?: ProductData[];
}

export default function ProductsPage({ products = [] }: ProductsPageProps) {
  const { t } = useLang();
  const safeProducts = products ?? [];
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/analytics/categories`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Categories fetch error:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (!safeProducts.length) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="paper-panel shimmer" style={{ height: 180, opacity: 0.6 }} />
        ))}
      </div>
    );
  }

  const thStyle = {
    textAlign: "left" as const,
    padding: "8px 12px",
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    borderBottom: "1px solid var(--border)",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="paper-panel p-5">
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 4 }}>
            {t("products.top5")}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            {t("products.real_data")}
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={safeProducts} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              tickFormatter={(v) => (v.length > 12 ? v.slice(0, 12) + "…" : v)}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
              }}
              labelStyle={{ color: "var(--text-muted)", fontSize: 12 }}
              formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Revenue"]}
              cursor={{ fill: "var(--accent-soft)" }}
            />
            <Bar dataKey="revenue" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        <div className="paper-panel p-5">
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 16 }}>
            {t("products.detail")}
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[t("products.table_product"), t("products.table_revenue"), t("products.table_units")].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeProducts.map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "var(--text-primary)" }}>
                    {p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
                    ৳{p.revenue.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "var(--text-secondary)" }}>
                    {p.units.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="paper-panel p-5">
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 16 }}>
            {t("products.by_category")}
          </h3>
          {loading ? (
            <div className="paper-panel shimmer" style={{ height: 220, opacity: 0.6 }} />
          ) : categories.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "80px 0" }}>
              {t("products.no_category")}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={3}
                  stroke="var(--bg-card)"
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                  }}
                  formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Revenue"]}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="paper-panel p-5">
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 16 }}>
            {t("products.category_perf")}
        </h3>
        {loading ? (
          <div className="paper-panel shimmer" style={{ height: 200, opacity: 0.6 }} />
        ) : categories.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "60px 0" }}>
            {t("products.upload_for_category")}
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr>
                  {[t("products.cat_category"), t("products.cat_revenue"), t("products.cat_orders"), t("products.cat_profit"), t("products.cat_rating")].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px", fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: PIE_COLORS[i % PIE_COLORS.length],
                          marginRight: 8,
                        }}
                      />
                      {c.name}
                    </td>
                    <td style={{ padding: "12px", fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
                      ৳{c.revenue.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", fontSize: 13, color: "var(--text-secondary)" }}>
                      {c.orders.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                      ৳{c.profit.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", fontSize: 13, color: "var(--amber)" }}>
                      ⭐ {c.avg_rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
