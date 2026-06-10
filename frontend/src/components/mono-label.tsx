import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("mono-caps text-muted-foreground", className)}>{children}</span>;
}
