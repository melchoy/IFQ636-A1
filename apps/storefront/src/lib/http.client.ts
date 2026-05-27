import { jsonRequest } from "@otbt/web";

const apiBaseUrl = import.meta.env.VITE_STOREFRONT_API_BASE_URL ?? "/api/storefront";

export function storefrontRequest<TResponse>(path: string, init: RequestInit = {}) {
  return jsonRequest<TResponse>(path, {
    ...init,
    baseUrl: apiBaseUrl,
  });
}
