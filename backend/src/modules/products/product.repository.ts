import { eq, desc, avg } from "drizzle-orm";
import db from "../../db";
import {
  product,
  productQuantity,
  productReview,
  productImages,
} from "../../db/schemas/product-schema";
import type {
  CreateProductInput,
  CreateProductWithImagesAndQuantityInput,
  Product,
  ProductQuantityType,
} from "./product.types";
import { user } from "../../db/schemas/auth-schema";
import { QueryBuilder } from "drizzle-orm/pg-core";

export const createProductRepo = async (
  data: CreateProductInput,
): Promise<Product> => {
  const [created] = await db
    .insert(product)
    .values({
      name: data.name,
      price: data.price,
      description: data.description,
      discount: data.discount,
    })
    .returning();

  return created;
};

export const createProductQuantityRepo = async (
  productId: number,
  quantity: number,
  color: string,
  size: string,
): Promise<ProductQuantityType> => {
  const [existingProduct] = await db
    .select()
    .from(product)
    .where(eq(product.id, productId))
    .limit(1);

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const [newQuantity] = await db
    .insert(productQuantity)
    .values({
      productId,
      color,
      quantity,
      size,
    })
    .returning();

  return newQuantity;
};

//TODO ADD CATCHING
export const getNewArrivalsRepo = async () => {
  const result = await db
    .select({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      createdAt: product.createdAt,

      averageRating: avg(productReview.rating).mapWith(Number),

      imageId: productImages.id,
      imageURL: productImages.imageURL,
    })
    .from(product)
    .leftJoin(productImages, eq(productImages.productId, product.id))
    .leftJoin(productReview, eq(productReview.productId, product.id))
    .groupBy(product.id, productImages.id, productImages.imageURL)
    .orderBy(desc(product.createdAt))
    .limit(4);

  // tiny cleanup only (group images properly)
  const map = new Map<number, any>();

  for (const row of result) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        name: row.name,
        price: row.price,
        discount: row.discount,
        createdAt: row.createdAt,
        averageRating: row.averageRating ?? 0,
        images: [],
      });
    }

    const product = map.get(row.id);

    if (row.imageId) {
      product.images.push({
        id: row.imageId,
        imageURL: row.imageURL,
      });
    }
  }

  return Array.from(map.values());
};

export const createFullProduct = async (
  data: CreateProductWithImagesAndQuantityInput,
) => {
  return await db.transaction(async (tx) => {
    const { imageURL, quantity, color, size, ...productData } = data;

    // 1. Insert product
    const [newProduct] = await tx
      .insert(product)
      .values(productData)
      .returning();

    // 2. Insert quantity
    await tx.insert(productQuantity).values({
      productId: newProduct.id,
      quantity,
      color,
      size,
    });

    // 3. Insert images
    await tx.insert(productImages).values(
      imageURL.map((url) => ({
        productId: newProduct.id,
        imageURL: url,
      })),
    );

    return newProduct;
  });
};

export const fetchProductById = async (id: number) => {
  // Get product data first (no joins)
  const productData = await db
    .select({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productDescription: product.description,
      productClothingType: product.clothingType,
      productDiscount: product.discount,
      productRating: product.rating,
      productCreatedAt: product.createdAt,
      productUpdatedAt: product.updatedAt,
    })
    .from(product)
    .where(eq(product.id, id))
    .limit(1);

  if (!productData.length) return null;

  const first = productData[0];

  // Get images
  const images = await db
    .select({
      id: productImages.id,
      imageURL: productImages.imageURL,
    })
    .from(productImages)
    .where(eq(productImages.productId, id));

  // Get quantities
  const quantities = await db
    .select({
      id: productQuantity.id,
      color: productQuantity.color,
      size: productQuantity.size,
      quantity: productQuantity.quantity,
    })
    .from(productQuantity)
    .where(eq(productQuantity.productId, id));

  // Get reviews with user info
  const reviews = await db
    .select({
      id: productReview.id,
      rating: productReview.rating,
      createdAt: productReview.createdAt,
      userId: user.id,
      userName: user.name,
      userImage: user.image,
    })
    .from(productReview)
    .leftJoin(user, eq(user.id, productReview.userId))
    .where(eq(productReview.productId, id));

  const avgRating =
    reviews.length > 0
      ? Math.round(
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
        )
      : 0;

  const response: any = {
    id: first.productId,
    name: first.productName,
    price: first.productPrice,
    description: first.productDescription,
    clothingType: first.productClothingType,
    discount: first.productDiscount,
    rating: first.productRating,
    createdAt: first.productCreatedAt,
    updatedAt: first.productUpdatedAt,
    averageRating: avgRating,
    images,
    quantities,
    quantitiesCount: quantities.length,
  };

  // Only include reviews if they exist
  if (reviews.length > 0) {
    response.reviews = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      createdAt: r.createdAt,
      user: {
        id: r.userId,
        name: r.userName,
        image: r.userImage,
      },
    }));
    response.reviewsCount = reviews.length;
  }

  return response;
};
