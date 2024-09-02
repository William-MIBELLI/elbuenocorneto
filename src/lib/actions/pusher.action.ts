"use server";

import { getConversationById } from "../requests/conversation.request";
import { getPusherServer } from "../pusher/server";
import { MessageSelect } from "@/drizzle/schema";

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