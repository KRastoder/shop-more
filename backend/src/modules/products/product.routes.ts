import { Router } from "express";
import {
  createProduct,
  createProductQuantityController,
  getNewArrivals,
  makeFullProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "./product.controller";
import { validate } from "../../middleware/validate";
import { createProductQuantitySchema, createProductSchema } from "./product.types";
import { upload } from "../../middleware/upload";
import { requireAdmin } from "../../middleware/admin.middleware";
import { requireAuth } from "../../middleware/auth.middleware";

const productRouter = Router();

productRouter.post("/", requireAdmin, createProduct);

productRouter.post("/full", requireAdmin, upload.array("images", 5), makeFullProduct);

productRouter.post(
  "/quantity/:productId",
  requireAdmin,
  validate(createProductQuantitySchema),
  createProductQuantityController,
);

productRouter.put(
  "/:id",
  requireAdmin,
  validate(createProductSchema.partial()),
  updateProduct,
);

productRouter.delete("/:id", requireAdmin, deleteProduct);

productRouter.get("/", getAllProducts);
productRouter.get("/newArrivals", getNewArrivals);
productRouter.get("/product/:id", getProductById);

export default productRouter;
