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
  Info,
  DollarSign,
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
  { icon: <LayoutDashboard size={18} />, label: "Dashboard",   id: "dashboard" },
  { icon: <BarChart3 size={18} />,       label: "Analytics",   id: "analytics" },
  { icon: <TrendingUp size={18} />,      label: "Sales Trend", id: "sales"     },
  { icon: <Package size={18} />,         label: "Products",    id: "products"  },
  { icon: <Upload size={18} />,          label: "Upload Data", id: "upload"    },
  { icon: <Lightbulb size={18} />,       label: "AI Insights", id: "insights", badge: 3 },
  { icon: <Info size={18} />,            label: "About",       id: "about"     },
  { icon: <DollarSign size={18} />,      label: "Pricing",     id: "pricing"   },
];

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="sidebar-panel flex flex-col transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? 68 : 236, minHeight: "100vh", flexShrink: 0 }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: collapsed ? "20px 14px" : "20px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* B-AI Logo mark */}
        <div
          className="logo-mark"
          style={{ width: 38, height: 38, fontSize: 14 }}
        >
          B-AI
        </div>

        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 17,
                color: "var(--text-primary)",
                letterSpacing: "-0.04em",
                lineHeight: 1.15,
                whiteSpace: "nowrap",
              }}
            >
              Byapari AI
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 500,
                marginTop: 1,
              }}
            >
              Intelligence Platform
            </div>
          </div>
        )}
      </div>

      {/* ── Section label ── */}
      {!collapsed && (
        <div style={{ padding: "18px 16px 6px" }}>
          <span className="section-label">Navigation</span>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? "16px 8px" : "8px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${isActive ? "active" : ""}`}
              style={{
                padding: collapsed ? "10px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>
                {item.icon}
              </span>

              {!collapsed && (
                <span style={{ flex: 1, fontSize: 13.5 }}>{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className="badge badge-accent"
                  style={{ fontSize: 10, minWidth: 20, height: 20 }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Team credit (visible when expanded) ── */}
      {!collapsed && (
        <div
          style={{
            margin: "0 10px 12px",
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            background: "rgba(82,157,255,0.04)",
            border: "1px solid rgba(82,157,255,0.10)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 5,
            }}
          >
            Built by
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              color: "var(--text-primary)",
              lineHeight: 1.3,
            }}
          >
            S M Mohaiminul Islam
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--accent)",
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            Team Nexion
          </div>
        </div>
      )}

      {/* ── Bottom controls ── */}
      <div
        style={{
          padding: collapsed ? "8px" : "8px 10px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <button
          onClick={() => onNavigate("settings")}
          className="nav-item"
          style={{
            padding: collapsed ? "10px 0" : "9px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={18} style={{ opacity: 0.6 }} />
          {!collapsed && (
            <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              Settings
            </span>
          )}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="nav-item"
          style={{
            padding: collapsed ? "10px 0" : "9px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          title={collapsed ? "Expand" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={18} style={{ opacity: 0.5 }} />
          ) : (
            <>
              <ChevronLeft size={18} style={{ opacity: 0.5 }} />
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                Collapse
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}