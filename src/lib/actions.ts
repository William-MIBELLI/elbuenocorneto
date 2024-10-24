"use server";

import { signIn } from "@/auth";
import { loginSchema } from "./zod";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export const login = async (
  callbackUrl: string,
  intialState: { error: string },
  formData: FormData
) => {
  console.log('CALLBACK : ', callbackUrl);
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
    await signIn("credentials", { email, password, redirectTo: `/${callbackUrl}` });
    return { error: "All good 😀" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
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
