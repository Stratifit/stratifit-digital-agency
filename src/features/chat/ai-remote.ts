import {
  matchKnowledge,
  type ChatProvider,
  type ChatRequest,
  type ChatResponse,
} from "./ai";

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
 * response style, and forces an explicit ESCALATE marker only when the
 * question is genuinely outside the knowledge base — so the app can hand
 * the visitor to a human instead of letting the model invent facts.
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
    `ALWAYS respond in the visitor's language. The visitor's locale is: ${locale}. Translate your answer into that language even if the knowledge below is in English.`,
    style ? STYLE_GUIDE[style] ?? "" : "",
    "Answer ONLY from the approved knowledge below. Do not invent prices, discounts, timelines, availability, testimonials, results, guarantees, or human approvals.",
    "Keep answers concise (2-5 sentences). When the question is vague, ask one clarifying question before answering.",
    "Be helpful: if a question is close to the knowledge, answer with what the knowledge supports and offer the relevant next step (e.g. contact form, pricing page).",
    "Reply with the exact word ESCALATE only when the question is clearly outside Stratifit's business (unrelated topics, personal advice, confidential data) or when the knowledge genuinely does not cover it.",
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
 *
 * When the provider itself fails (network error, timeout, rate limit 429,
 * 5xx), fall back to the deterministic local knowledge matcher instead of
 * escalating, so visitors still get an answer from the knowledge base.
 * A clean ESCALATE from the model still escalates (question out of scope).
 */
export class RemoteChatProvider implements ChatProvider {
  async generateResponse(input: ChatRequest): Promise<ChatResponse> {
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = normalizeBaseUrl(process.env.AI_BASE_URL);
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    if (!apiKey) {
      return matchKnowledge(input);
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
      return matchKnowledge(input);
    }

    if (!res.ok) {
      console.error(`Chat AI provider HTTP ${res.status}`);
      return matchKnowledge(input);
    }

    let body: { choices?: { message?: { content?: string } }[] };
    try {
      body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    } catch {
      return matchKnowledge(input);
    }

    const content = body.choices?.[0]?.message?.content?.trim() ?? "";

    if (content.toUpperCase() === "ESCALATE" || !content) {
      return { content: "", escalated: true };
    }

    return { content, escalated: false };
  }
}
