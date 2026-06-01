import { useMutation } from "@tanstack/react-query";

import type { CheckoutRequest, CheckoutSessionResponse } from "@otbt/types";

import { storefrontRequest } from "../../lib/http.client";

function submitCheckout(data: CheckoutRequest) {
  return storefrontRequest<CheckoutSessionResponse>("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: submitCheckout,
  });
}
