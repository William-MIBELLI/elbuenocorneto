'use server';

import { getDb } from "@/drizzle/db";
import { MessageInsert, messageTable } from "@/drizzle/schema";

export const createMessageOnDb = async (message: MessageInsert) => {
  try {
    const db = getDb();
    const msg = await db
      .insert(messageTable)
      .values(message)
      .returning().then((res) => res[0]);

    return msg;
  } catch (error: any) {
    console.log("ERROR CREATE MESSAGE ON DB ", error?.message);
    return null;
  }
}