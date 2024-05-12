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
      phone: z
      .string()
      .length(10, "Please provide a 10 keys lenght phone number.")
      .regex(new RegExp(
        /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
      ), "Phone number can have only digits."),
  })
  .refine((data) => data.confirm === data.password, {
    message: "Password have to match.",
    path: ["confirm"],
  });

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password need atleast 6 characters")
      .max(32, "Password can have 32 characters"),
    confirm: z.string().min(6),
  })
  .refine((data) => data.confirm === data.password, {
    message: "Password have to match.",
    path: ["confirm"],
  });
