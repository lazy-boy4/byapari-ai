"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations } from "./translations";

export type Lang = "en" | "bn";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const t = useCallback(
    (key: string): string => {
      const value = translations[lang][key as keyof typeof translations.en];
      if (value === undefined) {
        const fallback = translations.en[key as keyof typeof translations.en];
        return fallback !== undefined ? String(fallback) : key;
      }
      if (Array.isArray(value)) return key;
      return String(value);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return ctx;
}
