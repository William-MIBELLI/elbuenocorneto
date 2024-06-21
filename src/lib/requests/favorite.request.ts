import { AuthError } from "next-auth";
import { getDb } from "@/drizzle/db";
import { Favoriteinsert, favoritesTable, images, locations, products } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidV4 } from "uuid";
import { ProductDataForList, ProductForList } from "@/interfaces/IProducts";

export const getFavoritesByUserId = async (userId: string): Promise<ProductForList[]> => {
  try {

    const db = getDb();

    const favorites = await db
      .selectDistinctOn([products.id])
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId))
      .leftJoin(products, eq(products.id, favoritesTable.productId))
      .leftJoin(locations, eq(locations.id, products.locationId))
      .leftJoin(images, eq(images.productId, products.id));
    
    return favorites;
  } catch (error) {
    console.log("ERROR FETCHING FAVORITES : ", error);
    return [];
  }
};

export const createFavorite = async (productId: string, userId: string) => {
  try {
    //ON CREE UN NOUVEAU FAVORIS
    const fav: Favoriteinsert = {
      id: uuidV4(),
      productId,
      userId,
    };

    //ON L'AJOUTE DANS LA DB
    const db = getDb();
    const added = await db.insert(favoritesTable).values(fav).returning();

    //SI CA NOUS RETURN AUCUNE RAW, ON TRHOW UNE ERROR
    if (!added.length) throw new Error("Zero raw created");

    console.log('ADDED : ', added);
    return true;
  } catch (error) {
    console.log("ERRIR CREATING FAVORITE : ", error);
    return null;
  }
};

export const deleteFavorite = async (productId: string, userId: string) => {
  try {
    const db = getDb();
    const deleted = await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.productId, productId),
          eq(favoritesTable.userId, userId)
        )
      )
      .returning();

    if (!deleted.length) throw new Error("Zero raw deleted");

    console.log('DELETED : ', deleted);

    return true;
  } catch (error) {
    console.log("ERROR DELETING FAVORITE : ", error);
    return null;
  }
};

export const isThisProductAFavorite = async (
  productId: string,
  userId: string
) => {
  try {
    const db = getDb();
    const isFavorite = await db
      .select()
      .from(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.productId, productId)
        )
    );
    return !!isFavorite.length;
  } catch (error) {
    console.log("ERROR FETCHING ISFAVORITE : ", error);
    return false;
  }
};

export const updateFavoriteOnDB = async (productId: string, userId: string) => {
  try {
    const db = getDb();

    //ON CHECK SI LE PRODUCT EST DANS LES FAVORIS DE LUSER
    const fav = await db.select().from(favoritesTable).where(
      and(
        eq(favoritesTable.productId, productId),
        eq(favoritesTable.userId, userId),
      )
    )

    //SI OUI ON LE DELETE
    if (fav.length) {
      await deleteFavorite(productId, userId);
    }

    //SINON ON LE CREE
    else {
      await createFavorite(productId, userId);
    }

    //ON RETURN UN BOOLEAN CONTRAIRE A LA VALEUR DE FAV, VU QUON A INVERSE SA VALEUR
    return !fav.length
  } catch (error) {
    console.log('ERROR UDPATING FAV ON DB : ', error);
    return null;
  }
}
