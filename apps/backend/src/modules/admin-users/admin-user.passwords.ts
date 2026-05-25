import bcrypt from "bcryptjs";

export function hashAdminPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyAdminPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
