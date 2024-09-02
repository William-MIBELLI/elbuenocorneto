"use server";

import { getDb } from "@/drizzle/db";
import {
  conversationTable,
  MessageInsert,
  messageTable,
} from "@/drizzle/schema";
import { and, count, eq, ne, or } from "drizzle-orm";

export const createMessageOnDb = async (message: MessageInsert) => {
  try {
    const db = getDb();
    const msg = await db
      .insert(messageTable)
      .values(message)
      .returning()
      .then((res) => res[0]);

    return msg;
  } catch (error: any) {
    console.log("ERROR CREATE MESSAGE ON DB ", error?.message);
    return null;
  }
};

export const getUnreadMessagesByUserId = async (userId: string) => {
  try {

    //SI PAS DE USER ID ON FAST RETURN
    if (userId === '') {
      return null
    }

    const db = getDb();

    //LA SUBREQUEST POUR RECUPERER TOUS LES MESSAGES DE TOUTES LES CONVERSATION DE L'UTILISATEUR
    const sq = db
      .select()
      .from(conversationTable)
      .where(
        or(
          eq(conversationTable.buyerId, userId),
          eq(conversationTable.sellerId, userId)
        )
      )
      .leftJoin(
        messageTable,
        eq(messageTable.conversationId, conversationTable.id)
      )
      .as("sq");

    //ON COUNT LE NOMBRE DE MESSAGES QUI ONT ISREAD === FALSE
    const req = await db
      .select({ count: count() })
      .from(sq)
      .where(and(
        eq(sq.message.isRead, false),
        ne(sq.message.senderId, userId)
      ));

    return req;
  } catch (error: any) {
    console.log("ERROR GET UNREAD MESSAGE COUNT REQUEST : ", error?.message);
    return null;
  }
};

export const updateIsReadByMsgId = async (messageId: string) => {
  try {
    const db = getDb();
    const updated = await db
      .update(messageTable)
      .set({ isRead: true })
      .where(eq(messageTable.id, messageId))
      .returning()
      .then(r => r[0]);
    
    return updated;
  } catch (error: any) {
    console.log("ERROR UPDATE ISREAD REQUEST : ", error?.message);
    return null;
  }
};
