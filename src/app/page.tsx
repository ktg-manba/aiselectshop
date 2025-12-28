"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { CategoryGroup } from "@/data/categories";
import type { Tool } from "@/data/tools";
import { getLogoUrl } from "@/lib/logo";

type LocalizedText = {
  en: string;
  zh: string;
};

type CaseItem = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  thumbnail: string;
  tags: LocalizedText[];
  metrics: { label: string; value: string }[];
  tools: LocalizedText[];
};

type AssistantMatch = {
  id: string;
  name_en: string;
  name_zh: string;
  internal_url: string;
  official_url?: string | null;
};

type AssistantMessage = {
  role: "assistant" | "user";
  content: string;
  matches?: AssistantMatch[];
};

function isStitchCase(item: CaseItem | null) {
  if (!item) return false;
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

function getCaseLink(item: CaseItem | null) {
  if (!item) return "/cases";
  return isStitchCase(item) ? "/cases/aishop" : `/cases/${item.id}`;
}

export default function Home() {
  const { lang, toggle, t } = useLanguage();
  const [toolItems, setToolItems] = useState<Tool[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [toolModal, setToolModal] = useState<Tool | null>(null);
  const [categoryModal, setCategoryModal] = useState<string | null>(null);
  const [subTagModal, setSubTagModal] = useState<string | null>(null);
  const [caseModal, setCaseModal] = useState<CaseItem | null>(null);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [typedMessages, setTypedMessages] = useState<Record<number, string>>({});
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const typedMessagesRef = useRef<Record<number, string>>({});
  const assistantScrollRef = useRef<HTMLDivElement | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [layout, setLayout] = useState<Record<string, LayoutItem>>({});
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [dragEnabled, setDragEnabled] = useState(true);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layoutRef = useRef<Record<string, LayoutItem>>({});
  const suppressClickRef = useRef(false);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    moved: boolean;
    pendingLayout?: Record<string, LayoutItem>;
    pendingHeight?: number;
  } | null>(null);
  const expectedIds = useMemo(
    () => [
      "brand",
      "hero",
      "directions",
      "new-arrival",
      "latest-case",
      "social",
      "assistant",
      "submit",
      "explore-categories",
      "explore-case",
      "tagline",
    ],
    []
  );

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setToolModal(null);
        setCategoryModal(null);
        setSubTagModal(null);
        setCaseModal(null);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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
          category: { en: row.category_name_en || "", zh: row.category_name_zh || "" },
          categoryId: row.category_id || "",
          categorySlug: row.category_slug || row.category_id || "",
          logoUrl: getLogoUrl(row.official_url),
          pricing: row.pricing_type || "freemium",
          tags: (row.tags_en || []).map((tag: string, idx: number) => ({
            en: tag,
            zh: (row.tags_zh || [])[idx] || tag,
          })),
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
        if (mapped.length) {
          setToolItems(mapped);
        }
      } catch {
        // Ignore fetch errors and keep fallback data.
      }
    }

    async function loadCases() {
      try {
        const res = await fetch("/api/cases?featured=1", { cache: "no-store" });
        if (!res.ok) return;
        const payload = await res.json();
        if (!Array.isArray(payload.data)) return;
        const mapped = payload.data.map((row: any) => ({
          id: row.id,
          title: { en: row.title_en, zh: row.title_zh },
          summary: { en: row.description_en || "", zh: row.description_zh || "" },
          thumbnail: row.thumbnail_url || "",
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
          metrics: [],
          tools: (row.tools_en || []).map((tool: string, idx: number) => ({
            en: tool,
            zh: (row.tools_zh || [])[idx] || tool,
          })),
        }));
        setCaseItems(mapped);
      } catch {
        // Ignore fetch errors and keep fallback data.
      }
    }

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
        if (mapped.length) {
          setCategoryGroups(mapped);
        }
      } catch {
        // Ignore fetch errors and keep fallback data.
      }
    }

    loadTools();
    loadCategories();
    loadCases();
  }, []);

  useEffect(() => {
    const greeting = t({
      en: "Hi! I'm the AI Select Shop assistant. How can I help?",
      zh: "你好！我是 AI 买手店助手，有什么可以帮忙的吗？",
    });
    if (assistantMessages.length === 0) {
      setAssistantMessages([{ role: "assistant", content: greeting }]);
      return;
    }
    setAssistantMessages((prev) => {
      if (prev.length === 0) return prev;
      const first = prev[0];
      if (first.role !== "assistant") return prev;
      if (first.content === greeting) return prev;
      return [{ ...first, content: greeting }, ...prev.slice(1)];
    });
  }, [assistantMessages.length, t]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setDragEnabled(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    if (dragEnabled) return;
    dragRef.current = null;
    setDraggingId(null);
    document.body.style.userSelect = "";
  }, [dragEnabled]);

  useEffect(() => {
    typedMessagesRef.current = typedMessages;
    if (assistantScrollRef.current) {
      assistantScrollRef.current.scrollTop = assistantScrollRef.current.scrollHeight;
    }
  }, [typedMessages]);

  useEffect(() => {
    if (assistantScrollRef.current) {
      assistantScrollRef.current.scrollTop = assistantScrollRef.current.scrollHeight;
    }
  }, [assistantMessages, assistantLoading]);

  useEffect(() => {
    const lastAssistantIndex = [...assistantMessages]
      .map((message, index) => ({ message, index }))
      .reverse()
      .find((item) => item.message.role === "assistant")?.index;
    if (lastAssistantIndex === undefined) return;
    const message = assistantMessages[lastAssistantIndex];
    if (!message || message.role !== "assistant") return;
    const current = typedMessagesRef.current[lastAssistantIndex];
    if (current === message.content) return;
    setTypingIndex(lastAssistantIndex);
    setTypedMessages((prev) => ({ ...prev, [lastAssistantIndex]: "" }));
    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setTypedMessages((prev) => {
        const next = {
          ...prev,
          [lastAssistantIndex]: message.content.slice(0, i),
        };
        typedMessagesRef.current = next;
        return next;
      });
      if (i >= message.content.length) {
        window.clearInterval(interval);
        setTypingIndex(null);
      }
    }, 20);
    return () => window.clearInterval(interval);
  }, [assistantMessages]);

  function openMatchedTool(match: AssistantMatch) {
    const tool =
      toolItems.find((item) => item.id === match.id) ||
      toolItems.find(
        (item) =>
          item.name.en.toLowerCase() === match.name_en.toLowerCase() ||
          item.name.zh === match.name_zh
      );
    if (tool) {
      setToolModal(tool);
      return;
    }
    const fallback = {
      id: match.id,
      name: { en: match.name_en, zh: match.name_zh },
      description: { en: "", zh: "" },
      category: { en: "AI Tool", zh: "AI 工具" },
      categoryId: "ai-tool",
      pricing: "freemium" as const,
      tags: [],
      secondaryTags: [],
      url: match.official_url || "",
      logoUrl: match.official_url ? getLogoUrl(match.official_url) : undefined,
      initials: match.name_en.slice(0, 2).toUpperCase() || "AI",
    };
    setToolModal(fallback);
  }

  async function handleAssistantSend() {
    const message = assistantInput.trim();
    if (!message || assistantLoading) return;
    setAssistantLoading(true);
    setAssistantInput("");
    setAssistantMessages((prev) => [...prev, { role: "user", content: message }]);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setAssistantMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: t({
              en: "Sorry, something went wrong. Please try again.",
              zh: "抱歉，出错了，请稍后再试。",
            }),
          },
        ]);
        return;
      }
      const reply =
        String(payload.reply || "").trim() ||
        t({
          en: "I didn't get a response. Please try again.",
          zh: "我没有拿到回复，请再试一次。",
        });
      setAssistantMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          matches: Array.isArray(payload.matches) ? payload.matches : undefined,
        },
      ]);
    } catch {
      setAssistantMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t({
            en: "Network error, please try again.",
            zh: "网络错误，请稍后再试。",
          }),
        },
      ]);
    } finally {
      setAssistantLoading(false);
    }
  }

  const freeLayout = Object.keys(layout).length > 0;


  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (!dragRef.current || !containerRef.current) return;
      const { id, offsetX, offsetY, startX, startY, moved } = dragRef.current;
      const distance = Math.hypot(event.clientX - startX, event.clientY - startY);
      if (!moved && distance < 12) return;
      if (!dragRef.current.moved) {
        dragRef.current.moved = true;
        setDraggingId(id);
        document.body.style.userSelect = "none";
        suppressClickRef.current = true;
      }
      if (!freeLayout && dragRef.current.pendingLayout) {
        const nextLayout = dragRef.current.pendingLayout;
        layoutRef.current = nextLayout;
        setLayout(nextLayout);
        setContainerHeight(
          dragRef.current.pendingHeight ?? getLayoutHeight(nextLayout)
        );
      }
      const containerRect = containerRef.current.getBoundingClientRect();
      setLayout(() => {
        const base = layoutRef.current;
        const current = base[id];
        if (!current) return base;
        const next = {
          ...base,
          [id]: {
            ...current,
            x: event.clientX - containerRect.left - offsetX,
            y: event.clientY - containerRect.top - offsetY,
          },
        };
        layoutRef.current = next;
        setContainerHeight(getLayoutHeight(next));
        return next;
      });
    }

    function handlePointerUp() {
      if (!dragRef.current) return;
      if (!dragRef.current.moved) {
        dragRef.current = null;
        return;
      }
      dragRef.current = null;
      setDraggingId(null);
      document.body.style.userSelect = "";
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 50);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [layout]);

  function getStyle(id: string) {
    if (!freeLayout || !layout[id]) return {};
    const item = layout[id];
    return {
      position: "absolute" as const,
      left: item.x,
      top: item.y,
      width: item.width,
      height: item.height,
    };
  }

  function handlePointerDown(id: string) {
    return (event: React.PointerEvent<HTMLElement>) => {
      if (!dragEnabled) return;
      const target = event.target as HTMLElement;
      if (target.closest("[data-no-drag], input, textarea")) return;
      if (!containerRef.current) return;
      let pendingLayout: Record<string, LayoutItem> | undefined;
      if (!freeLayout) {
        pendingLayout = computeLayout();
      }
      const targetElement = event.currentTarget as HTMLElement;
      if (targetElement.setPointerCapture) {
        targetElement.setPointerCapture(event.pointerId);
      }
      const rect = targetElement.getBoundingClientRect();
      dragRef.current = {
        id,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        pendingLayout,
        pendingHeight: pendingLayout ? getLayoutHeight(pendingLayout) : undefined,
      };
    };
  }

  function handleLinkClick(event: React.MouseEvent<HTMLElement>) {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function computeLayout() {
    const container = containerRef.current;
    if (!container) return {};
    const elements = Array.from(
      container.querySelectorAll<HTMLDivElement>("[data-id]")
    );
    const containerRect = container.getBoundingClientRect();
    const nextLayout: Record<string, LayoutItem> = {};

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const id = el.dataset.id;
      if (!id) return;
      nextLayout[id] = {
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      };
    });

    return nextLayout;
  }

  const categoryTools = useMemo(() => {
    if (!categoryModal) return [];
    return toolItems
      .filter(
        (tool) => tool.categoryId === categoryModal || tool.categorySlug === categoryModal
      )
      .filter((tool) =>
        subTagModal
          ? tool.secondaryTags.some(
              (tag) => tag.name.en === subTagModal || tag.name.zh === subTagModal
            )
          : true
      )
      .slice(0, 3);
  }, [categoryModal, subTagModal, toolItems]);
  const primaryTool = toolItems[0] ?? null;
  const primaryCase = caseItems[0] ?? null;

  return (
    <div
      ref={pageRef}
      className="min-h-screen text-gray-800 dark:text-gray-100 relative z-10 page-reveal"
    >
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={toggle}
          className="h-10 w-10 bg-white/90 text-gray-700 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition flex items-center justify-center"
        >
          {lang === "中文" ? "中" : "EN"}
        </button>
      </div>
      <div
        className={`bento-grid ${freeLayout ? "free-layout" : ""}`}
        id="grid-container"
        ref={containerRef}
        style={freeLayout && containerHeight ? { height: containerHeight } : undefined}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          data-id="brand"
          onPointerDown={handlePointerDown("brand")}
          style={getStyle("brand")}
          draggable={false}
          className="card-logo bg-white rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-grab active:cursor-grabbing text-black"
        >
          <div className="relative z-10 py-8">
            <h1 className="font-display font-bold text-6xl tracking-tighter text-[#002FA7] group-hover:rotate-6 transition-transform duration-500 leading-none">
              AI<br />SELECT<br />
              <span className="text-black">SHOP</span>
            </h1>
          </div>
          <div className="absolute bottom-6 bg-white shadow-sm px-6 py-2 rounded-full border border-gray-100">
            <span className="font-medium text-sm">Est. 2025</span>
          </div>
        </div>

        <div
          data-id="hero"
          onPointerDown={handlePointerDown("hero")}
          style={getStyle("hero")}
          draggable={false}
          className="card-hero bg-white rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col justify-between relative cursor-grab active:cursor-grabbing text-black"
        >
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight mb-6 text-gray-900">
              <span className="text-[#002FA7] text-3xl">
                {t({ en: "Curating the best AI tools", zh: "精选最好的 AI 工具" })}
              </span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-light">
              {t({
                en: "Stop searching through thousands of mediocre apps. Our boutique features only the high-impact, design-forward AI solutions that actually transform your workflow.",
                zh: "不用再在海量应用中筛选。我们只收录真正提升效率、兼具设计感的 AI 解决方案。",
              })}
            </p>
          </div>
          <div className="flex justify-end mt-6">
            <Link
              href="/categories/ai-coding"
              data-no-drag
              aria-label={t({ en: "Open tool detail", zh: "打开工具详情" })}
              className="bg-black text-white rounded-full w-12 h-12 inline-flex items-center justify-center hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">arrow_outward</span>
            </Link>
          </div>
        </div>

        <div
          data-id="directions"
          onPointerDown={handlePointerDown("directions")}
          style={getStyle("directions")}
          draggable={false}
          className="card-list bg-gradient-to-br from-gray-50 to-gray-100 rounded-[32px] p-0 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card overflow-hidden flex flex-col border border-white/20 cursor-grab active:cursor-grabbing"
        >
          <div className="px-6 pt-6 pb-2 border-b border-gray-200 bg-white/60 backdrop-blur-sm z-10 flex justify-between items-center sticky top-0">
            <span className="font-display font-bold text-lg text-[#002FA7]">
              {t({ en: "Directions", zh: "方向" })}
            </span>
            <span className="bg-[#002FA7]/10 text-[#002FA7] px-2 py-1 rounded text-xs font-bold">
              {t({
                en: `${categoryGroups.length} Categories`,
                zh: `${categoryGroups.length} 个分类`,
              })}
            </span>
          </div>
          <div className="overflow-y-auto no-scrollbar flex-1 p-6 space-y-3">
            {categoryGroups.map((category) => (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => {
                    setExpandedCategoryId((prev) =>
                      prev === category.id ? null : category.id
                    );
                  }}
                  data-no-drag
                  className="group relative bg-white rounded-xl p-4 shadow-sm border border-transparent hover:border-[#002FA7] transition-all cursor-pointer text-left w-full"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800 group-hover:text-[#002FA7]">
                      {lang === "EN" ? category.name.en : category.name.zh}
                    </span>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#002FA7] transition-transform group-hover:translate-x-1">
                      chevron_right
                    </span>
                  </div>
                </button>
                {expandedCategoryId === category.id && (
                  <div className="flex flex-wrap gap-2">
                    {category.subTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          setCategoryModal(category.id);
                          setSubTagModal(tag.name.en);
                        }}
                        data-no-drag
                        className="text-xs px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-gray-600 hover:border-[#002FA7] hover:text-[#002FA7] transition"
                      >
                        {lang === "EN" ? tag.name.en : tag.name.zh}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
            <Link
              href="/categories/ai-coding"
              data-no-drag
              className="bg-[#002FA7] text-white rounded-full px-4 py-2 shadow-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              {t({ en: "All Categories", zh: "全部分类" })}
            </Link>
          </div>
        </div>

        <button
          data-id="new-arrival"
          onPointerDown={handlePointerDown("new-arrival")}
          style={getStyle("new-arrival")}
          draggable={false}
          onClick={() => {
            if (suppressClickRef.current) return;
            if (primaryTool) setToolModal(primaryTool);
          }}
          className="card-latest bg-white rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card relative overflow-hidden group cursor-grab active:cursor-grabbing text-left text-black"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold font-display text-xl">
              {t({ en: "New Arrival", zh: "最新工具" })}
            </span>
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
              2m ago
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2">
            {primaryTool ? (lang === "EN" ? primaryTool.name.en : primaryTool.name.zh) : "--"}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {primaryTool
              ? lang === "EN"
                ? primaryTool.description.en
                : primaryTool.description.zh
              : ""}
          </p>
          <div className="font-mono text-[10px] leading-[10px] text-gray-400 whitespace-pre overflow-hidden select-none opacity-50 group-hover:opacity-80 transition-opacity">
            :::    ::: :::::::::: :::::::::: 
            :+:    :+: :+:        :+:        
            +:+    +:+ +:+        +:+        
            +#++:++#++ +#++:++#   +#++:++#   
            +#+    +#+ +#+        +#+        
            #+#    #+# #+#        #+#        
            ###    ### ########## ########## 
          </div>
          <span className="absolute bottom-4 right-4 bg-gray-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </button>

        <button
          data-id="latest-case"
          onPointerDown={handlePointerDown("latest-case")}
          style={getStyle("latest-case")}
          draggable={false}
          onClick={() => {
            if (suppressClickRef.current) return;
            if (primaryCase) setCaseModal(primaryCase);
          }}
          className="card-about bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC] rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card relative cursor-grab active:cursor-grabbing text-left"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 mix-blend-overlay"
            style={{
              backgroundImage: `url(${
                primaryCase?.thumbnail ||
                "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80"
              })`,
            }}
          />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-white font-bold text-xl">
              {t({ en: "Latest Case", zh: "最新案例" })}
            </h3>
            <p className="text-white/80 text-sm mt-1">
              {primaryCase ? (lang === "EN" ? primaryCase.title.en : primaryCase.title.zh) : "--"}
            </p>
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
              {t({ en: "View Case", zh: "查看案例" })}
            </span>
          </div>
        </button>

        <div
          data-id="social"
          onPointerDown={handlePointerDown("social")}
          style={getStyle("social")}
          draggable={false}
          className="card-visual bg-white/90 rounded-[32px] p-4 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col items-center justify-center space-y-4 cursor-grab active:cursor-grabbing"
        >
          <div className="flex flex-col gap-4 w-full">
            <a
              className="h-14 bg-[#E4405F] rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform w-full"
              href="#"
            >
              <span className="font-bold text-xl">Ig</span>
            </a>
            <a
              className="h-14 bg-[#60A5FA] rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform w-full"
              href="#"
              data-no-drag
            >
              <span className="font-bold text-xl">X</span>
            </a>
          </div>
        </div>

        <div
          data-id="assistant"
          onPointerDown={handlePointerDown("assistant")}
          style={getStyle("assistant")}
          draggable={false}
          className="card-qa bg-white/90 rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card relative min-h-[240px] flex flex-col cursor-grab active:cursor-grabbing"
        >
          <div className="flex-1 p-6 flex flex-col justify-end relative bg-gray-50">
            <div
              ref={assistantScrollRef}
              className="space-y-3 mb-4 max-h-[220px] overflow-y-auto pr-1 scroll-smooth"
            >
              {assistantMessages.map((message, index) => {
                const typedContent = typedMessages[index];
                const isTyping = typingIndex === index;
                const displayContent =
                  message.role === "assistant" && typedContent !== undefined
                    ? typedContent
                    : message.content;
                const typingDone =
                  message.role !== "assistant" ||
                  !isTyping ||
                  typedContent?.length === message.content.length;
                return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-[#002FA7] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-sm shadow-sm max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-white text-gray-700 rounded-tl-none"
                        : "bg-[#002FA7] text-white rounded-tr-none"
                    }`}
                  >
                    {displayContent}
                    {typingDone && message.matches && message.matches.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.matches.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => openMatchedTool(tool)}
                            data-no-drag
                            className="w-full text-left rounded-2xl border border-[#002FA7]/20 bg-[#002FA7]/5 px-3 py-2 text-xs text-[#002FA7] hover:bg-[#002FA7]/10 transition"
                          >
                            <div className="font-semibold">
                              {lang === "EN" ? tool.name_en : tool.name_zh}
                            </div>
                            <div className="text-[10px] text-[#002FA7]/70">
                              {t({ en: "Open tool details", zh: "打开工具详情" })}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );})}
              {assistantLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#002FA7] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-gray-400 shadow-sm">
                    {t({ en: "Thinking...", zh: "思考中..." })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
              <input
                className="w-full bg-gray-100 border-none rounded-full py-3 px-4 pr-12 text-sm text-gray-800 focus:ring-2 focus:ring-[#002FA7]"
                placeholder={t({ en: "Ask anything...", zh: "尽管提问..." })}
                type="text"
                value={assistantInput}
                onChange={(event) => setAssistantInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAssistantSend();
                  }
                }}
                data-no-drag
              />
              <button
                data-no-drag
                onClick={handleAssistantSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#002FA7] text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-60"
                disabled={assistantLoading || !assistantInput.trim()}
              >
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>

        <Link
          data-id="submit"
          onPointerDown={handlePointerDown("submit")}
          style={getStyle("submit")}
          href="/admin"
          draggable={false}
          onClick={handleLinkClick}
          className="card-contact bg-[#002FA7] text-white rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col justify-between group cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
          <div>
            <h3 className="font-display font-bold text-2xl mb-2">
              {t({ en: "Submit a Tool", zh: "提交工具" })}
            </h3>
            <p className="text-blue-100 text-sm">
              {t({ en: "Building the future?", zh: "一起构建未来？" })}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono text-sm opacity-80 group-hover:opacity-100">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>{t({ en: "Submit Now", zh: "立即提交" })}</span>
          </div>
        </Link>

        <Link
          data-id="explore-categories"
          onPointerDown={handlePointerDown("explore-categories")}
          style={getStyle("explore-categories")}
          href="/categories/ai-coding"
          draggable={false}
          onClick={handleLinkClick}
          className="card-pill-1 bg-white rounded-full p-4 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col items-center justify-center border border-transparent hover:border-gray-200 transition-all text-center cursor-grab active:cursor-grabbing text-black"
        >
          <span className="font-display font-bold text-sm block">
            {t({ en: "Explore Categories", zh: "探索分类" })}
          </span>
        </Link>
        <Link
          data-id="explore-case"
          onPointerDown={handlePointerDown("explore-case")}
          style={getStyle("explore-case")}
          href="/cases"
          draggable={false}
          onClick={handleLinkClick}
          className="card-pill-2 bg-white rounded-full p-4 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col items-center justify-center border border-transparent hover:border-gray-200 transition-all text-center cursor-grab active:cursor-grabbing text-black"
        >
          <span className="font-display font-bold text-sm block">
            {t({ en: "Explore Case", zh: "探索案例" })}
          </span>
        </Link>

        <div
          data-id="tagline"
          onPointerDown={handlePointerDown("tagline")}
          style={getStyle("tagline")}
          draggable={false}
          className="card-tagline rounded-[32px] flex items-center justify-center text-white/20 font-display text-3xl tracking-[0.35em] uppercase cursor-grab active:cursor-grabbing animate-pulse"
        >
          {t({ en: "Select Your Future", zh: "选择你的未来" })}
        </div>
      </div>

      {toolModal && (
        <ToolDetailModal
          tool={toolModal}
          onClose={() => setToolModal(null)}
          caseItems={caseItems}
          getCaseLink={getCaseLink}
          onOpenCategory={(categoryId, subTagId) => {
            setToolModal(null);
            setCategoryModal(categoryId);
            setSubTagModal(subTagId ?? null);
          }}
        />
      )}
      {categoryModal && (
        <CategoryToolsModal
          categoryId={categoryModal}
          subTagId={subTagModal}
          tools={categoryTools}
          categoryGroups={categoryGroups}
          onClose={() => {
            setCategoryModal(null);
            setSubTagModal(null);
          }}
          onOpenTool={(tool) => {
            setCategoryModal(null);
            setSubTagModal(null);
            setToolModal(tool);
          }}
          onClearSubTag={() => setSubTagModal(null)}
        />
      )}
      {caseModal && (
        <CaseDetailModal
          data={caseModal}
          onClose={() => setCaseModal(null)}
          onOpenTool={(tool) => {
            const match = toolItems.find(
              (item) =>
                item.name.en.toLowerCase() === tool.en.toLowerCase() ||
                item.name.zh === tool.zh
            );
            if (match) {
              setCaseModal(null);
              setToolModal(match);
            }
          }}
        />
      )}
    </div>
  );
}

type LayoutItem = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getLayoutHeight(layout: Record<string, LayoutItem>) {
  const bottoms = Object.values(layout).map((item) => item.y + item.height);
  if (bottoms.length === 0) return 0;
  return Math.max(...bottoms) + 40;
}

function Overlay({ onClose }: { onClose: () => void }) {
  return (
    <button
      aria-label="Close modal"
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    />
  );
}

function ToolDetailModal({
  tool,
  onClose,
  caseItems,
  getCaseLink,
  onOpenCategory,
}: {
  tool: Tool;
  onClose: () => void;
  caseItems: CaseItem[];
  getCaseLink: (item: CaseItem | null) => string;
  onOpenCategory: (categoryId: string, subTagId?: string) => void;
}) {
  const { lang, t } = useLanguage();
  const pricingLabel =
    tool.pricing === "free"
      ? t({ en: "Free", zh: "免费" })
      : tool.pricing === "paid"
      ? t({ en: "Paid", zh: "付费" })
      : t({ en: "Freemium", zh: "部分免费" });
  const relatedCases = caseItems.filter((item) =>
    item.tools.some(
      (caseTool) =>
        caseTool.en.toLowerCase() === tool.name.en.toLowerCase() ||
        caseTool.zh === tool.name.zh
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <Overlay onClose={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-3xl bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] border border-white/20 text-black"
      >
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm rounded-t-[32px]">
          <div className="flex items-center gap-3">
            {tool.logoUrl ? (
              <img
                src={tool.logoUrl}
                alt={lang === "EN" ? tool.name.en : tool.name.zh}
                className="w-12 h-12 rounded-full bg-[#002FA7]/10 object-contain"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#002FA7]/10 text-[#002FA7] flex items-center justify-center font-bold">
                {tool.initials}
              </div>
            )}
            <div>
              <div className="font-display text-2xl font-bold">
                {lang === "EN" ? tool.name.en : tool.name.zh}
              </div>
              <div className="text-xs font-mono text-gray-400">tool_detail.modal</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:scale-110 transition"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="p-6 grid gap-4 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              {lang === "EN" ? tool.description.en : tool.description.zh}
            </p>
            {tool.secondaryTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tool.secondaryTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => onOpenCategory(tool.categoryId, tag.id)}
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
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">link</span>
                {tool.url}
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">paid</span>
                {pricingLabel}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
            {relatedCases.length > 0 && (
              <>
                <div className="text-xs font-mono text-gray-400">
                  {t({ en: "RELATED CASES", zh: "相关案例" })}
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {relatedCases.map((item) => (
                    <Link
                      key={item.id}
                      href={getCaseLink(item)}
                      className="min-w-[140px] rounded-xl bg-gray-50 p-3 hover-card text-left"
                    >
                      <div className="text-sm font-bold">
                        {lang === "EN" ? item.title.en : item.title.zh}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.tags[0]
                          ? lang === "EN"
                            ? item.tags[0].en
                            : item.tags[0].zh
                          : t({ en: "Case", zh: "案例" })}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
            <div className="flex gap-2">
              <a
                href={tool.url}
                className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
                {t({ en: "Visit Website", zh: "访问官网" })}
              </a>
              <button className="border border-gray-200 rounded-full px-4 py-2 text-sm">
                {t({ en: "Save", zh: "收藏" })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryToolsModal({
  categoryId,
  subTagId,
  tools,
  categoryGroups,
  onClose,
  onOpenTool,
  onClearSubTag,
}: {
  categoryId: string;
  subTagId: string | null;
  tools: Tool[];
  categoryGroups: CategoryGroup[];
  onClose: () => void;
  onOpenTool: (tool: Tool) => void;
  onClearSubTag: () => void;
}) {
  const { lang, t } = useLanguage();
  const category = categoryGroups.find((item) => item.id === categoryId);
  const categoryLabel = category ? (lang === "EN" ? category.name.en : category.name.zh) : categoryId;
  const categorySlug = category?.slug ?? categoryId;
  const subTag =
    category?.subTags.find(
      (tag) => tag.name.en === subTagId || tag.name.zh === subTagId
    ) ?? null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <Overlay onClose={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-2xl bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] border border-white/20 text-black"
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="font-display text-2xl font-bold">{categoryLabel}</div>
            {subTag && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]">
                  {lang === "EN" ? subTag.name.en : subTag.name.zh}
                </span>
                <button
                  onClick={onClearSubTag}
                  className="text-gray-400 hover:text-[#002FA7] transition"
                >
                  {t({ en: "Clear", zh: "清除筛选" })}
                </button>
              </div>
            )}
            <div className="text-sm text-gray-500">
              {t({
                en: `${tools.length} recommended tools`,
                zh: `${tools.length} 个推荐工具`,
              })}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="p-6 space-y-3">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onOpenTool(tool)}
              className="bg-white rounded-xl p-4 border border-transparent hover:border-[#002FA7] transition-all flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-3">
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
                  <div className="font-bold text-sm">
                    {lang === "EN" ? tool.name.en : tool.name.zh}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lang === "EN" ? tool.description.en : tool.description.zh}
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          ))}
        </div>
        <div className="px-6 pb-6 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-400">
            {t({ en: "TOTAL 24 TOOLS", zh: "共 24 个工具" })}
          </span>
          <Link
            href={`/categories/${categorySlug}${subTagId ? `?sub=${encodeURIComponent(subTagId)}` : ""}`}
            className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
          >
            {t({ en: "View All", zh: "查看全部" })}
          </Link>
        </div>
      </div>
    </div>
  );
}

function CaseDetailModal({
  data,
  onClose,
  onOpenTool,
}: {
  data: CaseItem;
  onClose: () => void;
  onOpenTool: (tool: LocalizedText) => void;
}) {
  const { lang, t } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <Overlay onClose={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-4xl bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] border border-white/20 text-black"
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="font-display text-2xl font-bold">
              {t({ en: "Latest Case", zh: "最新案例" })}
            </div>
            <div className="text-sm text-gray-500">
              {lang === "EN" ? data.title.en : data.title.zh}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <div className="p-6 grid gap-4 lg:grid-cols-[3fr_2fr]">
          <div className="rounded-2xl overflow-hidden relative">
            <div
              className="w-full aspect-video bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC]"
              style={
                data.thumbnail
                  ? {
                      backgroundImage: `url(${data.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="font-bold text-lg">
                {t({ en: "Case Overview", zh: "案例概览" })}
              </div>
              <div className="text-xs text-white/80">
                {data.tags.map((tag) => (lang === "EN" ? tag.en : tag.zh)).join(" • ")}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600 leading-relaxed">
              {lang === "EN" ? data.summary.en : data.summary.zh}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {data.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl bg-gray-50 p-3 text-center"
                >
                  <div className="text-lg font-bold">{metric.value}</div>
                  <div className="text-[10px] text-gray-500">{metric.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {data.tools.map((tool) => (
                <button
                  key={tool.en}
                  onClick={() => onOpenTool(tool)}
                  className="text-xs px-3 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]"
                >
                  {lang === "EN" ? tool.en : tool.zh}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Link
                href={getCaseLink(data)}
                className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
              >
                {t({ en: "View Details", zh: "查看详情" })}
              </Link>
              <button className="border border-gray-200 rounded-full px-4 py-2 text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">share</span>
                {t({ en: "Share", zh: "分享" })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
