import CreateProductQuantityForm from "@/components/admin/CreateProductQuantityForm";
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
  const { id } = await params;

  return <CreateProductQuantityForm productId={Number(id)} />;
}
