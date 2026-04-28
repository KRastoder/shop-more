"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductForm = {
  name: string;
  price: string;
  description: string;
  discount: string;
};

export default function CreateProductForm() {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: "",
    description: "",
    discount: "0",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("http://localhost:8000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        description: form.description,
        discount: Number(form.discount),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data?.error || "Something went wrong");
      return;
    }

    setSuccess("Product created successfully!");
    setTimeout(() => router.push("/admin"), 800);
  };

  const inputClass =
    "w-full bg-white text-black border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/70 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center text-black">
          Create Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Product name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">
              Price (cents or whole number)
            </label>
            <input
              name="price"
              type="number"
              min={1}
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. 2999"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} resize-none h-28`}
              placeholder="Product description"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-700">
              Discount (0–99%)
            </label>
            <input
              name="discount"
              type="number"
              min={0}
              max={99}
              value={form.discount}
              onChange={handleChange}
              className={inputClass}
              placeholder="0"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create product"}
          </button>
        </form>
      </div>
    </div>
  );
}
