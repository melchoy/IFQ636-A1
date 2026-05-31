import { jsonRequest } from "@otbt/web";

import { getSessionToken } from "./session-token";

const apiBaseUrl = import.meta.env.VITE_STOREFRONT_API_BASE_URL ?? "/api/storefront";

function withSessionHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  const sessionToken = getSessionToken();

  if (sessionToken && !nextHeaders.has("Authorization")) {
    nextHeaders.set("Authorization", `Bearer ${sessionToken}`);
  }

  const headerRecord: Record<string, string> = {};
  nextHeaders.forEach((value, key) => {
    headerRecord[key] = value;
  });

  return headerRecord;
}

export function storefrontRequest<TResponse>(path: string, init: RequestInit = {}) {
  return jsonRequest<TResponse>(path, {
    ...init,
    baseUrl: apiBaseUrl,
    headers: withSessionHeaders(init.headers),
  });
}
