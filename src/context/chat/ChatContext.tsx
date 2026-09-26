import { createContext } from "react";
import type { ChatMessage } from "../../types";

export interface ChatContextValue {
  chatId: string | null;
  recipientPhone: string | null;
  messages: ChatMessage[];
  error: string | null;
  isSending: boolean;
  openChat: (phone: string) => void;
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);
