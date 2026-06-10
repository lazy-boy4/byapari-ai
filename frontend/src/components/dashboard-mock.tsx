import { PaperCard } from "./paper-card";
import { MonoLabel } from "./mono-label";
import { HealthGauge } from "./health-gauge";

export function DashboardMock() {
  return (
    <PaperCard className="p-5">
      <div className="flex items-center justify-between border-b border-rule pb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-[color:var(--color-danger)]" />
            <span className="size-2 rounded-full bg-[color:var(--color-warning)]" />
            <span className="size-2 rounded-full bg-[color:var(--color-success)]" />
          </div>
          <MonoLabel className="ml-2">overview.csv · 1,284 rows</MonoLabel>
        </div>
        <MonoLabel className="text-coffee">LIVE</MonoLabel>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { l: "REVENUE", v: "৳ 8.4L", d: "+12%" },
          { l: "PROFIT", v: "৳ 2.1L", d: "+8%" },
          { l: "ORDERS", v: "1,284", d: "+204" },
        ].map((k) => (
          <div key={k.l} className="border border-rule p-3">
            <MonoLabel>{k.l}</MonoLabel>
            <div className="font-display text-xl font-semibold mt-1">{k.v}</div>
            <div className="font-mono text-[10px] text-[color:var(--color-success)] mt-1">{k.d}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-5 gap-4 items-center border-t border-rule pt-4">
        <div className="col-span-2 flex justify-center">
          <HealthGauge score={78} size={150} />
        </div>
        <div className="col-span-3 space-y-2">
          {[
            { l: "Revenue trend", v: 82 },
            { l: "Profit margin", v: 71 },
            { l: "Rating", v: 88 },
            { l: "Returns", v: 64 },
          ].map((b) => (
            <div key={b.l}>
              <div className="flex justify-between mb-1">
                <span className="font-mono text-[10px]">{b.l}</span>
                <span className="font-mono text-[10px] tabular-nums">{b.v}</span>
              </div>
              <div className="h-1 bg-rule">
                <div className="h-full bg-ink" style={{ width: `${b.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PaperCard>
  );
}
