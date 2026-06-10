"use client";

import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: ReactNode;
  accentColor?: string;
  delay?: number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export default function KpiCard({
  title,
  value,
  subtext,
  icon,
  accentColor = "var(--primary)",
  delay = 1,
  trend,
  trendValue,
}: KpiCardProps) {
  const trendColor =
    trend === "up"
      ? "var(--green)"
      : trend === "down"
      ? "var(--red)"
      : "var(--text-muted)";

  return (
    <div
      className={`paper-panel kpi-card fade-up delay-${delay}`}
      style={{ padding: "20px 22px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-sm)",
            background: "var(--accent-dim)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {trend && trendValue && (
          <span
            className="chip"
            style={{
              color: trendColor,
              background: trend === "up" ? "var(--green-dim)" : trend === "down" ? "var(--red-dim)" : "var(--bg-elevated)",
              border: `1px solid var(--border)`,
            }}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        )}
      </div>

      <div
        className="stat-number"
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          fontWeight: 500,
        }}
      >
        {title}
      </div>

      {subtext && (
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 4,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}
