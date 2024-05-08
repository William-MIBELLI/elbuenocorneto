"use server";

import { signIn } from "@/auth";
import { loginSchema } from "./zod";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export const login = async (
  intialState: { error: string },
  formData: FormData
) => {
  const parsedCredentials = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedCredentials.success) {
    const errors = parsedCredentials.error.flatten().fieldErrors;
    // console.log('Wrong credentials. : ', errors);
    return { error: "Wrong credentials." };
  }

  const { email, password } = parsedCredentials.data;

  try {
    await signIn("credentials", { email, password, redirectTo: '/' });
    return { error: "All good 😀" };
  } catch (error) {
    if (error instanceof AuthError) {
      console.log('ON RENTRE DANS LE CATCH');
      switch (error.type) {
        case "CredentialsSignin": {
          console.log("CREDENTIALS ERROR DANS LE IF ");
          return { error: "Invalid credentials 😱." };
        }
        default:
          return {
            error: "Something in auth process went wrong, please retry.",
          };
      }
    }
    throw error
  }
};
