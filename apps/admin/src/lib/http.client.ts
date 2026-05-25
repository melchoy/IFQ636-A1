import { getAdminToken } from "../modules/auth/auth.storage";

const apiBaseUrl = import.meta.env.VITE_ADMIN_API_BASE_URL ?? "/api/admin";

export async function httpRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export function adminHttpRequest<T>(path: string, init: RequestInit = {}) {
  const token = getAdminToken();

  return httpRequest<T>(path, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
}
