import { eq } from "drizzle-orm";
import db from "../../db";
import { usersTable } from "../../db/schemas/user-schema";

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

    const user = await db.insert(usersTable).values({
      role: role,
      name: name,
      password: password, // HASH later
      email: email,
    });

    return user;
  },
};
