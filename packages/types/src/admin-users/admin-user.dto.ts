import type { AdminUser } from "./admin-user.entity.js";

export interface LoginAdminDto {
  email: string;
  password: string;
}

export interface LoginAdminResponse extends AdminUser {
  token: string;
}
