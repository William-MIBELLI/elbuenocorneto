import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = z
  .object({
    email: z.string().email("Please provide a valid email address."),
    password: z
      .string()
      .min(6, "Password need atleast 6 characters")
      .max(32, "Password can have 32 characters"),
    confirm: z.string().min(6),
    name: z
      .string()
      .min(3, "Name require atleast 3 characters.")
      .max(20, "Name can have 20 characters maximum."),
  })
  .refine((data) => data.confirm === data.password, {
    message: "Password have to match.",
    path: ["confirm"],
  });
