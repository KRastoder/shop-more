import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate =
  (schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = z.treeifyError(error);
        return res.status(400).json({
          status: "validation_error",
          errors: formatted,
        });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
