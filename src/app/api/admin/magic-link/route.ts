import { NextResponse } from "next/server";
import crypto from "crypto";
import { signToken } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const supabase = createAdminSupabaseClient();
  const { data: tokenRow, error: tokenError } = await supabase
    .from("admin_magic_tokens")
    .select("id, user_id")
    .eq("token_hash", tokenHash)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (tokenError) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
  if (!tokenRow) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, is_admin")
    .eq("id", tokenRow.user_id)
    .maybeSingle();
  if (userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!user || !user.is_admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await supabase
    .from("admin_magic_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", tokenRow.id);
  const jwt = signToken({ adminId: user.id, email: user.email, role: "admin" });

  const response = NextResponse.redirect(new URL("/admin/tools", request.url));
  response.cookies.set("auth-token", jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
