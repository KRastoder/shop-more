import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../auth/auth";
import { createReviewSchema, updateReviewSchema } from "./review.types";
import {
  createReviewRepo,
  deleteReviewRepo,
  getProductReviewsRepo,
  getUserReviewsRepo,
  hasUserPurchasedProduct,
  updateReviewRepo,
} from "./review.repository";

export const createReview = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ err: "Unauthorized" });
    }

    const validation = createReviewSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ err: validation.error.format() });
    }

    const { productId, rating, comment } = validation.data;

    // Check if user has purchased the product
    const hasPurchased = await hasUserPurchasedProduct(session.user.id, productId);
    if (!hasPurchased) {
      return res.status(403).json({ err: "You can only review products you have purchased" });
    }

    const review = await createReviewRepo(session.user.id, { productId, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    if (error.message?.includes("unique_user_product_review")) {
      return res.status(400).json({ err: "You have already reviewed this product" });
    }
    console.error("Create review error:", error);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId as string);
    if (isNaN(productId)) {
      return res.status(400).json({ err: "Invalid product ID" });
    }

    const reviews = await getProductReviewsRepo(productId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ err: "Unauthorized" });
    }

    const reviews = await getUserReviewsRepo(session.user.id);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ err: "Unauthorized" });
    }

    const reviewId = parseInt(req.params.id as string);
    if (isNaN(reviewId)) {
      return res.status(400).json({ err: "Invalid review ID" });
    }

    const validation = updateReviewSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ err: validation.error.format() });
    }

    const review = await updateReviewRepo(reviewId, session.user.id, validation.data);
    if (!review) {
      return res.status(404).json({ err: "Review not found or you don't have permission" });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ err: "Unauthorized" });
    }

    const reviewId = parseInt(req.params.id as string);
    if (isNaN(reviewId)) {
      return res.status(400).json({ err: "Invalid review ID" });
    }

    const deleted = await deleteReviewRepo(reviewId, session.user.id);
    if (!deleted) {
      return res.status(404).json({ err: "Review not found or you don't have permission" });
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ err: "Internal server error" });
  }
};

export const checkPurchaseStatus = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({ err: "Unauthorized" });
    }

    const productId = parseInt(req.params.productId as string);
    if (isNaN(productId)) {
      return res.status(400).json({ err: "Invalid product ID" });
    }

    const hasPurchased = await hasUserPurchasedProduct(session.user.id, productId);
    res.status(200).json({ success: true, hasPurchased });
  } catch (error) {
    console.error("Check purchase status error:", error);
    res.status(500).json({ err: "Internal server error" });
  }
};
