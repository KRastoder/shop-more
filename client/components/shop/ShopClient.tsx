"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { getImageSrc } from "@/lib/images";

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

  const toggleColor = useCallback((color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  }, []);

  const toggleSize = useCallback((size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }, []);

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortBy)?.label || "Newest";

  return (
    <div className="w-9/10 mx-auto py-10 md:py-20">
      <h1 className="text-center text-3xl md:text-4xl lg:text-6xl font-extrabold text-black mb-6 md:mb-10">
        ALL PRODUCTS
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Filters - Horizontal scroll on mobile, sidebar on desktop */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-4">
            {/* Mobile: Horizontal filter bar */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-4 mb-4 border-b border-gray-200">
              <button
                onClick={() => setShowDiscountedOnly(!showDiscountedOnly)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl border text-sm transition-colors ${
                  showDiscountedOnly
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {showDiscountedOnly ? "Discounted ✓" : "On Sale"}
              </button>
              {allColors.slice(0, 5).map((color) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs transition-colors ${
                    selectedColors.includes(color)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>

            {/* Desktop: Full filter sidebar */}
            <div className="hidden lg:block">
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3">Filters</h3>
                <button
                  onClick={() => setShowDiscountedOnly(!showDiscountedOnly)}
                  className={`w-full text-left px-4 py-2 rounded-xl border text-sm transition-colors ${
                    showDiscountedOnly
                      ? "bg-black text-white border-black"
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
                      className={`px-4 py-2 rounded-xl border text-sm transition-all duration-200 ${
                        selectedColors.includes(color)
                          ? "bg-black text-white border-black scale-105"
                          : "bg-white text-black border-gray-300 hover:border-black hover:scale-105"
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

              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-xl border text-sm transition-all duration-200 ${
                        selectedSizes.includes(size)
                          ? "bg-black text-white border-black scale-105"
                          : "bg-white text-black border-gray-300 hover:border-black hover:scale-105"
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
                  className="text-sm text-gray-500 underline hover:text-black transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <p className="text-gray-500 text-sm">
              Showing <span className="font-semibold text-black">{filteredAndSorted.length}</span> of <span className="font-semibold text-black">{products.length}</span> products
            </p>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 bg-white text-black hover:border-black transition-colors text-sm"
              >
                Sort: {currentSortLabel}
                <ChevronDown size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[200px] overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === option.value
                          ? "font-bold bg-gray-100 text-black"
                          : "text-gray-700 hover:bg-gray-50"
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
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No products match your filters.</p>
              <button
                onClick={() => {
                  setSelectedColors([]);
                  setSelectedSizes([]);
                  setShowDiscountedOnly(false);
                }}
                className="text-sm text-black underline hover:text-gray-600 transition-colors"
              >
                Clear filters to see all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
