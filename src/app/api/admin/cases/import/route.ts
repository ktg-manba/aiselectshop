import { NextResponse } from "next/server";
import { applyAuthCookies, requireAdmin } from "@/lib/admin";
import { parseCsv, parseJsonArrayField } from "@/lib/csv";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const supabase = createAdminSupabaseClient();

  const contentType = request.headers.get("content-type") || "";
  const csvText = contentType.includes("application/json")
    ? String((await request.json()).csv || "")
    : await request.text();

  if (!csvText.trim()) {
    return NextResponse.json({ error: "CSV content is required" }, { status: 400 });
  }

  const records = parseCsv(csvText);
  let inserted = 0;

  for (const row of records) {
    const { error } = await supabase.from("cases").insert({
      title_en: row.title_en,
      title_zh: row.title_zh,
      description_en: row.description_en || null,
      description_zh: row.description_zh || null,
      detailed_content_en: row.detailed_content_en || null,
      detailed_content_zh: row.detailed_content_zh || null,
      thumbnail_url: row.thumbnail_url || null,
      case_type_en: row.case_type_en || null,
      case_type_zh: row.case_type_zh || null,
      tags_en: parseJsonArrayField(row.tags_en),
      tags_zh: parseJsonArrayField(row.tags_zh),
      subtags_en: parseJsonArrayField(row.subtags_en),
      subtags_zh: parseJsonArrayField(row.subtags_zh),
      tools_en: parseJsonArrayField(row.tools_en),
      tools_zh: parseJsonArrayField(row.tools_zh),
      results_speed: row.results_speed || null,
      results_cost: row.results_cost || null,
      results_match: row.results_match || null,
      is_featured: row.is_featured === "true" || row.is_featured === "1",
      view_count: Number.isFinite(Number(row.view_count)) ? Number(row.view_count) : 0,
    });
    if (error) {
      return NextResponse.json({ error: "Failed to import cases" }, { status: 500 });
    }
    inserted += 1;
  }

  const response = NextResponse.json({ inserted });
  return applyAuthCookies(response, auth.session);
}
