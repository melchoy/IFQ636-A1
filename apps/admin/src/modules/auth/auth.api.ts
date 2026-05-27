import type { AdminUser, LoginAdminResponse } from "@otbt/types";

import { adminHttpRequest, httpRequest } from "../../lib/http.client";

export function loginAdmin(email: string, password: string) {
  return httpRequest<LoginAdminResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentAdmin() {
  return adminHttpRequest<AdminUser>("/auth/me");
}
