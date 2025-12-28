import { NextResponse } from "next/server";
import { applyAuthCookies, requireAdmin } from "@/lib/admin";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const supabase = createAdminSupabaseClient();
  const { id } = await params;
  const { error } = await supabase.from("category_subtags").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to delete subtag" }, { status: 500 });
  }
  const response = NextResponse.json({ ok: true });
  return applyAuthCookies(response, auth.session);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const supabase = createAdminSupabaseClient();
  const body = await request.json();
  const { id } = await params;

  const payload: Record<string, unknown> = {
    name_en: body.name_en,
    name_zh: body.name_zh,
    order_index: Number.isFinite(Number(body.order_index)) ? Number(body.order_index) : 0,
  };

  const { data, error } = await supabase
    .from("category_subtags")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: "Failed to update subtag" }, { status: 500 });
  }

  const response = NextResponse.json({ data });
  return applyAuthCookies(response, auth.session);
}
