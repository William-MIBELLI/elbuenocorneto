"use server";

import { getDb } from "@/drizzle/db";
import {
  products,
  TransactionInsert,
  transactionTable,
} from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";

export const createTransactionOnDB = async (transaction: TransactionInsert) => {
  try {
    const db = getDb();
    const trans = await db
      .insert(transactionTable)
      .values(transaction)
      .returning()
      .then((r) => r[0]);
    if (!trans) {
      throw new Error("Creation failed");
    }
    return trans;
  } catch (error: any) {
    console.log("ERROR CREATE TRANSACTION REQUEST : ", error?.message);
    return null;
  }
};

export const getUserTransactions = async (userId: string) => {
  try {
    const db = getDb();

    const transactions = await db
      .select()
      .from(transactionTable)
      .leftJoin(
        products,
        eq(transactionTable.productId, products.id)
      )
      .where(
        or(
          eq(transactionTable.userId, userId),
          eq(products.userId, userId)
        )
      );

    return transactions;
  } catch (error: any) {
    console.log("ERROR GET USER TRANSACTION REQUEST : ", error?.message);
    return [];
  }
};
