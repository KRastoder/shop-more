import { eq } from "drizzle-orm";
import db from "../../db";
import { usersTable } from "../../db/schemas/user-schema";
import bcrypt from "bcrypt";

export const userRepository = {
  create: async (
    role: string,
    name: string,
    email: string,
    password: string,
  ) => {
    const [checkIfUserExists] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (checkIfUserExists) {
      throw new Error("You already have an account");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db
      .insert(usersTable)
      .values({
        role,
        name,
        password: hashedPassword,
        email,
      })
      .returning();

    if (!user || user.length === 0) {
      throw new Error("Could not make user");
    }

    return user;
  },
};
