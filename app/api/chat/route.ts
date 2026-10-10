import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat-knowledge";

/** Ordered fallback chain — newer flash models get demand spikes. */
const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-lite-latest",
];
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

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
    },
  });

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          signal: AbortSignal.timeout(20000),
        },
      );
      if (!res.ok) continue; // overloaded/retired → next model
      const data = await res.json();
      const reply: string =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? "")
          .join("") ?? "";
      if (reply) return NextResponse.json({ reply });
    } catch {
      // timeout/network error → next model
    }
  }
  return NextResponse.json({ error: "upstream" }, { status: 502 });
}
