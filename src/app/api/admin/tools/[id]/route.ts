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

function normalizeText(value: unknown) {
  if (value === undefined) return undefined;
  if (value === "") return null;
  return value;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const supabase = createAdminSupabaseClient();
  const { id } = await params;
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 });
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
    name_en: normalizeText(body.name_en),
    name_zh: normalizeText(body.name_zh),
    description_en: normalizeText(body.description_en),
    description_zh: normalizeText(body.description_zh),
    detailed_intro_en: normalizeText(body.detailed_intro_en),
    detailed_intro_zh: normalizeText(body.detailed_intro_zh),
    official_url: normalizeText(body.official_url),
    logo_url: normalizeText(body.logo_url),
    category_id: normalizeText(body.category_id),
    pricing_type: normalizeText(body.pricing_type),
  };
  if (body.subtags_en !== undefined) payload.subtags_en = asArray(body.subtags_en);
  if (body.subtags_zh !== undefined) payload.subtags_zh = asArray(body.subtags_zh);
  if (typeof body.is_featured === "boolean") payload.is_featured = body.is_featured;
  if (Number.isFinite(Number(body.view_count))) payload.view_count = Number(body.view_count);

  const { data, error } = await supabase
    .from("tools")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update tool" },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ data });
  return applyAuthCookies(response, auth.session);
}
