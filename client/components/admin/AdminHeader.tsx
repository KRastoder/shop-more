import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";

export default async function AdminHeader() {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/404");
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-9/10 mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-extrabold text-black hover:underline">
            SHOP.MORE
          </Link>
          <nav className="flex gap-4">
            <Link 
              href="/admin" 
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/orders" 
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              Orders
            </Link>
          </nav>
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
