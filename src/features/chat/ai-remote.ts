import type { ChatProvider, ChatRequest, ChatResponse } from "./ai";

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

    const knowledgeText = input.knowledge
      .map((k) => `- ${k.title ?? k.question}: ${k.content ?? k.answer}`)
      .join("\n");

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: [
              "You are the Stratifit support assistant.",
              "Answer ONLY from the approved knowledge below.",
              "Never invent prices, timelines, guarantees, or results.",
              "If the knowledge does not cover the question, reply with the exact word: ESCALATE",
              `Knowledge:\n${knowledgeText}`,
            ].join("\n"),
          },
          { role: "user", content: input.message },
        ],
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
