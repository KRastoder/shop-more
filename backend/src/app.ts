import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./auth/auth";
import productRouter from "./modules/products/product.routes";
import orderRouter from "./modules/orders/order.routes";
import reviewRouter from "./modules/reviews/review.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json()); // must come after auth routes according to better auth docs

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API IS RUNNING" });
});

app.use("/uploads", express.static("uploads"));

app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/reviews", reviewRouter);
export default app;
