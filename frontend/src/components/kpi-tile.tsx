import { PaperCard } from "@/components/paper-card";
import { MonoLabel } from "@/components/mono-label";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

const toneMap = {
  success: "text-[color:var(--color-success)]",
  warning: "text-[color:var(--color-warning)]",
  danger: "text-[color:var(--color-danger)]",
} as const;

export function KpiTile({ label, value, delta, tone = "success", index }: { label: string; value: string; delta?: string; tone?: keyof typeof toneMap; index: string }) {
  const { t } = useLang();
  return (
    <PaperCard className="p-5">
      <div className="flex items-center justify-between">
        <MonoLabel>{label}</MonoLabel>
        <MonoLabel className="text-coffee">{index}</MonoLabel>
      </div>
      <div className="mt-6 font-display text-3xl font-semibold tabular-nums">{value}</div>
      {delta && (
        <div className="mt-2 flex items-center gap-2">
          <span className={cn("font-mono text-xs", toneMap[tone])}>{delta}</span>
          <span className="mono-caps text-muted-foreground">{t("kpi.vs_prev")}</span>
        </div>
      )}
    </PaperCard>
  );
}
