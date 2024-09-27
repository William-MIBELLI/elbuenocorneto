import {
  CategoriesType,
  ICoordonates,
  categoriesTypeList,
} from "./../interfaces/IProducts";
import {
  AttributeSelect,
  LocationInsert,
  StateEnum,
  TransactionInsert,
  deliveriesEnum,
} from "./../drizzle/schema";
import { DeliveryType, DeliveryTypeList } from "./../interfaces/IDelivery";
import { GENDER } from "@/interfaces/IUser";
import { z } from "zod";
import { IPickerShop } from "@/interfaces/ILocation";

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

export const productSchema = z.object({
  userId: z.string().uuid("This user_id is not valid."),
  title: z
    .string()
    .min(4, "Le titre doit avoir au moins 4 caractères.")
    .max(100, "Le titre doit avoir au maximum 100 caractères."),
  price: z.number(),
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

export const updateProductSchema = productSchema.pick({
  title: true,
  price: true,
  description: true,
});

export const createConversationSchema = z.object({
  message: z.string().min(3).max(2500),
  sellerId: z.string(),
  productId: z.string(),
});

export const createMessageSchema = z.object({
  content: z.string().min(3).max(2500),
  conversationId: z.string(),
  senderId: z.string(),
});


export const baseDeliverySchema = z.object({
  productId: z.string().uuid("ProductId is not a UUID"),
  userId: z.string().uuid("userId is not a UUID"),
  costProtection: z.number(),
  sellerId: z.string().uuid("SellerID is not a UUID"),
  productTitle: z.string(),
  totalPrice: z.number().positive("Le prix ne peut pas être négatif."),
  deliveryMethod: z.enum(deliveriesEnum.enumValues).optional()

}) satisfies z.ZodType<Omit<TransactionInsert, "id">>;

export type baseDeliverySchemaType = z.infer<typeof baseDeliverySchema>;

export const homeDeliverySchema = baseDeliverySchema.extend({
  firstname: z.string().min(3).max(25),
  lastname: z.string().min(3).max(25),
  houseNumber: z.number(),
  streetName: z.string().min(3).max(100),
  addressLine: z.string().optional(),
  postCode: z.number().refine((val) => val.toString().length === 5, {
    message: "Le code postal doit comporter 5 caractères",
  }),
  city: z.string().min(3).max(100),
  phoneNumber: z
    .number()
    .refine(
      (val) => {
        const str = val.toString();
        return (
          (str.length === 10 && str[0] === "0") ||
          (str.length === 9 && str[0] !== "0")
        );
      },
      {
        message:
          "Le numéro de téléphone doit comporter 9 chiffres, ou 10 chiffres commençant par 0",
      }
    )
    .optional(),
  country: z.string().default("France"),
  pickerId: z.string().optional()
}) satisfies z.ZodType<Omit<TransactionInsert, "id">>;

export type HomdeDeliverySchemaType = z.infer<typeof homeDeliverySchema>;

export const mergePickerAndFormData = (
  picker: IPickerShop | undefined,
  fd: FormData
) => {
  const mergedFD = new FormData();

  // Copier les entrées existantes du FormData original
  for (const [key, value] of fd.entries()) {
    mergedFD.append(key, value);
  }

  //SI PAS DE PICKER, ON RETURN DIRECT LE FORMDATA
  if (!picker) {
    return mergedFD;
  }

  //ON SPREAD PICKER
  const { street, house_number, name, postal_code, city, country, id } = picker;

  //ON MERGE LE NOUVEL OBJET AVEC LE PICKER
  const pickerData: Record<string, number | string> = {
    streetName: street,
    houseNumber: +house_number,
    addressLine: name,
    postCode: +postal_code,
    city,
    country,
    pickerId: id.toString()
  };
  console.log('PICKER ET PICKER DATA DANS LE MAPPER : ', picker, pickerData);

  Object.keys(pickerData).forEach((key) => {
    mergedFD.append(key, pickerData[key].toString());
  });

  return mergedFD;
};

export const mergeDataAndFormData = (
  data: Partial<TransactionInsert>,
  fd: FormData
): FormData => {
  const newFD = new FormData();
  const objEntries = Object.fromEntries(fd.entries());

  Object.keys(objEntries).forEach((key) => {
    return newFD.append(key, objEntries[key]);
  });

  (Object.keys(data) as Array<keyof Partial<TransactionInsert>>
  ).forEach((key) => newFD.append(key, data[key] as string));


  return newFD;
};
