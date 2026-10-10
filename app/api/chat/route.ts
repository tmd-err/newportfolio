import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat-knowledge";

const MODEL = "gemini-3.8-flash";
const MAX_HISTORY = 12;
const MAX_LEN = 2000;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const clean = messages
    .filter(
      (m) =>
        (m?.role === "user" || m?.role === "assistant") &&
        typeof m?.content === "string",
    )
    .slice(-MAX_HISTORY);
  if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const contents = clean.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.slice(0, MAX_LEN) }],
  }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemPrompt() }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }),
      },
    );
    if (!res.ok) {
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    const data = await res.json();
    const reply: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("") ?? "";
    if (!reply) {
      return NextResponse.json({ error: "empty" }, { status: 502 });
    }
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
