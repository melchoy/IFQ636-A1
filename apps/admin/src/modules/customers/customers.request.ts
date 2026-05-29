import type {
  AdminCustomerDetailResponse as CustomerDetailResponse,
  AdminCustomerListResponse as CustomerListResponse,
  AdminCustomerUpdateRequest as CustomerUpdateRequest,
  AdminCustomerUpdateResponse as CustomerUpdateResponse,
} from "@otbt/types";

import { adminHttpRequest } from "../../lib/http.client";

export function fetchCustomerList() {
  return adminHttpRequest<CustomerListResponse>("/customers");
}

export function fetchCustomerDetail(customerId: string) {
  return adminHttpRequest<CustomerDetailResponse>(`/customers/${customerId}`);
}

export function updateCustomer(customerId: string, customer: CustomerUpdateRequest) {
  return adminHttpRequest<CustomerUpdateResponse>(`/customers/${customerId}`, {
    method: "PATCH",
    body: JSON.stringify(customer),
  });
}
