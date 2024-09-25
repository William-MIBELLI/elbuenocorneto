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
import {
  updateTransactionStatusOnDb,
  createTransactionOnDB,
  getTransaction,
} from "../requests/transaction.request";
import { sendTransactionCreationNotif } from "./pusher.action";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { reserveProduct } from "../requests/product.request";
import { Stripe } from 'stripe'
import { capturePaymentACTION } from "./stripe.action";
import { updateUserWalletOnDb } from "../requests/user.request";

const createTransactionObject = (
  value: Omit<TransactionInsert, "id">
): TransactionInsert => {
  const transaction: TransactionInsert = {
    id: v4(),
    ...value,
  };

  return transaction;
};

const checkIfUSerISPartOfTransaction = async (
  transactionId: string,
  onlySeller: boolean,
  onlyBuyer: boolean
) => {
  try {
    //ON RECUPERE L'ID DE L'USER DANS LA SESSION
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("user ID missing in session");
    }

    const userId = session.user.id;

    //ON RECUPERE LA TRANSACTION CORRESPONDANTE AU productId
    const transactions = await getTransaction("id", transactionId);

    if (transactions.length === 0) {
      throw new Error("No transaction with this id");
    }

    const transaction = transactions[0];

    //ON CHECK QUE L'USER EN FAIT PARTI
    if (transaction.userId !== userId && transaction.sellerId !== userId) {
      throw new Error("User not belong to this transaction.");
    } else if (onlySeller && transaction.sellerId !== userId) {
      throw new Error("User is not the seller");
    } else if (onlyBuyer && transaction.userId !== userId) {
      throw new Error("Usert is not the buyer");
    }

    //ON RETURN LA TRANSACTION
    return transaction;
  } catch (error: any) {
    console.log("ERROR CHECK USER PART OF TRANS ACTION : ", error?.message);
    return null;
  }
};

export const handDeliveryACTION = async (
  data: baseDeliverySchemaType,
  state: unknown,
  fd: FormData
) => {
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
    baseData: Partial<TransactionInsert>;
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

export const homeDeliveryACTION = async (
  data: baseDeliverySchemaType,
  state: unknown,
  fd: FormData
) => {
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

export const createTransactionACTION = async (
  transaction: TransactionInsert,
  paymentId: string
) => {
  //ON AJOUTE LE PAYMENTINTENTID A LA TRANSACTION
  const updatedTransaction: TransactionInsert = {
    ...transaction,
    paymentIntentId: paymentId,
  };
  try {
    //ON LA SAVER DANS LA DB
    const res = await createTransactionOnDB(updatedTransaction);
    if (!res) {
      throw new Error("res from createTransactionOnDB is null");
    }

    //SI LA SAVE EST OK, ON NOTIFIE LE VENDEUR
    await sendTransactionCreationNotif(res);

    revalidatePath(`/product/${transaction.productId}`, "page");
    console.log("ON PASSE LE REVALIDATE PATH");
    return res;
  } catch (error: any) {
    console.log("ERROR CREATE TRANSACTION ACTION : ", error?.message);
    return null;
  }
};

export const cancelTransactionACTION = async (transactionId: string) => {
  try {
    //TODOD RECUP TRANSACTION FROM CHECK
    const transaction = await checkIfUSerISPartOfTransaction(
      transactionId,
      false, false
    );

    if (!transaction) {
      throw new Error("No transaction with this id.");
    }
    //ON CHECK QU'ELLE N'A PAS ETE VALIDEE
    if (transaction.status !== "CREATED") {
      throw new Error("This transaction can not be canceled.");
    }

    //SI OUI ON PASSE LE STATUS DE LA TRANSACTION A CANCEL
    await updateTransactionStatusOnDb(transactionId, "CANCELED");

    //ON PASSE ISRESERVED DU PRODUCT A FALSE
    await reserveProduct(transaction.productId, false);

    //ON CANCEL LE PAYMENTINTENT SUR STRIPE

    //ON REVALIDE LES PATHS
    revalidatePath(`/product/${transaction.productId}`, "page");
    revalidatePath("/mes-transactions", "page");

    return true;
  } catch (error: any) {
    console.log("ERROR CANCEL TRANSACTION ACTION : ", error?.message);
    return null;
  }
};

export const acceptTransactionACTION = async (transactionId: string) => {
  try {
    const transaction = await checkIfUSerISPartOfTransaction(
      transactionId,
      true, false
    );

    if (!transaction) {
      throw new Error("Check failed");
    }

    //ON VERIFIE LE STATUS DE LA TRANSACTION
    if (transaction.status !== "CREATED") {
      throw new Error("This transaction can not be accepted.");
    }

    //SI C'EST OK ON PASSE STATUS A ACCEPTED
    const updated = await updateTransactionStatusOnDb(
      transactionId,
      "ACCEPTED"
    );

    revalidatePath("/mes-transactions", "layout");
  } catch (error: any) {
    console.log("ERROR ACCEPT TRANSACTION ACTION : ", error?.message);
    return null;
  }
};

export const getDeliveryInfoFromTransactionACTION = async (
  transactionId: string
) => {
  try {
    const transaction = await checkIfUSerISPartOfTransaction(
      transactionId,
      false, false

    );

    return transaction;
  } catch (error: any) {
    console.log("ERROR GET DELIVERY INFO ACTION ", error?.message);
    return null;
  }
};

export const confirmReceptionTransactionACTION = async (
  transactionId: string
) => {
  try {

    //ON CHECK LA LEGITIMITE DE L'USER
    const transaction = await checkIfUSerISPartOfTransaction(transactionId, false, true);
    
    if (!transaction) {
      throw new Error('Check failed');
    }

    //ON UPDATE LE STATUS DE LA TRANSACTION
    const updated = updateTransactionStatusOnDb(transactionId, 'DONE');

    if (!updated) {
      throw new Error('Update failed');
    }

    //ON CAPTURE LE PAIEMENT SUR STRIPE VIA LE PAYMENTINTENTID
    const intent = await capturePaymentACTION(transaction.paymentIntentId!);

    if (!intent) {
      throw new Error('Intent is null');
    }

    //ON DEDUIT LA MARGE DU PRIX TOTAL
    const amount = transaction.totalPrice - transaction.costProtection;

    //ON UPDATE LA WALLET DU VENDEUR
    const updatedWallet = await updateUserWalletOnDb(transaction.sellerId, amount);

    if (!updatedWallet) {
      throw new Error('updated wallet null');
    }

    //ON REVALIDATE LE PATH
    revalidatePath('/mes-transactions', 'page');
    
    return true;
  } catch (error: any) {
    console.log("ERROR CONFIRM TRANSACTION ACTION : ", error?.message);
    return null;
  }
};
