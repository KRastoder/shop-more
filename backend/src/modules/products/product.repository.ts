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
