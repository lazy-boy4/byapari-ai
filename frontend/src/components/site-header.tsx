"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";

const nav = [
  { href: "/dashboard", labelKey: "nav.dashboard" },
  { href: "/dashboard?section=pricing", labelKey: "nav.pricing" },
  { href: "/docs", labelKey: "nav.docs" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold tracking-tight">ব্যাপারী</span>
          <span className="mono-caps text-muted-foreground">· B-AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={cn("mono-caps px-3 py-2 transition-colors hover:text-ink", active ? "text-ink" : "text-muted-foreground")}>
                {t(n.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex border border-ink">
            <button
              onClick={() => setLang("en")}
              className={cn(
                "mono-caps px-3 py-2 transition-colors cursor-pointer",
                lang === "en" ? "bg-ink text-[color:var(--color-paper)]" : "bg-transparent text-muted-foreground"
              )}
            >
              {t("header.toggle.en")}
            </button>
            <button
              onClick={() => setLang("bn")}
              className={cn(
                "mono-caps px-3 py-2 transition-colors cursor-pointer",
                lang === "bn" ? "bg-ink text-[color:var(--color-paper)]" : "bg-transparent text-muted-foreground"
              )}
            >
              {t("header.toggle.bn")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
