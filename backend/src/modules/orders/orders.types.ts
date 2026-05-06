import { z } from "zod";

export const orderStatusEnum = z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]);

export const createOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  totalPrice: z.number().int().positive("Total price must be a positive integer"),
  address: z.string().min(1, "Address is required"),
});

export const createOrderItemSchema = z.object({
  productId: z.number().int().positive("Product ID must be valid"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  color: z.string().optional(),
  size: z.string().optional(),
});

export const createOrderWithItemsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  totalPrice: z.number().int().positive("Total price must be a positive integer"),
  address: z.string().min(1, "Address is required"),
  items: z.array(createOrderItemSchema).min(1, "Order must have at least one item"),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

// TYPE EXPORTS
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type CreateOrderWithItemsInput = z.infer<typeof createOrderWithItemsSchema>;
export type OrderStatus = z.infer<typeof orderStatusEnum>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
