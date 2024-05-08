import { getDb } from "@/drizzle/db";
import { products, users } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";


export const getUserForProfile = async (id: string) => {
  try {
    const db = await getDb();
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        products: {
          columns: {
            title: true,
            price: true,
            category: true,
            id: true,
            createdAt: true
          },
          with:{
            images: { limit: 1 },
            location: true
          }
        },
        location: {}
      },
      columns: {
        password: false
      }
    })
    return user;
  } catch (error) {
    console.log('ERROR FETCHING USER DATA FOR PROILE : ', error);
    return undefined;
  }
}

export const getUserById = async (id: string) => {
  try {
    const db = getDb();
    const user = await db
      .select({ count: sql<number>`cast(count(${products.userId}) as int)`, user: users })
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