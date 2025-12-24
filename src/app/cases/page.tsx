"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type CaseListItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
};

const cases: CaseListItem[] = [
  {
    id: "gen-video",
    title: "Generative Video & 3D Workflow",
    summary: "AI pipeline for 30-second product films with automation.",
    category: "AI Video",
    date: "2024-06-18",
  },
  {
    id: "creative-ops",
    title: "Creative Ops Automation",
    summary: "Automated asset creation for product launches.",
    category: "AI Image Gen",
    date: "2024-05-30",
  },
  {
    id: "support-bot",
    title: "Support Chatbot Redesign",
    summary: "Unified customer support workflows with AI triage.",
    category: "AI Chatbot",
    date: "2024-05-12",
  },
  {
    id: "audio-brand",
    title: "Audio Branding Studio",
    summary: "Rapid sound identity generation for agencies.",
    category: "AI Audio",
    date: "2024-04-28",
  },
];

const categories = [
  "All",
  "AI Chatbot",
  "AI Coding",
  "AI Image Gen",
  "AI Video",
  "AI Audio",
];

export default function CasesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCases = useMemo(() => {
    if (activeCategory === "All") return cases;
    return cases.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen px-6 pb-16">
      <div className="max-w-6xl mx-auto pt-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-4xl font-bold text-white">Cases</div>
            <div className="text-sm text-white/70 mt-2">
              Explore boutique AI case studies and workflows.
            </div>
          </div>
          <Link
            href="/"
            className="bg-white/90 rounded-full px-4 py-2 text-sm text-gray-700"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory === category
                  ? "bg-[#002FA7] text-white"
                  : "bg-white/90 text-gray-700 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((item) => (
            <Link
              key={item.id}
              href={`/cases/${item.id}`}
              className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover-card"
            >
              <div className="text-xs font-mono text-gray-400">{item.category}</div>
              <div className="font-display text-lg font-bold mt-2">{item.title}</div>
              <p className="text-sm text-gray-600 mt-2">{item.summary}</p>
              <div className="text-xs text-gray-400 mt-4">{item.date}</div>
            </Link>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="mt-10 bg-white/90 rounded-2xl p-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="font-display text-2xl font-bold">No cases found</div>
            <div className="text-sm text-gray-500 mt-2">
              Try a different category to explore more stories.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
