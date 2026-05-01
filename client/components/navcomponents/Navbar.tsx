"use client";

import Link from "next/link";
import DiscountBar from "./discount-bar";
import { CircleUser, ShoppingCart, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
    };
    checkSession();
  }, []);

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartCount());
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <nav className="flex flex-col justify-center items-center border-b border-second">
      <div className="w-full">
        <DiscountBar />
      </div>
      <div className="flex w-9/10 py-5 justify-between items-center">
        <div className="flex gap-7">
          <h1 className="text-black font-extrabold text-3xl text-center">
            SHOP.MORE
          </h1>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/shop" className="flex">
                Shop <ChevronDown />
              </Link>
            </li>
            <li>
              <Link href="/on-sale">On Sale</Link>
            </li>
            <li>
              <Link href="/new-arrivals">New Arrivals</Link>
            </li>
            <li>
              <Link href="/brands">Brands</Link>
            </li>
          </ul>
        </div>
        <div className="flex gap-5 items-center">
          <Link href="/cart" className="relative">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex gap-4 items-center">
              <Link href="/my-orders" className="text-black hover:underline text-sm">
                My Orders
              </Link>
              <button
                onClick={() => authClient.signOut()}
                className="text-sm text-gray-600 hover:text-black hover:underline"
              >
                Logout
              </button>
              <CircleUser />
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Link href="/sign-up" className="text-sm text-black hover:underline">
                Sign Up
              </Link>
              <Link href="/sign-in" className="text-sm text-black hover:underline">
                Sign In
              </Link>
              <Link href="/sign-in">
                <CircleUser />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
