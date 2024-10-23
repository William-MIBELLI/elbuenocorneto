import { getDb } from "@/drizzle/db";
import {
  InsertUser,
  products,
  ratingSelect,
  ratingTable,
  SelectUser,
  transactionTable,
  users,
} from "@/drizzle/schema";
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
        seller: {
          columns: {},
          with: {
            rating: {
              columns: {
                rate: true,
              },
            },
          },
        },
      },
      columns: {
        password: false,
      },
    });
    return user;
  } catch (error: any) {
    console.log("ERROR FETCHING USER DATA FOR PROILE : ", error?.message);
    return undefined;
  }
};

export const getUserById = async (id: string) => {
  try {
    const db = getDb();

    //ON RECUPERE LES DATAS DU USER, LE COUNT DE SES PRODUCTS ET SES RATES
    const user = await db
      .select({
        user: users,
        count: db.$count(products, eq(products.userId, id)),
        rating: ratingTable,
      })
      .from(users)
      .leftJoin(transactionTable, eq(transactionTable.sellerId, id))
      .leftJoin(ratingTable, eq(ratingTable.transactionId, transactionTable.id))
      .where(eq(users.id, id))
      .groupBy(users.id, ratingTable.id);

    type AccumulatedUser = {
      user: SelectUser;
      count: number;
      ratings: ratingSelect[];
    };

    //ON MAP LE RESULTAT POUR EN FAIRE UN SEUL OBJET
    const mappedUser = user.reduce<AccumulatedUser>((acc, current) => {
      // Si c'est la première itération, on initialise l'accumulateur
      if (!acc.user) {
        return {
          user: current.user,
          count: current.count,
          ratings: current.rating ? [current.rating] : [],
        };
      }

      // Sinon on ajoute le rating au tableau s'il existe
      return {
        ...acc,
        ratings: current.rating
          ? [...acc.ratings, current.rating]
          : acc.ratings,
      };
    }, {} as AccumulatedUser);

    return mappedUser;
  } catch (error: any) {
    console.log("ERROR FETCHING USER : ", error?.message);
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
