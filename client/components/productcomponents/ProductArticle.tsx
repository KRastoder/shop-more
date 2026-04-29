import Image from "next/image";
import { Star } from "lucide-react";

type ProductProps = {
  id: number;
  name: string;
  price: number;
  discount: number;
  averageRating: number;
  imageURL?: string;
};

export default function ProductArticle(props: ProductProps) {
  const image = props.imageURL;

  const src = image?.startsWith("http")
    ? image
    : image
      ? `http://localhost:8000${image}`
      : null;

  const rating = props.averageRating ?? 0;
  const displayRating = rating === 0 ? 5 : rating;

  return (
    <article className=" p-3 rounded w-[300px]">
      <div className="relative w-full h-[300px] bg-gray-100 overflow-hidden rounded">
        {src ? (
          <Image
            src={src}
            alt={props.name}
            fill
            unoptimized
            className="rounded-4xl"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="mt-2 font-semibold">{props.name}</div>

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

      <p className="text-xl text-black font-bold">${props.price}</p>
    </article>
  );
}
