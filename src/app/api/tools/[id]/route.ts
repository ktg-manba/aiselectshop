import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createPublicSupabaseClient();
  const { id } = await params;
  const { data, error } = await supabase
    .from("tools")
    .select("*, categories(name_en,name_zh,slug)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const tool = {
    ...data,
    category_name_en: data.categories?.name_en || null,
    category_name_zh: data.categories?.name_zh || null,
    category_slug: data.categories?.slug || null,
  };
  return NextResponse.json({ data: tool });
}
