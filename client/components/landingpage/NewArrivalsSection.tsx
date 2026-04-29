import ProductArticle from "../productcomponents/ProductArticle";

type ProductCardDTO = {
  id: number;
  name: string;
  price: number;
  discount: number;
  averageRating: number;
  images: {
    imageURL: string;
  }[];
};

async function getNewArrivals() {
  const res = await fetch(`http://localhost:8000/products/newArrivals`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
}

export default async function NewArrivalsSection() {
  const data = await getNewArrivals();
  const products: ProductCardDTO[] = data.data;

  return (
    <section className="flex flex-col  py-20 gap-10 border-b-2 border-b-gray-900">
      <h1 className="text-center text-6xl font-extrabold ">NEW ARRIVALS</h1>
      <div className="flex gap-10 justify-center ">
        {products.map((product) => (
          <ProductArticle
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            discount={product.discount}
            averageRating={product.averageRating ?? 0}
            imageURL={product.images?.[0]?.imageURL ?? ""}
          />
        ))}
      </div>
      <div className="flex items-center justify-center">
        <button className="outline outline-gray-500 w-50 px-5 py-5 rounded-4xl">
          View all
        </button>
      </div>
    </section>
  );
}
