import { useMutation, useQuery } from "@tanstack/react-query";

import type { AdminCustomerUpdateRequest as CustomerUpdateRequest } from "@otbt/types";

import { queryClient } from "../../lib/query-client";
import {
  customerDetailQuery,
  customerDetailQueryKey,
  customerListQuery,
} from "./customers.query";
import { updateCustomer } from "./customers.request";

export function useCustomerList() {
  const { data: customerList } = useQuery(customerListQuery);

  if (!customerList) {
    throw new Error("Customer list was not loaded");
  }

  return customerList;
}

export function useCustomerDetail(customerId: string) {
  const { data: customerDetail } = useQuery(customerDetailQuery(customerId));

  if (!customerDetail) {
    throw new Error("Customer detail was not loaded");
  }

  return customerDetail;
}

export function useUpdateCustomer(customerId: string) {
  return useMutation({
    mutationFn: (customer: CustomerUpdateRequest) => updateCustomer(customerId, customer),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: customerListQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: customerDetailQueryKey(customerId) });
    },
  });
}
