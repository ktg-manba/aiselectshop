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
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
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
    slug: body.slug,
    name_en: body.name_en,
    name_zh: body.name_zh,
    description_en: body.description_en || null,
    description_zh: body.description_zh || null,
    icon: body.icon || null,
    order_index: Number.isFinite(Number(body.order_index)) ? Number(body.order_index) : 0,
  };

  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }

  const response = NextResponse.json({ data });
  return applyAuthCookies(response, auth.session);
}
