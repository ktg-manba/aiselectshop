"use client";

import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import BottomBar from "@/components/BottomBar";
import { useLanguage } from "@/components/LanguageProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function AiShopCasePage() {
  const { lang, t, toggle } = useLanguage();
  return (
    <div className={`${spaceGrotesk.className} min-h-screen bg-[#F8FAFC] text-slate-800`}>
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={toggle}
          className="h-10 w-10 bg-white/90 text-gray-700 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition flex items-center justify-center"
        >
          {lang === "中文" ? "中" : "EN"}
        </button>
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F8FAFC]">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] bg-blue-100/30 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[0%] -right-[10%] w-[60vw] h-[60vw] bg-indigo-100/30 rounded-full blur-[120px] opacity-50" />
      </div>

      <main className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-16 flex flex-col items-center">
        <div className="text-center mb-16 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm text-[#0052FF] text-xs font-bold uppercase tracking-widest mb-6">
            <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
            {t({ en: "Development Workflow", zh: "开发流程" })}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            {lang === "EN" ? (
              <>
                Building an <span className="text-[#0052FF]">AI Navigation Site</span>
                <br className="hidden md:block" /> with Stitch &amp; Cursor.
              </>
            ) : (
              <>
                用 <span className="text-[#0052FF]">Stitch + Cursor</span>
                <br className="hidden md:block" />
                搭建 AI 导航站
              </>
            )}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {t({
              en: "A step-by-step visualization of the modern frontend workflow: utilizing AI to analyze reference designs and generate production-ready code instantly.",
              zh: "通过分步流程展示现代前端协作：让 AI 分析参考设计并快速生成可落地代码。",
            })}
          </p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-orange-100 text-orange-600 text-xs font-bold">
                1
              </span>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t({ en: "The Inspiration", zh: "灵感来源" })}
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
              {lang === "EN" ? (
                <>
                  "The <span className="font-bold text-slate-900 not-italic">mac.ac</span>{" "}
                  website serves as the primary visual reference, selected for its distinctive
                  grid system and typography."
                </>
              ) : (
                <>
                  “<span className="font-bold text-slate-900 not-italic">mac.ac</span> 是主要
                  视觉参考，以其独特的网格系统与排版风格作为基准。”
                </>
              )}
            </div>
            <div className="bg-orange-50/50 rounded-3xl p-4 border border-orange-100/50">
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col h-full min-h-[400px]">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[10px] font-mono text-slate-400">MAD_Logo_2022.svg</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center mb-12">
                  <div className="text-center">
                    <h3 className="text-6xl font-bold text-slate-800 leading-none tracking-tighter mb-1">
                      M
                    </h3>
                    <h3 className="text-6xl font-bold text-slate-800 leading-none tracking-tighter">
                      AD
                    </h3>
                  </div>
                </div>
                <div className="mt-auto">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {t({
                      en: "MAD designs brands and digital products.",
                      zh: "MAD 设计品牌与数字产品。",
                    })}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {t({
                      en: "The distinctive grid layout and typography of this site serve as the visual foundation for the new project.",
                      zh: "该网站的网格布局与排版风格构成新项目的视觉基础。",
                    })}
                  </p>
                  <div className="flex justify-end mt-4">
                    <div className="w-8 h-8 rounded-full bg-slate-500 text-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">north_east</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3 text-[10px] font-mono text-slate-400">
                {t({ en: "Original Design Reference", zh: "原始设计参考" })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-blue-100 text-[#0052FF] text-xs font-bold">
                2
              </span>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t({ en: "The Workflow", zh: "流程拆解" })}
              </h2>
            </div>
            <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 p-2 overflow-hidden relative">
              <div className="bg-slate-50/50 rounded-2xl p-6 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {[
                    {
                      iconWrapper: "bg-orange-50 text-orange-500",
                      icon: "lightbulb",
                      step: "Step 01",
                      title: t({ en: "Conceive AI Nav Site", zh: "定义导航站目标" }),
                      desc: t({
                        en: "Conceptualize the AI navigation website structure, define the content strategy, and target the core domain.",
                        zh: "构思 AI 导航站结构，定义内容策略与核心领域。",
                      }),
                    },
                    {
                      iconWrapper: "bg-indigo-50 text-indigo-500",
                      icon: "grid_view",
                      step: "Step 02",
                      title: t({ en: "mac.ac Inspiration", zh: "参考 mac.ac" }),
                      desc: t({
                        en: "Use the distinctive mac.ac design as the primary visual reference for a modern, grid-based aesthetic.",
                        zh: "以 mac.ac 的网格与排版为主要视觉参考。",
                      }),
                    },
                    {
                      iconWrapper: "bg-pink-50 text-pink-500",
                      icon: "content_copy",
                      step: "Step 03",
                      title: t({ en: "Stitch Replication", zh: "Stitch 复刻" }),
                      desc: t({
                        en: "Leverage Stitch to analyze the reference visuals and instantly generate a high-fidelity design replica.",
                        zh: "用 Stitch 解析参考视觉并快速生成高保真方案。",
                      }),
                    },
                    {
                      iconWrapper: "bg-blue-50 text-[#0052FF]",
                      icon: "code",
                      step: "Step 04",
                      title: t({ en: "Cursor Code", zh: "Cursor 落地" }),
                      desc: t({
                        en: "Implement production-ready code with Cursor, refactoring components into React and Tailwind CSS.",
                        zh: "用 Cursor 把组件重构为可上线的 React + Tailwind 代码。",
                      }),
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,82,255,0.12)]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${card.iconWrapper}`}
                        >
                          <span className="material-symbols-outlined text-2xl">
                            {card.icon}
                          </span>
                        </div>
                        <span className="px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {card.step}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-end gap-3 mb-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t({ en: "The Result", zh: "最终成果" })}
              </h2>
              <span className="flex items-center justify-center w-6 h-6 rounded bg-green-100 text-green-600 text-xs font-bold">
                3
              </span>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 italic text-slate-600 text-sm leading-relaxed text-right">
              {t({
                en: "The final output: A fully functional AI Navigation site mirroring the desired aesthetic, deployed in record time.",
                zh: "最终产出：一个完整可用的 AI 导航站，保留目标审美，并以极短时间上线。",
              })}
            </div>
            <div className="bg-[#0052FF] rounded-[40px] p-4 pb-0 shadow-2xl relative overflow-hidden h-full flex flex-col">
              <div className="bg-white rounded-t-[32px] overflow-hidden flex-1 flex flex-col relative h-[600px]">
                <div className="p-8 pb-4 border-b border-slate-100">
                  <div className="text-[9px] text-slate-400 font-mono mb-6">nav_logo.svg</div>
                  <div className="text-center">
                    <h3 className="text-4xl font-bold text-[#0052FF] leading-none tracking-tight mb-1">
                      AI
                    </h3>
                    <h3 className="text-4xl font-bold text-slate-900 leading-none tracking-tight">
                      NAV
                    </h3>
                  </div>
                  <div className="flex justify-center mt-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-600">
                      <span className="material-symbols-outlined text-[12px] text-[#0052FF]">
                        language
                      </span>
                      ainav.site
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {t({ en: "Featured Tools", zh: "精选工具" })}
                    </h4>
                    <span className="bg-blue-100 text-[#0052FF] text-[10px] font-bold px-2 py-0.5 rounded">
                      {t({ en: "Directory", zh: "导航" })}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-2 flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-slate-400 text-sm">
                      search
                    </span>
                    <span className="text-xs text-slate-400">
                      {t({ en: "Search AI tools...", zh: "搜索 AI 工具..." })}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "ChatGPT 4o", dot: "bg-green-500", tag: "Chatbot" },
                      { name: "Midjourney", dot: "bg-purple-500", tag: "Image Gen" },
                      { name: "Claude 3.5", dot: "bg-orange-500", tag: "Assistant" },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                          <span className="text-xs font-bold text-slate-800">{item.name}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-6 left-0 right-0 text-center">
                    <span className="text-[10px] text-slate-400 font-mono">⌘ K to search</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0052FF] transition"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                {t({ en: "Back to Cases", zh: "返回案例" })}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:text-[#0052FF] hover:border-[#0052FF] transition"
          >
            {t({ en: "View Case List", zh: "查看案例页" })}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </main>

      <BottomBar active="cases" />
    </div>
  );
}
