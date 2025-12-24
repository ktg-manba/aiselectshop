"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ToolItem = {
  id: string;
  name: string;
  description: string;
  pricing: "free" | "paid" | "freemium";
  updated: string;
  popularity: number;
  initials: string;
};

const toolList: ToolItem[] = [
  {
    id: "claude",
    name: "Claude 3.5",
    description: "AI coding assistant for teams.",
    pricing: "paid",
    updated: "2d",
    popularity: 98,
    initials: "CL",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Editor with AI refactors.",
    pricing: "paid",
    updated: "1d",
    popularity: 90,
    initials: "CU",
  },
  {
    id: "deepseek",
    name: "DeepSeek V2",
    description: "Open source models for scale.",
    pricing: "freemium",
    updated: "6h",
    popularity: 86,
    initials: "DS",
  },
  {
    id: "tabnine",
    name: "Tabnine",
    description: "Private code completions.",
    pricing: "free",
    updated: "3d",
    popularity: 70,
    initials: "TN",
  },
];

const categoryTabs = [
  "AI Chatbot",
  "AI Coding",
  "AI Image Gen",
  "AI Video",
  "AI Audio",
];

const filters = ["all", "free", "paid", "freemium"] as const;
const sorts = ["popularity", "updated"] as const;

type Filter = (typeof filters)[number];
type Sort = (typeof sorts)[number];

export default function CategoryDetailPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("popularity");
  const [activeCategory, setActiveCategory] = useState("AI Coding");

  const visibleTools = useMemo(() => {
    const filtered = toolList.filter((tool) =>
      filter === "all" ? true : tool.pricing === filter
    );
    return [...filtered].sort((a, b) => {
      if (sort === "updated") {
        return a.updated.localeCompare(b.updated);
      }
      return b.popularity - a.popularity;
    });
  }, [filter, sort]);

  return (
    <div className="min-h-screen px-6 pb-16">
      <div className="max-w-6xl mx-auto pt-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-4xl font-bold text-white">AI Coding</div>
            <div className="text-sm text-white/70 mt-2">
              Tools that supercharge development workflows.
            </div>
          </div>
          <div className="text-right text-xs font-mono text-white/60">
            <div>24 TOOLS</div>
            <div>UPDATED 2D AGO</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory === tab
                  ? "bg-[#002FA7] text-white"
                  : "bg-white/90 text-gray-700 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                filter === item
                  ? "bg-[#002FA7] text-white"
                  : "bg-white/90 text-gray-700 border border-gray-200"
              }`}
            >
              {item === "all" ? "All" : item}
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
                Sort: {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white/90 rounded-2xl p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {tool.initials}
                </div>
                <div>
                  <div className="font-bold">{tool.name}</div>
                  <div className="text-xs text-gray-500">{tool.description}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="px-2 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]">
                  {tool.pricing}
                </span>
                <span>Updated {tool.updated}</span>
              </div>
            </div>
          ))}
        </div>

        {visibleTools.length === 0 && (
          <div className="mt-10 bg-white/90 rounded-2xl p-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="font-display text-2xl font-bold">No tools found</div>
            <div className="text-sm text-gray-500 mt-2">
              Reset filters or submit a new tool for review.
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
              >
                Reset Filters
              </button>
              <Link
                href="/admin/login"
                className="border border-gray-200 rounded-full px-4 py-2 text-sm"
              >
                Submit a Tool
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
