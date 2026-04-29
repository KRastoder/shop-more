import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./auth/auth";
import productRouter from "./modules/products/product.routes";

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
export default app;
