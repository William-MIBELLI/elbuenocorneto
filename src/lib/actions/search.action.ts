"use server";
import { LocationInsert, SearchInsert, SearchSelect } from "@/drizzle/schema";
import { ISearchParams } from "./../../context/search.context";
import { auth } from "@/auth";
import {
  createLocationOnDB,
  deleteLocationOnDB,
  updateLocationOnDB,
} from "../requests/location.request";
import { v4 as uuidv4 } from "uuid";
import {
  checkSearchExist,
  createSearchOnDB,
  deleteSearchOnDB,
  getSearchs,
  updateSearchOnDB,
} from "../requests/search.request";
import { revalidatePath } from "next/cache";
import { rest } from "lodash";
import { compareSearchs } from "../helpers/search.helper";

export const createSearchACTION = async (
  data: { params: ISearchParams; location: LocationInsert | undefined },
  state: {
    success: boolean;
    error: string;
    newParams?: SearchInsert | undefined;
  },
  fd: FormData
) => {
  try {
    const { params, location } = data;
    const session = await auth();

    //ON CHECK SI L'UTILISATEUR EST CONNECTE
    if (!session || !session.user || !session.user.id) {
      throw new Error("User not connected");
    }

    //ON CREE LE SEARCHINSERT
    const searchToSave: SearchInsert = {
      id: uuidv4(),
      userId: session.user.id,
      locationId: location?.id,
      ...params
    };

    //ON CHECK SI LA RECHERCHE EST DEJA EXISTANTE
    const exisitingSearch = await checkSearchExist(searchToSave, session.user.id);

    if (exisitingSearch) {
      throw new Error("Search already exist");
    }

    //SI LNG LAT ET RADIUS, ON CHECK SI LOCATION EST BIEN DEFINI
    if (params.lng && params.lat && params.radius) {
      if (!location) {
        throw new Error("Location not defined but got coordonates and radius");
      }

      //ON CREE LA LOCATION ET ON RECUPERE SON ID
      const loc = await createLocationOnDB(location);
      if (!loc) {
        throw new Error("Location not created");
      }

      //ON AJOUTE L'ID DE LA LOCATION A LA RECHERCHE
      searchToSave.locationId = loc.id;
    }

    //ON L'INSERT DANS LA DB
    const savedSearch = await createSearchOnDB(searchToSave);

    if (!savedSearch) {
      throw new Error("Search not saved");
    }

    return {
      ...state,
      success: true,
      error: "",
      newParams: savedSearch,
    };
  } catch (error: any) {
    console.log("ERROR IN SEARCH ACTION", error?.message);
    return { ...state, success: false, error: error?.message };
  }
};

export const deleteSearchACTION = async (
  data: { id: string },
  state: {
    error: string;
    success: boolean;
    newParams?: ISearchParams | undefined;
  },
  fd: FormData
) => {
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
    return { ...state, success: false, error: error?.message };
  }
};

export const updateSearchACTION = async (
  data: {
    search: ISearchParams;
    location: LocationInsert | undefined;
  },
  state: {
    success: boolean;
    error: string;
    newParams?: SearchInsert | undefined;
  },
  fd: FormData
) => {
  try {
    const session = await auth();

    //ON CHECK SI L'UTILISATEUR EST CONNECTE
    if (!session || !session.user || !session.user.id)
      throw new Error("User not connected");

    const { search, location } = data;

    console.log('DATA DANS UPDATE SEARCH ACTION : ', data);

    //ON CHECK SI LA RECHERCHE EXISTE
    const existingSearch = await getSearchs("id", search.id);

    if (existingSearch.length === 0) {
      throw new Error("Search not found");
    }

    const oldSearchItem = existingSearch[0];
    const { search: oldSearch, location: OldLocation } = oldSearchItem;

    //ON CHECK SI L'USER A DEJA UNE SEARCH IDENTIQUE
    const isSame = await checkSearchExist(search, session.user.id);

    //SI LES PARAMS SONT LES MEMES ET QU'IL N'Y A PAS DE LOCATION, ON RENVOIE UNE ERREUR
    if (isSame && !location) {
      throw new Error("Same search params");
    }

    //SI ON A UNE NOUVELLE LOCATION
    if (location?.coordonates) {
      console.log('OLCDSEACRH : ', oldSearch);
      //ON CHECK SI IL Y EN A UNE ANCIENNE
      if (OldLocation?.coordonates) {
        //ON LES DESTRUCTURE POUR ENLEVER L'ID
        const { lng: newLng, lat: newLat } = location.coordonates;
        const { lng: oldLng, lat: oldLat} = OldLocation.coordonates;

        //ON LES COMPARE
        const isSameLoc = newLng === oldLng && newLat === oldLat;

        console.log('IS SAME LOC : ', isSameLoc, newLng, oldLng, newLat, oldLat);
        //SI LES LOCATIONS SONT DIFFERENTES
        if (!isSameLoc) {
          console.log('ON RENTRE DANS LE IF DE LOCATIONS DIFFERENTES');
          //ON MET A JOUR L'ANCIENNE LOCATION AVEC LES PROPRIETES DE LA NOUVELLE
          const updatedLoc = await updateLocationOnDB(
            {...location, id: oldSearch.locationId!},
            oldSearchItem?.location?.id!
          );

          //ON VERIFIE QU'ELLE A BIEN ETE CREEE
          if (!updatedLoc) throw new Error("Location not created");
          
        }
        //SI LA LOCATION ET LES PARAMS SONT IDENTIQUES, ON RENVOIE UNE ERREUR
        else if (isSameLoc && isSame) {
          throw new Error("Cette recherche existe déjà");
        }
      } else {
        //SI PAS DANCIENNE LOCATION, ON CREE LA NOUVELLE
        const loc = await createLocationOnDB(location);

        //ON VERIFIE QU'ELLE A BIEN ETE CREEE
        if (!loc) throw new Error("Location not created");
      }
    }

    //SI PAS DE LOCATION, ON SUPPRIME L'ANCIENNE
    if ((!search.lat && !search.lng && !search.radius) && oldSearchItem.location?.id) {
      const isDeleted = await deleteLocationOnDB(oldSearchItem.location.id);

      if (!isDeleted) throw new Error("Location not deleted");
    }

    

    //ON UPDATE LA RECHERCHE
    const updatedSearch = await updateSearchOnDB(
      {
        ...search,
        createdAt: new Date(),
        locationId: location ? oldSearchItem?.location?.id || location.id : null,
        userId: session.user.id,
        id: oldSearch.id,
      },
      oldSearch.id
    );

    //ON CHECK SI LA RECHERCHE A ETE UPDATE
    if (!updatedSearch) {
      throw new Error("Search not updated");
    }

    // console.log('UPDATED SEARCH DANS ACTION  : ', updatedSearch);

    //ON RETURN SUCCESS
    return {
      success: true,
      error: "",
      newParams: updatedSearch,
    };
  } catch (error: any) {
    console.log("ERROR IN UPDATE SEARCH ACTION", error?.message);
    return { ...state, success: false, error: error?.message };
  }
};
