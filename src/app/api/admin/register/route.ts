import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim();

  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const adminSupabase = createAdminSupabaseClient();
  const { data: existing, error: existingError } = await adminSupabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existingError) {
    return NextResponse.json({ error: "Failed to validate user" }, { status: 500 });
  }
  if (existing?.id) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || "Failed to create user" }, { status: 400 });
  }

  const { data: profile, error: profileError } = await adminSupabase
    .from("users")
    .upsert(
      {
        id: data.user.id,
        email,
        password_hash: "supabase_auth",
        name: name || null,
        is_admin: true,
      },
      { onConflict: "email" }
    )
    .select("id, email, name, is_admin, created_at")
    .single();
  if (profileError) {
    return NextResponse.json({ error: "Failed to create admin profile" }, { status: 500 });
  }

  return NextResponse.json({ data: profile });
}
