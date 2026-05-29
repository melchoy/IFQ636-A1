import type { Customer } from "@otbt/types";

import { HttpError } from "../../middleware/error-handler.js";
import { CustomerModel, type CustomerDocument } from "./customer.model.js";
import { hashCustomerPassword } from "./customer.passwords.js";

type CustomerRecord = CustomerDocument & {
  _id: { toString(): string };
};

interface CustomerRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function serializeCustomer(customer: CustomerRecord): Customer {
  return {
    id: customer._id.toString(),
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}

export async function registerCustomer(
  customerRegistration: CustomerRegistration,
): Promise<Customer> {
  const normalizedEmail = customerRegistration.email.trim().toLowerCase();
  const existingCustomer = await CustomerModel.findOne({
    email: normalizedEmail,
  }).exec();

  if (existingCustomer) {
    throw new HttpError(409, "Customer email already registered");
  }

  const customer = await CustomerModel.create({
    firstName: customerRegistration.firstName.trim(),
    lastName: customerRegistration.lastName.trim(),
    email: normalizedEmail,
    passwordHash: await hashCustomerPassword(customerRegistration.password),
  });

  return serializeCustomer(customer);
}
