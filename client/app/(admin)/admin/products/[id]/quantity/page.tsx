import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  return (
    <div className="w-9/10 mx-auto py-20">
      <h1 className="text-3xl font-bold text-black mb-4">Manage Product Quantity</h1>
      <p className="text-gray-500">
        Use the{" "}
        <a href="/admin" className="underline hover:text-black">
          Admin Dashboard
        </a>{" "}
        to manage product quantities.
      </p>
    </div>
  );
}
