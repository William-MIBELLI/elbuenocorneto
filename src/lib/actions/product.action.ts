"use server";
import { RedirectType, redirect, usePathname } from "next/navigation";

import {
  AttributeSelect,
  ImageSelect,
  LocationInsert,
  ProdAttrInsert,
  ProductInsert,
  ProductSelect,
  attrNameType,
  deliveries,
} from "@/drizzle/schema";
import { DeliveryType } from "@/interfaces/IDelivery";
import {
  IProductImage,
  ProductForList,
  ProductUpdateType,
} from "@/interfaces/IProducts";
import { parseWithZod } from "@conform-to/zod";
import { ZodAny, ZodType, z } from "zod";
import {
  ProductSchemaType,
  createDynamicSchemaForAttrs,
  locationSchema,
  productSchema,
  updateProductSchema,
} from "../zod";
import {
  createProdAttrsOnDB,
  createProductOnDB,
  createSearchCondition,
  deleteProductOnDB,
  getProductsList,
  udpateProductOnDB,
  updateProdAttrOnDb,
} from "../requests/product.request";
import { createLocationOnDB } from "../requests/location.request";
import {
  deleteImagesOnDB,
  deleteMultipleImagesOnCloud,
  insertImagesOnDB,
  uploadImageOnCloud,
  uploadMultipleImagesOnCloud,
} from "../requests/picture.request";
import { insertPDLOnDB, updatePDLonDB } from "../requests/delivery.request";
import { ProdAttrTypeWithName } from "@/context/newproduct.context";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ISearchParams } from "@/context/search.context";
import Success from "@/components/new-product/Success";

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
    productAttributes: ProdAttrTypeWithName[];
    attributes: AttributeSelect[];
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
    const mappedAttributes: ProdAttrInsert[] = data.productAttributes.map(
      (attr) => {
        return { ...attr, test: "jambon" };
      }
    );

    //ON CREE UN SCHEMA ZOD DYNAMIC POUR FIT LES ATTRS
    const dynamicSchema = createDynamicSchemaForAttrs(data.attributes);

    //ON LES CHECK
    const parsedAttributes = z
      .object({})
      .extend(dynamicSchema)
      .safeParse(mappedAttributes);

    if (!parsedAttributes) {
      return {
        ...initialState,
        attrs: "Les caractéristiques renseignées présentent une erreur.",
      };
    }

    //ON CHECK LA LOCATION
    const parsedLocation = locationSchema.safeParse(data.location);

    if (!parsedLocation.success) {
      const errors = parsedLocation.error.flatten().fieldErrors;
      return {
        ...initialState,
        location:
          "La localisation de l'adresse présente une erreur, merci de la renseigner à nouveau.",
      };
    }

    //SI C'EST GOOD ON CREE LA LOCATION
    const newL = await createLocationOnDB(data.location);

    if (!newL) throw new Error("Impossible de sauvegarder l'adresse.");

    //ON CREE ENSUITE LE PRODUCT DANS LA DB
    const newP = await createProductOnDB(data.product);

    if (!newP) throw new Error("Impossible de sauvegarder votre annonce.");

    //ON CREE LES PRODUCTSATTRIBUTS DANS LA DB
    const newA = await createProdAttrsOnDB(mappedAttributes);

    if (!newA)
      throw new Error(
        "Impossible de sauvegarder les caractéristiques de l'annonce."
      );

    //ON UPLOAD LES PHOTO SUR LE CLOUD ET ON RECUP LES URLS
    const pictures = data.files.getAll("file") as File[];

    if (pictures.length) {
      const images = await uploadMultipleImagesOnCloud(
        pictures,
        data.product.id
      );

      if (!images || !images.length)
        throw new Error("Impossible de sauvegarder les images de l'annonce.");

      //ON STOCKE LES URLS DES IMAGES DANS LA DB
      const insertImage = await insertImagesOnDB(images);

      if (!insertImage) {
        return {
          ...initialState,
          images:
            "Un problème est survenu avec l'enregistrement des vos photos.",
        };
      }
    }

    //ON AJOUTE LES DELIVERIES S'IL Y EN A
    if (data.selected.length) {
      const res = await insertPDLOnDB(data.product.id, data.selected);
      if (!res) {
        return {
          ...initialState,
          success: true,
          selected:
            "Un problème est survenu lors de l'enregistrement de vos options de livraisons.",
        };
      }
    }

    return { ...initialState, success: true };
  } catch (error: any) {
    //SI ERREUR AVEC LA CREATION, ON SUPPRIME TOUT CE QUI A PU ETRE CREE POUR EVITER LES CONFLITS LORS DU RESUBMIT
    console.log("ERROR CREATE PRODUCT ACTION", error);
    await deleteProductOnDB(data.product.id);
    return {
      ...initialState,
      success: false,
      _form: error?.message ?? "Une erreur est survenue.",
    };
  }
};

