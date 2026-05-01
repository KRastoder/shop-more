const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  userId: string;
  userName: string | null;
  userImage: string | null;
  productId?: number;
  productName?: string;
};

export type CreateReviewData = {
  productId: number;
  rating: number;
  comment?: string;
};

export type UpdateReviewData = {
  rating?: number;
  comment?: string;
};

export async function checkPurchaseStatus(productId: number): Promise<boolean> {
  const res = await fetch(`${API_URL}/reviews/check-purchase/${productId}`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.success ? data.hasPurchased : false;
}

export async function createReview(data: CreateReviewData): Promise<Review> {
  const res = await fetch(`${API_URL}/reviews/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.err || "Failed to create review");
  return result.data;
}

export async function getProductReviews(productId: number): Promise<Review[]> {
  const res = await fetch(`${API_URL}/reviews/product/${productId}`);
  const result = await res.json();
  return result.success ? result.data : [];
}

export async function getUserReviews(): Promise<Review[]> {
  const res = await fetch(`${API_URL}/reviews/user`, {
    credentials: "include",
  });
  const result = await res.json();
  return result.success ? result.data : [];
}

export async function updateReview(id: number, data: UpdateReviewData): Promise<Review> {
  const res = await fetch(`${API_URL}/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.err || "Failed to update review");
  return result.data;
}

export async function deleteReview(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/reviews/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.err || "Failed to delete review");
}
