"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";

// The dashboard is an app-like, full-height workspace — the marketing
// footer doesn't belong there, so hide it on /dashboard (and any nested
// dashboard route).
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/dashboard" || pathname?.startsWith("/dashboard/")) return null;
  return <SiteFooter />;
}
