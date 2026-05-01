import { Router } from "express";
import {
  createOrder,
  createOrderWithItems,
  getOrder,
  getUserOrderHistory,
} from "./orders.controller";

const orderRouter = Router();

orderRouter.post("/", createOrder);
orderRouter.post("/with-items", createOrderWithItems);
orderRouter.get("/:orderId", getOrder);
orderRouter.get("/user/:userId", getUserOrderHistory);

export default orderRouter;
