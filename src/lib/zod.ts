import { CategoriesType, ICoordonates, categoriesTypeList } from './../interfaces/IProducts';
import { LocationInsert, deliveriesEnum } from './../drizzle/schema';
import { DeliveryType, DeliveryTypeList } from './../interfaces/IDelivery';
import { GENDER } from "@/interfaces/IUser";
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

export const informationsSchema = z.object({
  gender: z.enum(['1', '2', '0']).optional(),
  lastname: z.string().max(32, "C'est cher le stockage... moins de 32 caractères svp. 👀").optional(),
  firstname: z.string().max(32, "C'est cher le stockage... moins de 32 caractères svp. 👀").optional(),
  birthday: z.string().date('PB AVEC LA DATE').nullable()
}).partial()

export const productSchema = z.object({
  userId: z.string().uuid('This user_id is not valid.'),
  title: z.string().min(4,'Le titre doit avoir au moins 4 caractères.').max(100, 'Le titre doit avoir au maximum 100 caractères.'),
  price: z.number(),
  description: z.string().min(10, 'La description doit avoir au moins 10 caractères.').max(2500, 'Maximum 2500 caractères.'),
  category: z.enum([categoriesTypeList[0], ...categoriesTypeList], { message: "Cette catégorie n'est pas disponible." }),
  locationId: z.string().uuid()
})
export type ProductSchemaType = z.infer<typeof productSchema>

export const locationSchema = z.object({
  id: z.string().uuid(),
  city: z.string(),
  streetName: z.string().optional(),
  postcode: z.number(),
  label: z.string(),
  coordonates: z.object({ lat: z.number(), lng: z.number()})
})
