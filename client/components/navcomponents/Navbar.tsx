"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

export default function NavBar() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartCount());
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // mobileMenuOpen resets when pathname changes (no effect needed)

  return (
    <nav className="border-b border-second">
      <div className="flex w-9/10 mx-auto py-4 md:py-5 justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-black font-extrabold text-2xl md:text-3xl hover:underline z-50"
        >
          SHOP.MORE
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-7 items-center">
          <ul className="flex items-center gap-4">
            <li>
              <Link
                href="/shop"
                className="flex items-center gap-1 hover:text-gray-600 transition-colors"
              >
                Shop <ChevronDown size={16} />
              </Link>
            </li>
            <li>
              <Link
                href="/on-sale"
                className="hover:text-gray-600 transition-colors"
              >
                On Sale
              </Link>
            </li>
            <li>
              <Link
                href="/new-arrivals"
                className="hover:text-gray-600 transition-colors"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/brands"
                className="hover:text-gray-600 transition-colors"
              >
                Brands
              </Link>
            </li>
          </ul>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex gap-5 items-center">
          <Link
            href="/cart"
            className="relative hover:opacity-70 transition-opacity"
          >
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex gap-4 items-center">
              <Link href="/my-orders" className="text-sm hover:underline">
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
              <Link href="/sign-up" className="text-sm hover:underline">
                Sign Up
              </Link>
              <Link href="/sign-in" className="text-sm hover:underline">
                Sign In
              </Link>
              <Link href="/sign-in">
                <CircleUser />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden z-50"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="flex flex-col h-full pt-20 px-6 pb-8 overflow-y-auto">
            {/* Navigation Links */}
            <div className="space-y-6 mb-8">
              <Link
                href="/shop"
                className="block text-2xl font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/on-sale"
                className="block text-2xl font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                On Sale
              </Link>
              <Link
                href="/new-arrivals"
                className="block text-2xl font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link
                href="/brands"
                className="block text-2xl font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brands
              </Link>
            </div>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="flex items-center gap-2 text-xl font-semibold text-black mb-8"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart />
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="space-y-6 mt-auto">
                <Link
                  href="/my-orders"
                  className="block text-xl font-semibold text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    authClient.signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xl font-semibold text-gray-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-6 mt-auto">
                <Link
                  href="/sign-up"
                  className="block text-xl font-semibold text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/sign-in"
                  className="block text-xl font-semibold text-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
