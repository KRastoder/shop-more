import { Router } from "express";
import {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  checkPurchaseStatus,
} from "./review.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const reviewRouter = Router();

// Create a review (requires purchase)
reviewRouter.post("/", requireAuth, createReview);

// Get reviews for a product (public)
reviewRouter.get("/product/:productId", getProductReviews);

// Get current user's reviews (requires auth)
reviewRouter.get("/user", requireAuth, getUserReviews);

// Check if user purchased a product (requires auth)
reviewRouter.get("/check-purchase/:productId", requireAuth, checkPurchaseStatus);

// Update a review (only by author)
reviewRouter.put("/:id", requireAuth, updateReview);

// Delete a review (only by author)
reviewRouter.delete("/:id", requireAuth, deleteReview);

export default reviewRouter;
