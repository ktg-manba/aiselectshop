"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomBar from "@/components/BottomBar";
import { useLanguage } from "@/components/LanguageProvider";
import { getLogoUrl } from "@/lib/logo";

type ToolItem = {
  id: string;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  pricing: "free" | "paid" | "freemium";
  tags: { en: string; zh: string }[];
  logoUrl?: string;
  url?: string;
};

export default function CaseDetailPage() {
  const { t, lang, toggle } = useLanguage();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const caseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [caseItem, setCaseItem] = useState<any | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">(
    "loading"
  );
  const [toolItems, setToolItems] = useState<ToolItem[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  useEffect(() => {
    async function loadCase() {
      try {
        const res = await fetch(`/api/cases/${caseId}`);
        if (res.status === 404) {
          try {
            const listRes = await fetch("/api/cases");
            if (listRes.ok) {
              const listPayload = await listRes.json();
              const match = Array.isArray(listPayload.data)
                ? listPayload.data.find((item: any) => item.id === caseId)
                : null;
              if (match) {
                setCaseItem(match);
                setStatus("ready");
                return;
              }
            }
          } catch {
            // Ignore fallback errors.
          }
          setStatus("not-found");
          return;
        }
        if (!res.ok) {
          setStatus("error");
          return;
        }
        const payload = await res.json();
        if (!payload.data) {
          setStatus("not-found");
          return;
        }
        setCaseItem(payload.data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
    if (caseId) loadCase();
  }, [caseId]);

  useEffect(() => {
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
          pricing: row.pricing_type || "freemium",
          tags: (row.tags_en || []).map((tag: string, idx: number) => ({
            en: tag,
            zh: (row.tags_zh || [])[idx] || tag,
          })),
          logoUrl: getLogoUrl(row.official_url),
          url: row.official_url || "",
        }));
        setToolItems(mapped);
      } catch {
        // Ignore fetch errors.
      }
    }
    loadTools();
  }, []);

  const tags = useMemo(() => {
    if (!caseItem) return [];
    const en = (caseItem.subtags_en || caseItem.tags_en || []) as string[];
    const zh = (caseItem.subtags_zh || caseItem.tags_zh || []) as string[];
    return en.map((item, idx) => ({
      en: item,
      zh: zh[idx] || item,
    }));
  }, [caseItem]);

  const tools = useMemo(() => {
    if (!caseItem) return [];
    const en = (caseItem.tools_en || []) as string[];
    const zh = (caseItem.tools_zh || []) as string[];
    return en.map((item, idx) => ({
      en: item,
      zh: zh[idx] || item,
    }));
  }, [caseItem]);

  useEffect(() => {
    if (!caseItem) return;
    const titleMatch =
      String(caseItem.title_en || "").toLowerCase().includes("stitch") ||
      String(caseItem.title_zh || "").toLowerCase().includes("stitch");
    const toolMatch = Array.isArray(caseItem.tools_en)
      ? caseItem.tools_en.some((tool: string) => tool.toLowerCase().includes("stitch"))
      : false;
    if (titleMatch || toolMatch) {
      router.replace("/cases/aishop");
    }
  }, [caseItem, router]);

  function openToolModal(tool: { en: string; zh: string }) {
    const match = toolItems.find(
      (item) =>
        item.name.en.toLowerCase() === tool.en.toLowerCase() ||
        item.name.zh === tool.zh
    );
    if (match) {
      setSelectedTool(match);
      return;
    }
    setSelectedTool({
      id: tool.en,
      name: tool,
      description: { en: "", zh: "" },
      pricing: "freemium",
      tags: [],
    });
  }

  const title = caseItem
    ? lang === "EN"
      ? caseItem.title_en
      : caseItem.title_zh
    : status === "not-found"
    ? t({ en: "Case not found", zh: "未找到案例" })
    : status === "error"
    ? t({ en: "Failed to load", zh: "加载失败" })
    : t({ en: "Loading...", zh: "加载中..." });
  const summary = caseItem
    ? lang === "EN"
      ? caseItem.description_en || ""
      : caseItem.description_zh || ""
    : "";
  const content = caseItem
    ? lang === "EN"
      ? caseItem.detailed_content_en || ""
      : caseItem.detailed_content_zh || ""
    : "";
  const categoryLabel = caseItem
    ? lang === "EN"
      ? caseItem.case_type_en || ""
      : caseItem.case_type_zh || ""
    : "";
  const dateLabel = caseItem?.created_at
    ? String(caseItem.created_at).slice(0, 10)
    : "";

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
        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] reveal-item">
          <div className="w-full aspect-video bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC]" />
          {caseItem?.thumbnail_url && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${caseItem.thumbnail_url})` }}
            />
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <Link
              href="/"
              className="bg-white/80 rounded-full p-2 shadow-sm hover:scale-105 transition"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </Link>
            <button className="bg-white/80 rounded-full p-2 shadow-sm hover:scale-105 transition">
              <span className="material-symbols-outlined text-sm">share</span>
            </button>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="font-display text-4xl font-bold">
              {title}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs font-mono">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {categoryLabel || t({ en: "Case", zh: "案例" })}
              </span>
              <span>{dateLabel}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="bg-white/90 rounded-2xl p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] reveal-item">
            <div className="font-display font-bold text-lg mb-3">
              {t({ en: "Case Content", zh: "案例内容" })}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {content || summary}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] reveal-item">
              <div className="font-display font-bold text-lg mb-3">
                {t({ en: "Tags", zh: "标签" })}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {tags.length === 0 && (
                  <span className="text-gray-400">
                    {t({ en: "No tags", zh: "暂无标签" })}
                  </span>
                )}
                {tags.map((tag) => (
                  <span
                    key={tag.en}
                    className="px-3 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]"
                  >
                    {lang === "EN" ? tag.en : tag.zh}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] reveal-item">
              <div className="font-display font-bold text-lg mb-3">
                {t({ en: "Tools Used", zh: "使用工具" })}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                {tools.length === 0 && (
                  <div className="text-gray-400 text-xs">
                    {t({ en: "No tools listed", zh: "暂无工具" })}
                  </div>
                )}
                {tools.map((tool) => (
                  <div key={tool.en} className="flex items-center justify-between">
                    <button
                      onClick={() => openToolModal(tool)}
                      className="text-left hover:text-[#002FA7] transition"
                    >
                      {lang === "EN" ? tool.en : tool.zh}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            onClick={() => setSelectedTool(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close tool detail"
          />
          <div className="relative z-50 w-full max-w-xl bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] border border-white/20 text-black">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {selectedTool.logoUrl ? (
                  <img
                    src={selectedTool.logoUrl}
                    alt={lang === "EN" ? selectedTool.name.en : selectedTool.name.zh}
                    className="w-10 h-10 rounded bg-blue-50 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {selectedTool.name.en.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-display text-xl font-bold">
                    {lang === "EN" ? selectedTool.name.en : selectedTool.name.zh}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedTool.pricing === "free"
                      ? t({ en: "Free", zh: "免费" })
                      : selectedTool.pricing === "paid"
                      ? t({ en: "Paid", zh: "付费" })
                      : t({ en: "Freemium", zh: "部分免费" })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedTool.description.en || selectedTool.description.zh ? (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === "EN"
                    ? selectedTool.description.en
                    : selectedTool.description.zh}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  {t({ en: "No description yet.", zh: "暂无描述。" })}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedTool.tags.map((tag) => (
                  <span
                    key={tag.en}
                    className="px-3 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]"
                  >
                    {lang === "EN" ? tag.en : tag.zh}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                {selectedTool.url ? (
                  <a
                    href={selectedTool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
                  >
                    {t({ en: "Visit Website", zh: "访问官网" })}
                  </a>
                ) : (
                  <button
                    className="bg-gray-200 text-gray-500 rounded-full px-4 py-2 text-sm cursor-not-allowed"
                    disabled
                  >
                    {t({ en: "No website", zh: "暂无官网" })}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomBar active="cases" />
    </div>
  );
}
