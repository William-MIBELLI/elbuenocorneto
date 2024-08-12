"use server";

import { getDb } from "@/drizzle/db";
import { ConversationInsert, ConversationSelect, conversationTable } from "@/drizzle/schema";
import { and, eq, or } from "drizzle-orm";

export const createConversationOnDb = async (
  conversation: ConversationInsert
) => {
  try {
    const db = getDb();
    const conv = await db
      .insert(conversationTable)
      .values(conversation)
      .returning()
      .then((res) => res[0]);

    return conv;
  } catch (error: any) {
    console.log("ERROR CREATE CONVERSATION ON DB ", error?.message);
    return null;
  }
};

export const checkIfExistingConversation = async (
  productId: string,
  sellerId: string,
  buyerId: string
): Promise<ConversationSelect | null> => {
  try {
    const db = getDb();
    const conv = await db
      .select()
      .from(conversationTable)
      .where(
        and(
          eq(conversationTable.productId, productId),
          eq(conversationTable.sellerId, sellerId),
          eq(conversationTable.buyerId, buyerId)
        )
      ).then((res) => res[0]);

    return conv;
  } catch (error: any) {
    console.log("ERROR CHECK IF EXISTING CONVERSATION ", error?.message);
    return null;
  }
};

export const getUserConversations = async (userId: string) => {
  try {
    const db = getDb();
    
    const convos = await db.query.conversationTable.findMany({
      where: or(
        eq(conversationTable.buyerId, userId),
        eq(conversationTable.sellerId, userId)
      ),
      with: {
        messages: true,
        product: true,
        buyer: true,
        seller: true,
      }
    })

    console.log('CONVS ', convos);

    return convos;
  } catch (error: any) {
    console.log("ERROR GET USER CONVERSATIONS ", error?.message);
    return [];
  }
}

export type ConversationListType = Awaited<ReturnType<typeof getUserConversations>>;

export type ConversationListItemType = ConversationListType[number];
