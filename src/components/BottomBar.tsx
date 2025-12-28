"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

type BottomBarProps = {
  active?: "home" | "categories" | "cases";
};

export default function BottomBar({ active = "home" }: BottomBarProps) {
  const { t } = useLanguage();
  const base =
    "w-28 justify-center px-4 py-2 rounded-full text-sm font-medium transition flex items-center";
  const activeCls = "bg-[#002FA7] text-white";
  const idleCls = "bg-white/90 text-gray-700 hover:bg-white";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 rounded-full bg-white/70 p-2 shadow-lg backdrop-blur">
        <Link
          href="/"
          className={`${base} ${active === "home" ? activeCls : idleCls}`}
        >
          {t({ en: "Home", zh: "首页" })}
        </Link>
        <Link
          href="/categories/ai-coding"
          className={`${base} ${active === "categories" ? activeCls : idleCls}`}
        >
          {t({ en: "Categories", zh: "分类" })}
        </Link>
        <Link
          href="/cases"
          className={`${base} ${active === "cases" ? activeCls : idleCls}`}
        >
          {t({ en: "Cases", zh: "案例" })}
        </Link>
      </div>
    </div>
  );
}
