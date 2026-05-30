import type { Customer, CustomerUpdate } from "./customer.entity.js";

export type AdminCustomerListItem = Customer;
export type AdminCustomerDetail = Customer;
export type AdminCustomerUpdateRequest = CustomerUpdate;

export interface AdminCustomerListResponse {
  customers: AdminCustomerListItem[];
}

export interface AdminCustomerDetailResponse {
  customer: AdminCustomerDetail;
}

export interface AdminCustomerUpdateResponse {
  customer: AdminCustomerDetail;
}
