import type { Customer } from "./customer.entity.js";

export interface LoginCustomerDto {
  email: string;
  password: string;
}

export interface LoginCustomerResponse {
  customer: Customer;
  token: string;
}

export interface CurrentCustomerResponse {
  customer: Customer;
}
