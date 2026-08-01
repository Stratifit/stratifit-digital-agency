import type { KnowledgeEntry } from "./knowledge";

export interface ChatRequest {
  message: string;
  locale: string;
  knowledge: KnowledgeEntry[];
}

export interface ChatResponse {
  content: string;
  escalated: boolean;
}

export interface ChatProvider {
  generateResponse(input: ChatRequest): Promise<ChatResponse>;
}

const STOP_WORDS = new Set([
  "what", "is", "your", "how", "do", "does", "can", "are", "the", "a", "an",
  "to", "for", "of", "from", "with", "my", "i", "we", "you", "on", "in", "at",
  "about", "and", "or", "it", "this", "that", "me", "us", "not", "have", "has",
  "would", "will", "should", "please", "tell", "need", "want", "much", "many",
]);

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
}

function contentTokens(text: string): Set<string> {
  return new Set(
    normalize(text)
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
  );
}

/**
 * Knowledge-based fallback provider. Answers ONLY when the question clearly
 * overlaps approved content; otherwise escalates. Never invents facts.
 * Replace with a real model provider once AI_API_KEY is configured.
 */
export class KnowledgeChatProvider implements ChatProvider {
  async generateResponse(input: ChatRequest): Promise<ChatResponse> {
    const queryTokens = contentTokens(input.message);

    let best: KnowledgeEntry | null = null;
    let bestScore = 0;

    for (const entry of input.knowledge) {
      const primary = contentTokens(`${entry.question ?? ""} ${entry.title ?? ""}`);
      const secondary = contentTokens(`${entry.answer ?? ""} ${entry.content ?? ""}`);

      let score = 0;
      for (const token of queryTokens) {
        if (primary.has(token)) score += 2;
        else if (secondary.has(token)) score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }

    if (best && bestScore >= 4) {
      const answer = best.answer ?? best.content ?? "";
      if (answer.trim()) {
        return { content: answer, escalated: false };
      }
    }

    return { content: "", escalated: true };
  }
}

export async function getChatProvider(): Promise<ChatProvider> {
  if (process.env.AI_API_KEY) {
    const { RemoteChatProvider } = await import("./ai-remote");
    return new RemoteChatProvider();
  }
  return new KnowledgeChatProvider();
}
