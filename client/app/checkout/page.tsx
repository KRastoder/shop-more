"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getCart, clearCart, getCartTotal, type Cart } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSessionAndLoadCart = async () => {
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        router.replace("/sign-in");
        return;
      }

      const cartItems = getCart();
      if (cartItems.length === 0) {
        router.replace("/cart");
        return;
      }

      setCart(cartItems);
    };

    checkSessionAndLoadCart();
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError("Please enter a shipping address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        router.replace("/sign-in");
        return;
      }

       const orderData = {
         userId: session.user.id,
         totalPrice: getCartTotal(),
         address: address,
         items: cart.map(item => ({
           productId: item.productId,
           quantity: item.quantity,
           color: item.color,
           size: item.size,
         })),
       };

      const res = await fetch("http://localhost:8000/orders/with-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        router.push("/my-orders");
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Order Summary</h2>
          {cart.map((item: Cart[number]) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="flex justify-between py-2 border-b last:border-b-0"
            >
              <span className="text-gray-600">
                {item.name} ({item.color}, {item.size}) x{item.quantity}
              </span>
              <span className="text-black font-semibold">${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 text-xl font-bold text-black">
            <span>Total:</span>
            <span>${getCartTotal()}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Shipping Address</h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full shipping address..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
            rows={4}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Placing Order..." : `Place Order - $${getCartTotal()}`}
        </button>
      </div>
    </div>
  );
}
