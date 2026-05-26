"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Upload,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  badge?: number;
}

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", id: "dashboard" },
  { icon: <BarChart3 size={20} />, label: "Analytics", id: "analytics" },
  { icon: <TrendingUp size={20} />, label: "Sales Trend", id: "sales" },
  { icon: <Package size={20} />, label: "Products", id: "products" },
  { icon: <Upload size={20} />, label: "Upload Data", id: "upload" },
  { icon: <Lightbulb size={20} />, label: "AI Insights", id: "insights", badge: 3 },
];

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="sidebar-bg flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? "72px" : "240px", minHeight: "100vh" }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Logo mark */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl font-bold text-sm"
          style={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white",
            fontFamily: "Syne, sans-serif",
          }}
        >
          ব
        </div>
        {/* Logo text — hidden when collapsed */}
        {!collapsed && (
          <div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              Byapari AI
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
              Business Intelligence
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation Items ── */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-3 rounded-xl transition-all duration-200 w-full text-left"
              style={{
                padding: collapsed ? "10px 12px" : "10px 14px",
                background: isActive ? "var(--accent-glow)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                border: isActive
                  ? "1px solid rgba(59, 130, 246, 0.25)"
                  : "1px solid transparent",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                position: "relative",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              {/* Icon */}
              <span className="flex-shrink-0">{item.icon}</span>

              {/* Label */}
              {!collapsed && <span className="flex-1">{item.label}</span>}

              {/* Badge */}
              {!collapsed && item.badge && (
                <span
                  className="rounded-full text-xs font-bold flex items-center justify-center"
                  style={{
                    background: "var(--accent)",
                    color: "white",
                    width: 20,
                    height: 20,
                    fontFamily: "Syne, sans-serif",
                    fontSize: 10,
                  }}
                >
                  {item.badge}
                </span>
              )}

              {/* Active left border indicator */}
              {isActive && (
                <span
                  className="absolute left-0 rounded-full"
                  style={{
                    width: 3,
                    height: "60%",
                    background: "var(--accent)",
                    borderRadius: "0 3px 3px 0",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom: Settings + Collapse ── */}
      <div
        className="p-2 flex flex-col gap-1"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {/* Settings button */}
        <button
          onClick={() => onNavigate("settings")}
          className="flex items-center gap-3 rounded-xl transition-all duration-200 w-full"
          style={{
            padding: collapsed ? "10px 12px" : "10px 14px",
            color: "var(--text-muted)",
            background: "transparent",
            border: "1px solid transparent",
            fontSize: 14,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 rounded-xl transition-all duration-200 w-full"
          style={{
            padding: collapsed ? "10px 12px" : "10px 14px",
            color: "var(--text-muted)",
            background: "transparent",
            border: "1px solid transparent",
            fontSize: 14,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span style={{ fontSize: 13 }}>Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  );
}