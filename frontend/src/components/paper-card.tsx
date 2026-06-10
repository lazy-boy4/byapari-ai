import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function PaperCard({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "paper-grain border border-rule bg-card text-card-foreground",
        "shadow-[0_1px_0_0_var(--color-rule),0_18px_30px_-24px_oklch(0_0_0/0.25)]",
        "relative",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
