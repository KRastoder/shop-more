"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  averageRating: number;
  createdAt: string;
  images: { id: number; imageURL: string }[];
  quantities: { id: number; color: string; size: string; quantity: number }[];
};

type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "newest";

function getImageSrc(imageURL?: string) {
  if (!imageURL) return null;
  return imageURL.startsWith("http")
    ? imageURL
    : `http://localhost:8000${imageURL}`;
}

function ProductCard({ product }: { product: Product }) {
  const src = getImageSrc(product.images?.[0]?.imageURL);
  const rating = product.averageRating ?? 0;
  const displayRating = rating === 0 ? 5 : rating;

  return (
    <Link href={`/product/${product.id}`} className="block">
      <article className="p-3 rounded w-full group">
        <div className="relative w-full h-[300px] bg-gray-100 overflow-hidden rounded">
          {src ? (
            <Image
              src={src}
              alt={product.name}
              fill
              unoptimized
              className="rounded-4xl object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="mt-2 font-semibold">{product.name}</div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= displayRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating === 0 ? "No ratings" : `${rating}/5`}
          </span>
        </div>

        <p className="text-xl text-black font-bold mt-1">
          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
          {product.discount > 0 && (
            <>
              <span className="text-gray-400 line-through text-base ml-2">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded">
                -{product.discount}%
              </span>
            </>
          )}
        </p>
      </article>
    </Link>
  );
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "price-asc", label: "Price Low → High" },
  { value: "price-desc", label: "Price High → Low" },
  { value: "rating-desc", label: "Highest Rated" },
];

export default function ShopClient({ products }: { products: Product[] }) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) =>
      p.quantities.forEach((q) => {
        if (q.color) colors.add(q.color);
      }),
    );
    return Array.from(colors).sort();
  }, [products]);

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) =>
      p.quantities.forEach((q) => {
        if (q.size) sizes.add(q.size);
      }),
    );
    return Array.from(sizes).sort();
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    if (showDiscountedOnly) {
      result = result.filter((p) => p.discount > 0);
    }

    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.quantities.some((q) => selectedColors.includes(q.color)),
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.quantities.some((q) => selectedSizes.includes(q.size)),
      );
    }

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return result;
  }, [products, sortBy, selectedColors, selectedSizes, showDiscountedOnly]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label || "Newest";

  return (
    <div className="w-9/10 mx-auto py-20">
      <h1 className="text-center text-6xl font-extrabold text-black mb-10">
        ALL PRODUCTS
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-3">Filters</h3>
            <button
              onClick={() => setShowDiscountedOnly(!showDiscountedOnly)}
              className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                showDiscountedOnly
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              {showDiscountedOnly ? "Discounted Only: ON" : "Discounted Only: OFF"}
            </button>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg mb-3">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                    selectedColors.includes(color)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {color}
                </button>
              ))}
              {allColors.length === 0 && (
                <p className="text-gray-400 text-sm">No colors available</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl border text-sm transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
              {allSizes.length === 0 && (
                <p className="text-gray-400 text-sm">No sizes available</p>
              )}
            </div>
          </div>

          {(selectedColors.length > 0 || selectedSizes.length > 0 || showDiscountedOnly) && (
            <button
              onClick={() => {
                setSelectedColors([]);
                setSelectedSizes([]);
                setShowDiscountedOnly(false);
              }}
              className="mt-6 text-sm text-gray-500 underline hover:text-black"
            >
              Clear all filters
            </button>
          )}
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 text-sm">
              Showing {filteredAndSorted.length} of {products.length} products
            </p>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 bg-white text-black hover:border-black transition-colors"
              >
                {currentSortLabel}
                <ChevronDown size={16} />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[200px]">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        sortBy === option.value
                          ? "font-bold bg-gray-50"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredAndSorted.length === 0 ? (
            <p className="text-center text-gray-400 py-20">
              No products match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
