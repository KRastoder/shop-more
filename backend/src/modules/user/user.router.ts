import Router from "express";
import { createUserController } from "./user.controller";

const userRotuer = Router();

userRotuer.post("/create", createUserController);
export default userRotuer;
