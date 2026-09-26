export type MessageDirection = "in" | "out";

export interface ChatMessage {
  idMessage: string;
  text: string;
  direction: MessageDirection;
  timestamp: number;
}

/** GREEN-API SendMessage: max text length in characters */
export const MAX_MESSAGE_LENGTH = 4000;

export interface GreenApiCredentials {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

export interface SendMessageResult {
  idMessage: string;
}

/** Any webhook from the ReceiveNotification queue. */
export interface GreenApiWebhookBody {
  typeWebhook: string;
  timestamp?: number;
  idMessage?: string;
  messageData?: {
    typeMessage?: string;
    textMessageData?: {
      textMessage?: string;
    };
  };
}

export interface ReceiveNotificationResult {
  receiptId: number;
  body: GreenApiWebhookBody;
}

export interface DeleteNotificationResult {
  result: boolean;
  reason?: string;
}
