import { Search } from 'lucide-react';
"use server";

import { parseWithZod } from "@conform-to/zod";
import { createConversationSchema } from "../zod";
import { ConversationInsert, MessageInsert } from "@/drizzle/schema";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";
import { checkIfExistingConversation, createConversationOnDb } from "../requests/conversation.request";
import { error } from "console";
import { createMessageOnDb } from "../requests/message.request";

export const startConversationACTION = async (prevState: { error: string | undefined, success?: boolean}, fd: FormData) => {
  try {
    //ON CHECK SI L'USER EST CONNECTE
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new Error('Vous devez être connecté pour pouvoir envoyer un message');
    }

    //ON CHECK LES INPUTS
    const submission = parseWithZod(fd, {
      schema: createConversationSchema,
    });

    //SI IL Y A UNE ERREUR ON THROW UNE ERREUR
    if (submission.status !== 'success') {
      const err = submission.reply().error
      console.log('ERROR SUBMISSION ', err);
      throw new Error('Erreur de validation, merci de vérifier les champs');
    }

    const { message: content, productId, sellerId } = submission.value;

    //ON CREE LE MESSAGEINSERT SANS LE CONVERSATION ID
    const message: MessageInsert = {
      id: uuidv4(),
      conversationId: '',
      content,
      senderId: session.user.id,
    }

    //ON CHECK SI UNE CONVERSATION EXISTE DEJA
    const exisitingConv = await checkIfExistingConversation(productId, sellerId, session.user.id);
    
    //SI PAS DE CONVERSATION TROUVEE, ON LA CREE
    if (!exisitingConv) {

      const conv: ConversationInsert = {
        id: uuidv4(),
        productId,
        sellerId,
        buyerId: session.user.id,
      }
  
      const conversation = await createConversationOnDb(conv);

      //SI LA CREDATION RETURN NULL, ON THROW UNE ERREUR
      if (!conversation) {
        throw new Error('Impossible de créer la conversation');
      }

      //ON SET LE CONVERSATION ID DANS LE MESSAGE
      message.conversationId = conversation.id;
    } else {

      //SI UNE CONVERSATION EXISTE, ON SET LE CONVERSATION ID DANS LE MESSAGE
      message.conversationId = exisitingConv.id;
    }

    //ON CREE LE MESSAGE DANS LA DB
    const mess = await createMessageOnDb(message);

    console.log('MESSAGE ', mess);
    if (!mess) {
      throw new Error('Impossible d\'envoyer le message');
    }

    return { success: true, error: undefined};
  } catch (error: any) {
    console.log('ERROR START CONVERSATION ACTION ', error?.message);
    return { error: error?.message, success: false };
  }
}