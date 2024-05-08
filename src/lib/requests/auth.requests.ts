import { getDb } from "@/drizzle/db";
import { hashPassword, isPasswordMatching } from "../password";
import { InsertUser, SelectUser, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4} from 'uuid'

export const findUserByEmail = async (
  email: string
): Promise<SelectUser | undefined> => {
  try {
    const db = await getDb();
    //const user: SelectUser | undefined = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, email) });
    const user = await db.select().from(users).where(eq(users.email, email));
    // console.log('USER DANS FINDUSERBYEMAIL :', user);
    return user[0];
  } catch (error) {
    // console.log("Error finduser : ", error);
    return undefined;
  }
};

export const createUserOnDb = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    // ON HASH LE PASSWORD
    const hash = await hashPassword(password);

    if (!hash) throw new Error("Cant hash pass");

    // ON CREE ET ON INSERT LE NEWUSER DANS LA DB
    const db = getDb();
    const newUser = await db
      .insert(users)
      .values({
        id: uuidv4(),
        email: email.toLowerCase().trim(),
        password: hash,
        name,
        locationId: '95f5d191-ef8f-48c0-a1e4-e4cab2e0f47a'
      })
      .returning();

    // ON LE RETURN
    return newUser[0];
  } catch (error) {
    console.log("Error : ", error);
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    // LOOKING FOR USER IN DB
    const user = await findUserByEmail(email);

    if (!user) throw new Error("No user with this email address.");

    // CHECK PASSWORD
    const isMatched = await isPasswordMatching(password, user.password);

    if (!isMatched) throw new Error("Invalid password.");

    // RETURN USER
    return user;
  } catch (error) {
    // console.log("Error login error : ", error);
    return null;
  }
};
