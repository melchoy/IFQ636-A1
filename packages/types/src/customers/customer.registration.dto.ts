import type { Customer } from "./customer.entity.js";

export interface RegisterCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterCustomerResponse {
  customer: Customer;
}
