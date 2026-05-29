import { useMutation } from "@tanstack/react-query";

import type { RegisterCustomerDto, RegisterCustomerResponse } from "@otbt/types";

import { storefrontRequest } from "../../../lib/http.client";

function registerCustomer(data: RegisterCustomerDto) {
  return storefrontRequest<RegisterCustomerResponse>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function useRegisterCustomerMutation() {
  return useMutation({
    mutationFn: registerCustomer,
  });
}
