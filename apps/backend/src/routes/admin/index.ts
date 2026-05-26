import { Router } from "express";

import { adminAuthRouter } from "./auth.js";
import { adminProductsRouter } from "./products.js";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/products", adminProductsRouter);
