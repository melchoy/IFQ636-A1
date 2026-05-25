import type { AdminUser, LoginAdminDto, LoginAdminResponse } from "@otbt/types";
import { Router } from "express";

import { HttpError } from "../../middleware/error-handler.js";
import { requireAdmin, type AdminAuthRequest } from "../../middleware/require-admin.js";
import { AdminUser as AdminUserModel } from "../../modules/admin-users/admin-user.model.js";
import { verifyAdminPassword } from "../../modules/admin-users/admin-user.passwords.js";
import { generateAdminToken } from "../../modules/admin-users/admin-user.tokens.js";

export const adminAuthRouter = Router();

const toAdminUser = (admin: { _id?: unknown; id?: string; email: string }): AdminUser => ({
  id: admin.id ?? String(admin._id),
  email: admin.email,
});

adminAuthRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body as Partial<LoginAdminDto>;

    if (!email || !password) {
      throw new HttpError(400, "Email and password are required");
    }

    const admin = await AdminUserModel.findOne({ email: email.toLowerCase() });
    const validPassword = admin ? await verifyAdminPassword(password, admin.passwordHash) : false;

    if (!admin || !validPassword) {
      throw new HttpError(401, "Invalid admin credentials");
    }

    const response: LoginAdminResponse = {
      ...toAdminUser(admin),
      token: generateAdminToken({ id: admin.id, email: admin.email }),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

adminAuthRouter.get("/me", requireAdmin, (req: AdminAuthRequest, res, next) => {
  try {
    if (!req.admin) {
      throw new HttpError(401, "Not authorized");
    }

    res.json(toAdminUser(req.admin));
  } catch (error) {
    next(error);
  }
});

adminAuthRouter.post("/logout", requireAdmin, (_req, res) => {
  res.status(204).send();
});
