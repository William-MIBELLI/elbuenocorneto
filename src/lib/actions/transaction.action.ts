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
import { updateTransactionStatusOnDb, createTransactionOnDB, getTransaction } from "../requests/transaction.request";
import { sendTransactionCreationNotif } from "./pusher.action";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { reserveProduct } from "../requests/product.request";

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

export const cancelTransactionACTION = async (transactionId: string) => {
  try {
    //ON RECUPERE L'ID DE L'USER DANS LA SESSION
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error('user ID missing in session');
    }

    const userId = session.user.id;

    //ON RECUPERE LA TRANSACTION CORRESPONDANTE AU productId
    const transactions = await getTransaction('id', transactionId);

    if (transactions.length === 0) {
      throw new Error('No transaction with this id');
    }

    const transaction = transactions[0];

    //ON CHECK QUE L'USER EN FAIT PARTI
    if (transaction.userId !== userId && transaction.sellerId !== userId) {
      throw new Error('User not belong to this transaction.')
    }

    //ON CHECK QU'ELLE N'A PAS ETE VALIDEE
    if (transaction.status !== 'CREATED') {
      throw new Error('This transaction can not be canceled.')
    }

    //SI OUI ON PASSE LE STATUS DE LA TRANSACTION A CANCEL
    await updateTransactionStatusOnDb(transactionId, 'CANCELED');

    //ON PASSE ISRESERVED DU PRODUCT A FALSE
    await reserveProduct(transaction.productId, false);

    //ON CANCEL LE PAYMENTINTENT SUR STRIPE

    //ON REVALIDE LES PATHS
    revalidatePath(`/product/${transaction.productId}`, 'page');
    revalidatePath('/mes-transactions', 'page');

    return true;
  } catch (error: any) {
    console.log('ERROR CANCEL TRANSACTION ACTION : ', error?.message);
    return null;
  }
}

export const acceptTransactionACTION = async (transactionId: string) => {
  try {
    //ON RECUPERE L'ID DE L'USER
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error('No userId on session.');
    }
    const userId = session.user.id;

    //ON RECUPERE LA TRANSACTION
    const transactions = await getTransaction('id', transactionId);

    if (transactions.length === 0) {
      throw new Error('No transaction found.');
    }
    const transaction = transactions[0];

    //ON VERIFIE QUE L'USER EST BIEN LE VENDEUR
    if (transaction.sellerId !== userId) {
      throw new Error('user is not the seller.');
    }

    //ON VERIFIE LE STATUS DE LA TRANSACTION
    if (transaction.status !== 'CREATED') {
      throw new Error('This transaction can not be accepted.');
    }

    //SI C'EST OK ON PASSE STATUS A ACCEPTED
    const updated = await updateTransactionStatusOnDb(transactionId, 'ACCEPTED');

    revalidatePath('/mes-transactions', 'layout');
  } catch (error: any) {
    console.log('ERROR ACCEPT TRANSACTION ACTION : ', error?.message);
    return null;
  }
}

export const getDeliveryInfoFromTransactionACTION = async (transactionId: string) => {
  try {
    //ON RECUPERE L'ID DE L'USER
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error('No userId on session.');
    }
    const userId = session.user.id;

    //ON RECUPERE LA TRANSACTION
    const transactions = await getTransaction('id', transactionId);

    if (transactions.length === 0) {
      throw new Error('No transaction found.');
    }
    const transaction = transactions[0];

    //ON VERIFIE QUE L'USER EST BIEN DANS LA TRANSACTION
    if (transaction.sellerId !== userId && transaction.userId !== userId) {
      throw new Error('user is not the seller.');
    }

    return transaction;
  } catch (error:any) {
    console.log('ERROR GET DELIVERY INFO ACTION ', error?.message);
    return null;
  }
}
