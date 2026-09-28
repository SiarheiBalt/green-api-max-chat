/**
 * Базовый URL GREEN-API: из VITE_GREEN_API_URL или по префиксу idInstance.
 * Запросы идут напрямую на https://<host>/… (в dev возможен CORS).
 */
export function normalizeApiUrl(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, "");
  if (!trimmed) {
    throw new Error("Пустой URL API");
  }
  return trimmed;
}

// к какому API-серверу ходить, определяют первые 4 цифры idInstance.
export function resolveApiUrlFromInstance(idInstance: string): string {
  const fromEnv = import.meta.env.VITE_GREEN_API_URL?.trim();
  if (fromEnv) {
    return normalizeApiUrl(fromEnv);
  }

  const id = idInstance.trim();
  const prefix = id.match(/^(\d{4})/)?.[1];
  if (!prefix) {
    throw new Error("idInstance должен начинаться минимум с 4 цифр");
  }

  return `https://${prefix}.api.green-api.com`;
}
