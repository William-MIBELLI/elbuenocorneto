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

export const createSearchACTION = async (
  data: { params: ISearchParams; location: LocationInsert | undefined },
  state: {
    success: boolean;
    error: string;
    newParams?: ISearchParams | undefined;
  },
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
      newParams: { ...savedSearch.searchParams, id: savedSearch.id },
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
    params: ISearchParams;
    location: LocationInsert | undefined;
  },
  state: {
    success: boolean;
    error: string;
    newParams?: ISearchParams | undefined;
  },
  fd: FormData
) => {
  try {
    const session = await auth();

    //ON CHECK SI L'UTILISATEUR EST CONNECTE
    if (!session || !session.user || !session.user.id)
      throw new Error("User not connected");

    const { params, location } = data;

    //ON CHECK SI LA RECHERCHE EXISTE
    const existingSearch = await getSearchs("id", params.id);

    if (existingSearch.length === 0) {
      throw new Error("Search not found");
    }

    const oldSearch = existingSearch[0];

    //ON COMPARE LES ANCIENS PARAMS AVEC LES NOUVEAUX
    const isSame =
      JSON.stringify(oldSearch.search.searchParams) === JSON.stringify(params);

    console.log("IS SAME : ", isSame, oldSearch.search.searchParams, params);
    //SI LES PARAMS SONT LES MEMES ET QU'IL N'Y A PAS DE LOCATION, ON RENVOIE UNE ERREUR
    if (isSame && !location) {
      throw new Error("Same search params");
    }

    //SI ON A UNE NOUVELLE LOCATION
    if (location?.coordonates) {
      console.log('OLCDSEACRH : ', oldSearch);
      //ON CHECK SI IL Y EN A UNE ANCIENNE
      if (oldSearch.location?.coordonates) {
        //ON LES DESTRUCTURE POUR ENLEVER L'ID
        const { lng: newLng, lat: newLat } = location.coordonates;
        const { lng: oldLng, lat: oldLat} = oldSearch.location.coordonates;

        //ON LES COMPARE
        const isSameLoc = newLng === oldLng && newLat === oldLat;

        console.log('IS SAME LOC : ', isSameLoc, newLng, oldLng, newLat, oldLat);
        //SI LES LOCATIONS SONT DIFFERENTES
        if (!isSameLoc) {
          console.log('ON RENTRE DANS LE IF DE LOCATIONS DIFFERENTES');
          //ON MET A JOUR L'ANCIENNE LOCATION AVEC LES PROPRIETES DE LA NOUVELLE
          const updatedLoc = await updateLocationOnDB(
            {...location, id: oldSearch.search.locationId!},
            oldSearch.location.id
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
    if ((!params.lat && !params.lng && !params.radius) && oldSearch.location?.id) {
      const isDeleted = await deleteLocationOnDB(oldSearch.location.id);

      if (!isDeleted) throw new Error("Location not deleted");
    }

    

    //ON UPDATE LA RECHERCHE
    const updatedSearch = await updateSearchOnDB(
      {
        ...oldSearch.search,
        searchParams: params,
        locationId: location ? oldSearch?.location?.id || location.id : null,
      },
      oldSearch.search.id
    );

    //ON CHECK SI LA RECHERCHE A ETE UPDATE
    if (!updatedSearch) {
      throw new Error("Search not updated");
    }

    console.log('UPDATED SEARCH DANS ACTION  : ', updatedSearch);

    //ON RETURN SUCCESS
    return {
      success: true,
      error: "",
      newParams: { ...updatedSearch.searchParams, id: updatedSearch.id },
    };
  } catch (error: any) {
    console.log("ERROR IN UPDATE SEARCH ACTION", error?.message);
    return { ...state, success: false, error: error?.message };
  }
};
