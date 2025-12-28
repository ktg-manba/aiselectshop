import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = createPublicSupabaseClient();
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const tag = url.searchParams.get("tag");
  const featured = url.searchParams.get("featured");

  let query = supabase
    .from("cases")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("case_type_en", category);
  }
  if (featured === "1") {
    query = query.eq("is_featured", true);
  }
  if (tag) {
    query = query.or(`subtags_en.cs.{${tag}},tags_en.cs.{${tag}}`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Failed to load cases" }, { status: 500 });
  }
  return NextResponse.json({ data: data || [] });
}
