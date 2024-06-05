
"use server";

import { AttributeSelect, LocationInsert, ProdAttrInsert, ProductInsert, ProductSelect, deliveries } from "@/drizzle/schema";
import { DeliveryType } from "@/interfaces/IDelivery";
import { IProductImage } from "@/interfaces/IProducts";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { ProductSchemaType, createDynamicSchemaForAttrs, locationSchema, productSchema } from "../zod";
import { createProdAttrsOnDB, createProductOnDB } from "../requests/product.request";
import { createLocationOnDB } from "../requests/location.request";
import { insertImagesOnDB, uploadImageOnCloud, uploadMultipleImagesOnCloud } from "../requests/picture.request";
import { insertPDLOnDB } from "../requests/delivery.request";
import { ProdAttrTypeWithName } from "@/context/newproduct.context";

export const newProductACTION = async (initialState: unknown, fd: FormData) => {
  const parsedTitle = parseWithZod(fd, {
    schema: z.object({ title: z.string().min(4, "MINIMUM DEPUIS ACTION") }),
  });
  if (parsedTitle.status !== "success") {
    return parsedTitle.reply();
  }
};

export interface ICreationState {
  product?: Record<string, string[] | undefined>;
  location?: string | undefined;
  images?: string | undefined;
  selected?: string | undefined;
  success: boolean;
  _form?: string | undefined;
  attrs?: string | undefined;
}

export const createProductACTION = async (
  data: {
    product: ProductInsert;
    location: LocationInsert;
    files: FormData;
    selected: string[];
    productAttributes: ProdAttrTypeWithName[],
    attributes: AttributeSelect[]
  },
  initialState: ICreationState,
  fd: FormData
) => {
  try {

    //ON CHECK SI LE PRODUCT EST VALIDE
    const parsedProduct = productSchema.safeParse(data.product);

    if (!parsedProduct.success) {
      const errors = parsedProduct.error.flatten().fieldErrors;
      return { ...initialState, product: errors };
    }

    //ON MAP LES PRODUCTS ATTRIBUTES
    const mappedAttributes: ProdAttrInsert[] = data.productAttributes.map(attr => {
      return {...attr, test: 'jambon'}
    })
    
    //ON CREE UN SCHEMA ZOD DYNAMIC POUR FIT LES ATTRS
    const dynamicSchema = createDynamicSchemaForAttrs(data.attributes)

    //ON LES CHECK
    const parsedAttributes = z.object({}).extend(dynamicSchema).safeParse(mappedAttributes);

    if (!parsedAttributes) {
      return {...initialState, attrs: 'Les caractéristiques renseignées présentent une erreur.'}
    }

    //ON CHECK LA LOCATION
    const parsedLocation = locationSchema.safeParse(data.location);

    if (!parsedLocation.success) {
      const errors = parsedLocation.error.flatten().fieldErrors;
      return {...initialState, location: "La localisation de l'adresse présente une erreur, merci de la renseigner à nouveau."}
    }

    //SI C'EST GOOD ON CREE LA LOCATION
    const newL = await createLocationOnDB(data.location);

    if (!newL) throw new Error("Impossible de sauvegarder l'adresse.");

    //ON CREE ENSUITE LE PRODUCT DANS LA DB
    const newP = await createProductOnDB(data.product);

    if (!newP) throw new Error("Impossible de sauvegarder votre annonce.");

    //ON CREE LES PRODUCTSATTRIBUTS DANS LA DB
    const newA = await createProdAttrsOnDB(mappedAttributes);

    if (!newA) throw new Error('Impossible de sauvegarder les caractéristiques de l\'annonce.');


    //ON UPLOAD LES PHOTO SUR LE CLOUD ET ON RECUP LES URLS
    const pictures = data.files.getAll('file') as File[];
    
    if (pictures.length) {
      const images = await uploadMultipleImagesOnCloud(pictures, data.product.id);
  
      if (!images || !images.length) throw new Error('Impossible de sauvegarder les images de l\'annonce.');
  
      //ON STOCKE LES URLS DES IMAGES DANS LA DB
      const insertImage = await insertImagesOnDB(images);
  
      if (!insertImage) {
        return {...initialState, images: 'Un problème est survenu avec l\'enregistrement des vos photos.'}
      };
    }

    //ON AJOUTE LES DELIVERIES S'IL Y EN A
    if (data.selected.length) {
      const res = await insertPDLOnDB(data.product.id, data.selected);
      if (!res) {
        return {...initialState, success: true, selected: "Un problème est survenu lors de l'enregistrement de vos options de livraisons."}
      }
    }

    return { ...initialState, success: true };
    
  } catch (error: any) {
    console.log("ERROR CREATE PRODUCT ACTION", error);
    return {...initialState, success: false, _form: error?.message ?? 'Une erreur est survenue.'};
  }
};


