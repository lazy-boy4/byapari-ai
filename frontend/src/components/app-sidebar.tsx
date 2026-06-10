"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  BarChart3,
  LineChart,
  Package,
  Upload,
  Lightbulb,
  Info,
  Settings,
  BookOpen,
  History,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { MonoLabel } from "./mono-label";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

interface AppSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  fileName?: string;
  rowCount?: number;
}

const items = [
  { id: "dashboard", labelKey: "sidebar.overview", icon: LayoutGrid },
  { id: "analytics", labelKey: "sidebar.analytics", icon: BarChart3 },
  { id: "sales", labelKey: "sidebar.sales_trend", icon: LineChart },
  { id: "products", labelKey: "sidebar.products", icon: Package },
  { id: "upload", labelKey: "sidebar.upload_data", icon: Upload },
  { id: "history", labelKey: "sidebar.history", icon: History },
  { id: "insights", labelKey: "sidebar.insights", icon: Lightbulb },
  { id: "about", labelKey: "sidebar.about", icon: Info },
];

export function AppSidebar({ activeSection, onNavigate, fileName, rowCount }: AppSidebarProps) {
  const { t } = useLang();
  const [collapsed, setCollapsed] = useState(false);

  // Start collapsed on small screens; the toggle then controls it on any device.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  const itemClass = (active: boolean) =>
    cn(
      "w-full flex items-center gap-3 py-2 mono-caps border-l-2 text-left transition-colors cursor-pointer",
      collapsed ? "justify-center px-0" : "justify-start px-3",
      active
        ? "border-ink text-ink font-semibold bg-secondary/50"
        : "border-transparent text-muted-foreground hover:text-ink hover:border-ink"
    );

  return (
    // Persistent on every device. The toggle collapses it to a slim icon
    // rail or expands it with labels. The rail is extra-narrow on small
    // screens so it doesn't eat into the content area.
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-rule bg-[color:var(--color-sidebar)] sticky top-[65px] h-[calc(100vh-65px)] transition-[width] duration-200",
        collapsed ? "w-11 sm:w-14" : "w-48 lg:w-60"
      )}
    >
      {/* ── Header / collapse toggle ── */}
      <div
        className={cn(
          "flex items-center gap-2 border-b border-rule py-4",
          collapsed ? "justify-center px-1.5 sm:px-3" : "justify-between px-3"
        )}
      >
        {!collapsed && (
          <div className="min-w-0">
            <MonoLabel className="text-coffee">{t("sidebar.workspace")}</MonoLabel>
            <div className="font-display text-base font-semibold mt-1 truncate" title={fileName || t("sidebar.no_csv")}>
              {fileName || t("sidebar.no_csv")}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
              {rowCount !== undefined ? `${rowCount.toLocaleString()} ${t("sidebar.rows")}` : t("sidebar.rows_30")}
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
          aria-expanded={!collapsed}
          title={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
          className="flex items-center justify-center size-8 shrink-0 border border-rule text-muted-foreground transition-colors hover:bg-ink hover:text-[color:var(--color-paper)] cursor-pointer"
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      </div>

      <nav className={cn("flex-1 py-4 space-y-0.5 overflow-y-auto", collapsed ? "px-1.5 sm:px-2" : "px-2 lg:px-3")}>
        {items.map((i) => {
          const active = activeSection === i.id;
          return (
            <button key={i.id} onClick={() => onNavigate(i.id)} title={t(i.labelKey)} className={itemClass(active)}>
              <i.icon className="size-4 shrink-0" strokeWidth={1.5} />
              {!collapsed && <span className="truncate">{t(i.labelKey)}</span>}
            </button>
          );
        })}
      </nav>

      <div className={cn("border-t border-rule space-y-0.5", collapsed ? "px-1.5 sm:px-2 py-2" : "p-2 lg:p-3")}>
        <button
          onClick={() => onNavigate("settings")}
          title={t("sidebar.settings")}
          className={itemClass(activeSection === "settings")}
        >
          <Settings className="size-4 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>{t("sidebar.settings")}</span>}
        </button>
        <Link
          href="/docs"
          title={t("sidebar.docs")}
          className={cn(
            "w-full flex items-center gap-3 py-2 mono-caps text-muted-foreground hover:text-ink",
            collapsed ? "justify-center px-0" : "justify-start px-3"
          )}
        >
          <BookOpen className="size-4 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>{t("sidebar.docs")}</span>}
        </Link>
      </div>
    </aside>
  );
}
