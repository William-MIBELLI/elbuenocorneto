"use server";

import { parseWithZod } from "@conform-to/zod";
import { createMessageSchema } from "../zod";
import { v4 as uuidv4 } from "uuid";
import { MessageInsert, MessageSelect } from "@/drizzle/schema";
import { createMessageOnDb } from "../requests/message.request";
import { sendMessageNotification } from "./pusher.action";

export const createMessageACTION = async (
  prevState: {
    error: string | undefined;
    success?: boolean;
    newMsg: undefined | MessageSelect;
  },
  fd: FormData
) => {
  try {
    console.log("CREATE MESSAGE ACTION ");
    //ON CHECK LES INPUTS
    const submission = parseWithZod(fd, { schema: createMessageSchema });

    if (submission.status !== "success") {
      const err = submission.reply().error;
      throw new Error("Erreur de validation, merci de vérifier les champs");
    }
    //ON RECUPERE LES VALUES
    const { content, conversationId, senderId } = submission.value;
    console.log("VALUES ", content, conversationId, senderId);

    //ON CREE LE MESSAGEINSERT
    const message: MessageInsert = {
      id: uuidv4(),
      conversationId,
      content,
      senderId,
    };

    //ON ENVOIE LE MESSAGE DANS LA DB
    const msg: MessageSelect | null = await createMessageOnDb(message);

    if (!msg) {
      throw new Error("Erreur lors de la création du message");
    }

    //ON ENVOIE UNE NOTIF VIA PUSHER
    const notif = await sendMessageNotification(msg);
    console.log('NOTIF : ', notif);


    return { error: undefined, success: true, newMsg: msg };
  } catch (error: any) {
    console.log("ERROR CREATE MESSAGE ACTION ", error?.message);
    return { error: error?.message, success: false, newMsg: undefined };
  }
};

export const sendMessageForTransaction = async () => {
  
}
