import ShopClient from "@/components/shop/ShopClient";

async function getAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  return data.data;
}

interface PageProps {
  searchParams: Promise<{
    discounted?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const products = await getAllProducts();
  const { discounted } = await searchParams;
  const showDiscounted = discounted === "true";

  return <ShopClient products={products} initialDiscountedOnly={showDiscounted} />;
}
