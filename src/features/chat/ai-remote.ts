import type { ChatProvider, ChatRequest, ChatResponse } from "./ai";

const STYLE_GUIDE: Record<string, string> = {
  professional:
    "Be professional, precise, and businesslike. Use clear, confident wording.",
  friendly:
    "Be warm, approachable, and conversational. Use a welcoming tone.",
  concise:
    "Be short and to the point. Prefer brief answers over long explanations.",
};

/**
 * Custom reply behavior. The system prompt gives the assistant a Stratifit
 * persona, keeps it grounded in approved knowledge, applies the configured
 * response style, and forces an explicit ESCALATE marker when the question
 * is not covered — so the app can hand the visitor to a human instead of
 * letting the model invent facts.
 */
export function buildSystemPrompt(
  knowledge: ChatRequest["knowledge"],
  locale: string,
  style?: string
): string {
  const knowledgeText = knowledge
    .map((k) => `- ${k.title ?? k.question}: ${k.content ?? k.answer}`)
    .join("\n");

  return [
    "You are the Stratifit support assistant, an expert on Stratifit's digital agency services.",
    `You respond in the visitor's language. The visitor's locale is: ${locale}.`,
    style ? STYLE_GUIDE[style] ?? "" : "",
    "Answer ONLY from the approved knowledge below.",
    "Keep answers concise (2-5 sentences). Ask one clarifying question when the request is vague.",
    "Never invent prices, discounts, timelines, availability, testimonials, results, guarantees, or human approvals.",
    "If the knowledge does not cover the question, reply with the exact word: ESCALATE",
    `Approved knowledge:\n${knowledgeText}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Accept `AI_BASE_URL` with or without the scheme (e.g. `//host/v1`). */
export function normalizeBaseUrl(raw?: string): string {
  let base = (raw ?? "https://api.openai.com/v1").trim().replace(/\/+$/, "");
  if (base.startsWith("//")) base = `https:${base}`;
  else if (!/^https?:\/\//i.test(base)) base = `https://${base}`;
  return base;
}

/**
 * Remote provider used when AI_API_KEY is configured. Calls a compatible
 * OpenAI-style chat completions endpoint (e.g. Groq). The response must stay
 * grounded in the approved knowledge provided in the system prompt.
 */
export class RemoteChatProvider implements ChatProvider {
  async generateResponse(input: ChatRequest): Promise<ChatResponse> {
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = normalizeBaseUrl(process.env.AI_BASE_URL);
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    if (!apiKey) {
      return { content: "", escalated: true };
    }

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      {
        role: "system",
        content: buildSystemPrompt(input.knowledge, input.locale, input.style),
      },
    ];

    for (const entry of input.history ?? []) {
      messages.push({ role: entry.role, content: entry.content });
    }

    messages.push({ role: "user", content: input.message });

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          messages,
        }),
        signal: AbortSignal.timeout(20_000),
      });
    } catch (error) {
      console.error(
        "Chat AI provider error:",
        error instanceof Error ? error.message : error
      );
      return { content: "", escalated: true };
    }

    if (!res.ok) {
      console.error(`Chat AI provider HTTP ${res.status}`);
      return { content: "", escalated: true };
    }

    let body: { choices?: { message?: { content?: string } }[] };
    try {
      body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    } catch {
      return { content: "", escalated: true };
    }

    const content = body.choices?.[0]?.message?.content?.trim() ?? "";

    if (content.toUpperCase() === "ESCALATE" || !content) {
      return { content: "", escalated: true };
    }

    return { content, escalated: false };
  }
}
