"use client";

import { useLang } from "@/lib/language-context";
import type { ReactNode } from "react";

export function LangBody({ children, className }: { children: ReactNode; className?: string }) {
  const { lang } = useLang();
  return (
    <body lang={lang} className={className}>
      {children}
    </body>
  );
}
