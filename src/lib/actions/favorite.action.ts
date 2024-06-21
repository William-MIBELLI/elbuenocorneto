'use server';

import { revalidatePath } from "next/cache";
import { updateFavoriteOnDB } from "../requests/favorite.request";

export const updateFavoriteACTION = async (initialState: {
  success: boolean;
  value: boolean;
}, fd: FormData) => {
  try {
    const productId = fd.get('productId')?.toString();
    const userId = fd.get('userId')?.toString();

    if (!userId || !productId) throw new Error('Ids for update are missing.');

    const updated = await updateFavoriteOnDB(productId, userId);

    if (updated === null) throw new Error('Getting null for updated.');

    revalidatePath('/category')
    return { ...initialState, success: true, value: updated }

  } catch (error) {
    console.log('ERROR UPDATE FAV ACTION : ', error);
    return {...initialState, success: false}
  }
}