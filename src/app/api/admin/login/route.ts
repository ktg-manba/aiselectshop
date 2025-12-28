import { NextResponse } from "next/server";
import { applyAuthCookies } from "@/lib/admin";
import { createAdminSupabaseClient, createPublicSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();

  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const adminClient = createAdminSupabaseClient();
  const { data: admin, error: adminError } = await adminClient
    .from("users")
    .select("id, email, name, is_admin")
    .eq("id", data.user.id)
    .maybeSingle();
  if (adminError || !admin || !admin.is_admin) {
    return NextResponse.json({ error: "Not an admin" }, { status: 403 });
  }

  const response = NextResponse.json({ data: admin });
  return applyAuthCookies(response, data.session);
}
