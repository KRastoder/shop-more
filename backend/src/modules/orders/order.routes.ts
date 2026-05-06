import { Router } from "express";
import {
  createOrder,
  createOrderWithItems,
  getOrder,
  getUserOrderHistory,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "./orders.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const orderRouter = Router();

// All order routes require authentication
orderRouter.post("/", requireAuth, createOrder);
orderRouter.post("/with-items", requireAuth, createOrderWithItems);
orderRouter.get("/:orderId", requireAuth, getOrder);
orderRouter.get("/user/:userId", requireAuth, getUserOrderHistory);

// Admin-only routes
orderRouter.get("/admin/all", requireAuth, requireAdmin, getAllOrders);
orderRouter.patch("/:orderId/status", requireAuth, requireAdmin, updateOrderStatus);
orderRouter.delete("/:orderId", requireAuth, requireAdmin, deleteOrder);

export default orderRouter;
