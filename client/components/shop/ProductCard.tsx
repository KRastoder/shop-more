import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { getImageSrc, isRemoteImage } from "@/lib/images";
import { memo } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  averageRating: number;
  images: { id: number; imageURL: string }[];
  quantities: { id: number; color: string; size: string; quantity: number }[];
};

function ProductCard({ product }: { product: Product }) {
  const src = getImageSrc(product.images?.[0]?.imageURL);
  const rating = product.averageRating ?? 0;
  const displayRating = rating === 0 ? 5 : rating;
  const isRemote = typeof src === "string" && isRemoteImage(src);

  return (
    <Link href={`/product/${product.id}`} className="block">
      <article className="p-3 rounded w-full group">
        <div className="relative w-full h-[300px] bg-gray-100 overflow-hidden rounded">
          <Image
             src={src}
             alt={product.name}
             fill
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
             className="rounded-4xl object-contain group-hover:scale-105 transition-transform duration-300"
             unoptimized={isRemote}
           />
        </div>

        <div className="mt-2 font-semibold">{product.name}</div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= displayRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating === 0 ? "No ratings" : `${rating}/5`}
          </span>
        </div>

        <p className="text-xl text-black font-bold mt-1">
          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
          {product.discount > 0 && (
            <>
              <span className="text-gray-400 line-through text-base ml-2">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded">
                -{product.discount}%
              </span>
            </>
          )}
        </p>
      </article>
    </Link>
  );
}

export default memo(ProductCard);
