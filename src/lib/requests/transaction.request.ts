"use server";

import { getDb } from "@/drizzle/db";
import {
  images,
  products,
  TransactionInsert,
  TransactionStatusEnum,
  transactionTable,
} from "@/drizzle/schema";
import { and, asc, count, desc, eq, getTableColumns, ne, or } from "drizzle-orm";

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

type Keys = keyof (typeof transactionTable)["_"]["columns"];

const sensitiveKeys: Keys[] = [
  "addressLine",
  "city",
  "country",
  "firstname",
  "houseNumber",
  "lastname",
  "phoneNumber",
  "phoneNumber",
];

export const getUserTransactions = async (userId: string) => {
  try {
    const db = getDb();

    const transactionsQuery = await db.query.transactionTable.findMany({
      where: or(
        eq(transactionTable.userId, userId),
        eq(transactionTable.sellerId, userId)
      ),
      with: {
        product: {
          with: {
            images: true,
          },
        },
        seller: {
          columns: {
            id: true,
            name: true,
            phone: true,
          },
        },

        delivery: true,
        user: {
          columns: {
            id: true,
            phone: true,
          },
        },
      },
      orderBy: [desc(transactionTable.createdAt)]
    });

    //ON MAP LES INFO DE LA TRANSACTION SELON SON STATUS
    //POUR PAS QUE LE VENDEUR AIT ACCES AUX INFOS DE L'ACHETEUR AVANT D'AVOIR ACCEPTE
    const mapped = transactionsQuery.map(item => {
      if (item.status === 'ACCEPTED') {
        return item;
      }
      const mappedItem = { ...item };
      sensitiveKeys.forEach(key => {
        if (key in mappedItem) {
          delete(mappedItem)[key]
        }
      })
      return mappedItem
    })

    return mapped;
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
    const res = await db
      .select({ id: transactionTable.id })
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.sellerId, userId),
          eq(transactionTable.status, "CREATED")
        )
      );
    return res;
  } catch (error: any) {
    console.log("ERROR GET WAITING TRANSACTION REQUEST : ", error?.message);
    return null;
  }
};

type transactionKey = keyof (typeof transactionTable)["_"]["columns"];

export const getTransaction = async <T extends Partial<transactionKey>>(
  col: T,
  value: any
) => {
  try {
    const db = getDb();
    const transaction = await db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable[col], value));
    return transaction;
  } catch (error: any) {
    console.log("ERROR GET TRANSACTION REQUEST : ", error?.message);
    return [];
  }
};

type Status = (typeof TransactionStatusEnum.enumValues)[number];

export const updateTransactionStatusOnDb = async (
  transactionId: string,
  status: Status
) => {
  try {
    const db = getDb();

    const updated = await db
      .update(transactionTable)
      .set({ status: status })
      .where(eq(transactionTable.id, transactionId))
      .returning();
    if (updated.length === 0) {
      throw new Error("0 raw updated");
    }
    return true;
  } catch (error: any) {
    console.log("ERROR CANCEL TRANSACTION REQUEST : ", error?.message);
    return null;
  }
};
