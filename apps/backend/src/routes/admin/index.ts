import { Router } from "express";

import { adminAuthRouter } from "./auth.js";
import { adminCustomersRouter } from "./customers.js";
import { adminOrdersRouter } from "./orders.js";
import { adminProductsRouter } from "./products.js";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/customers", adminCustomersRouter);
adminRouter.use("/orders", adminOrdersRouter);
adminRouter.use("/products", adminProductsRouter);
