"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, ShoppingBag, Minus, Plus } from "lucide-react";
import { ProductDataDTO } from "@/types";
import { useRouter } from "next/navigation";
import { addToCart, type CartItem } from "@/lib/cart";
import {
  getProductReviews,
  checkPurchaseStatus,
  createReview,
  updateReview,
  deleteReview,
  type Review,
} from "@/lib/reviews";
import { authClient } from "@/lib/auth-client";
import { getImageSrc } from "@/lib/images";

export default function ProductBuySection({ data }: { data: ProductDataDTO }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageSrc = getImageSrc(data.images[selectedImageIndex]?.imageURL);
  const rating = data.averageRating === 0 ? 5 : data.averageRating;

  const colors = useMemo(
    () => [...new Set(data.quantities.map((q) => q.color))],
    [data.quantities],
  );

  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(false);

  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const sizes = useMemo(() => {
    return [
      ...new Set(
        data.quantities
          .filter((q) => q.color === selectedColor)
          .map((q) => q.size),
      ),
    ];
  }, [data.quantities, selectedColor]);

  // Reset size when color changes
  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    setSelectedSize("");
  }, []);

  const availableQty = useMemo(() => {
    if (!selectedSize) return null;
    return (
      data.quantities.find(
        (q) => q.color === selectedColor && q.size === selectedSize,
      )?.quantity ?? 0
    );
  }, [data.quantities, selectedColor, selectedSize]);

  const hasReviews = data.reviewsCount > 0 && data.reviews.length > 0;

  const handleAddToCart = useCallback(() => {
    if (!selectedColor || !selectedSize) {
      alert("Please select color and size");
      return;
    }

    if (availableQty === 0) {
      alert("This item is out of stock");
      return;
    }

    const discountedPrice = (data.discount || 0) > 0
      ? data.price * (1 - (data.discount || 0) / 100)
      : data.price;

    const cartItem: CartItem = {
      productId: data.id,
      name: data.name,
      price: parseFloat(discountedPrice.toFixed(2)),
      discount: data.discount || 0,
      imageURL: data.images[0]?.imageURL || "",
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      availableQty: availableQty ?? 0,
    };

    addToCart(cartItem);
    setAddedToCart(true);
  }, [selectedColor, selectedSize, availableQty, data, quantity]);

  // Reset addedToCart after 2 seconds with cleanup
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Fetch reviews and check purchase status
  const fetchReviews = useCallback(async () => {
    try {
      const reviewsData = await getProductReviews(data.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [data.id]);

  // Fetch reviews on mount
  useEffect(() => {
    setLoadingReviews(true);
    fetchReviews().finally(() => setLoadingReviews(false));
  }, [fetchReviews]);

  // Check purchase status when user changes
  useEffect(() => {
    if (currentUser) {
      checkPurchaseStatus(data.id)
        .then(setHasPurchased)
        .catch(err => console.error("Failed to check purchase status:", err));
    } else {
      setHasPurchased(false);
    }
  }, [currentUser, data.id]);

  const handleSubmitReview = useCallback(async () => {
    if (!currentUser) {
      router.push("/sign-in");
      return;
    }

    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        await updateReview(editingReviewId, {
          rating: reviewRating,
          comment: reviewComment || undefined,
        });
      } else {
        await createReview({
          productId: data.id,
          rating: reviewRating,
          comment: reviewComment || undefined,
        });
      }
      setReviewRating(5);
      setReviewComment("");
      setShowReviewForm(false);
      setEditingReviewId(null);
      await fetchReviews();
    } catch (error: any) {
      alert(error.message || "Failed to submit review");
    } finally {
       setSubmittingReview(false);
     }
   }, [currentUser, router, editingReviewId, reviewRating, reviewComment, data.id, updateReview, createReview, fetchReviews]);

   const handleEditReview = useCallback((review: Review) => {
    setReviewRating(review.rating);
    setReviewComment(review.comment || "");
    setEditingReviewId(review.id);
    setShowReviewForm(true);
  }, []);

  const handleDeleteReview = useCallback(async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId);
      await fetchReviews();
    } catch (error: any) {
      alert(error.message || "Failed to delete review");
    }
  }, [fetchReviews]);

  const handleCancelReview = useCallback(() => {
    setReviewRating(5);
    setReviewComment("");
    setShowReviewForm(false);
    setEditingReviewId(null);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Main buy section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* ── IMAGE GALLERY ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative">
              <div className="aspect-square bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={data.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
              {(data.discount ?? 0) > 0 && (
                <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-black text-white text-xs font-semibold tracking-widest uppercase px-2 md:px-3 py-1 rounded-full">
                  -{data.discount ?? 0}% off
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {data.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {data.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-black scale-105"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={getImageSrc(img.imageURL) || "/placeholder.png"}
                      alt={`${data.name} ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── INFO ── */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Name */}
            <div>
              <h1 className="text-4xl font-black tracking-tight text-black leading-tight">
                {data.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= Math.round(rating)
                          ? "text-black fill-black"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {data.reviewsCount === 0
                    ? "No reviews yet"
                    : `${rating.toFixed(1)} · ${data.reviewsCount} review${data.reviewsCount > 1 ? "s" : ""}`}
                </span>
              </div>
            </div>

             {/* Price */}
             <div className="flex items-baseline gap-3 flex-wrap">
               <span className="text-2xl md:text-3xl font-black text-black">
                 ${(data.price * (1 - (data.discount || 0) / 100)).toFixed(2)}
               </span>
              {data.discount ?? 0 > 0 ? (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ${data.price.toFixed(2)}
                    </span>
                    <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-semibold">
                      -{data.discount ?? 0}%
                    </span>
                  </>
                ) : null}
             </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-5">
              {data.description}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-100" />

                {/* Colors */}
             {colors.length > 0 && (
               <div>
                 <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                   Color — <span className="text-black">{selectedColor}</span>
                 </p>
                 <div className="flex gap-2 flex-wrap">
                   {colors.map((color) => {
                     const isSelected = color === selectedColor;
                     return (
                       <button
                         key={color}
                         onClick={() => handleColorChange(color)}
                         className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                           ${
                             isSelected
                               ? "bg-black text-white border-black scale-105"
                               : "bg-gray-100 text-gray-600 border-gray-100 hover:border-gray-300"
                           }`}
                       >
                         {color}
                       </button>
                     );
                   })}
                 </div>
               </div>
             )}

             {/* Sizes */}
             {sizes.length > 0 && (
               <div>
                 <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                   Size{" "}
                   {selectedSize && (
                     <span className="text-black">— {selectedSize}</span>
                   )}
                 </p>
                 <div className="flex gap-2 flex-wrap">
                   {sizes.map((size) => {
                     const isSelected = size === selectedSize;
                     return (
                       <button
                         key={size}
                         onClick={() => setSelectedSize(size)}
                         className={`min-w-[3rem] h-12 rounded-lg text-sm font-semibold transition-all duration-200 border
                           ${
                             isSelected
                               ? "bg-black text-white border-black scale-105"
                               : "bg-gray-100 text-gray-600 border-gray-100 hover:border-gray-300"
                           }`}
                       >
                         {size}
                       </button>
                     );
                   })}
                 </div>
                 {availableQty !== null && (
                   <p className={`text-xs mt-2 ${
                     availableQty === 0
                       ? "text-red-500"
                       : availableQty <= 5
                         ? "text-yellow-600"
                         : "text-green-600"
                   }`}>
                     {availableQty === 0
                       ? "Out of stock"
                       : availableQty <= 5
                         ? `Only ${availableQty} left in stock`
                         : `${availableQty} in stock`}
                   </p>
                 )}
               </div>
             )}

             {/* Quantity */}
             <div>
               <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                 Quantity
               </p>
               <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                 <button
                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                   className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors active:bg-gray-300"
                 >
                   <Minus size={14} />
                 </button>
                 <span className="w-10 md:w-12 text-center text-sm font-bold text-black">
                   {quantity}
                 </span>
                 <button
                   onClick={() =>
                     setQuantity((q) =>
                       availableQty !== null
                         ? Math.min(availableQty, q + 1)
                         : q + 1,
                     )
                   }
                   className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors active:bg-gray-300"
                 >
                   <Plus size={14} />
                 </button>
               </div>
             </div>

             {/* Add to cart */}
             <button
               onClick={handleAddToCart}
               disabled={availableQty === 0}
               className="w-full flex items-center justify-center gap-2 md:gap-3 bg-black text-white py-3 md:py-4 rounded-xl font-semibold tracking-wide text-sm hover:bg-gray-900 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
             >
               <ShoppingBag size={16} className="md:hidden" />
               <ShoppingBag size={18} className="hidden md:inline" />
               {addedToCart ? "Added to Cart!" : "Add to Cart"}
             </button>
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <div className="mt-12 md:mt-20 border-t border-gray-100 pt-8 md:pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-black tracking-tight">
              Customer Reviews
            </h2>
             {!loadingUser && currentUser && hasPurchased && !showReviewForm && !reviews.some(r => r.userId === currentUser.id) && (
              <button
                onClick={() => {
                  setEditingReviewId(null);
                  setReviewRating(5);
                  setReviewComment("");
                  setShowReviewForm(true);
                }}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 transition-colors w-full sm:w-auto"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Info messages for non-logged/non-purchased users */}
          {loadingUser ? (
            <p className="text-gray-400 mb-4">Loading...</p>
          ) : !currentUser && !showReviewForm ? (
            <p className="text-gray-500 mb-4">
              Please <button onClick={() => router.push("/sign-in")} className="text-blue-600 hover:underline">sign in</button> to write a review.
            </p>
          ) : null}
          {currentUser && !hasPurchased && !showReviewForm && (
            <p className="text-gray-500 mb-4">
              You can only review products you have purchased.
            </p>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {editingReviewId ? "Edit Review" : "Write a Review"}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      type="button"
                    >
                      <Star
                        size={24}
                        className={
                          star <= reviewRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Comment (optional)
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={4}
                  placeholder="Share your experience with this product..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 disabled:opacity-50 transition-colors"
                >
                  {submittingReview
                    ? "Submitting..."
                    : editingReviewId
                      ? "Update Review"
                      : "Submit Review"}
                </button>
                <button
                  onClick={handleCancelReview}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Reviews List */}
          {loadingReviews ? (
            <p className="text-gray-400 text-center py-8">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-3"
                >
                  {/* Reviewer */}
                  <div className="flex items-center gap-3">
                    {review.userImage ? (
                      <Image
                        src={getImageSrc(review.userImage) || "/placeholder.png"}
                        alt={review.userName ?? "User"}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                        {review.userName?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {review.userName ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    {/* Stars */}
                    <div className="ml-auto flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= review.rating
                              ? "text-black fill-black"
                              : "text-gray-200 fill-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {/* Comment */}
                  {review.comment && (
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  )}
                  {/* Edit/Delete for current user */}
                  {currentUser && review.userId === currentUser.id && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No reviews yet. {hasPurchased && "Be the first to review this product!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
