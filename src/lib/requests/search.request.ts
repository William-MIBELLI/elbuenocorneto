import { check } from "drizzle-orm/mysql-core";
import { getDb } from "@/drizzle/db";
import {
  locations,
  LocationSelect,
  SearchInsert,
  SearchSelect,
  searchTable,
} from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const createSearchOnDB = async (search: SearchInsert) => {
  try {
    const db = getDb();
    const res = await db
      .insert(searchTable)
      .values(search)
      .returning()
      .then((r) => r[0]);
    return res;
  } catch (error) {
    console.log("ERROR CREATING SEARCH : ", error);
    return null;
  }
};

export interface ISearchItem {
  search: SearchSelect;
  location: LocationSelect | null;
}

export const getSearchsByUserID = async (
  userId: string
): Promise<ISearchItem[]> => {
  try {
    const db = getDb();
    const res = await db
      .select()
      .from(searchTable)
      .leftJoin(locations, eq(searchTable.locationId, locations.id))
      .where(eq(searchTable.userId, userId))
      .then((r) => r);
    return res;
  } catch (error) {
    console.log("ERROR GETTING SEARCH BY USER ID : ", error);
    return [];
  }
};

export const checkSearchExist = async (searchToSave: SearchInsert) => {
  try {
    const db = getDb();
    const { userId, searchParams } = searchToSave;

    //ON RECUPERE TOUTES LES RECHERCHES DE L'UTILISATEUR
    const res = await db
      .select()
      .from(searchTable)
      .where(and(eq(searchTable.userId, userId)))
      .then((r) => r);

    //ON FILTRE LES RECHERCHES QUI ONT LES MEMES PARAMS
    const mapped = res.filter((r) => {
      return JSON.stringify(r.searchParams) === JSON.stringify(searchParams);
    });

    return mapped;
  } catch (error) {
    console.log("ERROR CHECKING SEARCH EXIST : ", error);
    return null;
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
