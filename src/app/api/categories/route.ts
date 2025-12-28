import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createPublicSupabaseClient();
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
    id: category.id,
    slug: category.slug,
    name: { en: category.name_en, zh: category.name_zh },
    description: { en: category.description_en, zh: category.description_zh },
    icon: category.icon,
    order_index: category.order_index,
    subTags: [] as Array<{
      id: string;
      name: { en: string; zh: string };
      order_index?: number | null;
    }>,
  }));
  const map = new Map(categories.map((item) => [item.id, item]));
  (subtagsData || []).forEach((subtag: any) => {
    const parent = map.get(subtag.category_id);
    if (!parent) return;
    parent.subTags.push({
      id: subtag.id,
      name: { en: subtag.name_en, zh: subtag.name_zh },
      order_index: subtag.order_index,
    });
  });
  return NextResponse.json({ data: categories });
}
