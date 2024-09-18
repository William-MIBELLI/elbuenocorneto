"use server";

import { parseWithZod } from "@conform-to/zod";
import {
  baseDeliverySchema,
  homeDeliverySchema,
  mergePickerAndFormData,
  PickerDeliverySchema,
} from "../zod";
import { TransactionInsert } from "@/drizzle/schema";
import { v4 } from "uuid";
import { IPickerShop } from "@/interfaces/ILocation";
import { createTransactionOnDB } from "../requests/transaction.request";

const createTransactionObject = (
  value: Omit<TransactionInsert, "id">
): TransactionInsert => {
  const transaction: TransactionInsert = {
    id: v4(),
    ...value,
  };

  return transaction;
};

export const handDeliveryACTION = async (state: unknown, fd: FormData) => {
  const submission = parseWithZod(fd, { schema: baseDeliverySchema });
  if (submission.status === "success") {
    const transaction = createTransactionObject(submission.value);
    submission.payload["transaction"] = transaction;
  }
  return submission.reply();
};

export const lockerDeliveryACTION = async (
  data: IPickerShop | undefined,
  state: unknown,
  fd: FormData
) => {
  console.log("VALIDATE LOCKER : ", data);
  const merged = mergePickerAndFormData(data, fd);
  const submission = parseWithZod(merged, { schema: homeDeliverySchema });
  if (submission.status === "success") {
    const transaction = createTransactionObject(submission.value);
    submission.payload["transaction"] = transaction;
  }

  return submission.reply();
};

export const homeDeliveryACTION = async (state: unknown, fd: FormData) => {
  //ON VALIDE LES INPUTS
  const submission = parseWithZod(fd, { schema: homeDeliverySchema });
  if (submission.status === "success") {
    //SI C'EST OK ON CREE UN OBJET TRANSACTION
    const transaction = createTransactionObject(submission.value);

    //ON LE PASSE AU PAYLOAD
    submission.payload["transaction"] = transaction;
  }
  return submission.reply();
};

export const createTransactionACTION = async (transaction: TransactionInsert, paymentId: string) => {
  const updatedTransaction: TransactionInsert = {
    ...transaction,
    paymentIntentId: paymentId
  }
  try {
    const res = await createTransactionOnDB(updatedTransaction);
    if (!res) {
      throw new Error('res from createTransactionOnDB is null');
    }
    return true;
  } catch (error: any) {
    console.log('ERROR CREATE TRANSACTION ACTION : ', error?.message);
    return null;
  }
}
