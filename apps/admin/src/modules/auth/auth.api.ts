import type { AdminUser, LoginAdminResponse } from "@otbt/types";

import { httpRequest } from "../../lib/http.client";
import { getAdminToken } from "./auth.storage";

function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function loginAdmin(email: string, password: string) {
  return httpRequest<LoginAdminResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentAdmin() {
  return httpRequest<AdminUser>("/auth/me", {
    headers: getAuthHeaders(),
  });
}
