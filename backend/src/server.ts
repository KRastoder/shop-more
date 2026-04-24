import express from "express";
import cors from "cors";
import userRotuer from "./modules/user/user.router";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "API IS RUNNING",
  });
});
app.use("/user", userRotuer);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
