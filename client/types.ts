//============PRODUCT TYPES============//

//This is response from get product by id
export type ProductDataDTO = {
  id: number;
  name: string;
  price: number;
  description: string;
  discount: number | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  averageRating: number;

  images: {
    id: number;
    imageURL: string;
  }[];

  quantities: {
    id: number;
    color: string;
    size: string;
    quantity: number;
  }[];

  quantitiesCount: number;

  reviews: {
    id: number;
    rating: number;
    createdAt: string;
    user: {
      id: string | null;
      name: string | null;
      image: string | null;
    };
  }[];

  reviewsCount: number;
};
