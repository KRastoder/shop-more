"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { User } from "better-auth";
import { signOut } from "@/lib/auth-actions";

export default function MobileMenu({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openedAtPath, setOpenedAtPath] = useState("");
  const pathname = usePathname();

  const toggleMenu = () => {
    if (!isOpen) {
      setOpenedAtPath(pathname);
    }
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => setIsOpen(false);

  // Derived visibility: closes automatically when pathname changes
  const isVisible = isOpen && openedAtPath === pathname;

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden z-50"
        aria-label="Toggle menu"
      >
        {isVisible ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isVisible && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="flex flex-col h-full pt-20 px-6 pb-8 overflow-y-auto">
            {/* Navigation Links */}
            <div className="space-y-6 mb-8">
              <Link
                href="/shop"
                className="block text-2xl font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={closeMenu}
              >
                Shop
              </Link>
              <Link
                href="/on-sale"
                className="block text-2xl font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={closeMenu}
              >
                On Sale
              </Link>
              <Link
                href="/new-arrivals"
                className="block text-2xl font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={closeMenu}
              >
                New Arrivals
              </Link>
              <Link
                href="/brands"
                className="block text-2xl font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={closeMenu}
              >
                Brands
              </Link>
            </div>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="flex items-center gap-2 text-xl font-semibold text-black mb-8"
              onClick={closeMenu}
            >
              <ShoppingCart />
              Cart
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="space-y-6 mt-auto">
                <Link
                  href="/my-orders"
                  className="block text-xl font-semibold text-black"
                  onClick={closeMenu}
                >
                  My Orders
                </Link>
                <form
                  action={signOut}
                  className="inline"
                >
                  <button
                    type="submit"
                    className="text-xl font-semibold text-gray-600"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 mt-auto">
                <Link
                  href="/sign-up"
                  className="block text-xl font-semibold text-black"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
                <Link
                  href="/sign-in"
                  className="block text-xl font-semibold text-black"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
