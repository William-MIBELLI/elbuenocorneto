import {
  CategoriesType,
  ICoordonates,
  categoriesTypeList,
} from "./../interfaces/IProducts";
import {
  AttributeSelect,
  LocationInsert,
  StateEnum,
  deliveriesEnum,
} from "./../drizzle/schema";
import { DeliveryType, DeliveryTypeList } from "./../interfaces/IDelivery";
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
      .regex(
        new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
        "Phone number can have only digits."
      ),
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

export const informationsSchema = z
  .object({
    gender: z.enum(["1", "2", "0"]).optional(),
    lastname: z
      .string()
      .max(32, "C'est cher le stockage... moins de 32 caractères svp. 👀")
      .optional(),
    firstname: z
      .string()
      .max(32, "C'est cher le stockage... moins de 32 caractères svp. 👀")
      .optional(),
    birthday: z.string().date("PB AVEC LA DATE").nullable(),
  })
  .partial();



export const productSchema = z
  .object({
    userId: z.string().uuid("This user_id is not valid."),
    title: z
      .string()
      .min(4, "Le titre doit avoir au moins 4 caractères.")
      .max(100, "Le titre doit avoir au maximum 100 caractères."),
    price: z.number().optional(),
    description: z
      .string()
      .min(10, "La description doit avoir au moins 10 caractères.")
      .max(2500, "Maximum 2500 caractères."),
    categoryType: z
      .string()
      .refine(
        (value) => categoriesTypeList.includes(value as CategoriesType),
        "Cette catégorie n'est aps disponible"
      ),
    locationId: z.string().uuid(),
    state: z
      .string({ message: "L'état est requis" })
      .refine((val) => StateEnum.enumValues.find((item) => item === val)),
  });
  
export type ProductSchemaType = z.infer<typeof productSchema>;

export const locationSchema = z.object({
  id: z.string().uuid(),
  city: z.string(),
  streetName: z.string().optional(),
  postcode: z.number(),
  label: z.string(),
  coordonates: z.object({ lat: z.number(), lng: z.number() }),
});

export const attributeSchema = z.object({});

export const createDynamicSchemaForAttrs = (attributes: AttributeSelect[]) => {
  console.log("ATTRIBUTE DANS CREATESCHEMA : ", attributes);
  //ON CREE UN ARRAY DANS LEQUEL ON STOCKE UN KEY/VALUE POUR CHAQUE ATTR
  const vers: {
    name: string;
    content: z.ZodType<any, any>;
  }[] = [];

  //ON LOOP SUR CHAQUE ATTR ET SELON LE TYPE ON PUSH LE SCHEMA DANS LE ARRAY
  attributes.forEach((attr) => {
    switch (attr.type) {
      case "number": {
        const ver = attr.required ? z.number() : z.number().optional();
        return vers.push({ name: attr.name, content: ver });
      }
      case "text": {
        const ver = attr.required
          ? z
              .string()
              .max(32, `${attr.label} doit contenir au maximum 32 caractères.`)
          : z.string().optional();
        return vers.push({ name: attr.name, content: ver });
      }
      case "select": {
        const ver = attr.required
          ? z
              .string()
              .refine(
                (value) => attr.possibleValue?.includes(value),
                "L'option choisie n'est pas disponible."
              )
          : z
              .string()
              .refine(
                (value) => attr.possibleValue?.includes(value),
                "L'option choisie n'est pas disponible."
              )
              .optional();
        return vers.push({ name: attr.name, content: ver });
      }
      case "boolean": {
        const ver = attr.required ? z.boolean() : z.boolean().optional();
        return vers.push({ name: attr.name, content: ver });
      }
      default:
        console.log("Invalid input type :", attr.type);
        return;
    }
  });

  //ON MAP LE ARRAY VERS UN OBJET QU'ON PEUT PASSER A ZOD POUR LA VALIDATION
  const mappedVers = vers.reduce((prev, current) => {
    return { ...prev, [current.name]: current.content };
  }, {});

  //ON LE STOCKE DANS LE STATE
  return mappedVers;
};


export const updateProductSchema = productSchema.pick({ title: true, price: true, description: true})
