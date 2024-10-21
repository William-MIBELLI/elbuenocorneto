'use server';

import { parseWithZod } from "@conform-to/zod";
import { ratingSchema } from "../zod";
import { getRates, insertRateOnDB } from "../requests/rate.request";
import { ratingInsert } from "@/drizzle/schema";
import { v4 } from "uuid";

export const createRatingACTION = async ( state: unknown, fd: FormData) => {
  try {

    //ON CONTROLE LES INPUTS
    const parsed = parseWithZod(fd,{ schema: ratingSchema})

    //SI ERROR, ON CATCH
    if (parsed.status !== 'success') {
      console.log('PARSED ERROR : ', parsed.error);
      throw new Error('parse failed');
    }

    //ON VERIFIE QUE LA TRANSACTION N'A PAS DE RATING
    const existingRates = await getRates('transactionId', parsed.value.transactionId);

    if (existingRates.length > 0) {
      throw new Error('Cette transaction est déja notée.');
    }

    //ON CREE LE RATINGINSERT
    const { transactionId, commentary, rate } = parsed.value
    
    const rating: ratingInsert = {
      id: v4(),
      rate,
      commentary,
      transactionId
    }

    //ON L'INSERT DANS LA DB
    const inserted = await insertRateOnDB(rating);

    if (!inserted) {
      throw new Error('aucune ligne insérée dans rating_table');
    }
    
    //ON RETURN SUCCESS
    return { success: true };

  } catch (error: any) {
    console.log('ERROR CREATE RATING ACTION : ', error?.message);
    return undefined;
  }
}