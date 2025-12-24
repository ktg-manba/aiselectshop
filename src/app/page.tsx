"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Tool = {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: "free" | "paid" | "freemium";
  tags: string[];
  url: string;
  initials: string;
};

type CaseItem = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  tools: string[];
};

const tools: Tool[] = [
  {
    id: "deepseek",
    name: "DeepSeek V2",
    description: "Open source champion. Deploy smart models with ease and cost efficiency.",
    category: "AI Coding",
    pricing: "freemium",
    tags: ["Open Source", "LLM", "Reasoning"],
    url: "https://deepseek.com",
    initials: "DS",
  },
  {
    id: "claude",
    name: "Claude 3.5",
    description: "Design-forward coding partner for teams.",
    category: "AI Chatbot",
    pricing: "paid",
    tags: ["Assistant", "Safety"],
    url: "https://claude.ai",
    initials: "CL",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI pair editor with fast inline edits.",
    category: "AI Coding",
    pricing: "paid",
    tags: ["Editor", "Workflow"],
    url: "https://cursor.sh",
    initials: "CU",
  },
];

const cases: CaseItem[] = [
  {
    id: "gen-video",
    title: "Generative Video & 3D Workflow",
    summary:
      "A boutique studio built a fully generative pipeline for 30-second product films with AI-driven assets and automation.",
    tags: ["Video", "3D", "Automation"],
    metrics: [
      { label: "Speed", value: "3x" },
      { label: "Cost", value: "-40%" },
      { label: "Match", value: "98%" },
    ],
    tools: ["Runway", "ComfyUI", "Blender"],
  },
];

const categories = [
  "AI Chatbot",
  "AI Coding",
  "AI Image Gen",
  "AI Video",
  "AI Audio",
];

