import Link from "next/link";

const tools = [
  { name: "Claude 3.5", category: "AI Coding", updated: "2d", status: "Active" },
  { name: "Cursor", category: "AI Coding", updated: "1d", status: "Draft" },
  { name: "Devin", category: "AI Coding", updated: "6h", status: "Hidden" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-600",
  Draft: "bg-blue-100 text-blue-600",
  Hidden: "bg-gray-100 text-gray-600",
};

export default function AdminToolsPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="font-display text-2xl font-bold">Tools</div>
              <div className="text-sm text-gray-500">Manage your AI catalog.</div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/tools/new"
                className="bg-[#002FA7] text-white rounded-full px-4 py-2 text-sm"
              >
                New Tool
              </Link>
              <Link
                href="/admin/login"
                className="border border-gray-200 rounded-full px-4 py-2 text-sm"
              >
                Logout
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <input
              className="flex-1 min-w-[240px] rounded-full bg-gray-100 border-none px-4 py-2 text-sm"
              placeholder="Search tools..."
              type="text"
            />
            <button className="border border-gray-200 rounded-full px-4 py-2 text-sm">
              Filter
            </button>
            <button className="border border-gray-200 rounded-full px-4 py-2 text-sm">
              Sort
            </button>
          </div>

          <div className="space-y-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="bg-white rounded-xl p-3 flex items-center justify-between border border-gray-100"
              >
                <div>
                  <div className="font-bold text-sm">{tool.name}</div>
                  <div className="text-xs text-gray-500">
                    {tool.category} • Updated {tool.updated}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[tool.status]}`}>
                  {tool.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
