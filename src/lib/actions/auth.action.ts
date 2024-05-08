"use server";

import { hashPassword } from "../password";
import { createUserOnDb, findUserByEmail } from "../requests/auth.requests";
import { signUpSchema } from "../zod";
import { redirect } from "next/navigation";
import { getDb } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { signIn } from "@/auth";

export const signUp = async (initialState: {}, formData: FormData) => {
  // CHECK LES INPUTS
  const parsedCredentials = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    name: formData.get("name"),
  });

  // SI ERREURS DANS LES INPUTS, ON LES RETURN
  if (!parsedCredentials.success) {
    const errors = parsedCredentials.error.flatten().fieldErrors;
    return errors;
  }

  const { email, password, name } = parsedCredentials.data;
  try {
    // ON CHECK SI LEMAIL N'EST PAS DEJA UTILISE
    const existingUser = await findUserByEmail(email.toLowerCase());
    if (existingUser) return { email: "This address is already used." };

    // ON CREE l'USER DANS LA DB
    const user = await createUserOnDb(email, password, name);

    if (!user) throw new Error("Cant create user");
  } catch (error: any) {
    console.log('error : ', error?.message);
    return { _form: ["Something went wrong."] };
  }
  // SI TOUT EST OK, ON SIGNIN
  await signIn("credentials", {
    email: email.toLowerCase(),
    password,
    redirectTo: "/",
  });

  return {};
};
