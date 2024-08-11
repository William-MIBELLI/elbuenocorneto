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

    //ON CHECKE SI UNE CONVERSATION EXISTE DEJA
    const exisitingConv = await checkIfExistingConversation(productId, sellerId, session.user.id);
    
    if (exisitingConv.length > 0) {
      throw new Error('Vous avez déjà une conversation en cours avec ce vendeur concernant cette annonce.');
    }

    //ON CREE D'ABORD LA CONVERSATION
    const conv: ConversationInsert = {
      id: uuidv4(),
      productId,
      sellerId,
      buyerId: session.user.id,
    }

    const conversation = await createConversationOnDb(conv);

    //SI PAS DE CONVERSATION ON RETOURNE UNE ERREUR
    if (!conversation) {
      throw new Error('Impossible de créer la conversation');
    }

    //ON CREE ENSUITE LE MESSAGE
    const message: MessageInsert = {
      id: uuidv4(),
      conversationId: conversation.id,
      content,
      senderId: session.user.id,
    }

    const mess = await createMessageOnDb(message);

    if (!mess) {
      throw new Error('Impossible d\'envoyer le message');
    }

    return { success: true, error: undefined};
  } catch (error: any) {
    console.log('ERROR START CONVERSATION ACTION ', error?.message);
    return { error: error?.message, success: false };
  }
}