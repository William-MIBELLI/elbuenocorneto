"use server";

import { getDb } from "@/drizzle/db";
import {
  images,
  products,
  TransactionInsert,
  transactionTable,
} from "@/drizzle/schema";
import { and, count, eq, or } from "drizzle-orm";

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
    
    const transactionsQuery = await db.query.transactionTable.findMany({
      where: or(
        eq(transactionTable.userId, userId),
        eq(transactionTable.sellerId, userId)
      ),
      with: {
        product: {
          with: {
            images: true
          }
        },
        seller: {
          columns: {
            id: true,
            name: true
          }
        },
        delivery: true
      }
    })

    return transactionsQuery;
  } catch (error: any) {
    console.log("ERROR GET USER TRANSACTION REQUEST : ", error?.message);
    return [];
  }
};

export type UserTransactions = Awaited<ReturnType<typeof getUserTransactions>>;
export type UserTransactionItem = UserTransactions[number];

export const getWaitingTransactions = async (userId: string) => {
  try {
    const db = getDb();
    const res = await db.select({ id: transactionTable.id }).from(transactionTable).where(and(
      eq(transactionTable.sellerId, userId),
      eq(transactionTable.status, 'CREATED')
    ))
    return res;
  } catch (error: any) {
    console.log('ERROR GET WAITING TRANSACTION REQUEST : ', error?.message);
    return null;
  }
}
