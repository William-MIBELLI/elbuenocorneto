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
import { revalidatePath } from "next/cache";
import { AnyPgColumn } from 'drizzle-orm/pg-core';
import { ISearchParams } from "@/context/search.context";

export const createSearchOnDB = async (search: SearchInsert) => {
  try {
    const db = getDb();
    const res = await db
      .insert(searchTable)
      .values(search)
      .returning()
      .then((r) => r[0]);
    // revalidatePath("/my-search", "page");
    console.log("SEARCH CREATED REQUEST APRES REVALIDATE PATH: ", res);
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

export const updateSearchOnDB = async (updatedSearch: SearchInsert, id: string) => {
  try {
    console.log('DATA DANS UPDATE SEARCH : ', updatedSearch, id);
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