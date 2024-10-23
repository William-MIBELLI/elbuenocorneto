"use server";

import { getDb } from "@/drizzle/db";
import { ratingInsert, ratingTable, transactionTable, users } from "@/drizzle/schema";
import { asc, eq, sql } from "drizzle-orm";

type key = keyof (typeof ratingTable)["_"]["columns"];

export const getRates = async (column: key, value: string | number) => {
  try {
    const db = getDb();

    const rates = await db
      .select()
      .from(ratingTable)
      .where(eq(ratingTable[column], value));

    return rates;
  } catch (error: any) {
    console.log("ERROR GET RATES REQUEST : ", error?.message);
    return [];
  }
};

export const insertRateOnDB = async (rate: ratingInsert) => {
  try {
    const db = getDb();
    const inserted = await db
      .insert(ratingTable)
      .values(rate)
      .returning()
      .then((r) => r[0]);

    return inserted;
  } catch (error: any) {
    console.log("ERROR INSERT RATE REQUEST : ", error?.message);
    return null;
  }
};

export const getRatesDetails = async (userId: string) => {
  try {
    const db = getDb();
    const rates = await db.query.ratingTable.findMany({
      where: (ratings, { sql }) =>
        sql`${ratings.transactionId} IN (
          SELECT "id" 
          FROM "transaction" 
          WHERE "seller_id" = ${userId}
        )`,
      with: {
        transaction: {
          columns: {
            createdAt: true,
            productTitle: true,
          },
          with: {
            user: {
              columns: {
                name: true,
                image: true,
              },
            },
            seller: {
              columns: {
                name: true
              }
            }
          },
        },
      },
      
    });

    const selectRates = await db
      .select()
      .from(ratingTable)
      .leftJoin(transactionTable, eq(transactionTable.id, ratingTable.transactionId))
      .leftJoin(users, eq(users.id, transactionTable.userId))
      .where(eq(transactionTable.sellerId, userId));
    
    // console.log('SELECT RATES : ', selectRates)
    return rates;
  } catch (error: any) {
    console.log("ERROR GET RATES DETAILS REQUEST : ", error?.message);
    return [];
  }
};

export type IRatingList = Awaited<ReturnType<typeof getRatesDetails>>;
export type IRatingDetails = IRatingList[number] ;
