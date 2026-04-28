import CreateProductQuantityForm from "@/components/admin/CreateProductQuantityForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CreateProductQuantityForm productId={Number(id)} />;
}
