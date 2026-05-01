import { z } from "zod";
import { productReview } from "../../db/schemas/product-schema";
import { InferSelectModel } from "drizzle-orm";

export const createReviewSchema = z.object({
  productId: z.number().int().positive("Product ID is required"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ProductReview = InferSelectModel<typeof productReview>;
