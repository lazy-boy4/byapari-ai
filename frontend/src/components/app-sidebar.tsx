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
  BookOpen
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
  { id: "insights", labelKey: "sidebar.insights", icon: Lightbulb },
  { id: "about", labelKey: "sidebar.about", icon: Info },
];

export function AppSidebar({ activeSection, onNavigate, fileName, rowCount }: AppSidebarProps) {
  const { t } = useLang();
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-rule bg-[color:var(--color-sidebar)] sticky top-[65px] h-[calc(100vh-65px)]">
      <div className="px-5 py-5 border-b border-rule">
        <MonoLabel className="text-coffee">{t("sidebar.workspace")}</MonoLabel>
        <div className="font-display text-lg font-semibold mt-1 truncate" title={fileName || t("sidebar.no_csv")}>
          {fileName || t("sidebar.no_csv")}
        </div>
        <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
          {rowCount !== undefined ? `${rowCount.toLocaleString()} ${t("sidebar.rows")}` : t("sidebar.rows_30")}
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map((i) => {
          const active = activeSection === i.id;
          return (
            <button
              key={i.id}
              onClick={() => onNavigate(i.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 mono-caps border-l-2 text-left transition-colors cursor-pointer",
                active
                  ? "border-ink text-ink font-semibold bg-secondary/50"
                  : "border-transparent text-muted-foreground hover:text-ink hover:border-ink"
              )}
            >
              <i.icon className="size-4 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{t(i.labelKey)}</span>
            </button>
          );
        })}
      </nav>
      <div className="border-t border-rule p-3 space-y-0.5">
        <button
          onClick={() => onNavigate("settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 mono-caps border-l-2 text-left transition-colors cursor-pointer",
            activeSection === "settings"
              ? "border-ink text-ink font-semibold bg-secondary/50"
              : "border-transparent text-muted-foreground hover:text-ink hover:border-ink"
          )}
        >
          <Settings className="size-4 shrink-0" strokeWidth={1.5} />
          {t("sidebar.settings")}
        </button>
        <Link
          href="/docs"
          className="flex items-center gap-3 px-3 py-2 mono-caps text-muted-foreground hover:text-ink"
        >
          <BookOpen className="size-4 shrink-0" strokeWidth={1.5} />
          {t("sidebar.docs")}
        </Link>
      </div>
    </aside>
  );
}
