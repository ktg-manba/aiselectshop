"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import BottomBar from "@/components/BottomBar";
import { useLanguage } from "@/components/LanguageProvider";
import { categoryGroups } from "@/data/categories";
import { tools as fallbackTools } from "@/data/tools";
import { getLogoUrl } from "@/lib/logo";

function toCategorySlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export default function ToolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { lang, t, toggle } = useLanguage();
  const { id } = use(params);
  const [tool, setTool] = useState(
    fallbackTools.find((item) => item.id === id) ?? null
  );
  const [relatedTools, setRelatedTools] = useState<typeof fallbackTools>([]);
  const [activeSubTagId, setActiveSubTagId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function mapToolRow(row: any) {
    return {
      id: row.id,
      name: { en: row.name_en, zh: row.name_zh },
      description: { en: row.description_en || "", zh: row.description_zh || "" },
      category: { en: row.category_name_en || "", zh: row.category_name_zh || "" },
      categoryId: row.category_id || "",
      pricing: row.pricing_type || "freemium",
      tags: (row.tags_en || []).map((tag: string, idx: number) => ({
        en: tag,
        zh: (row.tags_zh || [])[idx] || tag,
      })),
      logoUrl: getLogoUrl(row.official_url),
      secondaryTags:
        (row.subtags_en || []).length > 0
          ? (row.subtags_en || []).map((tag: string, idx: number) => ({
              id: tag,
              name: { en: tag, zh: (row.subtags_zh || [])[idx] || tag },
            }))
          : (row.tags_en || []).map((tag: string, idx: number) => ({
              id: tag,
              name: { en: tag, zh: (row.tags_zh || [])[idx] || tag },
            })),
      url: row.official_url || "",
      initials: row.name_en?.slice(0, 2)?.toUpperCase() || "AI",
    };
  }

  useEffect(() => {
    async function loadTool() {
      try {
        const res = await fetch(`/api/tools/${id}`);
        if (!res.ok) return;
        const payload = await res.json();
        if (!payload.data) return;
        setTool(mapToolRow(payload.data));
      } catch {
        // Ignore fetch errors and keep fallback.
      } finally {
        setIsLoading(false);
      }
    }

    loadTool();
  }, [id]);

  useEffect(() => {
    async function loadRelated() {
      if (!tool?.categoryId) return;
      try {
        const res = await fetch(`/api/tools?category_id=${tool.categoryId}`);
        if (!res.ok) return;
        const payload = await res.json();
        if (!Array.isArray(payload.data)) return;
        const mapped = payload.data.map(mapToolRow).filter((item: any) => item.id !== tool.id);
        const filtered = activeSubTagId
          ? mapped.filter((item: any) =>
              item.secondaryTags.some(
                (tag: any) =>
                  tag.name.en === activeSubTagId || tag.name.zh === activeSubTagId
              )
            )
          : mapped;
        setRelatedTools(filtered.slice(0, 4));
      } catch {
        // Ignore fetch errors.
      }
    }

    loadRelated();
  }, [tool?.categoryId, tool?.id, activeSubTagId]);

  if (!tool && isLoading) {
    return (
      <div className="min-h-screen px-6 pb-16 page-reveal">
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={toggle}
            className="h-10 w-10 bg-white/90 text-gray-700 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition flex items-center justify-center"
          >
            {lang === "中文" ? "中" : "EN"}
          </button>
        </div>
        <div className="max-w-3xl mx-auto pt-12">
          <div className="bg-white/95 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] text-black">
            <div className="font-display text-2xl font-bold">
              {t({ en: "Loading...", zh: "加载中..." })}
            </div>
          </div>
        </div>
        <BottomBar active="home" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen px-6 pb-16 page-reveal">
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={toggle}
            className="h-10 w-10 bg-white/90 text-gray-700 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition flex items-center justify-center"
          >
            {lang === "中文" ? "中" : "EN"}
          </button>
        </div>
        <div className="max-w-3xl mx-auto pt-12">
          <div className="bg-white/95 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] text-black">
            <div className="font-display text-3xl font-bold">
              {t({ en: "Tool not found", zh: "未找到该工具" })}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {t({
                en: "Try returning to the homepage to browse the curated list.",
                zh: "请返回首页浏览精选工具列表。",
              })}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
              >
                {t({ en: "Back to Home", zh: "返回首页" })}
              </Link>
              <Link
                href="/categories/ai-coding"
                className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700"
              >
                {t({ en: "Browse Categories", zh: "浏览分类" })}
              </Link>
            </div>
          </div>
        </div>
        <BottomBar active="home" />
      </div>
    );
  }

  const pricingLabel =
    tool.pricing === "free"
      ? t({ en: "Free", zh: "免费" })
      : tool.pricing === "paid"
      ? t({ en: "Paid", zh: "付费" })
      : t({ en: "Freemium", zh: "部分免费" });
  const categoryLabel = lang === "EN" ? tool.category.en : tool.category.zh;
  const categorySlug = toCategorySlug(tool.category.en);
  const categoryMeta = categoryGroups.find((item) => item.id === tool.categoryId);
  const subTags = categoryMeta?.subTags ?? tool.secondaryTags;
  const subTagQuery = activeSubTagId ? `?sub=${encodeURIComponent(activeSubTagId)}` : "";

  return (
    <div className="min-h-screen px-6 pb-16 page-reveal">
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={toggle}
          className="h-10 w-10 bg-white/90 text-gray-700 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition flex items-center justify-center"
        >
          {lang === "中文" ? "中" : "EN"}
        </button>
      </div>
      <div className="max-w-5xl mx-auto pt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-4xl font-bold text-white">
              {lang === "EN" ? tool.name.en : tool.name.zh}
            </div>
            <div className="text-sm text-white/70 mt-2">{categoryLabel}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="bg-white/90 rounded-full px-4 py-2 text-sm text-gray-700"
            >
              {t({ en: "Back to Home", zh: "返回首页" })}
            </Link>
            <Link
              href={`/categories/${categorySlug}${subTagQuery}`}
              className="bg-white/90 rounded-full px-4 py-2 text-sm text-gray-700"
            >
              {t({ en: "Category", zh: "返回分类" })}
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white/95 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] text-black">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {tool.logoUrl ? (
                  <img
                    src={tool.logoUrl}
                    alt={lang === "EN" ? tool.name.en : tool.name.zh}
                    className="w-14 h-14 rounded-full bg-[#002FA7]/10 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#002FA7]/10 text-[#002FA7] flex items-center justify-center text-lg font-bold">
                    {tool.initials}
                  </div>
                )}
                <div>
                  <div className="font-display text-2xl font-bold">
                    {lang === "EN" ? tool.name.en : tool.name.zh}
                  </div>
                  <div className="text-xs font-mono text-gray-400">tool_detail.page</div>
                </div>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                {lang === "EN" ? tool.description.en : tool.description.zh}
              </p>
              {tool.secondaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tool.secondaryTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setActiveSubTagId(tag.id)}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-[#002FA7] hover:bg-[#002FA7]/10 transition"
                    >
                      {lang === "EN" ? tag.name.en : tag.name.zh}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag.en}
                    className="text-xs px-3 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]"
                  >
                    {lang === "EN" ? tag.en : tag.zh}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="text-xs font-mono text-gray-400">
                {t({ en: "OVERVIEW", zh: "概览" })}
              </div>
              <div className="text-sm text-gray-600">
                {t({ en: "Pricing", zh: "价格" })}: {pricingLabel}
              </div>
              <div className="text-sm text-gray-600 break-all">
                {t({ en: "Website", zh: "官网" })}: {tool.url}
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  {t({ en: "Visit Website", zh: "访问官网" })}
                </a>
                <Link
                  href={`/categories/${categorySlug}${subTagQuery}`}
                  className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700"
                >
                  {t({ en: "More in Category", zh: "查看更多同类工具" })}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/95 rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] text-black">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-display text-lg font-bold">
              {t({ en: "Related Tools", zh: "相关工具" })}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSubTagId(null)}
                className={`text-xs px-3 py-1 rounded-full border transition ${
                  activeSubTagId
                    ? "border-gray-200 text-gray-500 hover:text-[#002FA7]"
                    : "border-[#002FA7] text-[#002FA7] bg-[#002FA7]/10"
                }`}
              >
                {t({ en: "All", zh: "全部" })}
              </button>
              {subTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setActiveSubTagId(tag.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition ${
                    activeSubTagId === tag.id
                      ? "border-[#002FA7] text-[#002FA7] bg-[#002FA7]/10"
                      : "border-gray-200 text-gray-500 hover:text-[#002FA7]"
                  }`}
                >
                  {lang === "EN" ? tag.name.en : tag.name.zh}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedTools.length === 0 ? (
              <div className="text-sm text-gray-500">
                {t({ en: "No tools found", zh: "暂无相关工具" })}
              </div>
            ) : (
              relatedTools.map((item) => (
                <Link
                  key={item.id}
                  href={`/tools/${item.id}`}
                  className="rounded-2xl border border-gray-100 p-4 hover:border-[#002FA7] transition"
                >
                  <div className="flex items-center gap-3">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={lang === "EN" ? item.name.en : item.name.zh}
                        className="w-10 h-10 rounded-full bg-[#002FA7]/10 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#002FA7]/10 text-[#002FA7] flex items-center justify-center text-xs font-bold">
                        {item.initials}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold">
                        {lang === "EN" ? item.name.en : item.name.zh}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lang === "EN" ? item.description.en : item.description.zh}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <BottomBar active="home" />
    </div>
  );
}
