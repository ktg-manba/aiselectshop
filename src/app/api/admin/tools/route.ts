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
    .from("tools")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: "Failed to load tools" }, { status: 500 });
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
    .from("tools")
    .insert({
      name_en: body.name_en,
      name_zh: body.name_zh,
      description_en: body.description_en || null,
      description_zh: body.description_zh || null,
      detailed_intro_en: body.detailed_intro_en || null,
      detailed_intro_zh: body.detailed_intro_zh || null,
      official_url: body.official_url || null,
      logo_url: body.logo_url || null,
      category_id: body.category_id || null,
      pricing_type: body.pricing_type || null,
      subtags_en: asArray(body.subtags_en),
      subtags_zh: asArray(body.subtags_zh),
      is_featured: body.is_featured === true,
      view_count: Number.isFinite(Number(body.view_count)) ? Number(body.view_count) : 0,
    })
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
  }

  const response = NextResponse.json({ data });
  return applyAuthCookies(response, auth.session);
}
