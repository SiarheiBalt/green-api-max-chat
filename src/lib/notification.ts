import type { ChatMessage, GreenApiWebhookBody } from "../types";

/**
 * Maps a receiveNotification body to a chat message when it is an incoming text message.
 * Does not filter by chatId (MVP: any text incoming on the instance may be shown in the open chat).
 */
export function parseIncomingText(body: GreenApiWebhookBody): ChatMessage | null {
  if (body.typeWebhook !== "incomingMessageReceived") {
    return null;
  }

  const messageData = body.messageData;
  if (!messageData || messageData.typeMessage !== "textMessage") {
    return null;
  }

  const rawText = messageData.textMessageData?.textMessage;
  if (typeof rawText !== "string") {
    return null;
  }

  const text = rawText.trim();
  if (!text) {
    return null;
  }

  const idMessage = body.idMessage;
  if (typeof idMessage !== "string" || !idMessage) {
    return null;
  }

  const ts =
    typeof body.timestamp === "number" && Number.isFinite(body.timestamp)
      ? body.timestamp
      : Math.floor(Date.now() / 1000);

  return {
    idMessage,
    text,
    direction: "in",
    timestamp: ts,
  };
}
