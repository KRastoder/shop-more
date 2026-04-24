import Router from "express";
import { createUserController } from "./user.controller";

const userRouter = Router();

userRouter.post("/create", createUserController);

export default userRouter;
