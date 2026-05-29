export type CustomerStatus = "active" | "disabled";
export type CustomerAccessLevel = "standard" | "member";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: CustomerStatus;
  accessLevel: CustomerAccessLevel;
  createdAt: string;
  updatedAt: string;
}

export type CustomerUpdate = Partial<
  Pick<
    Customer,
    "firstName" | "lastName" | "email" | "status" | "accessLevel"
  >
>;
