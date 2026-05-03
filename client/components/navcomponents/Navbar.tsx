import Link from "next/link";
import { CircleUser, ShoppingCart, ChevronDown, Menu } from "lucide-react";
import { getSession } from "@/lib/get-session";
import CartCount from "./CartCount";
import MobileMenu from "./MobileMenu";

export default async function NavBar() {
  const session = await getSession();
  const user = session?.user ?? null;

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
                href="/shop?discounted=true"
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
            <CartCount />
          </Link>
          {user ? (
            <div className="flex gap-4 items-center">
              <Link href="/my-orders" className="text-sm hover:underline">
                My Orders
              </Link>
              <form
                action="/api/auth/sign-out"
                method="post"
              >
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-black hover:underline"
                >
                  Logout
                </button>
              </form>
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

        {/* Mobile Menu Button - Client Component */}
        <MobileMenu user={user} />
      </div>
    </nav>
  );
}
