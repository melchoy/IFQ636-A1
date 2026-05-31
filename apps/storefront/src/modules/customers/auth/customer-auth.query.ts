import { queryOptions, useMutation } from "@tanstack/react-query";

import type {
  CurrentCustomerResponse,
  LoginCustomerDto,
  LoginCustomerResponse,
} from "@otbt/types";

import { storefrontRequest } from "../../../lib/http.client";
import { getSessionToken } from "./customer-auth.storage";

export const currentCustomerQueryKey = ["current-customer"];

function loginCustomer(data: LoginCustomerDto) {
  return storefrontRequest<LoginCustomerResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentCustomer() {
  return storefrontRequest<CurrentCustomerResponse>("/auth/me");
}

export function logoutCustomer() {
  return storefrontRequest<void>("/auth/logout", {
    method: "POST",
  });
}

export function currentCustomerQueryOptions() {
  return queryOptions({
    queryKey: currentCustomerQueryKey,
    queryFn: getCurrentCustomer,
    enabled: Boolean(getSessionToken()),
    retry: false,
  });
}

export function useLoginCustomerMutation() {
  return useMutation({
    mutationFn: loginCustomer,
  });
}

export function useLogoutCustomerMutation() {
  return useMutation({
    mutationFn: logoutCustomer,
  });
}
