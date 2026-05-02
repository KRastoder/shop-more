"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import ProductModal from "./ProductModal";

type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  averageRating?: number;
  createdAt?: string;
  images: { id: number; imageURL: string }[];
  quantities: { id: number; color: string; size: string; quantity: number }[];
};

type FilterTab = "all" | "in-stock" | "out-of-stock" | "low-stock";

export default function AdminClient({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const getImageSrc = (imageURL?: string) => {
    if (!imageURL) return null;
    return imageURL.startsWith("http")
      ? imageURL
      : `${process.env.NEXT_PUBLIC_API_URL}${imageURL}`;
  };

  const getTotalStock = (product: Product) =>
    product.quantities.reduce((sum, q) => sum + q.quantity, 0);

  const filteredProducts = useMemo(() => {
    switch (filter) {
      case "in-stock":
        return products.filter((p) => getTotalStock(p) > 0);
      case "out-of-stock":
        return products.filter((p) => getTotalStock(p) === 0);
      case "low-stock":
        return products.filter((p) => {
          const stock = getTotalStock(p);
          return stock > 0 && stock < 5;
        });
      default:
        return products;
    }
  }, [products, filter]);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => getTotalStock(p) > 0).length;
    const outOfStock = products.filter((p) => getTotalStock(p) === 0).length;
    const lowStock = products.filter((p) => {
      const stock = getTotalStock(p);
      return stock > 0 && stock < 5;
    }).length;
    return { total, inStock, outOfStock, lowStock };
  }, [products]);

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${deleteProduct.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
        setDeleteProduct(null);
      }
    } catch (e) {
      console.error("Delete error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSaved = (savedProduct: Product, isEdit: boolean) => {
    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) => (p.id === savedProduct.id ? savedProduct : p)),
      );
    } else {
      setProducts((prev) => [savedProduct, ...prev]);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="w-9/10 mx-auto py-10 md:py-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-black">ADMIN DASHBOARD</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-gray-900 transition cursor-pointer text-sm md:text-base"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
        {[
          { label: "Total Products", value: stats.total, color: "bg-white" },
          { label: "In Stock", value: stats.inStock, color: "bg-green-50" },
          { label: "Low Stock", value: stats.lowStock, color: "bg-yellow-50" },
          { label: "Out of Stock", value: stats.outOfStock, color: "bg-red-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200`}>
            <p className="text-gray-500 text-xs md:text-sm">{stat.label}</p>
            <p className="text-2xl md:text-4xl font-bold text-black mt-1 md:mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2">
        {([
          { key: "all", label: "All" },
          { key: "in-stock", label: "In Stock" },
          { key: "out-of-stock", label: "Out of Stock" },
          { key: "low-stock", label: "Low Stock" },
        ] as { key: FilterTab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-shrink-0 px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              filter === tab.key
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300 hover:border-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 text-sm font-medium text-gray-500">Image</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Price</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Stock</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const stock = getTotalStock(product);
              const isOutOfStock = stock === 0;
              const isLowStock = stock > 0 && stock < 5;
              const src = getImageSrc(product.images?.[0]?.imageURL);

              return (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {src ? (
                        <Image src={src} alt={product.name} fill unoptimized className="object-contain p-1" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-black">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {product.quantities.length} variants
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-black">${product.price}</p>
                    {product.discount > 0 && (
                      <p className="text-xs text-gray-400 line-through">
                        ${product.price + product.discount}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-black font-medium">{stock}</p>
                    <p className="text-xs text-gray-400">
                      {product.quantities.length} variants
                    </p>
                  </td>
                  <td className="p-4">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-medium">
                        <XCircle size={14} />
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-medium">
                        <AlertCircle size={14} />
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                        <CheckCircle size={14} />
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/products/product/${product.id}`,
                            { credentials: "include" },
                          )
                            .then((res) => res.json())
                            .then((data) => {
                              setEditingProduct(data.data);
                              setShowModal(true);
                            });
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                      >
                        <Pencil size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => setDeleteProduct(product)}
                        className="p-2 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-400 py-20">No products match this filter.</p>
        )}
      </div>

      {/* Product Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map((product) => {
          const stock = getTotalStock(product);
          const isOutOfStock = stock === 0;
          const isLowStock = stock > 0 && stock < 5;
          const src = getImageSrc(product.images?.[0]?.imageURL);

          return (
            <div key={product.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {src ? (
                    <Image src={src} alt={product.name} fill unoptimized className="object-contain p-1" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-black truncate">{product.name}</p>
                  <p className="text-sm font-bold text-black mt-1">${product.price}</p>
                  <div className="mt-2">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-xs font-medium">
                        <XCircle size={12} />
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full text-xs font-medium">
                        <AlertCircle size={12} />
                        Low Stock ({stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                        <CheckCircle size={12} />
                        In Stock ({stock})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/products/product/${product.id}`,
                      { credentials: "include" },
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        setEditingProduct(data.data);
                        setShowModal(true);
                      });
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm hover:bg-gray-100 rounded-lg transition"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteProduct(product)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-400 py-10">No products match this filter.</p>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleProductSaved}
        />
      )}

      {/* Delete Confirmation */}
      {deleteProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-black mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteProduct.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteProduct(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-black font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
