import { NextResponse } from "next/server";
import { applyAuthCookies, requireAdmin } from "@/lib/admin";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

function asArray(value: unknown) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  if (typeof value === "string") {
    return value.split("|").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: "Failed to load cases" }, { status: 500 });
  }
  const response = NextResponse.json({ data: data || [] });
  return applyAuthCookies(response, auth.session);
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("cases")
    .insert({
      title_en: body.title_en,
      title_zh: body.title_zh,
      description_en: body.description_en || null,
      description_zh: body.description_zh || null,
      detailed_content_en: body.detailed_content_en || null,
      detailed_content_zh: body.detailed_content_zh || null,
      thumbnail_url: body.thumbnail_url || null,
      case_type_en: body.case_type_en || null,
      case_type_zh: body.case_type_zh || null,
      tags_en: asArray(body.tags_en),
      tags_zh: asArray(body.tags_zh),
      subtags_en: asArray(body.subtags_en),
      subtags_zh: asArray(body.subtags_zh),
      tools_en: asArray(body.tools_en),
      tools_zh: asArray(body.tools_zh),
      is_featured: body.is_featured === true,
      view_count: Number.isFinite(Number(body.view_count)) ? Number(body.view_count) : 0,
    })
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }

  const response = NextResponse.json({ data });
  return applyAuthCookies(response, auth.session);
}
