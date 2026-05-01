"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  discount: number;
  images: { id: number; imageURL: string }[];
  quantities: { id: number; color: string; size: string; quantity: number }[];
};

type Variant = {
  color: string;
  size: string;
  quantity: string;
};

type Props = {
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Product, isEdit: boolean) => void;
};

export default function ProductModal({ product, onClose, onSave }: Props) {
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [discount, setDiscount] = useState(product?.discount?.toString() ?? "0");
  const [images, setImages] = useState<File[]>([]);
  const [variants, setVariants] = useState<Variant[]>(
    product?.quantities?.length
      ? product.quantities.map((q) => ({
          color: q.color,
          size: q.size,
          quantity: q.quantity.toString(),
        }))
      : [{ color: "", size: "", quantity: "" }],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addVariant = () => {
    setVariants((prev) => [...prev, { color: "", size: "", quantity: "" }]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        if (isEdit && product) {
          // UPDATE existing product
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                name,
                price: Number(price),
                description,
                discount: Number(discount),
              }),
            },
          );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "Failed to update product");
        }

        const data = await res.json();
        onSave(data.data, true);
      } else {
        // CREATE new product with images and quantities
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("discount", discount);

        // Append images
        images.forEach((file) => {
          formData.append("images", file);
        });

        // Append quantity data as JSON
        const validVariants = variants.filter(
          (v) => v.color && v.size && v.quantity,
        );
        if (validVariants.length > 0) {
          formData.append("quantity", validVariants[0].quantity);
          formData.append("color", validVariants[0].color);
          formData.append("size", validVariants[0].size);
        }

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/full`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.message || "Failed to create product");
        }

        const data = await res.json();
          // Fetch the full product with images/quantities
          const fullRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/product/${data.data.id}`,
          );
        const fullData = await fullRes.json();
        onSave(fullData.data, false);
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">
            {isEdit ? "Edit Product" : "Create Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-white text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/70 transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 bg-white text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/70 transition"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Discount (0-99)</label>
              <input
                type="number"
                min={0}
                max={99}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full mt-1 bg-white text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/70 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 bg-white text-black border border-gray-300 rounded-lg px-4 py-3 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-black/70 transition"
              required
            />
          </div>

          {!isEdit && (
            <div>
              <label className="text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
                className="w-full mt-1 bg-white text-black border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-black file:text-white file:cursor-pointer"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">Variants (Color / Size / Stock)</label>
              {!isEdit && (
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-sm text-black font-medium hover:underline cursor-pointer"
                >
                  + Add Variant
                </button>
              )}
            </div>
            <div className="space-y-3">
              {variants.map((variant, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <input
                    type="text"
                    placeholder="Color"
                    value={variant.color}
                    onChange={(e) => updateVariant(i, "color", e.target.value)}
                    className="flex-1 bg-white text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/70 transition"
                    disabled={isEdit}
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    value={variant.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                    className="flex-1 bg-white text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/70 transition"
                    disabled={isEdit}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={variant.quantity}
                    onChange={(e) => updateVariant(i, "quantity", e.target.value)}
                    className="flex-1 bg-white text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/70 transition"
                    disabled={isEdit}
                  />
                  {!isEdit && variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-black font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-900 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
