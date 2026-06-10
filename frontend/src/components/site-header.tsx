"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { UserMenu } from "./user-menu";

const nav = [
  { href: "/dashboard", labelKey: "nav.dashboard" },
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/docs", labelKey: "nav.docs" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLang();
  const { user, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);

  // Exact route match (plus nested paths) — avoids "/dashboard" matching
  // every route and lets each tab highlight only on its own page.
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleMobileSignOut = async () => {
    setOpen(false);
    await signOutUser();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold tracking-tight">ব্যাপারী</span>
          <span className="mono-caps text-muted-foreground">· B-AI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => {
            const active = isActive(n.href);
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

          {/* Account (desktop) */}
          <div className="hidden md:block">
            <UserMenu />
          </div>

          {/* Mobile nav toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="md:hidden flex items-center justify-center size-9 border border-ink text-ink transition-colors hover:bg-ink hover:text-[color:var(--color-paper)] cursor-pointer"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {open && (
        <nav className="md:hidden border-t border-rule bg-background/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 flex flex-col">
            {nav.map((n) => {
              const active = isActive(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "mono-caps px-2 py-3 border-b border-rule/60 transition-colors hover:text-ink",
                    active ? "text-ink font-semibold" : "text-muted-foreground"
                  )}
                >
                  {t(n.labelKey)}
                </Link>
              );
            })}

            {/* Account actions (mobile) */}
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "mono-caps flex items-center gap-2 px-2 py-3 border-b border-rule/60 transition-colors hover:text-ink",
                    isActive("/profile") ? "text-ink font-semibold" : "text-muted-foreground"
                  )}
                >
                  <UserIcon className="size-4" /> {t("nav.profile")}
                </Link>
                <button
                  onClick={handleMobileSignOut}
                  className="mono-caps flex items-center gap-2 px-2 py-3 text-left text-danger transition-colors cursor-pointer"
                >
                  <LogOut className="size-4" /> {t("auth.signout")}
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="mono-caps flex items-center gap-2 px-2 py-3 text-coffee font-semibold"
              >
                <UserIcon className="size-4" /> {t("auth.signin")}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
