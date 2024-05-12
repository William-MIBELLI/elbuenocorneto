import { getDb } from "@/drizzle/db";
import { LocationInsert, locations } from "@/drizzle/schema";

export const createLocationOnDB = async (data: LocationInsert) => {
  try {
    const db = getDb();
    const loc = await db
      .insert(locations)
      .values(data)
      .returning()
      .then((r) => r[0]);
    return loc
  } catch (error) {
    console.log("ERROR CREATING LOCATION : ", error);
    return null;
  }
};
