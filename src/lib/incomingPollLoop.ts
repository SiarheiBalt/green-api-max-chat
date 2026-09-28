import { deleteNotification, receiveNotification } from "../api/greenApi";
import { parseIncomingText } from "./notification";
import type { ChatMessage, GreenApiCredentials } from "../types";

export interface IncomingPollLoopOptions {
  credentials: GreenApiCredentials;
  isActive: () => boolean;
  onMessage: (message: ChatMessage) => void;
}

/**
 * Long-poll GREEN-API notification queue until isActive() is false.
 * receiveNotification → deleteNotification → parse incoming text.
 */
export async function runIncomingPollLoop(options: IncomingPollLoopOptions): Promise<void> {
  const { credentials, isActive, onMessage } = options;

  const pollOnce = async (): Promise<void> => {
    if (!isActive()) {
      return;
    }

    try {
      const notification = await receiveNotification(credentials);
      if (!isActive()) {
        return;
      }

      if (notification) {
        await deleteNotification(credentials, notification.receiptId);
        const incoming = parseIncomingText(notification.body);
        if (incoming) {
          onMessage(incoming);
        }
      }
    } catch {
      if (!isActive()) {
        return;
      }
    }

    if (isActive()) {
      await pollOnce();
    }
  };

  await pollOnce();
}
