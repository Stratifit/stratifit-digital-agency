export type SenderType = "visitor" | "ai" | "admin" | "system";

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  content: string;
  content_format: string;
  created_at: string;
  is_internal: boolean;
}

export interface ChatConversation {
  id: string;
  status: "open" | "waiting_for_admin" | "waiting_for_visitor" | "resolved" | "archived";
  mode: "ai" | "human" | "paused" | "closed";
  source_page: string | null;
  last_message_at: string;
  created_at: string;
}

export type ConversationEventType =
  | "created"
  | "escalated"
  | "assigned"
  | "human_takeover"
  | "returned_to_ai"
  | "resolved"
  | "archived"
  | "email_sent";
