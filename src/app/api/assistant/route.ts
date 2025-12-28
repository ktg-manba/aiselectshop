import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase";

export const runtime = "nodejs";

type ToolMatch = {
  id: string;
  name_en: string;
  name_zh: string;
  official_url: string | null;
};

function normalize(text: string) {
  return text.toLowerCase().trim();
}

export async function POST(request: Request) {
  const { message } = await request.json();
  const prompt = String(message || "").trim();
  if (!prompt) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY is missing" }, { status: 500 });
  }

  let matches: ToolMatch[] = [];
  try {
    const supabase = createPublicSupabaseClient();
    const { data } = await supabase
      .from("tools")
      .select("id,name_en,name_zh,official_url")
      .limit(200);
    const needle = normalize(prompt);
    matches = (data || []).filter((tool: ToolMatch) => {
      const en = normalize(tool.name_en || "");
      const zh = normalize(tool.name_zh || "");
      return (en && needle.includes(en)) || (zh && needle.includes(zh));
    });
  } catch {
    // Ignore tool lookup errors; continue with LLM response.
  }

  const toolHints =
    matches.length > 0
      ? matches
          .map((tool) => {
            const internal = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/tools/${tool.id}`;
            return `- ${tool.name_en} / ${tool.name_zh} (${internal})`;
          })
          .join("\n")
      : "";

  const systemPrompt = [
    "You are the AI assistant for AI Select Shop.",
    "Answer concisely in the same language as the user.",
    "If tools from our catalog are relevant, recommend them first and include their site links.",
    toolHints ? `Catalog matches:\n${toolHints}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "AI Select Shop",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "OpenRouter request failed" }, { status: 500 });
  }

  const payload = await response.json();
  const reply =
    payload?.choices?.[0]?.message?.content ||
    payload?.choices?.[0]?.text ||
    "";

  return NextResponse.json({
    reply: String(reply || "").trim(),
    matches: matches.map((tool) => ({
      id: tool.id,
      name_en: tool.name_en,
      name_zh: tool.name_zh,
      internal_url: `/tools/${tool.id}`,
      official_url: tool.official_url,
    })),
  });
}
