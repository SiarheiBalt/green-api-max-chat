/**
 * Базовый URL GREEN-API: из VITE_GREEN_API_URL или по префиксу idInstance.
 * В dev запросы идут через прокси Vite: /api/<host>/… → https://<host>/…
 */
export function normalizeApiUrl(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, "");
  if (!trimmed) {
    throw new Error("Пустой URL API");
  }
  return trimmed;
}

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

export function requestApiBase(apiUrl: string): string {
  const normalized = apiUrl.replace(/\/+$/, "");

  if (!import.meta.env.DEV) {
    return normalized;
  }

  if (normalized.startsWith("/api/")) {
    return normalized;
  }

  if (normalized === "/api") {
    return "/api/api.green-api.com";
  }

  const withProtocol = normalized.startsWith("http") ? normalized : `https://${normalized}`;
  try {
    const parsed = new URL(withProtocol);
    const pathPrefix =
      parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "");
    return `/api/${parsed.host}${pathPrefix}`;
  } catch {
    return normalized;
  }
}
