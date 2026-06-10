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
      
       {/* AI Summary from Gemini */}
        {insights.ai_summary && (
          <div style={{
            padding: "16px 20px",
            borderRadius: 12,
            background: "rgba(232,184,75,0.06)",
            border: "1px solid rgba(232,184,75,0.15)",
            marginTop: 8,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 16 }}>✨</span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                color: "var(--gold)",
              }}>
                {lang === "bn" ? "Byapari এআই বিশ্লেষণ" : "Byapari AI Analysis"}
              </span>
            </div>
            <p style={{
              fontSize: 13.5,
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
            }}>
              {insights.ai_summary}
            </p>
          </div>
        )}

      {/* RAG Knowledge Base Recommendations */}
        {insights.rag_recommendations && insights.rag_recommendations.length > 0 && (
          <div style={{
            padding: "16px 20px",
            borderRadius: 12,
            background: "rgba(82,157,255,0.06)",
            border: "1px solid rgba(82,157,255,0.15)",
            marginTop: 16,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 16 }}>📚</span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                color: "var(--accent)",
              }}>
                {lang === "bn" ? "ব্যবসায়িক জ্ঞানভাণ্ডার থেকে" : "From Knowledge Base"}
              </span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {insights.rag_recommendations.map((tip, i) => (
                <div key={tip.id} style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: "var(--accent-dim)",
                      color: "var(--accent)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}>
                      {tip.category}
                    </span>
                    {tip.relevance !== null && tip.relevance !== undefined && (
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                        {lang === "bn" ? "প্রাসঙ্গিকতা" : "Relevance"}: {(1 - tip.relevance).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Merchant Personalization Profile */}
      {insights.merchant_profile && (
        <div style={{
          padding: "16px 20px",
          borderRadius: 12,
          background: "rgba(52,211,153,0.06)",
          border: "1px solid rgba(52,211,153,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 14,
              color: "var(--green)",
            }}>
              {lang === "bn" ? "আপনার ব্যবসার প্রোফাইল" : "Your Merchant Profile"}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              `${lang === "bn" ? "ধরন" : "Type"}: ${insights.merchant_profile.business_type}`,
              `${lang === "bn" ? "স্কেল" : "Scale"}: ${insights.merchant_profile.scale_tier}`,
              `${lang === "bn" ? "ডিজিটাল পেমেন্ট" : "Digital payments"}: ${insights.merchant_profile.digital_payment_pct}%`,
              ...(insights.merchant_profile.top_city
                ? [`${lang === "bn" ? "প্রধান শহর" : "Top city"}: ${insights.merchant_profile.top_city} (${insights.merchant_profile.city_concentration_pct}%)`]
                : []),
            ].map((chip, i) => (
              <span key={i} style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 99,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Knowledge Graph Intelligence */}
      {insights.graph_insights && insights.graph_insights.graph_stats.nodes > 0 && (
        <div style={{
          padding: "16px 20px",
          borderRadius: 12,
          background: "rgba(168,85,247,0.06)",
          border: "1px solid rgba(168,85,247,0.18)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🕸️</span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                color: "#c084fc",
              }}>
                {lang === "bn" ? "নলেজ গ্রাফ ইন্টেলিজেন্স" : "Knowledge Graph Intelligence"}
              </span>
            </div>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
              {insights.graph_insights.graph_stats.nodes} {lang === "bn" ? "নোড" : "nodes"} · {insights.graph_insights.graph_stats.edges} {lang === "bn" ? "সম্পর্ক" : "relationships"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {insights.graph_insights.cross_sell.slice(0, 2).map((pair, i) => (
              <div key={`cs-${i}`} style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}>
                🔗 <strong>{pair.product_a}</strong> + <strong>{pair.product_b}</strong>
                {lang === "bn"
                  ? " — প্রায়ই একসাথে কেনা হয়; বান্ডেল অফার করুন"
                  : " — frequently bought together; offer as a bundle"}
              </div>
            ))}
            {insights.graph_insights.city_opportunities.slice(0, 2).map((opp, i) => (
              <div key={`co-${i}`} style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}>
                🗺️ <strong>{opp.category}</strong>
                {lang === "bn"
                  ? ` — ${opp.city}-তে কম বিক্রি হচ্ছে (${opp.local_share_pct}% বনাম সামগ্রিক ${opp.global_share_pct}%)`
                  : ` is under-selling in ${opp.city} (${opp.local_share_pct}% vs ${opp.global_share_pct}% overall)`}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Market Signals */}
      {insights.market_signals && (insights.market_signals.exchange_rate.available || insights.market_signals.news.available) && (
        <div style={{
          padding: "16px 20px",
          borderRadius: 12,
          background: "rgba(251,191,36,0.05)",
          border: "1px solid rgba(251,191,36,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>📡</span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 14,
              color: "var(--gold, #fbbf24)",
            }}>
              {lang === "bn" ? "লাইভ মার্কেট সিগন্যাল" : "Live Market Signals"}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
              {lang === "bn" ? "বাস্তব-সময়ের বাহ্যিক ডেটা" : "real-time external data"}
            </span>
          </div>

          {insights.market_signals.exchange_rate.available && (
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
              💱 USD/BDT: <strong>৳{insights.market_signals.exchange_rate.usd_bdt}</strong>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {" "}({insights.market_signals.exchange_rate.source}, {insights.market_signals.exchange_rate.fetched_at})
              </span>
            </p>
          )}

          {insights.market_signals.news.available && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {insights.market_signals.news.headlines.slice(0, 3).map((h, i) => (
                <a
                  key={i}
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    textDecoration: "none",
                  }}
                >
                  📰 {h.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

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