import { getDb } from "@/drizzle/db";
import {
  DeliveryLinkInsert,
  deliveries,
  productDeliveryLink,
} from "@/drizzle/schema";
import { DeliveryType, deliveryList } from "@/interfaces/IDelivery";
import { and, eq, inArray } from "drizzle-orm";

export const getAllDeliveriesFromDB = async () => {
  try {
    const db = getDb();
    const del = await db.select().from(deliveries);
    return del;
  } catch (error) {
    console.log("ERROR FETCHING DELIVERIES : ", error);
    return [];
  }
};

export const insertPDLOnDB = async (
  productId: string,
  deliveryLinks: string[]
) => {
  const mappedDLP: DeliveryLinkInsert[] = deliveryLinks.map((delId) => {
    return { deliveryId: delId, productId };
  });

  try {
    const db = getDb();
    const res = await db
      .insert(productDeliveryLink)
      .values(mappedDLP)
      .returning();

    if (!res) throw new Error("Can't create PDL on DB.");

    return true;
  } catch (error) {
    console.log("ERROR INSERT DELIVERY LINKS ", error);
    return false;
  }
};


export const deletePDLOnDB = async (productId: string, pdlToDelete: string[]) => {
  try {
    const db = getDb();

    const deleted = await db
      .delete(productDeliveryLink)
      .where(
        and(
          eq(productDeliveryLink.productId, productId),
          inArray(productDeliveryLink.deliveryId, pdlToDelete)
        )
    ).returning();
    
    return deleted;
  } catch (error) {
    console.log("ERROR DELETING PDL REQUEST : ", error);
    return null;
  }
};

export const updatePDLonDB = async (
  productId: string,
  pdlToAdd: string[],
  pdlToDelete: string[]
) => {
  try {

    const added = pdlToAdd.length ? await insertPDLOnDB(productId, pdlToAdd) : false;
    const deleted = pdlToDelete ? await deletePDLOnDB(productId, pdlToDelete) : null;

    return { added, deleted };

  } catch (error) {
    console.log("ERROR UPDATING PDL REQUEST : ", error);
    return null;
  }
};
