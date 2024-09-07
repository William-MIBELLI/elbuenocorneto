"use server";

import { parseWithZod } from "@conform-to/zod";
import { createConversationSchema } from "../zod";
import { ConversationInsert, conversationTable, MessageInsert } from "@/drizzle/schema";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";
import {
  checkIfExistingConversation,
  ConversationListItemType,
  ConversationListType,
  createConversationOnDb,
  deleteConversationOnDB,
  getUserConversations,
} from "../requests/conversation.request";
import { error } from "console";
import { createMessageOnDb } from "../requests/message.request";
import { revalidatePath } from "next/cache";
import { getPusherServer } from "../pusher/server";
import { creationConversationNotification, sendMessageNotification } from "./pusher.action";
import { sql } from "drizzle-orm";

export const startConversationACTION = async (
  prevState: { error: string | undefined; success?: boolean },
  fd: FormData
) => {
  try {
    //ON CHECK SI L'USER EST CONNECTE
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new Error(
        "Vous devez être connecté pour pouvoir envoyer un message"
      );
    }

    //ON CHECK LES INPUTS
    const submission = parseWithZod(fd, {
      schema: createConversationSchema,
    });

      //SI IL Y A UNE ERREUR ON THROW UNE ERREUR
    if (submission.status !== "success") {
      const err = submission.reply().error;
      console.log("ERROR SUBMISSION ", err);
      throw new Error("Erreur de validation, merci de vérifier les champs");
    }

    const { message: content, productId, sellerId } = submission.value;

    //ON CREE LE MESSAGEINSERT SANS LE CONVERSATION ID
    const message: MessageInsert = {
      id: uuidv4(),
      conversationId: "",
      content,
      senderId: session.user.id,
    };

    //ON CHECK SI UNE CONVERSATION EXISTE DEJA
    const exisitingConv = await checkIfExistingConversation(
      productId,
      sellerId,
      session.user.id
    );

    //SI PAS DE CONVERSATION TROUVEE, ON LA CREE
    if (!exisitingConv) {
      const conv: ConversationInsert = {
        id: uuidv4(),
        productId,
        sellerId,
        buyerId: session.user.id,
      };

      const conversation = await createConversationOnDb(conv);

      //SI LA CREATION RETURN NULL, ON THROW UNE ERREUR
      if (!conversation) {
        throw new Error("Impossible de créer la conversation");
      }

      //ON SET LE CONVERSATION ID DANS LE MESSAGE
      message.conversationId = conversation.id;
    } else {
      //SI UNE CONVERSATION EXISTE, ON SET LE CONVERSATION ID DANS LE MESSAGE
      message.conversationId = exisitingConv.id;
    }

    //ON CREE LE MESSAGE DANS LA DB
    const mess = await createMessageOnDb(message);

    if (!mess) {
      throw new Error("Impossible d'envoyer le message");
    }

    //ON ENVOIE UNE NOTIF
    if (!exisitingConv) {
      const notified = await creationConversationNotification(sellerId, message.conversationId);
      console.log('CREATION NOTIF SEND');
    } else {
      const notified = await sendMessageNotification(mess);
      console.log('MESSAGE NOTIF SEND');
    }
    
    return { success: true, error: undefined };
  } catch (error: any) {
    console.log("ERROR START CONVERSATION ACTION ", error?.message);
    return { error: error?.message, success: false };
  }
};

export const deleteConversationACTION = async (
  convo: ConversationListItemType
) => {
  try {
    //ON CHECK SI L'USER EST CONNECTE
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new Error(
        "Vous devez être connecté pour pouvoir supprimer une conversation"
      );
    }

    //ON CHECK SI LA CONVERSATION EXISTE
    // const conv = await checkIfExistingConversation(
    //   convo.productId,
    //   convo.sellerId,
    //   session.user.id
    // );
    const conv: ConversationListType = await getUserConversations(sql`${conversationTable.id} = ${convo.id}`);

    //ON CHECK QUE L'USER FAIT PARTI DE LA CONVERSATION
    if (
      !conv ||
      (conv[0].buyerId !== session.user.id && conv[0].sellerId !== session.user.id)
    ) {
      console.log('ERROR DELETE : ', conv, convo);
      throw new Error("Impossible de supprimer cette conversation.");
    }

    //ON DELETE LA CONVERSATION
    const deletedConv = await deleteConversationOnDB(conv[0].id);

    //ON CHECK SI LA CONVERSAITON A ETE DELETE
    if (!deletedConv) {
      throw new Error("Impossible de supprimer la conversation");
    }

    //ON ENVOIE LA NOTIF VIA PUSHER
    const pusherServer = getPusherServer();
    pusherServer.trigger(
      [deletedConv.buyerId, deletedConv.sellerId],
      "delete_conversation",
      deletedConv.id
    );

    //ON REVALIDE LE PATH POUR /MESSAGES
    //revalidatePath("/messages");
    return true;
  } catch (error: any) {
    console.log("ERROR DELETE CONVERSATION ACTION ", error?.message);
    return false;
  }
};
