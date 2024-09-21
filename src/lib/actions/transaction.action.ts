"use server";

import { parseWithZod } from "@conform-to/zod";
import {
  baseDeliverySchema,
  baseDeliverySchemaType,
  homeDeliverySchema,
  mergeDataAndFormData,
  mergePickerAndFormData,
} from "../zod";
import { TransactionInsert } from "@/drizzle/schema";
import { v4 } from "uuid";
import { IPickerShop } from "@/interfaces/ILocation";
import { createTransactionOnDB } from "../requests/transaction.request";
import { sendTransactionCreationNotif } from "./pusher.action";
import { revalidatePath } from "next/cache";

const createTransactionObject = (
  value: Omit<TransactionInsert, "id">
): TransactionInsert => {
  const transaction: TransactionInsert = {
    id: v4(),
    ...value,
  };

  return transaction;
};

export const handDeliveryACTION = async (data: baseDeliverySchemaType, state: unknown, fd: FormData) => {
  const merged = mergeDataAndFormData(data, fd);
  const submission = parseWithZod(merged, { schema: baseDeliverySchema });
  if (submission.status === "success") {
    const transaction = createTransactionObject(submission.value);
    submission.payload["transaction"] = transaction;
  }
  return submission.reply();
};

export const lockerDeliveryACTION = async (
  data: {
    selectedPicker: IPickerShop | undefined;
    baseData: Partial<TransactionInsert>
  },
  state: unknown,
  fd: FormData
) => {

  //ON MERGE LES INFO DU PICKER AVEC LES ENTRIES DE L'INPUTS
  const mergedPicker = mergePickerAndFormData(data.selectedPicker, fd);

  //ON REMERGED LE TOUT AVEC LES BASEDELIVERIES
  const mergedFinal = mergeDataAndFormData(data.baseData, mergedPicker);
  
  const submission = parseWithZod(mergedFinal, { schema: homeDeliverySchema });
  if (submission.status === "success") {
    const transaction = createTransactionObject(submission.value);
    submission.payload["transaction"] = transaction;
  }

  return submission.reply();
};

export const homeDeliveryACTION = async (data: baseDeliverySchemaType,state: unknown, fd: FormData) => {
  //ON VALIDE LES INPUTS
  const merged = mergeDataAndFormData(data, fd);
  const submission = parseWithZod(merged, { schema: homeDeliverySchema });
  if (submission.status === "success") {
    //SI C'EST OK ON CREE UN OBJET TRANSACTION
    const transaction = createTransactionObject(submission.value);

    //ON LE PASSE AU PAYLOAD
    submission.payload["transaction"] = transaction;
  }
  return submission.reply();
};

export const createTransactionACTION = async (transaction: TransactionInsert, paymentId: string) => {

  //ON AJOUTE LE PAYMENTINTENTID A LA TRANSACTION
  const updatedTransaction: TransactionInsert = {
    ...transaction,
    paymentIntentId: paymentId
  }
  try {

    //ON LA SAVER DANS LA DB
    const res = await createTransactionOnDB(updatedTransaction);
    if (!res) {
      throw new Error('res from createTransactionOnDB is null');
    }

    //SI LA SAVE EST OK, ON NOTIFIE LE VENDEUR
    await sendTransactionCreationNotif(res);
    
    revalidatePath(`/product/${transaction.productId}`, 'page');
    console.log('ON PASSE LE REVALIDATE PATH')
    return res;
  } catch (error: any) {
    console.log('ERROR CREATE TRANSACTION ACTION : ', error?.message);
    return null;
  }
}
