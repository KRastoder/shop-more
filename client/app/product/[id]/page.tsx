import { ProductDataDTO } from "@/types";
import { notFound } from "next/navigation";
import ProductBuySection from "../../../components/productcomponents/ProductBuySection";
import NavBar from "../../../components/navcomponents/Navbar";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/product/${id}`);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status}`);
  }

  const product = await res.json();
  const data: ProductDataDTO = product.data;

  return (
    <>
      <NavBar />
      <div>
        <ProductBuySection data={data} />
      </div>
    </>
  );
}
