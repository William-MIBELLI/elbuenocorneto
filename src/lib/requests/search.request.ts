'use server'
import { getDb } from "@/drizzle/db";
import {
  locations,
  LocationSelect,
  SearchInsert,
  SearchSelect,
  searchTable,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { ISearchParams } from "@/context/search.context";
import { compareSearchs } from "../helpers/search.helper";

export const createSearchOnDB = async (search: SearchInsert) => {
  try {
    const db = getDb();
    const res = await db
      .insert(searchTable)
      .values(search)
      .returning()
      .then((r) => r[0]);
    return res;
  } catch (error: any) {
    console.log("ERROR CREATING SEARCH : ", error?.message);
    return null;
  }
};

export interface ISearchItem {
  search: SearchSelect;
  location: LocationSelect | null;
}

type SearchTableKeys = keyof typeof searchTable['_']['columns'];

export const getSearchs = async <T extends Partial<SearchTableKeys>>(
  col: T, value: any
): Promise<ISearchItem[]> => {
  try {
    const db = getDb();
    const res = await db
      .select()
        .from(searchTable)
      .leftJoin(locations, eq(searchTable.locationId, locations.id))
      .where(eq(searchTable[col], value))
      .then((r) => r);
    return res;
  } catch (error) {
    console.log("ERROR GETTING SEARCH BY USER ID : ", error);
    return [];
  }
};

export const checkSearchExist = async (searchToSave: SearchInsert | ISearchParams, userId: string): Promise<boolean> => {
  try {
    const db = getDb();
    const { id, locationId, ...searchParams } = searchToSave;

    //ON RECUPERE TOUTES LES RECHERCHES DE L'UTILISATEUR
    const res = await db
      .select()
      .from(searchTable)
      .where(eq(searchTable.userId, userId))
      .then((r) => r);

    //ON FILTRE LES RECHERCHES QUI ONT LES MEMES PARAMS
    for(const r of res) {
      const isSame = compareSearchs(r, searchToSave);

      //SI ON TROUVE UNE RECHERCHE IDENTIQUE, ON RENVOIE TRUE
      if (isSame) {
        return true;
      };
    }
    //SINON ON RENVOIE FALSE
    return false;

  } catch (error) {
    console.log("ERROR CHECKING SEARCH EXIST : ", error);
    return false;
  }
};

export const deleteSearchOnDB = async (
  searchId: string,
  userId: string
): Promise<boolean> => {
  try {
    const db = getDb();
    const res = await db
      .delete(searchTable)
      .where(and(eq(searchTable.id, searchId), eq(searchTable.userId, userId)));
    if(res.rowCount === 0) throw new Error('Search not found');
    return true;
  } catch (error) {
    console.log("ERROR DELETING SEARCH : ", error);
    return false;
  }
};

export const updateSearchOnDB = async (updatedSearch: SearchInsert, id: string) => {
  try {
    const db = getDb();
    const res = await db
      .update(searchTable)
      .set(updatedSearch)
      .where(eq(searchTable.id, id))
      .returning()
      .then((r) => r[0]);
    return res;
  } catch (error: any) {
    console.log("ERROR UPDATING SEARCH : ", error?.message);
    return null;
  }
}

