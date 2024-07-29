"use server";
import { LocationInsert, SearchInsert, SearchSelect } from "@/drizzle/schema";
import { ISearchParams } from "./../../context/search.context";
import { auth } from "@/auth";
import { createLocationOnDB } from "../requests/location.request";
import { v4 as uuidv4 } from "uuid";
import { checkSearchExist, createSearchOnDB, deleteSearchOnDB } from "../requests/search.request";
import { revalidatePath } from "next/cache";


export const createSearchACTION = async (
  data: { params: ISearchParams; location: LocationInsert | undefined },
  state:{ success: boolean; error: string},
  fd: FormData
) => {
  try {
    const { params, location } = data;
    const session = await auth();

    //ON CHECK SI L'UTILISATEUR EST CONNECTE
    if (!session || !session.user || !session.user.id)
      throw new Error("User not connected");
    const { user } = session;

    //ON CREE LE SEARCHINSERT
    const searchToSave: SearchInsert = {
      id: uuidv4(),
      userId: session.user.id,
      searchParams: params,
      locationId: location?.id,
    };

    //ON CHECK SI LA RECHERCHE EST DEJA EXISTANTE
    const exisitingSearch = await checkSearchExist(searchToSave);

    
    if (exisitingSearch && exisitingSearch.length > 0) {
      throw new Error("Search already exist");
    }

    //SI LNG LAT ET RADIUS, ON CHECK SI LOCATION EST BIEN DEFINI
    if (params.lng && params.lat && params.radius) {
      if (!location) {
        throw new Error("Location not defined");
      }

      //ON CREE LA LOCATION ET ON RECUPERE SON ID
      const loc = await createLocationOnDB(location);
    }

    //ON L'INSERT DANS LA DB
    const savedSearch = await createSearchOnDB(searchToSave);

    if (!savedSearch) {
      throw new Error("Search not saved");
    }
   
    return { ...state, success: true };
    
  } catch (error: any) {
    console.log("ERROR IN SEARCH ACTION", error?.message);
    return { success: false, error: error?.message };
  }
};

export const deleteSearchACTION = async (data: {id: string},state: { error: string, success: boolean }, fd: FormData) => {
  try {
    const session = await auth();

    //ON CHECK SI L'UTILISATEUR EST CONNECTE
    if (!session || !session.user || !session.user.id)
      throw new Error("User not connected");

    //ON DELETE LA RECHERCHE
    const isDeleted = await deleteSearchOnDB(data.id, session.user.id);

    if (!isDeleted) {
      throw new Error("Search not deleted");
    }
    revalidatePath("/my-search");
    return { success: true, error: "" };

  } catch (error: any) {
    console.log("ERROR IN DELETE SEARCH ACTION", error?.message);
    return { success: false, error: error?.message };
  }
}

