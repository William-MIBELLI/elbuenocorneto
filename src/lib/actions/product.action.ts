
"use server";

import { LocationInsert, ProductInsert, ProductSelect, deliveries } from "@/drizzle/schema";
import { DeliveryType } from "@/interfaces/IDelivery";
import { IProductImage } from "@/interfaces/IProducts";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { ProductSchemaType, locationSchema, productSchema } from "../zod";
import { createProductOnDB } from "../requests/product.request";
import { createLocationOnDB } from "../requests/location.request";
import { insertImagesOnDB, uploadImageOnCloud, uploadMultipleImagesOnCloud } from "../requests/picture.request";
import { insertPDLOnDB } from "../requests/delivery.request";

export const newProductACTION = async (initialState: unknown, fd: FormData) => {
  console.log("PRODUCT ACTION ");
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
}

export const createProductACTION = async (
  data: {
    product: ProductInsert;
    location: LocationInsert;
    files: FormData;
    selected: string[];
  },
  initialState: ICreationState,
  fd: FormData
) => {
  try {

    //ON CHECK SI LE PRODUCT EST VALIDE
    const parsedProduct = productSchema.safeParse(data.product);

    if (!parsedProduct.success) {
      const errors = parsedProduct.error.flatten().fieldErrors;
      const mappedErrors = Object.values(errors).map(fields => fields.flat().join(', '))
      return { ...initialState, product: errors };
    }

    //ON CHECK LA LOCATION
    const parsedLocation = locationSchema.safeParse(data.location);

    if (!parsedLocation.success) {
      const errors = parsedLocation.error.flatten().fieldErrors;
      const mappedErrors = Object.values(errors).map(fields => fields.flat().join(', '));
      return {...initialState, location: "La localisation de l'adresse présente une erreur, merci de la renseigner à nouveau."}
    }

    //SI C'EST GOOD ON CREE LA LOCATION
    const newL = await createLocationOnDB(data.location);

    if (!newL) throw new Error("Impossible de sauvegarder l'adresse.");

    //ON CREE ENSUITE LE PRODUCT DANS LA DB
    const newP = await createProductOnDB(data.product);

    if (!newP) throw new Error("Impossible de sauvegarder votre annonce.");


    //ON UPLOAD LES PHOTO SUR LE CLOUD ET ON RECUP LES URLS
    const pictures = data.files.getAll('file') as File[];
    
    if (pictures) {
      const images = await uploadMultipleImagesOnCloud(pictures, data.product.id);
  
      if (!images || !images.length) throw new Error('Impossible de sauvegarder les images de l\'annonce.');
  
      //ON STOCKE LES URLS DES IMAGES DANS LA DB
      const insertImage = await insertImagesOnDB(images);
  
      if (!insertImage) {
        return {...initialState, images: 'Un problème est survenu avec l\'enregistrement des vos photos.'}
      };
    }

    //ON AJOUTE LES DELIVERIES S'IL Y EN A
    if (data.selected) {
      const res = await insertPDLOnDB(data.product.id, data.selected);
      if (!res) {
        return {...initialState, selected: "Un problème est survenu lors de l'enregistrement de vos options de livraisons."}
      }
    }

    return { ...initialState, success: true };
    
  } catch (error: any) {
    console.log("ERROR CREATE PRODUCT ACTION", error);
    return {...initialState, success: false, _form: error?.message ?? 'Une erreur est survenue.'};
  }
};

export const testCreateProductACTION = async (data: {product: ProductInsert, location: LocationInsert, pictures: IProductImage[]}, is: any, fd: FormData) => {
  try {
    console.log('ON EST DANS TEST , ', data);
    return {...is}
  } catch (error) {
    return {...is}
  }
}
