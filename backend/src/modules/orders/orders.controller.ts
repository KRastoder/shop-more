import type { Request, Response } from "express";
import { ZodError } from "zod";
import { createOrderSchema, createOrderWithItemsSchema, updateOrderStatusSchema } from "./orders.types";
import {
  createOrderRepo,
  createOrderWithItemsRepo,
  getOrderById,
  getUserOrders,
  getAllOrdersRepo,
  updateOrderStatusRepo,
  deleteOrderRepo,
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
    const session = req.session;

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

    // Verify the order belongs to the logged-in user
    if (order.userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
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
    const session = req.session;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Verify user can only access their own orders
    if (userId !== session.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
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

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersRepo();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error("getAllOrders error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const validated = updateOrderStatusSchema.parse(req.body);
    const updated = await updateOrderStatusRepo(orderId, validated);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (e) {
    console.error("updateOrderStatus error:", e);
    if (e instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: e.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    
    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    await deleteOrderRepo(orderId);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (e) {
    console.error("deleteOrder error:", e);
    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};
