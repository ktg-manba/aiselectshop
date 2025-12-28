import { NextResponse } from "next/server";
import { getRefreshTokenFromRequest, getTokenFromRequest } from "@/lib/auth";
import { createAdminSupabaseClient, createPublicSupabaseClient } from "@/lib/supabase";

type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
};

type RequireAdminResult =
  | { ok: true; admin: { id: string; email: string; name: string | null; is_admin: boolean }; session?: AuthSession }
  | { ok: false; response: NextResponse };

function unauthorized(): RequireAdminResult {
  return {
    ok: false,
    response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  };
}

export function applyAuthCookies(response: NextResponse, session?: AuthSession) {
  if (!session) return response;
  const accessMaxAge =
    typeof session.expires_in === "number" ? session.expires_in : 60 * 60;
  response.cookies.set("auth-token", session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: accessMaxAge,
    path: "/",
  });
  response.cookies.set("refresh-token", session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}

async function refreshAdminSession(refreshToken: string | null) {
  if (!refreshToken) return null;
  const publicClient = createPublicSupabaseClient();
  const { data: refreshed, error: refreshError } =
    await publicClient.auth.refreshSession({ refresh_token: refreshToken });
  if (refreshError || !refreshed.session || !refreshed.session.user) {
    return null;
  }
  const adminClient = createAdminSupabaseClient();
  const { data: user, error: userError } = await adminClient
    .from("users")
    .select("id, email, name, is_admin")
    .eq("id", refreshed.session.user.id)
    .maybeSingle();
  if (userError || !user || !user.is_admin) {
    return null;
  }
  return { user, session: refreshed.session };
}

export async function requireAdmin(request: Request): Promise<RequireAdminResult> {
  const token = getTokenFromRequest(request);
  const refreshToken = getRefreshTokenFromRequest(request);
  if (!token) {
    const refreshed = await refreshAdminSession(refreshToken);
    if (!refreshed) return unauthorized();
    return { ok: true, admin: refreshed.user, session: refreshed.session };
  }
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    const refreshed = await refreshAdminSession(refreshToken);
    if (!refreshed) return unauthorized();
    return { ok: true, admin: refreshed.user, session: refreshed.session };
  }
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, name, is_admin")
    .eq("id", data.user.id)
    .maybeSingle();
  if (userError || !user || !user.is_admin) {
    return unauthorized();
  }
  return { ok: true, admin: user };
}
