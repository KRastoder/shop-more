import type { Request, Response } from "express";
import { userRepository } from "./user.repository";
export const createUserController = async (req: Request, res: Response) => {
  try {
    const { role, name, email, password } = req.body;

    await userRepository.create(role, name, email, password);

    res.status(200).json({ msg: "You created an account successfully" });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500); // upgrade later for more verbose error msg handling
  }
};
