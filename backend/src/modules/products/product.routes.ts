import { Router } from "express";
import {
  createProduct,
  createProductQuantityController,
  getNewArrivals,
} from "./product.controller";
import { validate } from "../../middleware/validate";
import { createProductQuantitySchema } from "./product.types";

const productRouter = Router();

productRouter.post("/", createProduct);

productRouter.post(
  "/quantity/:productId",
  validate(createProductQuantitySchema),
  createProductQuantityController,
);

productRouter.get("/newArrivals", getNewArrivals);

export default productRouter;
