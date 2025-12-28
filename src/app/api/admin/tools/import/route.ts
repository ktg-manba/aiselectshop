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
    const tagsEn = parseJsonArrayField(row.tags_en);
    const tagsZh = parseJsonArrayField(row.tags_zh);
    const subtagsEn = parseJsonArrayField(row.subtags_en);
    const subtagsZh = parseJsonArrayField(row.subtags_zh);

    const { error } = await supabase.from("tools").insert({
      name_en: row.name_en,
      name_zh: row.name_zh,
      description_en: row.description_en || null,
      description_zh: row.description_zh || null,
      detailed_intro_en: row.detailed_intro_en || null,
      detailed_intro_zh: row.detailed_intro_zh || null,
      official_url: row.official_url || null,
      logo_url: row.logo_url || null,
      category_id: row.category_id || null,
      pricing_type: row.pricing_type || null,
      tags_en: tagsEn,
      tags_zh: tagsZh,
      subtags_en: subtagsEn,
      subtags_zh: subtagsZh,
      is_featured: row.is_featured === "true" || row.is_featured === "1",
      view_count: Number.isFinite(Number(row.view_count)) ? Number(row.view_count) : 0,
    });
    if (error) {
      return NextResponse.json({ error: "Failed to import tools" }, { status: 500 });
    }
    inserted += 1;
  }

  const response = NextResponse.json({ inserted });
  return applyAuthCookies(response, auth.session);
}
