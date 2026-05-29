import { useMutation } from "@tanstack/react-query";

import type {
  CurrentCustomerResponse,
  LoginCustomerDto,
  LoginCustomerResponse,
} from "@otbt/types";

import { storefrontRequest } from "../../../lib/http.client";
import { getSessionToken } from "./customer-auth.storage";

function loginCustomer(data: LoginCustomerDto) {
  return storefrontRequest<LoginCustomerResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentCustomer() {
  const token = getSessionToken();

  return storefrontRequest<CurrentCustomerResponse>("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export function logoutCustomer() {
  const token = getSessionToken();

  return storefrontRequest<void>("/auth/logout", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export function useLoginCustomerMutation() {
  return useMutation({
    mutationFn: loginCustomer,
  });
}
