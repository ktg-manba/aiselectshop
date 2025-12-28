"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BottomBar from "@/components/BottomBar";
import { useLanguage } from "@/components/LanguageProvider";
import type { Tool } from "@/data/tools";
import { getLogoUrl } from "@/lib/logo";

const sorts = ["popularity", "updated"] as const;

type Sort = (typeof sorts)[number];

export default function CategoryDetailPage() {
  const { lang, t, toggle } = useLanguage();
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categoryGroups, setCategoryGroups] = useState<
    Array<{
      id: string;
      slug?: string | null;
      name: { en: string; zh: string };
      subTags: { id: string; name: { en: string; zh: string } }[];
    }>
  >([]);
  const [toolItems, setToolItems] = useState<Tool[]>([]);
  const [sort, setSort] = useState<Sort>("popularity");
  const [activeSubTagId, setActiveSubTagId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const categorySlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const activeCategory =
    categoryGroups.find((item) => item.slug === categorySlug) ??
    categoryGroups.find((item) => item.id === categorySlug);
  const activeCategoryLabel = activeCategory
    ? lang === "EN"
      ? activeCategory.name.en
      : activeCategory.name.zh
    : categorySlug;
  const subTags = activeCategory?.subTags ?? [];
  const categoryToolCount = toolItems.filter((tool) => {
    if (!activeCategory) return false;
    return (
      tool.categoryId === activeCategory.id ||
      tool.categoryId === activeCategory.slug ||
      tool.categorySlug === activeCategory.slug
    );
  }).length;
  const activeSubTagLabel = activeSubTagId
    ? subTags.find((tag) => tag.name.en === activeSubTagId || tag.name.zh === activeSubTagId)
    : null;

  useEffect(() => {
    setActiveSubTagId(searchParams.get("sub"));
  }, [searchParams, categorySlug]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) return;
        const payload = await res.json();
        if (!Array.isArray(payload.data)) return;
        const mapped = payload.data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          subTags: (row.subTags || []).map((tag: any) => ({
            id: tag.id,
            name: tag.name,
          })),
        }));
        if (mapped.length) setCategoryGroups(mapped);
      } catch {
        // Ignore fetch errors.
      }
    }

    async function loadTools() {
      try {
        const res = await fetch("/api/tools");
        if (!res.ok) return;
        const payload = await res.json();
        if (!Array.isArray(payload.data)) return;
        const mapped = payload.data.map((row: any) => ({
          id: row.id,
          name: { en: row.name_en, zh: row.name_zh },
          description: { en: row.description_en || "", zh: row.description_zh || "" },
          category: { en: row.category_name_en || "", zh: row.category_name_zh || "" },
          categoryId: row.category_id || "",
          categorySlug: row.category_slug || row.category_id || "",
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
        }));
        if (mapped.length) setToolItems(mapped);
      } catch {
        // Ignore fetch errors.
      }
    }

    loadCategories();
    loadTools();
  }, []);

  function updateSubTag(subTagId: string | null) {
    setActiveSubTagId(subTagId);
    if (!activeCategory?.slug) return;
    const query = subTagId ? `?sub=${encodeURIComponent(subTagId)}` : "";
    router.replace(`/categories/${activeCategory.slug}${query}`);
  }

  const visibleTools = useMemo(() => {
    const categoryKey = activeCategory?.id ?? categorySlug;
    const categorySlugKey = activeCategory?.slug ?? categorySlug;
    const filtered = toolItems
      .filter(
        (tool) =>
          tool.categoryId === categoryKey ||
          tool.categoryId === categorySlugKey ||
          tool.categorySlug === categorySlugKey
      )
      .filter((tool) =>
        activeSubTagId
          ? tool.secondaryTags.some(
              (tag) => tag.name.en === activeSubTagId || tag.name.zh === activeSubTagId
            )
          : true
      );
    const sorted = [...filtered];
    if (sort === "updated") {
      return sorted.sort((a, b) => a.name.en.localeCompare(b.name.en));
    }
    return sorted.sort((a, b) => a.name.en.localeCompare(b.name.en));
  }, [
    activeCategory?.id,
    activeCategory?.slug,
    activeSubTagId,
    categorySlug,
    sort,
    toolItems,
  ]);

  if (!activeCategory) {
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
        <div className="max-w-6xl mx-auto pt-12">
          <div className="bg-white/90 rounded-2xl p-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="font-display text-2xl font-bold">
              {t({ en: "Loading...", zh: "加载中..." })}
            </div>
          </div>
        </div>
        <BottomBar active="categories" />
      </div>
    );
  }

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
      <div className="max-w-6xl mx-auto pt-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-4xl font-bold text-white">
              {activeCategoryLabel}
            </div>
            <div className="text-sm text-white/70 mt-2">
              {t({
                en: "Tools that supercharge development workflows.",
                zh: "提升开发效率的工具。",
              })}
            </div>
          </div>
          <div className="text-right text-xs font-mono text-white/60">
            <div>
              {t({
                en: `${categoryToolCount} TOOLS`,
                zh: `${categoryToolCount} 个工具`,
              })}
            </div>
            <div>
              {activeSubTagLabel
                ? lang === "EN"
                  ? `FILTER: ${activeSubTagLabel.name.en}`
                  : `筛选：${activeSubTagLabel.name.zh}`
                : t({ en: "FILTER: ALL", zh: "筛选：全部" })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categoryGroups.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug ?? category.id}`}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory?.id === category.id
                  ? "bg-[#002FA7] text-white"
                  : "bg-white/90 text-gray-700 border border-gray-200"
              }`}
            >
              {lang === "EN" ? category.name.en : category.name.zh}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {sorts.map((item) => (
              <button
                key={item}
                onClick={() => setSort(item)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  sort === item
                    ? "bg-[#002FA7] text-white"
                    : "bg-white/90 text-gray-700 border border-gray-200"
                }`}
              >
                {t({
                  en: `Sort: ${item}`,
                  zh: `排序：${item === "updated" ? "更新时间" : "热度"}`,
                })}
              </button>
            ))}
          </div>
        </div>

        {subTags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => updateSubTag(null)}
              className={`rounded-full px-2 py-1 text-xs transition ${
                activeSubTagId
                  ? "bg-white/90 text-gray-700 border border-gray-200"
                  : "bg-[#002FA7] text-white"
              }`}
            >
              {t({ en: "All", zh: "全部" })}
            </button>
            {subTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => updateSubTag(tag.name.en)}
                className={`rounded-full px-2 py-1 text-xs transition ${
                  activeSubTagId === tag.name.en
                    ? "bg-[#002FA7] text-white"
                    : "bg-white/90 text-gray-700 border border-gray-200"
                }`}
              >
                {lang === "EN" ? tag.name.en : tag.name.zh}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              className="bg-white/90 rounded-2xl p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover-card text-left reveal-item"
            >
              <div className="flex items-center gap-3 mb-3">
                {tool.logoUrl ? (
                  <img
                    src={tool.logoUrl}
                    alt={lang === "EN" ? tool.name.en : tool.name.zh}
                    className="w-10 h-10 rounded bg-blue-50 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {tool.initials}
                  </div>
                )}
                <div>
                  <div className="font-bold">
                    {lang === "EN" ? tool.name.en : tool.name.zh}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lang === "EN" ? tool.description.en : tool.description.zh}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="px-2 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]">
                  {tool.pricing === "free"
                    ? t({ en: "Free", zh: "免费" })
                    : tool.pricing === "paid"
                    ? t({ en: "Paid", zh: "付费" })
                    : t({ en: "Freemium", zh: "部分免费" })}
                </span>
                <span className="text-gray-400">
                  {tool.secondaryTags[0]
                    ? lang === "EN"
                      ? tool.secondaryTags[0].name.en
                      : tool.secondaryTags[0].name.zh
                    : activeCategoryLabel}
                </span>
              </div>
            </button>
          ))}
        </div>

        {visibleTools.length === 0 && (
          <div className="mt-10 bg-white/90 rounded-2xl p-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="font-display text-2xl font-bold">
              {t({ en: "No tools found", zh: "没有找到工具" })}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {t({
                en: "Reset filters or submit a new tool for review.",
                zh: "重置筛选，或提交新工具。",
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => updateSubTag(null)}
                className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
              >
                {t({ en: "Reset Filters", zh: "重置筛选" })}
              </button>
              <Link
                href="/admin/login"
                className="border border-gray-200 rounded-full px-4 py-2 text-sm"
              >
                {t({ en: "Submit a Tool", zh: "提交工具" })}
              </Link>
            </div>
          </div>
        )}
      </div>

      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            onClick={() => setSelectedTool(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close tool detail"
          />
          <div className="relative z-50 w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] border border-white/20 text-black">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <div className="font-display text-2xl font-bold">
                  {lang === "EN" ? selectedTool.name.en : selectedTool.name.zh}
                </div>
                <div className="text-sm text-gray-500">{activeCategoryLabel}</div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {lang === "EN" ? selectedTool.description.en : selectedTool.description.zh}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]">
                  {selectedTool.pricing === "free"
                    ? t({ en: "Free", zh: "免费" })
                    : selectedTool.pricing === "paid"
                    ? t({ en: "Paid", zh: "付费" })
                    : t({ en: "Freemium", zh: "部分免费" })}
                </span>
                {selectedTool.secondaryTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => updateSubTag(tag.name.en)}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:text-[#002FA7] transition"
                  >
                    {lang === "EN" ? tag.name.en : tag.name.zh}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm">
                  {t({ en: "Visit Website", zh: "访问官网" })}
                </button>
                <button className="border border-gray-200 rounded-full px-4 py-2 text-sm">
                  {t({ en: "Save", zh: "收藏" })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomBar active="categories" />
    </div>
  );
}
