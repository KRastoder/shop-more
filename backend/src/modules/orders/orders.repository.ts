import db from "../../db";
import { orderSchema, orderItems, orderStatusEnum } from "../../db/schemas/order-schema";
import { product, productImages, productQuantity } from "../../db/schemas/product-schema";
import { user } from "../../db/schemas/auth-schema";
import type { CreateOrderInput, CreateOrderWithItemsInput, OrderStatus, UpdateOrderStatusInput } from "./orders.types";
import { eq, and, sql, desc } from "drizzle-orm";

export const createOrderRepo = async (data: CreateOrderInput) => {
  const [order] = await db
    .insert(orderSchema)
    .values({
      userId: data.userId,
      totalPrice: data.totalPrice,
      address: data.address,
    })
    .returning();

  return order;
};

export const createOrderWithItemsRepo = async (
  data: CreateOrderWithItemsInput,
) => {
  return await db.transaction(async (tx) => {
    const { items, ...orderData } = data;

    // Create order
    const [order] = await tx
      .insert(orderSchema)
      .values({
        userId: orderData.userId,
        totalPrice: orderData.totalPrice,
        address: orderData.address,
      })
      .returning();

    // Create order items with color/size
    await tx.insert(orderItems).values(
      items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        color: item.color ?? null,
        size: item.size ?? null,
      })),
    );

    // Deduct quantities from product_quantity
    for (const item of items) {
      await tx
        .update(productQuantity)
        .set({ quantity: sql`quantity - ${item.quantity}` })
        .where(
          and(
            eq(productQuantity.productId, item.productId),
            eq(productQuantity.color, item.color ?? ""),
            eq(productQuantity.size, item.size ?? ""),
          ),
        );
    }

    return order;
  });
};

export const getOrderById = async (orderId: number) => {
  const order = await db
    .select()
    .from(orderSchema)
    .where(eq(orderSchema.id, orderId))
    .limit(1);

  if (!order.length) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return {
    ...order[0],
    items,
  };
};

export const getUserOrders = async (userId: string) => {
  // Get all orders for user
  const orders = await db
    .select()
    .from(orderSchema)
    .where(eq(orderSchema.userId, userId))
    .orderBy(orderSchema.createdAt);

  // For each order, get items with product details
  const ordersWithItems = [];
  
  for (const order of orders) {
    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        color: orderItems.color,
        size: orderItems.size,
        productName: product.name,
        productPrice: product.price,
        productImage: productImages.imageURL,
      })
      .from(orderItems)
      .leftJoin(product, eq(product.id, orderItems.productId))
      .leftJoin(productImages, eq(productImages.productId, product.id))
      .where(eq(orderItems.orderId, order.id));

    ordersWithItems.push({
      ...order,
      items,
    });
  }

  return ordersWithItems;
};

export const getAllOrdersRepo = async (): Promise<Array<{
  id: number;
  userId: string;
  userEmail: string | null;
  totalPrice: number;
  address: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: number;
    productId: number;
    quantity: number | null;
    color: string | null;
    size: string | null;
    productName: string | null;
    productPrice: number | null;
    productImage: string | null;
  }>;
}>> => {
  const orders = await db
    .select({
      id: orderSchema.id,
      userId: orderSchema.userId,
      userEmail: user.email,
      totalPrice: orderSchema.totalPrice,
      address: orderSchema.address,
      status: orderSchema.status,
      createdAt: orderSchema.createdAt,
      updatedAt: orderSchema.updatedAt,
    })
    .from(orderSchema)
    .leftJoin(user, eq(orderSchema.userId, user.id))
    .orderBy(desc(orderSchema.createdAt));

  const ordersWithItems = [];

  for (const order of orders) {
    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        color: orderItems.color,
        size: orderItems.size,
        productName: product.name,
        productPrice: product.price,
        productImage: productImages.imageURL,
      })
      .from(orderItems)
      .leftJoin(product, eq(product.id, orderItems.productId))
      .leftJoin(productImages, eq(productImages.productId, product.id))
      .where(eq(orderItems.orderId, order.id));

    ordersWithItems.push({
      ...order,
      items,
    });
  }

  return ordersWithItems;
};

export const updateOrderStatusRepo = async (orderId: number, data: UpdateOrderStatusInput): Promise<typeof orderSchema.$inferSelect> => {
  const [updated] = await db
    .update(orderSchema)
    .set({ 
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(orderSchema.id, orderId))
    .returning();

  return updated;
};

export const deleteOrderRepo = async (orderId: number): Promise<void> => {
  await db.transaction(async (tx) => {
    // Delete order items first
    await tx.delete(orderItems).where(eq(orderItems.orderId, orderId));
    // Delete the order
    await tx.delete(orderSchema).where(eq(orderSchema.id, orderId));
  });
};
