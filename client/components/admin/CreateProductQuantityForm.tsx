"use client";
import { useState } from "react";

type QuantityForm = {
  quantity: string;
  color: string;
  size: string;
};

export default function CreateProductQuantityForm({
  productId,
}: {
  productId: number;
}) {
  const [form, setForm] = useState<QuantityForm>({
    quantity: "",
    color: "",
    size: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch(
      `http://localhost:8000/products/quantity/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quantity: Number(form.quantity),
          color: form.color,
          size: form.size,
        }),
      },
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data?.error || data?.err || "Something went wrong");
      return;
    }

    setSuccess("Quantity added successfully!");
    setForm({ quantity: "", color: "", size: "" });
  };

  const inputClass =
    "w-full bg-white text-black border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center text-black">
          Add Product Quantity
        </h1>
        <p className="text-sm text-neutral-500 text-center">
          Product ID: {productId}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. 50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">
              Color
            </label>
            <input
              name="color"
              type="text"
              value={form.color}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Red"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Size</label>
            <input
              name="size"
              type="text"
              value={form.size}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. M"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add quantity"}
          </button>
        </form>
      </div>
    </div>
  );
}
