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
  accentColor = "#529dff",
  delay = 1,
  trend,
  trendValue,
}: KpiCardProps) {
  const trendColor =
    trend === "up"
      ? "#34d399"
      : trend === "down"
      ? "#f87171"
      : "var(--text-muted)";

  return (
    <div
      className={`glass-card kpi-card fade-up delay-${delay}`}
      style={{ padding: "20px 22px" }}
    >
      {/* Top row: icon + trend */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        {/* Icon bubble */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${accentColor}16`,
            border: `1px solid ${accentColor}28`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {/* Trend badge */}
        {trend && trendValue && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: trendColor,
              background: `${trendColor}14`,
              border: `1px solid ${trendColor}28`,
              borderRadius: 99,
              padding: "3px 8px",
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        )}
      </div>

      {/* Value */}
      <div
        className="stat-number"
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 1,
          marginBottom: 6,
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 12.5,
          color: "var(--text-secondary)",
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </div>

      {/* Optional subtext */}
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

      {/* Accent line at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "15%",
          right: "15%",
          height: 2,
          borderRadius: "2px 2px 0 0",
          background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
        }}
      />
    </div>
  );
}