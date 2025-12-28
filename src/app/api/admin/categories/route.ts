import { NextResponse } from "next/server";
import { applyAuthCookies, requireAdmin } from "@/lib/admin";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const supabase = createAdminSupabaseClient();
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true });
  if (categoriesError) {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
  const { data: subtagsData, error: subtagsError } = await supabase
    .from("category_subtags")
    .select("*")
    .order("order_index", { ascending: true });
  if (subtagsError) {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
  const categories = (categoriesData || []).map((category: any) => ({
    ...category,
    subTags: [],
  }));
  const map = new Map(categories.map((item) => [item.id, item]));
  (subtagsData || []).forEach((subtag: any) => {
    const parent = map.get(subtag.category_id);
    if (!parent) return;
    parent.subTags.push({
      id: subtag.id,
      name_en: subtag.name_en,
      name_zh: subtag.name_zh,
      order_index: subtag.order_index,
    });
  });
  const response = NextResponse.json({ data: categories });
  return applyAuthCookies(response, auth.session);
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("categories")
    .insert({
      slug: body.slug,
      name_en: body.name_en,
      name_zh: body.name_zh,
      description_en: body.description_en || null,
      description_zh: body.description_zh || null,
      icon: body.icon || null,
      order_index: Number.isFinite(Number(body.order_index)) ? Number(body.order_index) : 0,
    })
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }

  const response = NextResponse.json({ data });
  return applyAuthCookies(response, auth.session);
}
