"use client";

import { useEffect, useState, useMemo } from "react";
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
import { getImageSrc } from "@/lib/images";

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

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      setCart([]);
    }
  };

  const cartTotal = useMemo(() => {
    return parseFloat(getCartTotal().toFixed(2));
  }, [cart]);

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-100 px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 text-center max-w-md w-full">
          <div className="mb-4 text-gray-300">
            <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
          <p className="text-gray-400 text-sm mb-6">Looks like you haven't added anything yet.</p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-black">Shopping Cart</h1>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="space-y-3 md:space-y-4">
          {cart.map((item: Cart[number]) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md p-4 md:p-6 flex gap-3 md:gap-4 items-center"
            >
              {/* Product Image */}
              <div className="relative w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.imageURL ? (
                  <Image
                    src={getImageSrc(item.imageURL)}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 64px, 96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-black text-sm md:text-base truncate">{item.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">Color: {item.color} | Size: {item.size}</p>
               <p className="text-base md:text-lg font-bold text-black mt-1">
                 ${item.price.toFixed(2)}
                 {item.discount > 0 && (
                   <span className="text-gray-400 line-through text-xs md:text-base ml-1 md:ml-2">
                     ${((item.price / (1 - item.discount / 100))).toFixed(2)}
                   </span>
                 )}
               </p>
              </div>

              {/* Quantity Controls - Stack on mobile */}
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleRemove(item)}
                  className="text-red-500 hover:text-red-700 text-xs transition-colors"
                >
                  Remove
                </button>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-6 md:w-8 text-center font-semibold text-sm md:text-base">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary + Checkout Button */}
        <div className="mt-6 md:mt-8 bg-white rounded-xl md:rounded-2xl shadow-sm md:shadow-md p-4 md:p-6">
          <div className="flex justify-between text-lg md:text-xl font-bold text-black">
            <span>Total:</span>
            <span>${cartTotal}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full mt-3 md:mt-4 bg-black text-white py-3 md:py-4 rounded-xl font-semibold hover:bg-gray-900 active:bg-gray-950 transition-colors text-sm md:text-base"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
