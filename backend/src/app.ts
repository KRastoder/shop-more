import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./auth/auth";
import { requireAuth } from "./middleware/auth.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", //TODO change later
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/test", requireAuth, (req, res) => {
  return res.status(200).json({ fail: true });
});

app.use(express.json()); // must come after auth routes according to better auth docs

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API IS RUNNING" });
});
export default app;
