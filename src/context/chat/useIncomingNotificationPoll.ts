import { useEffect, useRef } from "react";
import { runIncomingPollLoop } from "../../lib/incomingPollLoop";
import type { ChatMessage, GreenApiCredentials } from "../../types";

export interface UseIncomingNotificationPollOptions {
  enabled: boolean;
  /** Restarts the loop when the active chat changes (same as former useEffect deps). */
  chatId: string | null;
  credentials: GreenApiCredentials;
  onMessage: (message: ChatMessage) => void;
}

export function useIncomingNotificationPoll({
  enabled,
  chatId,
  credentials,
  onMessage,
}: UseIncomingNotificationPollOptions): void {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    const isActive = () => !cancelled;

    void runIncomingPollLoop({
      credentials,
      isActive,
      onMessage: (message) => onMessageRef.current(message),
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, chatId, credentials.apiUrl, credentials.idInstance, credentials.apiTokenInstance]);
}
