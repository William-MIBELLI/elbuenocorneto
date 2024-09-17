'use server';

import { parseWithZod } from "@conform-to/zod";
import { baseDeliverySchema, homeDeliverySchema, mergePickerAndFormData, PickerDeliverySchema } from "../zod";
import { TransactionInsert } from "@/drizzle/schema";
import { v4 } from "uuid";
import { IPickerShop } from "@/interfaces/ILocation";

const createTransaction = (value: Omit<TransactionInsert, 'id'>): TransactionInsert => {
  const transaction: TransactionInsert = {
    id: v4(),
    ...value
  }

  return transaction;
}

export const handDeliveryACTION = async (state: unknown, fd: FormData) => {
  const submission = parseWithZod(fd, { schema: baseDeliverySchema })
  if (submission.status === 'success') {
    const transaction = createTransaction(submission.value);
    submission.payload['transaction'] = transaction;
  }
  return submission.reply()
  
}

export const lockerDeliveryACTION = async (data: IPickerShop | undefined ,state: unknown, fd: FormData) => {
  console.log('VALIDATE LOCKER : ', data);
  const merged = mergePickerAndFormData(data, fd);
  const submission = parseWithZod(merged, { schema: homeDeliverySchema });
  if (submission.status === 'success') {
    const transaction = createTransaction(submission.value);
    submission.payload['transaction'] = transaction;
  }

  return submission.reply();
}

export const homeDeliveryACTION = async (state: unknown, fd: FormData) => {

  //ON VALIDE LES INPUTS
  const submission = parseWithZod(fd, { schema: homeDeliverySchema });
  if (submission.status === 'success') {

    //SI C'EST OK ON CREE UN OBJET TRANSACTION
    const transaction = createTransaction(submission.value);

    //ON LE PASSE AU PAYLOAD
    submission.payload['transaction'] = transaction;
  }
  return submission.reply()
}