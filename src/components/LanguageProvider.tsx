"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Language = "EN" | "中文";

type LocalizedText = {
  en: string;
  zh: string;
};

type LanguageContextValue = {
  lang: Language;
  toggle: () => void;
  t: (text: LocalizedText) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "中文" ? "EN" : "中文"));
  }, []);

  const t = useCallback(
    (text: LocalizedText) => (lang === "EN" ? text.en : text.zh),
    [lang]
  );

  const value = useMemo(
    () => ({ lang, toggle, t }),
    [lang, t, toggle]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
