import type { CustomerAccessLevel, CustomerStatus } from "@otbt/types";
import { Schema, model } from "mongoose";

export interface CustomerDocument {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  status: CustomerStatus;
  accessLevel: CustomerAccessLevel;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<CustomerDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
      required: true,
    },
    accessLevel: {
      type: String,
      enum: ["standard", "member"],
      default: "standard",
      required: true,
    },
  },
  { timestamps: true },
);

export const CustomerModel = model<CustomerDocument>("Customer", customerSchema);
