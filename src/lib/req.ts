import { getDb } from "@/drizzle/db";
import { users } from "@/drizzle/schema";

export const getUsersWithDrizzle = async () => {
  try {
    //await client.connect();
    // console.log('on rentre dans getuser db ');
    const db = await getDb();
    const user = await db.select().from(users);
    // console.log('USERS AVEC DRIZZLE : ', user)
    return user;
  } catch (error) {
    // console.log(error);
    return null;
  }
};
