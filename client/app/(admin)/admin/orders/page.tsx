import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { cookies } from "next/headers";

export default async function AdminOrdersPage() {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/404");
  }

  const cookieStore = await cookies();

  // Fetch all orders using server-side credentials
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  const orders = res.ok ? await res.json() : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="w-9/10 mx-auto py-10 md:py-20">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-black mb-8">
          ALL ORDERS
        </h1>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <p className="p-8 text-center text-gray-400">
            Orders feature coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
