import { eq, desc, sql } from "drizzle-orm";
import db from "../../db";
import {
  product,
  productQuantity,
  productReview,
  productImages,
} from "../../db/schemas/product-schema";
import type {
  CreateProductInput,
  Product,
  ProductQuantityType,
} from "./product.types";

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

export const getNewArrivalsRepo = async () => {
  const result = await db
    .select({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      discount: product.discount,
      createdAt: product.createdAt,
      averageRating: sql<number | null>`
      (SELECT AVG(${productReview.rating})
       FROM ${productReview}
       WHERE ${productReview.productId} = ${product.id})
    `,
      images: sql<{ id: number; imageURL: string }[] | null>`
      (SELECT json_agg(
        json_build_object(
          'id', ${productImages.id},
          'imageURL', ${productImages.imageURL}
        )
      )
      FROM ${productImages}
      WHERE ${productImages.productId} = ${product.id})
    `,
    })
    .from(product)
    .orderBy(desc(product.createdAt))
    .limit(4);

  return result;
};
