import { z } from "zod";
import { product, productQuantity } from "../../db/schemas/product-schema";
import { InferSelectModel } from "drizzle-orm";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().int().positive("Price must be a positive integer"),
  description: z.string().min(1, "Description is required"),
  discount: z.number().int().min(0).max(99).default(0),
});

export const createProductQuantitySchema = z.object({
  quantity: z.number().int().positive("Quanityty must be a positive integer"),
  color: z.string().min(1, "Description is required"),
  size: z.string().min(1, "Size is required"),
});

export const createProductWithImagesAndQuantity = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().int().positive("Price must be a positive integer"),
  description: z.string().min(1, "Description is required"),
  discount: z.number().int().min(0).max(99).default(0),
  quantity: z.number().int().positive("Quanityty must be a positive integer"),
  color: z.string().min(1, "Description is required"),
  size: z.string().min(1, "Size is required"),
  imageURL: z.string().array().nonempty({ error: "Can't be empty" }).min(1),
});

//========================= EXPORTS ================================
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type Product = InferSelectModel<typeof product>;

export type CreateProductQuantityInput = z.infer<
  typeof createProductQuantitySchema
>;
export type ProductQuantityType = InferSelectModel<typeof productQuantity>;

export type CreateProductWithImagesAndQuantityInput = z.infer<
  typeof createProductWithImagesAndQuantity
>;
