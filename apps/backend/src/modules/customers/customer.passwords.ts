import bcrypt from "bcryptjs";

export function hashCustomerPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyCustomerPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
