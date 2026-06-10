import { MonoLabel } from "@/components/mono-label";
import type { ReactNode } from "react";

export function SectionHeading({ index, eyebrow, title, lead }: { index: string; eyebrow: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <div className="mb-12 max-w-3xl">
      <div className="flex items-baseline gap-3 mb-4">
        <MonoLabel className="text-coffee">{index}</MonoLabel>
        <div className="h-px flex-1 bg-rule" />
        <MonoLabel>{eyebrow}</MonoLabel>
      </div>
      <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight">{title}</h2>
      {lead ? <p className="mt-4 text-base text-muted-foreground max-w-2xl">{lead}</p> : null}
    </div>
  );
}
