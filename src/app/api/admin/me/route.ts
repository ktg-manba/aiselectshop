import { NextResponse } from "next/server";
import { applyAuthCookies, requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  const response = NextResponse.json({ data: auth.admin });
  return applyAuthCookies(response, auth.session);
}
