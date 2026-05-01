import type { Request, Response } from "express";
import { ZodError } from "zod";
import { createOrderSchema, createOrderWithItemsSchema } from "./orders.types";
import {
  createOrderRepo,
  createOrderWithItemsRepo,
  getOrderById,
  getUserOrders,
} from "./orders.repository";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const validated = createOrderSchema.parse(req.body);
    const order = await createOrderRepo(validated);

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error("createOrder error:", e);
    if (e instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: e.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const createOrderWithItems = async (req: Request, res: Response) => {
  try {
    const validated = createOrderWithItemsSchema.parse(req.body);
    const order = await createOrderWithItemsRepo(validated);

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error("createOrderWithItems error:", e);
    if (e instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: e.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);

    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.error("getOrder error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

export const getUserOrderHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await getUserOrders(userId);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error("getUserOrderHistory error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    });
  }
};
