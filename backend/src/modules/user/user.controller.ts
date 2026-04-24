import type { Request, Response } from "express";
import { userRepository } from "./user.repository";
export const createUserController = async (req: Request, res: Response) => {
  try {
    const { role, name, email, password } = req.body;

    if (!role || !name || !email || !password) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    await userRepository.create(role, name, email, password);

    res.status(201).json({ msg: "You created an account successfully" });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "You already have an account") {
        return res.status(409).json({ msg: e.message });
      }
    }
    console.error("Register error:", e);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
