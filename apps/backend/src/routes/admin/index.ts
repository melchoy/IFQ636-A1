import { Router } from "express";

import { adminAuthRouter } from "./auth.js";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);
