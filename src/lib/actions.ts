"use server";

import { signIn } from "@/auth";
import { loginSchema } from "./zod";
import { redirect } from "next/navigation";

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
  // console.log(email, password);
  await signIn("credentials", { email, password });
  return { error: "All good 😀" };
  // try {
  //   //redirect('/')
  // } catch (error) {
  //   // console.log('ERROR : ',error)
  //   return { error: 'Something goes wrong.'};
  // }
};
