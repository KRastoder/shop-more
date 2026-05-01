import ShopClient from "@/components/shop/ShopClient";

async function getAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  return data.data;
}

export default async function ShopPage() {
  const products = await getAllProducts();

  return <ShopClient products={products} />;
}
