import { getDb } from "@/drizzle/db";
import { LocationInsert, locations } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const createLocationOnDB = async (data: LocationInsert) => {
  try {
    const db = getDb();
    const loc = await db
      .insert(locations)
      .values(data)
      .returning()
      .then((r) => r[0]);
    return loc;
  } catch (error) {
    console.log("ERROR CREATING LOCATION : ", error);
    return null;
  }
};

export const updateLocationOnDB = async (data: LocationInsert, id: string) => {
  try {
    console.log('DATA DANS UPDATE LOC : ', data, id);
    const db = getDb();
    const res = await db
      .update(locations)
      .set({ ...data, id, streetName: data?.streetName ?? null })
      .where(eq(locations.id, id))
      .returning()
      .then((r) => r[0]);
    console.log("RES DANS UPDATE LOC : ", res);
    return res ?? null;
  } catch (error: any) {
    console.log("ERROR UPDATE LOCATION REQUEST : ", error?.message);
    return null;
  }
};

export const deleteLocationOnDB = async (id: string) => {
  try {
    const db = getDb();
    const res = await db
      .delete(locations)
      .where(eq(locations.id, id))
      .then((r) => r);
    return res;
  } catch (error) {
    console.log("ERROR DELETING LOCATION REQUEST : ", error);
    return null;
  }
}
