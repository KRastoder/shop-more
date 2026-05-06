import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth/auth";
import { fromNodeHeaders } from "better-auth/node";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ err: "Unauthorized" });
    }
    if (session.user.role !== "admin") {
      return res.status(403).json({ err: "Forbidden" });
    }
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ err: "Unauthorized" });
  } }