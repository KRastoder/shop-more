import db from "../../db";
import { productReview, product } from "../../db/schemas/product-schema";
import { orderSchema } from "../../db/schemas/order-schema";
import { orderItems } from "../../db/schemas/order-schema";
import { eq, and } from "drizzle-orm";
import type { CreateReviewInput, UpdateReviewInput } from "./review.types";
import { user } from "../../db/schemas/auth-schema";

// Check if user has purchased the product
export const hasUserPurchasedProduct = async (userId: string, productId: number): Promise<boolean> => {
  const result = await db
    .select()
    .from(orderItems)
    .leftJoin(orderSchema, eq(orderSchema.id, orderItems.orderId))
    .where(
      and(
        eq(orderSchema.userId, userId),
        eq(orderItems.productId, productId)
      )
    )
    .limit(1);

  return result.length > 0;
};

// Create a review
export const createReviewRepo = async (
  userId: string,
  data: CreateReviewInput
) => {
  const [review] = await db
    .insert(productReview)
    .values({
      userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment || null,
    })
    .returning();

  return review;
};

// Get reviews for a product
export const getProductReviewsRepo = async (productId: number) => {
  const reviews = await db
    .select({
      id: productReview.id,
      rating: productReview.rating,
      comment: productReview.comment,
      createdAt: productReview.createdAt,
      userId: user.id,
      userName: user.name,
      userImage: user.image,
    })
    .from(productReview)
    .leftJoin(user, eq(user.id, productReview.userId))
    .where(eq(productReview.productId, productId))
    .orderBy(productReview.createdAt);

  return reviews;
};

// Get reviews by user
export const getUserReviewsRepo = async (userId: string) => {
  const reviews = await db
    .select({
      id: productReview.id,
      rating: productReview.rating,
      comment: productReview.comment,
      createdAt: productReview.createdAt,
      productId: productReview.productId,
      productName: product.name,
    })
    .from(productReview)
    .leftJoin(product, eq(product.id, productReview.productId))
    .where(eq(productReview.userId, userId))
    .orderBy(productReview.createdAt);

  return reviews;
};

// Update a review
export const updateReviewRepo = async (
  reviewId: number,
  userId: string,
  data: UpdateReviewInput
) => {
  const [review] = await db
    .update(productReview)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(productReview.id, reviewId),
        eq(productReview.userId, userId)
      )
    )
    .returning();

  return review;
};

// Delete a review
export const deleteReviewRepo = async (reviewId: number, userId: string) => {
  const result = await db
    .delete(productReview)
    .where(
      and(
        eq(productReview.id, reviewId),
        eq(productReview.userId, userId)
      )
    )
    .returning();

  return result.length > 0;
};

// Get average rating for a product
export const getProductAverageRating = async (productId: number) => {
  const result = await db
    .select({
      avgRating: productReview.rating,
    })
    .from(productReview)
    .where(eq(productReview.productId, productId));

  if (result.length === 0) return 0;

  const avg = result.reduce((sum, r) => sum + r.avgRating, 0) / result.length;
  return Math.round(avg);
};
