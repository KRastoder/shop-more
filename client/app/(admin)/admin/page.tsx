import AdminHeader from "@/components/admin/AdminHeader";
import AdminClient from "@/components/admin/AdminClient";
import { getSession } from "@/lib/get-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/404");
  }

  // Fetch products with cookies so backend knows we're admin
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  const data = await res.json();
  const products = data.data || [];

  return (
    <div>
      <AdminClient products={products} />
    </div>
  );
}
