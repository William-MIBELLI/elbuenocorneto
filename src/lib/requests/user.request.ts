import { getDb } from "@/drizzle/db";
import { products, users } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export const getUserForProfile = async (id: string) => {
  try {
    const db = getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        products: {
          with: {
            images: { limit: 1 },
            location: true,
            favorites: true,
          },
        },
        location: {},
      },
      columns: {
        password: false,
      },
    });
    return user;
  } catch (error) {
    console.log("ERROR FETCHING USER DATA FOR PROILE : ", error);
    return undefined;
  }
};

export const getUserById = async (id: string) => {
  try {
    const db = getDb();
    const user = await db
      .select({
        count: sql<number>`cast(count(${products.userId}) as int)`,
        user: users,
      })
      .from(products)
      .where(eq(products.userId, id))
      .rightJoin(users, eq(users.id, id))
      .groupBy(users.id)
      .then((res) => res[0]);
    return user;
  } catch (error) {
    console.log("ERROR FETCHING USER : ", error);
    return null;
  }
};

export const getUserForUpdate = async (id: string) => {
  try {
    const db = getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        location: true,
      },
    });
    return user ?? null;
  } catch (error) {
    console.log("ERROR FETCHING USER FOR UPDATE : ", error);
    return null;
  }
};

export const updateUserWalletOnDb = async (userId: string, amount: number) => {
  try {
    const db = getDb();
    const updated = await db
      .update(users)
      .set({ walletAmout: sql`${users.walletAmout} + ${amount}` })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  } catch (error: any) {
    console.log("ERROR UPDATE USER WALLET REQUEST : ", error?.message);
    return null;
  }
};
