"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Star, ShoppingBag, Minus, Plus } from "lucide-react";
import { ProductDataDTO } from "@/types";

export default function ProductBuySection({ data }: { data: ProductDataDTO }) {
  const imageSrc = `http://localhost:8000${data.images[0].imageURL}`;
  const rating = data.averageRating === 0 ? 5 : data.averageRating;

  const colors = useMemo(
    () => [...new Set(data.quantities.map((q) => q.color))],
    [data.quantities],
  );

  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

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
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedSize("");
  };

  const availableQty = useMemo(() => {
    if (!selectedSize) return null;
    return (
      data.quantities.find(
        (q) => q.color === selectedColor && q.size === selectedSize,
      )?.quantity ?? 0
    );
  }, [data.quantities, selectedColor, selectedSize]);

  const hasReviews = data.reviewsCount > 0 && data.reviews.length > 0;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Main buy section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* ── IMAGE ── */}
          <div className="relative">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={data.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            {data.discount && (
              <div className="absolute top-4 left-4 bg-black text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                -{data.discount}% off
              </div>
            )}
          </div>

          {/* ── INFO ── */}
          <div className="flex flex-col gap-6">
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
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-black">
                ${data.price.toFixed(2)}
              </span>
              {data.discount && (
                <span className="text-base text-gray-400 line-through">
                  ${(data.price / (1 - data.discount / 100)).toFixed(2)}
                </span>
              )}
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                          ${
                            isSelected
                              ? "bg-black text-white border-black"
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
                        className={`w-12 h-12 rounded-lg text-sm font-semibold transition-all duration-200 border
                          ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : "bg-gray-100 text-gray-600 border-gray-100 hover:border-gray-300"
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {availableQty !== null && (
                  <p className="text-xs text-gray-400 mt-2">
                    {availableQty === 0
                      ? "Out of stock"
                      : availableQty <= 5
                        ? `Only ${availableQty} left`
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
              <div className="inline-flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-bold text-black">
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
                  className="w-11 h-11 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              disabled={availableQty === 0}
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-xl font-semibold tracking-wide text-sm hover:bg-gray-900 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* ── REVIEWS ── */}
        {hasReviews && (
          <div className="mt-20 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-black text-black mb-8 tracking-tight">
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-3"
                >
                  {/* Reviewer */}
                  <div className="flex items-center gap-3">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name ?? "User"}
                        width={36}
                        height={36}
                        unoptimized
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                        {review.user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {review.user.name ?? "Anonymous"}
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
