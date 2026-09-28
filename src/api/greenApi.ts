import type {
  DeleteNotificationResult,
  GreenApiCredentials,
  GreenApiWebhookBody,
  ReceiveNotificationResult,
  SendMessageResult,
} from "../types";
import { requestApiBase } from "../lib/apiUrl";

const RECEIVE_TIMEOUT_SEC = 5;

function instanceUrl(credentials: GreenApiCredentials, method: string): string {
  const apiUrl = requestApiBase(credentials.apiUrl);
  const { idInstance, apiTokenInstance } = credentials;
  return `${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
}

function parseJson(text: string): unknown {
  if (!text.trim()) {
    return null;
  }
  return JSON.parse(text) as unknown;
}

function apiError(data: unknown): string | null {
  if (typeof data !== "object" || data === null || !("status" in data)) {
    return null;
  }
  if ((data as { status: string }).status !== "error") {
    return null;
  }
  const message = (data as { message?: string }).message;
  return message ?? "GREEN-API error";
}

export async function sendMessage(
  credentials: GreenApiCredentials,
  chatId: string,
  message: string,
): Promise<SendMessageResult> {
  const response = await fetch(instanceUrl(credentials, "sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message }),
  });

  const data = parseJson(await response.text());
  const err = apiError(data);
  if (err) throw new Error(err);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return data as SendMessageResult;
}

export async function receiveNotification(
  credentials: GreenApiCredentials,
  receiveTimeoutSec = RECEIVE_TIMEOUT_SEC,
): Promise<ReceiveNotificationResult | null> {
  const url = `${instanceUrl(credentials, "receiveNotification")}?receiveTimeout=${receiveTimeoutSec}`;
  const response = await fetch(url);
  const data = parseJson(await response.text());

  const err = apiError(data);
  if (err) throw new Error(err);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  if (data === null || typeof data !== "object" || data === null) {
    return null;
  }

  const receiptId = (data as { receiptId?: unknown }).receiptId;
  if (typeof receiptId !== "number") {
    return null;
  }

  return {
    receiptId,
    body: (data as { body: GreenApiWebhookBody }).body,
  };
}

export async function deleteNotification(
  credentials: GreenApiCredentials,
  receiptId: number,
): Promise<DeleteNotificationResult> {
  const url = `${instanceUrl(credentials, "deleteNotification")}/${receiptId}`;
  const response = await fetch(url, { method: "DELETE" });

  const data = parseJson(await response.text());
  const err = apiError(data);
  if (err) throw new Error(err);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return data as DeleteNotificationResult;
}
