import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { ChatMessage } from "../../types";
import { useSession } from "../session/useSession";
import { ChatContext, type ChatContextValue } from "./ChatContext";

export function ChatProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const [chatId, setChatId] = useState<string | null>(null);
  const [recipientPhone, setRecipientPhone] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const openChat = useCallback((phone: string) => {
    setRecipientPhone(phone.trim());
    setChatId(null);
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (_text: string) => {
    setIsSending(true);
    setError(null);
    try {
      // API integration in a later step
    } finally {
      setIsSending(false);
    }
  }, []);

  const resetChat = useCallback(() => {
    setChatId(null);
    setRecipientPhone(null);
    setMessages([]);
    setError(null);
    setIsSending(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      resetChat();
    }
  }, [isAuthenticated, resetChat]);

  const value: ChatContextValue = {
    chatId,
    recipientPhone,
    messages,
    error,
    isSending,
    openChat,
    sendMessage,
    resetChat,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
