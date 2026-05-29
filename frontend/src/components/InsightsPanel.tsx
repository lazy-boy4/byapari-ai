"use client";

import { useState } from "react";
import { InsightResponse, AiRecommendation } from "@/lib/api";

interface InsightsPanelProps {
  insights: InsightResponse | null;
  lang: "bn" | "en";
  onLanguageChange?: (lang: "bn" | "en") => void;
  isLoading?: boolean;
}

export default function InsightsPanel({
  insights,
  lang,
  onLanguageChange,
  isLoading,
}: InsightsPanelProps) {
  const handleLangChange = (newLang: "bn" | "en") => {
    onLanguageChange?.(newLang);
  };

  const getHealthColor = (score: number) => {
    if (score >= 70) return "#34d399";
    if (score >= 40) return "#fbbf24";
    return "#f87171";
  };

  const getHealthLabel = (score: number) => {
    if (score >= 70) return lang === "bn" ? "ভালো" : "Good";
    if (score >= 40) return lang === "bn" ? "মোটামুটি" : "Fair";
    return lang === "bn" ? "খারাপ" : "Poor";
  };

  const getSeverityClass = (insightText: string) => {
    if (insightText.includes("⚠️") || insightText.includes("📉") || insightText.includes("🚨")) {
      return "high";
    }
    if (insightText.includes("🚀") || insightText.includes("🏆") || insightText.includes("⭐") || insightText.includes("✅")) {
      return "low";
    }
    return "medium";
  };

  const circumference = 2 * Math.PI * 40;

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="shimmer" style={{ height: 120, marginBottom: 16 }} />
        <div className="space-y-3">
          <div className="shimmer" style={{ height: 60 }} />
          <div className="shimmer" style={{ height: 60 }} />
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="glass-card p-6 text-center" style={{ color: "var(--text-muted)" }}>
        {lang === "bn"
          ? "📊 CSV আপলোড করুন এবং ইনসাইট দেখতে ড্যাশবোর্ডে যান"
          : "📊 Upload a CSV and go to Dashboard to see insights"}
      </div>
    );
  }

  const strokeDashoffset = circumference - (insights.health_score / 100) * circumference;

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header with Language Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-primary)",
          }}>
            {lang === "bn" ? "🧠 এআই বিশ্লেষণ" : "🧠 AI Analysis"}
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            AI-Powered by Byapari Engine v2
          </p>
        </div>

        <div className="flex" style={{
          background: "var(--bg-elevated)",
          borderRadius: 8,
          padding: 3,
          gap: 2,
        }}>
          <button
            onClick={() => handleLangChange("bn")}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: lang === "bn" ? "var(--accent)" : "transparent",
              color: lang === "bn" ? "white" : "var(--text-muted)",
            }}
          >
            বাংলা
          </button>
          <button
            onClick={() => handleLangChange("en")}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: lang === "en" ? "var(--accent)" : "transparent",
              color: lang === "en" ? "white" : "var(--text-muted)",
            }}
          >
            EN
          </button>
        </div>
      </div>

      {/* Health Score Circle */}
      <div className="flex items-center gap-6">
        <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
          <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke={getHealthColor(insights.health_score)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span className="stat-number" style={{
              fontSize: 24,
              fontWeight: 800,
              color: getHealthColor(insights.health_score),
            }}>
              {insights.health_score}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
              {getHealthLabel(insights.health_score)}
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 15,
            color: "var(--text-primary)",
          }}>
            {lang === "bn" ? "ব্যবসা স্বাস্থ্য স্কোর" : "Business Health Score"}
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            {lang === "bn"
              ? `${insights.data_points}টি লেনদেনের উপর ভিত্তি করে`
              : `Based on ${insights.data_points} transactions`}
          </p>
          {insights.top_performer && (
            <p style={{ fontSize: 12, color: "var(--green)", marginTop: 6 }}>
              🏆 {lang === "bn" ? "সেরা: " : "Top: "}
              {insights.top_performer.product} (৳{insights.top_performer.revenue.toLocaleString()})
            </p>
          )}
          {insights.worst_performer && (
            <p style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>
              📉 {lang === "bn" ? "দুর্বল: " : "Weak: "}
              {insights.worst_performer.product}
            </p>
          )}
        </div>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3">
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 14,
          color: "var(--text-primary)",
        }}>
          {lang === "bn" ? "💡 মূল অনুমাননাগুলো" : "💡 Key Insights"}
        </h3>
        {insights.insights.map((insight: AiRecommendation, index: number) => {

          const colorMap: any = {
            growth: "var(--green)",
            warning: "var(--red)",
            risk: "orange",
            inventory: "gold",
            success: "deepskyblue",
          };

          const iconMap: any = {
            growth: "📈",
            warning: "⚠️",
            risk: "🚨",
            inventory: "📦",
            success: "✅",
          };

          return (
            <div
              key={index}
              className="insight-card fade-up"
              style={{
                padding: "16px 18px",
                animationDelay: `${index * 0.05}s`,
                borderLeft: `4px solid ${colorMap[insight.type]}`,
              }}
            >
              <div className="flex items-start gap-3">

                <span
                  style={{
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {iconMap[insight.type]}
                </span>

                <div style={{ flex: 1 }}>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <h4
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {insight.title}
                    </h4>

                    <span
                      style={{
                        fontSize: 10,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: "var(--bg-elevated)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {insight.confidence}%
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {insight.message}
                  </p>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        paddingTop: 16,
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {lang === "bn"
            ? `${insights.data_points}টি লেনদেন বিশ্লেষণ করা হয়েছে • ${new Date(insights.generated_at).toLocaleString("bn-BD")}`
            : `${insights.data_points} transactions analyzed • ${new Date(insights.generated_at).toLocaleString()}`}
        </span>
        <span style={{
          background: "var(--bg-elevated)",
          padding: "3px 10px",
          borderRadius: 99,
          fontSize: 11,
          color: "var(--text-secondary)",
        }}>
          {lang === "bn" ? "নিশ্চয়তা" : "Confidence"}: {insights.confidence}%
        </span>
      </div>
    </div>
  );
}