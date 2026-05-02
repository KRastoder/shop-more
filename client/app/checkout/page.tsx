"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getCart, clearCart, getCartTotal, type Cart } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const getItemPrice = (item: Cart[number]) => {
    return item.price; // Already discounted when added to cart
  };

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
          totalPrice: parseFloat(cartTotal.toFixed(2)),
          address: address,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            price: parseFloat(getItemPrice(item).toFixed(2)),
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
    <div className="min-h-screen bg-neutral-100 px-4 py-6 md:py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-black mb-3 md:mb-4">Order Summary</h2>
          <div className="space-y-2 md:space-y-3">
            {cart.map((item: Cart[number]) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-600 text-sm md:text-base flex-1">
                  {item.name} <span className="text-xs text-gray-400">({item.color}, {item.size}) ×{item.quantity}</span>
                </span>
                <span className="text-black font-semibold text-sm md:text-base ml-4">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 md:mt-4 pt-3 border-t border-gray-200 text-lg md:text-xl font-bold text-black">
             <span>Total:</span>
             <span>${cartTotal.toFixed(2)}</span>
           </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-black mb-3 md:mb-4">Shipping Address</h2>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full shipping address..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-black resize-none transition-all"
            rows={3}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !address.trim()}
          className="w-full bg-black text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-900 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Placing Order..." : `Place Order • $${cartTotal.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
