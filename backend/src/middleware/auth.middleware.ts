import type { Request, Response, NextFunction } from "express";
import { auth } from "../auth/auth";
import { fromNodeHeaders } from "better-auth/node";

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.session = session;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
