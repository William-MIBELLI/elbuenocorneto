"use server";

import { ConversationListType, getConversationById, getUserConversations } from "../requests/conversation.request";
import { getPusherServer } from "../pusher/server";
import { ConversationSelect, conversationTable, MessageSelect, TransactionSelect } from "@/drizzle/schema";
import { auth } from "@/auth";
import { sql } from "drizzle-orm";

export const sendMessageNotification = async (message: MessageSelect) => {
  const { conversationId: convoId, senderId } = message;
  try {
    //ON RECUPERE LA CONVO
    const convo = await getConversationById(convoId);
    if (!convo) {
      return null;
    }

    //ON RECUPERE L'ID DE L'USER QUI N'A PAS ENVOYE LE MESSAGE
    const userIdToNotif = convo.buyerId === senderId ? convo.sellerId : convo.buyerId;

    //ON RECUPERE LE PUSHER SERVER
    const pusherServer = getPusherServer();
    
    //ON TRIGGER L'EVENT
    pusherServer.trigger(userIdToNotif, 'new_message', message);
    console.log('USER TO NOTIF : ', userIdToNotif);
    
    return true;

  } catch (error: any) {
    console.log('ERROR SEND MESSAGE NOTIF ACTION : ', error?.message);
    return null;
  }
}

export const creationConversationNotification = async (userIdToNotif: string, convoId: string) => {

  try {
    const pusherServer = getPusherServer();
    const convo: ConversationListType = await getUserConversations(sql`${conversationTable.id} = ${convoId}`);
    if (!convo) {
      throw new Error('NO USER CONVO MATCHED WITH THIS CONDITION');
    }
    pusherServer.trigger(userIdToNotif, 'create_conversation', convo[0]);
    
  } catch (error: any) {
    console.log('ERROR CREATION CONVERSATION NOTIFICATION : ', error?.message);
    return null;
  }
}

export const sendTransactionCreationNotif = async (transaction: TransactionSelect) => {
  try {
    const pusher = getPusherServer();
    pusher.trigger(transaction.sellerId, 'transaction_creation', { transactionId: transaction.id});
  } catch (error: any) {
    console.log('ERROR SENDING TRANSACTION CREATION NOTIF : ', error?.message);
    return null;
  }
}