import { Schema, model } from "mongoose";

export interface AdminUserDocument {
  email: string;
  passwordHash: string;
}

const adminUserSchema = new Schema<AdminUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const AdminUser = model<AdminUserDocument>("AdminUser", adminUserSchema);
