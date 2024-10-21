"use server";

import { getDb } from "@/drizzle/db";
import { ratingInsert, ratingTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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