export const updateProductACTION = async (
  data: { productId: string },
  initialState: unknown,
  fd: FormData
) => {
  try {
    const parsedProduct = parseWithZod(fd, { schema: updateProductSchema });

    //SI ERREUR DANS LE FORMULAIRE, ON RETURN LES ERREURS VIA CONFORM
    if (parsedProduct.status !== "success") {
      return parsedProduct.reply();
    }

    //ON MET A JOUR LE PRODUCT DANS LA DB
    const update = await udpateProductOnDB(
      data.productId,
      parsedProduct.payload
    );

    //SI AUCUNE RESULTAT, ON THROW UNE ERREUR
    if (!update) {
      throw new Error("No product updated");
    }
    console.log("UPDATE : ", update);

    //SINON ON RETURN SUCCESS
    return parsedProduct.reply();
  } catch (error) {
    console.log("ERROR UPDATE PRODUCT ACTION : ", error);
    return null;
  }
};

interface DataType {
  previous: FormData;
  current: FormData;
  productId: string;
}
export const udpateProductImagesACTION = async (
  data: DataType,
  initialState: {
    _error?: string | undefined;
    success?: boolean;
    newPictures: ImageSelect[];
  },
  fd: FormData
) => {
  try {
    const { previous, current, productId } = data;
    const filesToSave: File[] = [];
    const filesToDelete: File[] = [];

    //ON MAP LES FILES DES FORMDATA DANS DES ARRAYS
    const currentList = current.getAll("file") as File[];
    const previousList = previous.getAll("file") as File[];

    //ON LOOP SUR CURRENTLIST
    currentList.forEach((item) => {
      //POUR CHAQUE FILE, ON CHECK SIL EST DANS PREVIOUSLIST
      const existingFile = previousList.find((prev) => prev.name === item.name);

      //SIL NY EST PAS, C'EST UN NOUVEAU FICHIER, ON LE PUSH DANS filesToSave
      if (!existingFile) {
        filesToSave.push(item);
      }
    });

    //SI IL Y A DES IMAGES A AJOUTER
    if (filesToSave.length) {
      //ON LUPLOAD filesToSave DANS LE CLOUD
      const newImg = await uploadMultipleImagesOnCloud(filesToSave, productId);

      if (!newImg) throw new Error("newImg is null");

      //ON LE STOCKE DANS LA DB
      const newImgsInserted = await insertImagesOnDB(newImg);

      if (!newImgsInserted) throw new Error("image insertion return false");
    }

    //ON LOOP SUR PREVIOUSLIST
    previousList.forEach((item) => {
      //ON CHECK SI LE FILE EST DANS LA CURRENT LIST
      const existingFile = currentList.find((curr) => curr.name === item.name);

      //S'IL N'Y EST PAS, C'EST QU'IL FAUT LE DELETE ET ON LE STOCKE DANS filesToDelete
      if (!existingFile) {
        console.log("FILE TO DELETE : ", item);
        filesToDelete.push(item);
      }
    });

    //ON MAP LE TABLEAU POUR RECUP QUE LES URLS
    const urlsToDelete = filesToDelete.map((f) => {
      //ON PREPEND L'URL A DELETE AVEC L'HOST
      return (
        "https://firebasestorage.googleapis.com/v0/b/ebccloud-f8c7c.appspot.com/o/" +
        f.name
      );
    });

    //SI AUCUNES IMAGES A SUPPRIMER, ON FAST RETURN
    if (!urlsToDelete.length) {
      return { ...initialState, success: true };
    }

    //ON LE DELETE DE LA DB
    const deletedOnDb = await deleteImagesOnDB(productId, urlsToDelete);

    if (!deletedOnDb)
      throw new Error("LES IMAGES NE SONT PAS DELETE DE LA DB.");

    console.log("URL TO DELETE : ", urlsToDelete);
    //ON LES DELETE DU CLOUD
    const deletedImgsCloud = await deleteMultipleImagesOnCloud(urlsToDelete);

    if (!deletedImgsCloud) {
      console.log("LES IMAGES NONT PAS ETE SUPPRIME DU CLOUD");
    }

    revalidatePath("/update-product/" + productId);
    return { ...initialState, success: true };
  } catch (error) {
    console.log("ERROR UPDATING PRODUCT IMAGES ACTION : ", error);
    return { ...initialState, success: false };
  }
};

