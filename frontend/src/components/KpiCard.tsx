"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;        // e.g. 12.4 means +12.4%
  changeLabel?: string;   // e.g. "vs last month"
  icon: React.ReactNode;
  accentColor?: string;   // CSS color value
  delay?: number;         // animation delay (1-4)
}

export default function KpiCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon,
  accentColor = "var(--accent)",
  delay = 1,
}: KpiCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={`glow-card p-5 fade-in fade-in-delay-${delay}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Background glow blob */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.08,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Top row: title + icon */}
      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            fontWeight: 500,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>

        {/* Icon circle */}
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 36,
            height: 36,
            background: accentColor,
            opacity: 0.9,
            color: "white",
          }}
        >
          {icon}
        </div>
      </div>

      {/* Main value */}
      <div
        className="stat-number"
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{
              background: isPositive
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(239, 68, 68, 0.12)",
              color: isPositive ? "var(--accent-green)" : "var(--accent-red)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isPositive ? "+" : ""}{change}%
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
}