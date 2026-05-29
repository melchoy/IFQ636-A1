import { queryOptions } from "@tanstack/react-query";

import { fetchCustomerDetail, fetchCustomerList } from "./customers.request";

export const customerListQuery = queryOptions({
  queryKey: ["customers", "list"] as const,
  queryFn: fetchCustomerList,
});

export function customerDetailQueryKey(customerId: string) {
  return ["customers", "detail", customerId] as const;
}

export function customerDetailQuery(customerId: string) {
  return queryOptions({
    queryKey: customerDetailQueryKey(customerId),
    queryFn: () => fetchCustomerDetail(customerId),
  });
}
