import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    role: z.string().min(3), //change to enum later
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  }),
});
