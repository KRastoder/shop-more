import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createProductSchema,
  CreateProductQuantityInput,
  createProductWithImagesAndQuantity,
} from "./product.types";
import {
  createProductRepo,
  createProductQuantityRepo,
  getNewArrivalsRepo,
  createFullProduct,
} from "./product.repository";

//TODO ADD A LOT MORE STUFF THIS IS EARLY TESTING LIKE IMAGES PROB NEED TO CHANGE ZOD TYPES
export const createProduct = async (req: Request, res: Response) => {
  try {
    const validated = createProductSchema.parse(req.body);
    const product = await createProductRepo(validated);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (e) {
    //Refactor later for better error handling
    console.error("create product controller", e);
    if (e instanceof ZodError) {
      return res.status(500).json({
        success: false,
        error: e.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "Iternal server error",
    });
  }
};

export const createProductQuantityController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { quantity, color, size } = req.body as CreateProductQuantityInput;
    const productId = Number(req.params.productId);

    if (!productId) {
      res.status(400).json({ success: false, msg: "Missing product id" });
    }
    const newProductQuantity = await createProductQuantityRepo(
      productId,
      quantity,
      color,
      size,
    );

    return res.status(201).json({
      success: true,
      msg: "Successfully added quantity to the product",
      data: newProductQuantity,
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Product not found") {
        return res
          .status(400)
          .json({ success: false, err: "Product not found" });
      }
    }
    console.error("createProductQuantityController error", e);
    return res.status(500).json({ err: "Iternal server error" });
  }
};

export const getNewArrivals = async (req: Request, res: Response) => {
  try {
    const newArrivals = await getNewArrivalsRepo();
    return res.status(201).json({ success: true, data: newArrivals });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, err: "Iternal server error" });
  }
};

export const makeFullProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    const imageURL = files.map((file) => `/uploads/${file.filename}`);

    const body = {
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      discount: Number(req.body.discount || 0),
      imageURL,
    };

    const validated = createProductWithImagesAndQuantity.parse(body);

    const product = await createFullProduct(validated);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Error",
    });
  }
};