export default function Home() {
  const [toolModal, setToolModal] = useState<Tool | null>(null);
  const [categoryModal, setCategoryModal] = useState<string | null>(null);
  const [caseModal, setCaseModal] = useState<CaseItem | null>(null);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setToolModal(null);
        setCategoryModal(null);
        setCaseModal(null);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const categoryTools = useMemo(() => {
    if (!categoryModal) return [];
    return tools.filter((tool) => tool.category === categoryModal).slice(0, 3);
  }, [categoryModal]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100">
      <div className="bento-grid" id="grid-container">
        <div className="card-logo bg-white rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-grab active:cursor-grabbing text-black">
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

        <div className="card-hero bg-white rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col justify-between relative cursor-grab active:cursor-grabbing text-black">
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight mb-6 text-gray-900">
              <span className="text-[#002FA7] text-3xl">Curating the best AI tools</span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed font-light">
              Stop searching through thousands of mediocre apps. Our boutique features
              only the high-impact, design-forward AI solutions that actually transform
              your workflow.
            </p>
          </div>
          <div className="flex justify-end mt-6">
            <button className="bg-black text-white rounded-full p-3 hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">arrow_outward</span>
            </button>
          </div>
        </div>

        <div className="card-list bg-gradient-to-br from-gray-50 to-gray-100 rounded-[32px] p-0 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card overflow-hidden flex flex-col border border-white/20 cursor-grab active:cursor-grabbing">
          <div className="px-6 pt-6 pb-2 border-b border-gray-200 bg-white/60 backdrop-blur-sm z-10 flex justify-between items-center sticky top-0">
            <span className="font-display font-bold text-lg text-[#002FA7]">Directions</span>
            <span className="bg-[#002FA7]/10 text-[#002FA7] px-2 py-1 rounded text-xs font-bold">
              5 Categories
            </span>
          </div>
          <div className="overflow-y-auto no-scrollbar flex-1 p-6 space-y-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryModal(category)}
                className="group relative bg-white rounded-xl p-4 shadow-sm border border-transparent hover:border-[#002FA7] transition-all cursor-pointer text-left w-full"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 group-hover:text-[#002FA7]">
                    {category}
                  </span>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-[#002FA7] transition-transform group-hover:translate-x-1">
                    chevron_right
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
            <Link
              href="/categories/ai-coding"
              className="bg-[#002FA7] text-white rounded-full px-4 py-2 shadow-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              All Categories
            </Link>
          </div>
        </div>

        <button
          onClick={() => setToolModal(tools[0])}
          className="card-latest bg-white rounded-[32px] p-6 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card relative overflow-hidden group cursor-grab active:cursor-grabbing text-left text-black"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold font-display text-xl">New Arrival</span>
            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
              2m ago
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2">DeepSeek V2</h3>
          <p className="text-sm text-gray-600 mb-6">
            Open source champion. Deploy smart models with ease and cost efficiency.
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
          onClick={() => setCaseModal(cases[0])}
          className="card-about bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC] rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card relative cursor-grab active:cursor-grabbing text-left"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-50 mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-white font-bold text-xl">Latest Case</h3>
            <p className="text-white/80 text-sm mt-1">Generative Video & 3D Workflow</p>
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
              View Case
            </span>
          </div>
        </button>

        <div className="card-visual bg-white/90 rounded-[32px] p-4 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col items-center justify-center space-y-4 cursor-grab active:cursor-grabbing">
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
            >
              <span className="font-bold text-xl">X</span>
            </a>
          </div>
        </div>

        <div className="card-qa bg-white/90 rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card relative min-h-[240px] flex flex-col cursor-grab active:cursor-grabbing">
          <div className="flex-1 p-6 flex flex-col justify-end relative bg-gray-50">
            <div className="space-y-3 mb-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#002FA7] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-gray-700 shadow-sm max-w-[80%]">
                  Hello! I'm your AI shopping assistant. What tool are you looking for today?
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
              <input
                className="w-full bg-gray-100 border-none rounded-full py-3 px-4 pr-12 text-sm focus:ring-2 focus:ring-[#002FA7]"
                placeholder="Ask anything..."
                type="text"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#002FA7] text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>

        <Link
          href="/admin/login"
          className="card-contact bg-[#002FA7] text-white rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col justify-between group cursor-grab active:cursor-grabbing"
        >
          <div>
            <h3 className="font-display font-bold text-2xl mb-2">Submit a Tool</h3>
            <p className="text-blue-100 text-sm">Building the future?</p>
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono text-sm opacity-80 group-hover:opacity-100">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Submit Now</span>
          </div>
        </Link>

        <Link
          href="/categories/ai-coding"
          className="card-pill-1 bg-white rounded-full p-4 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col items-center justify-center border border-transparent hover:border-gray-200 transition-all text-center cursor-grab active:cursor-grabbing text-black"
        >
          <span className="font-display font-bold text-sm block">Explore Categories</span>
        </Link>
        <Link
          href="/cases"
          className="card-pill-2 bg-white rounded-full p-4 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)] hover-card flex flex-col items-center justify-center border border-transparent hover:border-gray-200 transition-all text-center cursor-grab active:cursor-grabbing text-black"
        >
          <span className="font-display font-bold text-sm block">Explore Case</span>
        </Link>
      </div>

      {toolModal && (
        <ToolDetailModal
          tool={toolModal}
          onClose={() => setToolModal(null)}
          onOpenCase={() => setCaseModal(cases[0])}
        />
      )}
      {categoryModal && (
        <CategoryToolsModal
          category={categoryModal}
          tools={categoryTools}
          onClose={() => setCategoryModal(null)}
          onOpenTool={(tool) => {
            setCategoryModal(null);
            setToolModal(tool);
          }}
        />
      )}
      {caseModal && (
        <CaseDetailModal
          data={caseModal}
          onClose={() => setCaseModal(null)}
          onOpenTool={() => setToolModal(tools[0])}
        />
      )}
    </div>
  );
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
  onOpenCase,
}: {
  tool: Tool;
  onClose: () => void;
  onOpenCase: () => void;
}) {
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
            <div className="w-12 h-12 rounded-full bg-[#002FA7]/10 text-[#002FA7] flex items-center justify-center font-bold">
              {tool.initials}
            </div>
            <div>
              <div className="font-display text-2xl font-bold">{tool.name}</div>
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
            <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]"
                >
                  {tag}
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
                {tool.pricing.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
            <div className="text-xs font-mono text-gray-400">RELATED CASES</div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={onOpenCase}
                className="min-w-[140px] rounded-xl bg-gray-50 p-3 hover-card text-left"
              >
                <div className="text-sm font-bold">Gen Video</div>
                <div className="text-xs text-gray-500">Workflow</div>
              </button>
              <button
                onClick={onOpenCase}
                className="min-w-[140px] rounded-xl bg-gray-50 p-3 hover-card text-left"
              >
                <div className="text-sm font-bold">3D Studio</div>
                <div className="text-xs text-gray-500">Render</div>
              </button>
            </div>
            <div className="flex gap-2">
              <a
                href={tool.url}
                className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
                Visit Website
              </a>
              <button className="border border-gray-200 rounded-full px-4 py-2 text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryToolsModal({
  category,
  tools,
  onClose,
  onOpenTool,
}: {
  category: string;
  tools: Tool[];
  onClose: () => void;
  onOpenTool: (tool: Tool) => void;
}) {
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
            <div className="font-display text-2xl font-bold">{category}</div>
            <div className="text-sm text-gray-500">{tools.length} recommended tools</div>
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
                <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {tool.initials}
                </div>
                <div>
                  <div className="font-bold text-sm">{tool.name}</div>
                  <div className="text-xs text-gray-500">{tool.description}</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </button>
          ))}
        </div>
        <div className="px-6 pb-6 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-400">TOTAL 24 TOOLS</span>
          <Link
            href="/categories/ai-coding"
            className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
          >
            View All
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
  onOpenTool: () => void;
}) {
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
            <div className="font-display text-2xl font-bold">Latest Case</div>
            <div className="text-sm text-gray-500">{data.title}</div>
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
            <div className="w-full aspect-video bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC]" />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="font-bold text-lg">Case Overview</div>
              <div className="text-xs text-white/80">{data.tags.join(" • ")}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm text-gray-600 leading-relaxed">{data.summary}</div>
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
                  key={tool}
                  onClick={onOpenTool}
                  className="text-xs px-3 py-1 rounded-full bg-[#002FA7]/10 text-[#002FA7]"
                >
                  {tool}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Link
                href="/cases/gen-video"
                className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
              >
                View Details
              </Link>
              <button className="border border-gray-200 rounded-full px-4 py-2 text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">share</span>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
