import OrdersClient from "@/components/admin/orders/OrdersClient";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { AdminOrderDTO } from "@/types/order";

export default async function AdminOrdersPage() {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/404");
  }

  const cookieStore = await cookies();

  // Fetch all orders using server-side credentials (admin endpoint)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  const data = res.ok ? await res.json() : { data: [] };
  const orders: AdminOrderDTO[] = data.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <OrdersClient initialOrders={orders} />
    </div>
  );
}
