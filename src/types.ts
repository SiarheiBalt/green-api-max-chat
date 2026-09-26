export type MessageDirection = "in" | "out";

export interface ChatMessage {
  idMessage: string;
  text: string;
  direction: MessageDirection;
  timestamp: number;
}
