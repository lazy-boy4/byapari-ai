"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { ProductData } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PIE_COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ef4444"];

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
  const safeProducts = products ?? [];
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch category data from backend ──
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
          <div
            key={i}
            className="rounded-xl"
            style={{
              height: 180,
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
      {/* Top Products Bar Chart */}
      <div className="glow-card p-5">
        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text-primary)",
            marginBottom: 4,
          }}
        >
          Top 5 Products by Revenue
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Real data from your uploaded CSV
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={safeProducts}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            barCategoryGap="30%"
          >
            <defs>
              <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
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
                borderRadius: 10,
              }}
              labelStyle={{ color: "var(--text-muted)", fontSize: 12 }}
              formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Revenue"]}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="revenue" fill="url(#prodGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Products table + Pie chart */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {/* Products table */}
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
            Top Products Detail
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Product", "Revenue", "Units"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "6px 8px",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeProducts.map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td
                    style={{
                      padding: "10px 8px",
                      fontSize: 13,
                      color: "var(--text-primary)",
                    }}
                  >
                    {p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      fontSize: 13,
                      color: "#3b82f6",
                      fontWeight: 600,
                    }}
                  >
                    ৳{p.revenue.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {p.units.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Category pie chart */}
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
            Revenue by Category
          </h3>
          {loading ? (
            <div
              className="rounded-xl"
              style={{
                height: 220,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                opacity: 0.5,
              }}
            />
          ) : categories.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "80px 0" }}>
              No category data available
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
                >
                  {categories.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
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

      {/* Category details table */}
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
          Category Performance
        </h3>
        {loading ? (
          <div
            className="rounded-xl"
            style={{
              height: 200,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              opacity: 0.5,
            }}
          />
        ) : categories.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "60px 0" }}>
            Upload data to see category performance
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 500,
              }}
            >
              <thead>
                <tr>
                  {["Category", "Revenue", "Orders", "Profit", "Avg Rating"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        fontSize: 11,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: 14,
                        color: "var(--text-primary)",
                        fontWeight: 600,
                      }}
                    >
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
                    <td
                      style={{
                        padding: "12px",
                        fontSize: 13,
                        color: "#3b82f6",
                        fontWeight: 600,
                      }}
                    >
                      ৳{c.revenue.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {c.orders.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontSize: 13,
                        color: "#10b981",
                        fontWeight: 600,
                      }}
                    >
                      ৳{c.profit.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", fontSize: 13, color: "#f59e0b" }}>
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