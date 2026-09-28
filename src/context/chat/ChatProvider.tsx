import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  deleteNotification,
  receiveNotification,
  sendMessage as apiSendMessage,
} from "../../api/greenApi";
import { phoneToChatId } from "../../lib/normalizePhone";
import { parseIncomingText } from "../../lib/notification";
import type { ChatMessage } from "../../types";
import { MAX_MESSAGE_LENGTH } from "../../types";
import { useSession } from "../session/useSession";
import { ChatContext, type ChatContextValue } from "./ChatContext";

export function ChatProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, apiUrl, idInstance, apiTokenInstance } = useSession();
  const [chatId, setChatId] = useState<string | null>(null);
  const [recipientPhone, setRecipientPhone] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const chatIdRef = useRef(chatId);

  chatIdRef.current = chatId;

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.idMessage === message.idMessage)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  const openChat = useCallback((phone: string) => {
    const trimmed = phone.trim();
    try {
      const id = phoneToChatId(trimmed);
      setRecipientPhone(trimmed);
      setChatId(id);
      setMessages([]);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неверный номер телефона");
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const currentChatId = chatIdRef.current;
      if (!currentChatId) {
        return;
      }

      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setError(`Сообщение не длиннее ${MAX_MESSAGE_LENGTH} символов`);
        return;
      }

      setIsSending(true);
      setError(null);
      try {
        const credentials = { apiUrl, idInstance, apiTokenInstance };
        const result = await apiSendMessage(credentials, currentChatId, trimmed);
        appendMessage({
          idMessage: result.idMessage,
          text: trimmed,
          direction: "out",
          timestamp: Math.floor(Date.now() / 1000),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Не удалось отправить сообщение");
      } finally {
        setIsSending(false);
      }
    },
    [apiUrl, idInstance, apiTokenInstance, appendMessage],
  );

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

  useEffect(() => {
    if (!isAuthenticated || !chatId) {
      return;
    }

    const credentials = { apiUrl, idInstance, apiTokenInstance };
    let cancelled = false;

    const poll = async () => {
      while (!cancelled && chatIdRef.current) {
        try {
          const notification = await receiveNotification(credentials);
          if (cancelled || !chatIdRef.current) {
            break;
          }

          if (notification) {
            await deleteNotification(credentials, notification.receiptId);
            const incoming = parseIncomingText(notification.body);
            if (incoming) {
              appendMessage(incoming);
            }
          }
        } catch {
          if (cancelled) {
            break;
          }
        }
      }
    };

    void poll();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, chatId, apiUrl, idInstance, apiTokenInstance, appendMessage]);

  const value: ChatContextValue = {
    chatId,
    recipientPhone,
    messages,
    error,
    isSending,
    openChat,
    sendMessage,
    resetChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
