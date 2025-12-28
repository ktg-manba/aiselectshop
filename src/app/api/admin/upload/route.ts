import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { applyAuthCookies, requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set(["tool", "case"]);

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");
  const type = String(formData.get("type") || "tool");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const dir = path.join(process.cwd(), "public", "uploads", type);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);

  const response = NextResponse.json({ url: `/uploads/${type}/${filename}` });
  return applyAuthCookies(response, auth.session);
}
