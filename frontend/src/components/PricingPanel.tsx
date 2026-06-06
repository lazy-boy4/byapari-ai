"use client";

import { useState } from "react";
import { PricingResponse, PricingSuggestion } from "@/lib/api";

interface PricingPanelProps {
  data: PricingResponse | null;
  lang: "bn" | "en";
}

const PRIORITY_CONFIG = {
  high: {
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.3)",
    color: "#f87171",
    label: { bn: "🔴 জরুরি", en: "🔴 High Priority" },
  },
  medium: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.3)",
    color: "#fbbf24",
    label: { bn: "🟡 মাঝারি", en: "🟡 Medium" },
  },
  low: {
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.3)",
    color: "#34d399",
    label: { bn: "🟢 কম", en: "🟢 Low" },
  },
};

const SUGGESTION_CONFIG: Record<string, { icon: string; color: string; label: Record<string, string> }> = {
  reduce_price:  { icon: "📉", color: "#f87171", label: { bn: "দাম কমান",    en: "Reduce Price"    } },
  increase_price:{ icon: "📈", color: "#34d399", label: { bn: "দাম বাড়ান",  en: "Increase Price"  } },
  clearance:     { icon: "🏷️", color: "#fbbf24", label: { bn: "Clearance",   en: "Clearance"       } },
  bundle:        { icon: "📦", color: "#a78bfa", label: { bn: "বান্ডেল",     en: "Bundle"          } },
};

const PAGE_SIZE = 10;

export default function PricingPanel({ data, lang }: PricingPanelProps) {
  const [shown, setShown] = useState(PAGE_SIZE);

  if (!data || !data.suggestions || data.suggestions.length === 0) {
    return (
      <div className="glass-card p-6 text-center" style={{ color: "var(--text-muted)" }}>
        {lang === "bn" ? "প্রাইসিং ডেটা লোড করুন" : "Upload data to see pricing suggestions"}
      </div>
    );
  }

  const { suggestions, summary } = data;
  const visible = suggestions.slice(0, shown);
  const remaining = suggestions.length - shown;

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>
          {lang === "bn" ? "💰 ডাইনামিক প্রাইসিং" : "💰 Dynamic Pricing"}
        </h2>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
          {lang === "bn"
            ? `${summary.total_products}টি পণ্য বিশ্লেষণ · ${summary.total_opportunities}টি অ্যাকশন প্রয়োজন · ${summary.stable_products}টি স্থিতিশীল`
            : `${summary.total_products} products analyzed · ${summary.total_opportunities} need action · ${summary.stable_products} optimally priced`}
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
        {[
          {
            label: lang === "bn" ? "অ্যাকশন প্রয়োজন" : "Need Action",
            value: summary.total_opportunities,
            color: "#529dff",
          },
          {
            label: lang === "bn" ? "ঝুঁকিতে রাজস্ব" : "Revenue at Risk",
            value: summary.revenue_at_risk > 0
              ? `৳${Math.round(summary.revenue_at_risk).toLocaleString()}`
              : lang === "bn" ? "কোনো ঝুঁকি নেই" : "None",
            color: summary.revenue_at_risk > 0 ? "#f87171" : "#34d399",
          },
          {
            label: lang === "bn" ? "সম্ভাব্য উন্নতি" : "Potential Uplift",
            value: summary.potential_uplift > 0
              ? `৳${Math.round(summary.potential_uplift).toLocaleString()}`
              : lang === "bn" ? "মূল্য বৃদ্ধি নেই" : "No increases",
            color: summary.potential_uplift > 0 ? "#34d399" : "var(--text-muted)",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{ padding: "14px 16px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center" }}
          >
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{item.label}</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: item.color }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Suggestion Cards */}
      <div className="space-y-3">
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
          {lang === "bn" ? "🎯 কার্যকরী পরামর্শ" : "🎯 Actionable Suggestions"}
          <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>
            ({lang === "bn" ? `${visible.length}টি দেখানো হচ্ছে` : `showing ${visible.length}`})
          </span>
        </h3>

        {visible.map((s, i) => {
          const pc = PRIORITY_CONFIG[s.priority];
          const sc = SUGGESTION_CONFIG[s.suggestion] ?? { icon: "💡", color: "#529dff", label: { bn: "পরামর্শ", en: "Suggestion" } };
          const changeLabel = s.price_change_percent === 0
            ? lang === "bn" ? "মূল্য অপরিবর্তিত" : "No price change"
            : `${s.price_change_percent > 0 ? "+" : ""}${s.price_change_percent}%`;

          return (
            <div
              key={`${s.product}-${i}`}
              className="fade-up"
              style={{ padding: "18px 20px", borderRadius: 14, background: pc.bg, border: `1px solid ${pc.border}`, animationDelay: `${i * 0.05}s` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${sc.color}15`, border: `1px solid ${sc.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {sc.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.product}
                  </div>
                  <div style={{ fontSize: 11, color: sc.color, fontWeight: 600 }}>
                    {sc.label[lang]} · {changeLabel}
                  </div>
                </div>

                <span style={{ fontSize: 10, padding: "4px 10px", borderRadius: 99, background: pc.bg, border: `1px solid ${pc.border}`, color: pc.color, fontWeight: 700, flexShrink: 0 }}>
                  {pc.label[lang]}
                </span>
              </div>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12, padding: "10px 14px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                {s.display_text}
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, color: "var(--text-muted)" }}>
                <span><strong style={{ color: "var(--text-secondary)" }}>{lang === "bn" ? "মার্জিন" : "Margin"}:</strong> {s.current_metrics.profit_margin}%</span>
                <span><strong style={{ color: "var(--text-secondary)" }}>{lang === "bn" ? "রেটিং" : "Rating"}:</strong> {s.current_metrics.avg_rating}</span>
                <span><strong style={{ color: "var(--text-secondary)" }}>{lang === "bn" ? "রিটার্ন" : "Return"}:</strong> {(s.current_metrics.return_rate * 100).toFixed(1)}%</span>
                <span><strong style={{ color: "var(--text-secondary)" }}>{lang === "bn" ? "বিক্রয়" : "Sales"}:</strong> ৳{Math.round(s.current_metrics.total_sales).toLocaleString()}</span>
                <span><strong style={{ color: "var(--text-secondary)" }}>{lang === "bn" ? "ভেলোসিটি" : "Velocity"}:</strong> ৳{s.current_metrics.velocity}/day</span>
              </div>
            </div>
          );
        })}

        {/* Show more button */}
        {remaining > 0 && (
          <button
            onClick={() => setShown((prev) => prev + PAGE_SIZE)}
            style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {lang === "bn" ? `আরো ${Math.min(remaining, PAGE_SIZE)}টি দেখুন` : `Show ${Math.min(remaining, PAGE_SIZE)} more`}
          </button>
        )}

        {/* Stable products footer */}
        {summary.stable_products > 0 && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>✅</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {lang === "bn"
                ? `${summary.stable_products}টি পণ্যের দাম সঠিক আছে — কোনো পরিবর্তন দরকার নেই`
                : `${summary.stable_products} products are optimally priced — no action needed`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
