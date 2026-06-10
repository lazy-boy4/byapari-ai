"use client";

import Link from "next/link";
import { MonoLabel } from "./mono-label";
import { useLang } from "@/lib/language-context";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="mt-32 border-t border-rule">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold">{t("logo.title")}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <MonoLabel>{t("footer.built_by")}</MonoLabel>
            <span className="text-rule">·</span>
            <MonoLabel>{t("footer.cloudcamp")}</MonoLabel>
          </div>
        </div>
        <div>
          <MonoLabel>{t("footer.product")}</MonoLabel>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-coffee">{t("nav.dashboard")}</Link></li>
            <li><Link href="/docs" className="hover:text-coffee">{t("nav.docs")}</Link></li>
          </ul>
        </div>
        <div>
          <MonoLabel>{t("footer.contact")}</MonoLabel>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="text-muted-foreground">blueberry.poison.1309<br />@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-between gap-3">
          <MonoLabel>{t("footer.copyright")}</MonoLabel>
          <MonoLabel>{t("footer.buildfest")}</MonoLabel>
        </div>
      </div>
    </footer>
  );
}
