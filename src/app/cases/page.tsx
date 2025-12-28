"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BottomBar from "@/components/BottomBar";
import { useLanguage } from "@/components/LanguageProvider";

export const dynamic = "force-dynamic";

type LocalizedText = {
  en: string;
  zh: string;
};

type CategoryGroup = {
  id: string;
  name: LocalizedText;
  subTags: { id: string; name: LocalizedText }[];
};

type CaseListItem = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  category: LocalizedText;
  tags: LocalizedText[];
  tools: LocalizedText[];
  thumbnail: string;
  date: string;
  popularity: number;
};

const sorts = ["popularity", "date"] as const;
type Sort = (typeof sorts)[number];

export default function CasesPage() {
  const { lang, t, toggle } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("popularity");
  const [caseItems, setCaseItems] = useState<CaseListItem[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);

  function toTagId(tag: string) {
    return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  useEffect(() => {
    setActiveTagId(searchParams.get("tag"));
  }, [searchParams, activeCategory]);

  useEffect(() => {
    async function loadCases() {
      try {
        const res = await fetch("/api/cases");
        if (!res.ok) return;
        const payload = await res.json();
        if (!Array.isArray(payload.data)) return;
        const mapped = payload.data.map((row: any) => ({
          id: row.id,
          title: { en: row.title_en, zh: row.title_zh },
          summary: { en: row.description_en || "", zh: row.description_zh || "" },
          category: { en: row.case_type_en || "", zh: row.case_type_zh || "" },
          tags:
            (row.subtags_en || []).length > 0
              ? (row.subtags_en || []).map((tag: string, idx: number) => ({
                  en: tag,
                  zh: (row.subtags_zh || [])[idx] || tag,
                }))
              : (row.tags_en || []).map((tag: string, idx: number) => ({
                  en: tag,
                  zh: (row.tags_zh || [])[idx] || tag,
                })),
          tools: (row.tools_en || []).map((tool: string, idx: number) => ({
            en: tool,
            zh: (row.tools_zh || [])[idx] || tool,
          })),
          thumbnail: row.thumbnail_url || "",
          date: row.created_at ? String(row.created_at).slice(0, 10) : "",
          popularity: Number(row.view_count) || 0,
        }));
        setCaseItems(mapped);
      } catch {
        // Ignore fetch errors.
      }
    }

    loadCases();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) return;
        const payload = await res.json();
        if (!Array.isArray(payload.data)) return;
        const mapped = payload.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          subTags: (row.subTags || []).map((tag: any) => ({
            id: tag.id,
            name: tag.name,
          })),
        }));
        setCategoryGroups(mapped);
      } catch {
        // Ignore fetch errors.
      }
    }
    loadCategories();
  }, []);

  const categories = useMemo(() => {
    return [{ en: "All", zh: "全部" }, ...categoryGroups.map((item) => item.name)];
  }, [categoryGroups]);

  const categoryCases = useMemo(() => {
    if (activeCategory === "All") return caseItems;
    return caseItems.filter((item) => item.category.en === activeCategory);
  }, [activeCategory, caseItems]);

  const subTags = useMemo(() => {
    const active = categoryGroups.find((item) => item.name.en === activeCategory);
    if (!active) return [];
    return active.subTags.map((tag) => ({ id: toTagId(tag.name.en), tag: tag.name }));
  }, [activeCategory, categoryGroups]);

  const filteredCases = useMemo(() => {
    const filtered = activeTagId
      ? categoryCases.filter((item) =>
          item.tags.some((tag) => toTagId(tag.en) === activeTagId)
        )
      : categoryCases;
    const sorted = [...filtered];
    if (sort === "date") {
      return sorted.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }
    return sorted.sort((a, b) => b.popularity - a.popularity);
  }, [activeTagId, categoryCases, sort]);
  const activeTagLabel = activeTagId
    ? subTags.find((item) => item.id === activeTagId)?.tag ?? null
    : null;

  function updateTag(tagId: string | null) {
    setActiveTagId(tagId);
    const query = tagId ? `?tag=${tagId}` : "";
    router.replace(`/cases${query}`);
  }

  function isStitchCase(item: CaseListItem) {
    const titleMatch =
      item.title.en.toLowerCase().includes("stitch") ||
      item.title.zh.toLowerCase().includes("stitch");
    const toolMatch = item.tools.some(
      (tool) =>
        tool.en.toLowerCase().includes("stitch") ||
        tool.zh.toLowerCase().includes("stitch")
    );
    return titleMatch || toolMatch;
  }

  function getCaseLink(item: CaseListItem) {
    return isStitchCase(item) ? "/cases/aishop" : `/cases/${item.id}`;
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
              {t({ en: "Cases", zh: "案例" })}
            </div>
            <div className="text-sm text-white/70 mt-2">
              {t({
                en: "Explore boutique AI case studies and workflows.",
                zh: "探索精选 AI 案例与工作流。",
              })}
            </div>
          </div>
          <div className="text-right text-xs font-mono text-white/60">
            <div>
              {t({
                en: `${filteredCases.length} CASES`,
                zh: `${filteredCases.length} 个案例`,
              })}
            </div>
            <div>
              {activeTagLabel
                ? lang === "EN"
                  ? `FILTER: ${activeTagLabel.en}`
                  : `筛选：${activeTagLabel.zh}`
                : t({ en: "FILTER: ALL", zh: "筛选：全部" })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <button
              key={category.en}
              onClick={() => {
                setActiveCategory(category.en);
                updateTag(null);
              }}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory === category.en
                  ? "bg-[#002FA7] text-white"
                  : "bg-white/90 text-gray-700 border border-gray-200"
              }`}
            >
              {lang === "EN" ? category.en : category.zh}
            </button>
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
                  en: `Sort: ${item === "date" ? "date" : "popularity"}`,
                  zh: `排序：${item === "date" ? "时间" : "热度"}`,
                })}
              </button>
            ))}
          </div>
        </div>

        {subTags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => updateTag(null)}
              className={`rounded-full px-2 py-1 text-xs transition ${
                activeTagId
                  ? "bg-white/90 text-gray-700 border border-gray-200"
                  : "bg-[#002FA7] text-white"
              }`}
            >
              {t({ en: "All", zh: "全部" })}
            </button>
            {subTags.map(({ id, tag }) => (
              <button
                key={id}
                onClick={() => updateTag(id)}
                className={`rounded-full px-2 py-1 text-xs transition ${
                  activeTagId === id
                    ? "bg-[#002FA7] text-white"
                    : "bg-white/90 text-gray-700 border border-gray-200"
                }`}
              >
                {lang === "EN" ? tag.en : tag.zh}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((item) => (
            <Link
              key={item.id}
              href={getCaseLink(item)}
              className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover-card reveal-item"
            >
              <div className="rounded-xl overflow-hidden mb-4">
                <div
                  className="w-full aspect-video bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC]"
                  style={
                    item.thumbnail
                      ? {
                          backgroundImage: `url(${item.thumbnail})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
              </div>
              <div className="text-xs font-mono text-gray-400">
                {lang === "EN" ? item.category.en : item.category.zh}
              </div>
              <div className="font-display text-lg font-bold mt-2">
                {lang === "EN" ? item.title.en : item.title.zh}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {lang === "EN" ? item.summary.en : item.summary.zh}
              </p>
              <div className="text-xs text-gray-400 mt-4">{item.date}</div>
            </Link>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="mt-10 bg-white/90 rounded-2xl p-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="font-display text-2xl font-bold">
              {t({ en: "No cases found", zh: "没有找到案例" })}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {t({
                en: "Try a different category to explore more stories.",
                zh: "尝试切换分类查看更多案例。",
              })}
            </div>
          </div>
        )}
      </div>

      <BottomBar active="cases" />
    </div>
  );
}
