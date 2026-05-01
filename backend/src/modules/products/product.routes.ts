import { Router } from "express";
import {
  createProduct,
  createProductQuantityController,
  getNewArrivals,
  makeFullProduct,
  getProductById,
  getAllProducts,
} from "./product.controller";
import { validate } from "../../middleware/validate";
import { createProductQuantitySchema } from "./product.types";
import { upload } from "../../middleware/upload";

const productRouter = Router();

productRouter.post("/", createProduct);

productRouter.post("/full", upload.array("images", 5), makeFullProduct);

productRouter.post(
  "/quantity/:productId",
  validate(createProductQuantitySchema),
  createProductQuantityController,
);

productRouter.get("/newArrivals", getNewArrivals);
productRouter.get("/", getAllProducts);
productRouter.get("/product/:id", getProductById);

export default productRouter;
