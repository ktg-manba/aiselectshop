"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminToolsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,47,167,0.25)]">
          <div className="font-display text-2xl font-bold">Redirecting…</div>
          <div className="text-sm text-gray-500 mt-2">Opening admin console.</div>
        </div>
      </div>
    </div>
  );
}
