import type { ChatProvider, ChatRequest, ChatResponse } from "./ai";

export function buildSystemPrompt(
  knowledge: ChatRequest["knowledge"],
  locale: string
): string {
  const knowledgeText = knowledge
    .map((k) => `- ${k.title ?? k.question}: ${k.content ?? k.answer}`)
    .join("\n");

  return [
    "You are the Stratifit support assistant.",
    `You respond in the visitor's language. The visitor's locale is: ${locale}.`,
    "Answer ONLY from the approved knowledge below.",
    "Never invent prices, discounts, timelines, availability, testimonials, results, guarantees, or human approvals.",
    "If the knowledge does not cover the question, reply with the exact word: ESCALATE",
    `Approved knowledge:\n${knowledgeText}`,
  ].join("\n");
}

/**
 * Remote provider used when AI_API_KEY is configured. Calls a compatible
 * OpenAI-style chat completions endpoint. The response must stay grounded in
 * the approved knowledge provided in the system prompt.
 */
export class RemoteChatProvider implements ChatProvider {
  async generateResponse(input: ChatRequest): Promise<ChatResponse> {
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: buildSystemPrompt(input.knowledge, input.locale) },
    ];

    for (const entry of input.history ?? []) {
      messages.push({ role: entry.role, content: entry.content });
    }

    messages.push({ role: "user", content: input.message });

    const res = await fetch(`${baseUrl}/chat/completions`, {
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
    });

    if (!res.ok) {
      return { content: "", escalated: true };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = body.choices?.[0]?.message?.content?.trim() ?? "";

    if (content.toUpperCase() === "ESCALATE" || !content) {
      return { content: "", escalated: true };
    }

    return { content, escalated: false };
  }
}
