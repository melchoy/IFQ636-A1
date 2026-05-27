import {
  jsonRequest,
  multipartRequest as webMultipartRequest,
} from "@otbt/web";

import { getAdminToken } from "../modules/auth/auth.storage";

const apiBaseUrl = import.meta.env.VITE_ADMIN_API_BASE_URL ?? "/api/admin";

function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function httpRequest<T>(path: string, init: RequestInit = {}) {
  return jsonRequest<T>(path, {
    ...init,
    baseUrl: apiBaseUrl,
  });
}

export function adminHttpRequest<T>(path: string, init: RequestInit = {}) {
  return jsonRequest<T>(path, {
    ...init,
    baseUrl: apiBaseUrl,
    headers: {
      ...getAuthHeaders(),
      ...init.headers,
    },
  });
}

export function multipartRequest<T>(path: string, body: FormData) {
  return webMultipartRequest<T>(path, {
    baseUrl: apiBaseUrl,
    body,
    headers: getAuthHeaders(),
  });
}
