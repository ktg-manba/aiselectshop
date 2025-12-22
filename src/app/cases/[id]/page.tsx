import Link from "next/link";

const tools = [
  { name: "Runway", pricing: "Paid" },
  { name: "ComfyUI", pricing: "Free" },
  { name: "Blender", pricing: "Free" },
];

const metrics = [
  { label: "Speed", value: "3x" },
  { label: "Cost", value: "-40%" },
  { label: "Match", value: "98%" },
  { label: "Cycle", value: "-2w" },
];

export default function CaseDetailPage() {
  return (
    <div className="min-h-screen px-6 pb-16">
      <div className="max-w-6xl mx-auto pt-10">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)]">
          <div className="w-full aspect-video bg-gradient-to-br from-[#FFDEE9] to-[#B5FFFC]" />
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
            <div className="font-display text-4xl font-bold">Generative Video & 3D Workflow</div>
            <div className="flex items-center gap-2 mt-3 text-xs font-mono">
              <span className="bg-white/20 px-3 py-1 rounded-full">Video</span>
              <span>2024-06-18</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-4">
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="font-display font-bold text-lg mb-2">Background</div>
              <p className="text-sm text-gray-600">
                A boutique studio needed a faster pipeline to ship cinematic product
                teasers with minimal resources.
              </p>
            </div>
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="font-display font-bold text-lg mb-2">Workflow</div>
              <p className="text-sm text-gray-600">
                AI storyboard generation, asset creation, and automated compositing for
                rapid iteration.
              </p>
            </div>
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="font-display font-bold text-lg mb-2">Results</div>
              <p className="text-sm text-gray-600">
                Reduced production time by 40% while maintaining studio-grade quality.
              </p>
            </div>
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="font-display font-bold text-lg mb-2">Gallery</div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="aspect-video rounded-xl bg-gray-100" />
                <div className="aspect-video rounded-xl bg-gray-100" />
                <div className="aspect-video rounded-xl bg-gray-100" />
                <div className="aspect-video rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="font-display font-bold text-lg mb-3">Tools Used</div>
              <div className="space-y-2 text-sm text-gray-600">
                {tools.map((tool) => (
                  <div key={tool.name} className="flex items-center justify-between">
                    <span>{tool.name}</span>
                    <span className="text-xs text-[#002FA7]">{tool.pricing}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="font-display font-bold text-lg mb-3">Key Metrics</div>
              <div className="grid grid-cols-2 gap-3 text-center">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl bg-gray-50 p-3">
                    <div className="text-lg font-bold">{metric.value}</div>
                    <div className="text-[10px] text-gray-500">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/90 rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="font-display font-bold text-lg mb-3">Related</div>
              <div className="space-y-2">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-sm font-bold">AI Product Teasers</div>
                  <div className="text-xs text-gray-500">Video • 3D</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="text-sm font-bold">Creative Automation</div>
                  <div className="text-xs text-gray-500">Workflow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
