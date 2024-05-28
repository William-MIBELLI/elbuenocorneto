import { getDb } from "@/drizzle/db";
import { DeliveryLinkInsert, deliveries, productDeliveryLink } from "@/drizzle/schema";
import { DeliveryType, deliveryList } from "@/interfaces/IDelivery";

export const getAllDeliveriesFromDB = async () => {
  try {
    const db = getDb();
    const del = await db.select().from(deliveries)
    return del;
  } catch (error) {
    console.log('ERROR FETCHING DELIVERIES : ', error);
    return [];
  }
}

export const insertPDLOnDB = async (productId: string, deliveryLinks: string[]) => {

  const mappedDLP: DeliveryLinkInsert[] = deliveryLinks.map(delId => {
    return { deliveryId: delId, productId }
  })

  try {

    const db = getDb();
    const res = await db.insert(productDeliveryLink).values(mappedDLP).returning();

    if (!res) throw new Error("Can't create PDL on DB.");

    return true

  } catch (error) {
    console.log('ERROR INSERT DELIVERY LINKS ', error);
    return false;
  }
}