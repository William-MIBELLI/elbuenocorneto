"use server"
import { getDb } from "@/drizzle/db";
import { hashPassword, isPasswordMatching } from "../password";
import { InsertUser, SelectUser, products, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4} from 'uuid'

export const findUserByEmail = async (
  email: string
): Promise<SelectUser | undefined> => {
  try {
    const db =  getDb();
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
  name: string,
  phone: string,
  locationId: string,
  imageUrl: string | null
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
        phone,
        locationId,
        image: imageUrl 
      })
      .returning().then(r => r[0]);

    // ON LE RETURN
    return newUser;
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

export const updateUser = async (value: Partial<InsertUser>, id: string) => {

 
  const obj: { [key: string]: any } = value;

  //ON MAP LES VALUES RECUES POUR EVITER LES STRINGS VIDES
  Object.keys(obj).forEach(k => {
    if ((typeof obj[k]  === "string" && !obj[k].length) || obj[k] === undefined) {
      return obj[k] = null
    }
  })

  try {
    const db = getDb();
    const user = await db.update(users).set(obj as Partial<InsertUser>).where(eq(users.id, id)).returning().then(r => r[0]);
    console.log('UPDATE USER : ', user);
    return user;
  } catch (error) {
    console.log('ERROR UPDATING USER : ', error);
    return null;
  }
}

export const deleteUserOnDB = async (id: string): Promise<boolean> => {
  try {
    const db = getDb();
    // const associatedProduct = db.$with('associated_product').as(
    //   db.select().from(products).where(eq(products.userId, id))
    // )
    const deletedUser = await db.delete(users).where(eq(users.id, id)).returning().then(r => r[0]);
    console.log('use delleted  ', deletedUser);
    return true;
  } catch (error) {
    console.log('ERROR DELETE USER DB ', error);
    return false;
  }
}
