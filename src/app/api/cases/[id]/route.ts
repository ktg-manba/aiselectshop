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
    .from("cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data });
}
