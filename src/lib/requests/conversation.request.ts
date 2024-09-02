"use server";

import { getDb } from "@/drizzle/db";
import {
  ConversationInsert,
  ConversationSelect,
  conversationTable,
  MessageSelect,
  messageTable,
} from "@/drizzle/schema";
import { and, asc, desc, eq, or } from "drizzle-orm";

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
      )
      .then((res) => res[0]);

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
        messages: {
          orderBy: [desc(messageTable.createdAt)],
          limit: 1
        },
        product: {
          with: {
            images: true,
            location: true,
          },
        },
        buyer: true,
        seller: true,
      },
    });

    return convos;
  } catch (error: any) {
    console.log("ERROR GET USER CONVERSATIONS ", error?.message);
    return [];
  }
};

export const getConversationMessages = async (
  convoId: string
): Promise<MessageSelect[]> => {
  try {
    const db = getDb();
    const messages = await db.query.messageTable.findMany({
      where: eq(messageTable.conversationId, convoId),
    });

    return messages;
  } catch (error: any) {
    console.log("ERROR GET CONVERSATION MESSAGES ", error?.message);
    return [];
  }
};

export const deleteConversationOnDB = async (convoId: string) => {
  try {
    const db = getDb();
    const deleted = await db
      .delete(conversationTable)
      .where(eq(conversationTable.id, convoId))
      .returning()
      .then((res) => res[0]);

    return deleted;
  } catch (error: any) {
    console.log("ERROR DELETE CONVERSATION ON DB ", error?.message);
    return null;
  }
};

export const getConversationById = async (convoId: string) => {
  try {
    const db = getDb();
    const convo = await db
      .select()
      .from(conversationTable)
      .where(eq(conversationTable.id, convoId))
      .then((r) => r[0]);
    return convo;
  } catch (error: any) {
    console.log("ERROR GET CONVERSATION REQUEST : ", error?.message);
    return null;
  }
};

export type ConversationListType = Awaited<
  ReturnType<typeof getUserConversations>
>;

export type ConversationListItemType = ConversationListType[number];
