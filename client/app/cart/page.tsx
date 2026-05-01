"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  getCartTotal,
  clearCart,
  type Cart,
} from "@/lib/cart";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>([]);

  useEffect(() => {
    const checkSessionAndLoadCart = async () => {
      const { data: session } = await authClient.getSession();
      if (!session?.user) {
        router.replace("/sign-in");
        return;
      }
      setCart(getCart());
    };

    checkSessionAndLoadCart();

    // Listen for storage changes
    const handleStorage = () => setCart(getCart());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [router]);

  const handleRemove = (item: Cart[number]) => {
    removeFromCart(item.productId, item.color, item.size);
    setCart(getCart());
  };

  const handleQuantityChange = (item: Cart[number], newQty: number) => {
    if (newQty < 1) return;
    updateCartQuantity(item.productId, item.color, item.size, newQty);
    setCart(getCart());
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-100 px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Shopping Cart</h1>

        <div className="space-y-4">
          {cart.map((item: Cart[number]) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="bg-white rounded-2xl shadow-md p-6 flex gap-4 items-center"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageURL ? (
                  <Image
                    src={`http://localhost:8000${item.imageURL}`}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-black">{item.name}</h3>
                <p className="text-sm text-gray-500">Color: {item.color} | Size: {item.size}</p>
                <p className="text-lg font-bold text-black mt-1">${item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary + Checkout Button */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between text-xl font-bold text-black">
            <span>Total:</span>
            <span>${getCartTotal()}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