export const updateProductAttributesACTION = async (
  data: {
    prodAttrs: ProdAttrTypeWithName[];
    productId: string;
    attributes: AttributeSelect[];
  },
  is: unknown,
  fd: FormData
) => {
  try {
    //ON CREE LE SCHEMA ZOD GRACE AUX ATTRIBUTS POUR CHECK LES INPUTS
    const schema = createDynamicSchemaForAttrs(data.attributes);

    //ON VERIFIE LES INPUTS
    const submission = parseWithZod(fd, {
      schema: z.object({}).extend(schema),
    });

    //SI ERROR, ON FATS RETURN
    if (submission.status !== "success") {
      return submission.reply();
    }

    //ON MAP LE PAYLOAD DANS UN ARRAY
    const mappedPayload = Object.entries(submission.payload).map(
      ([key, value]) => {
        return { name: key as attrNameType, value: value as string };
      }
    );

    //SI C'EST OK, ON ENVOIE LE PAYLOAD MAPPE VERS PRODUCT.REQUEST
    const updated = await updateProdAttrOnDb(data.productId, mappedPayload);

    if (!updated || !updated.length) {
      console.log("NOTHING UPDATED ON DB : ", updated, mappedPayload);
    }

    //ON RETURN SUCCESS
    console.log("UPDATED OK : ", updated);
    return submission.reply();
  } catch (error) {
    console.log("ERROR UPDATE ATTR ACTION : ", error);
    return null;
  }
};

export const updatePDLACTION = async (
  data: { previous: string[]; selected: string[]; productId: string },
  iniotialState: { success?: boolean },
  fd: FormData
) => {
  try {
    console.log("UPDATE PDL ACTION");
    const pdlToAdd: string[] = [];

    const { previous, selected, productId } = data;

    //ON LOOP SUR SELECTED
    selected.forEach((item) => {
      const inPrevious = previous.find((pre) => pre === item);

      //SI L'ITEM EST ABSENT DE PREVIOUS, IL FAUT l'AJOUTER
      if (!inPrevious) {
        pdlToAdd.push(item);
      }
    });

    //ON LOOP SUR PREVIOUS
    const pdlToDelete: string[] = previous.filter((item) => {
      //SI L'ITEM EST ABSENT DE SELECTED, IL FAUT LE SUPPRIMER
      return !selected.find((sel) => sel === item);
    });

    console.log("TOADD ET TODELETE : ", pdlToAdd, pdlToDelete);

    //ON REQUEST LA DB AVEC LES PDL A ADD ET DELETE
    const updated = await updatePDLonDB(productId, pdlToAdd, pdlToDelete);

    console.log("UPDATED : ", updated);
    return { ...iniotialState, success: true };
  } catch (error) {
    console.log("ERROR UPDATE PDL ACTION : ", error);
    return { ...iniotialState, success: false };
  }
};

export const deleteProductAction = async (
  data: { product: ProductSelect; redirection: boolean; redirectPath: string },
  initialState: { success?: boolean; _error?: string },
  fd: FormData
) => {
  try {
    const session = await auth();
    const { product } = data;

    console.log("REDIRECTION PATH  DANS LE DELETE : ", data.redirection);

    //ON VERIFIE QUE LE PRODUCT A DELETE APPARTIENT BIEN A L'USER DE LA SESSION
    if (!session || session.user?.id !== product.userId) {
      return {
        ...initialState,
        success: false,
        _error:
          "Vous n'avez pas les autorisations pour supprimer cette annonce.",
      };
    }

    //ON DELETE DANS LA DB AVEC LE PRODUCT.ID
    // const deleted = await deleteProductOnDB(product.id);

    // if (!deleted) throw new Error("deleted null");

    //ON REVALIDE LE PATH
    revalidatePath("/mes-annonces");
  } catch (error) {
    console.log("ERROR DELETE PRODUCT ACTION : ", error);
    return { ...initialState, success: false };
  }

  //SI REDIRECTION EST TRUE, ON REDIRIGE
  if (data.redirection) {
    redirect(data.redirectPath);
  }

  //SINON ON RETURN SUCCESS
  return { ...initialState, success: true };
};

export const searchWithFiltersACTION = async (
  params: ISearchParams,
  initialState: {
    success: boolean;
    products: ProductForList[];
    error: string | null;
  },
  fd: FormData
) => {
  try {
    console.log('SEARCHWITHFILTER');
    if (!params.keyword.trim().length) {
      throw new Error('EMPTY KEYWORD, FAST EXIT');
    }
    const products = await getProductsList(params);

    return { ...initialState, success: true, products };
    
  } catch (error: any) {
    console.log("ERROR SEARCH WITH FITLERS ACTION : ", error?.message);
    return {...initialState, success: false};
  }
};
