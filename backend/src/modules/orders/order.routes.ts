import { Router } from "express";
import {
  createOrder,
  createOrderWithItems,
  getOrder,
  getUserOrderHistory,
} from "./orders.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const orderRouter = Router();

// All order routes require authentication
orderRouter.post("/", requireAuth, createOrder);
orderRouter.post("/with-items", requireAuth, createOrderWithItems);
orderRouter.get("/:orderId", requireAuth, getOrder);
orderRouter.get("/user/:userId", requireAuth, getUserOrderHistory);

export default orderRouter;
