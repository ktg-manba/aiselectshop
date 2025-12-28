import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = createAdminSupabaseClient();
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("category_id");
  const subTag = url.searchParams.get("sub_tag");
  const featured = url.searchParams.get("featured");

  let query = supabase
    .from("tools")
    .select("*, categories(name_en,name_zh,slug)")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  if (featured === "1") {
    query = query.eq("is_featured", true);
  }
  if (subTag) {
    query = query.or(`subtags_en.cs.{${subTag}},tags_en.cs.{${subTag}}`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Failed to load tools" }, { status: 500 });
  }
  const mapped =
    data?.map((row: any) => ({
      ...row,
      category_name_en: row.categories?.name_en || null,
      category_name_zh: row.categories?.name_zh || null,
      category_slug: row.categories?.slug || null,
    })) ?? [];
  return NextResponse.json({ data: mapped });
}
