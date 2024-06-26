import {
  CategoriesType,
  Details,
  ICard,
  ProductDataForList,
  ProductForList,
  ProductUpdateType,
  SearchResultType,
} from "@/interfaces/IProducts";
import { getDb } from "@/drizzle/db";
import {
  CategorySelect,
  ImageSelect,
  ProdAttrInsert,
  ProductInsert,
  ProductSelect,
  SelectUser,
  attrNameType,
  attributeCategoryJONC,
  attributesTable,
  categoryTable,
  deliveries,
  favoritesTable,
  images,
  locations,
  productAttributeJONC,
  productDeliveryLink,
  products,
  users,
} from "@/drizzle/schema";
import { SQL, and, count, eq, ilike, or, sql } from "drizzle-orm";
import { ProdAttrTypeWithName } from "@/context/newproduct.context";
import { auth } from "@/auth";

// export const getProductDetailsById = async (id: string) => {
//   try {
//     const db = getDb();
//     const data = await db.transaction(async (tx) => {
//       const p: ProductSelect[] = await tx
//         .select()
//         .from(products)
//         .where(eq(products.id, id));

//       const c = await tx
//         .select()
//         .from(categoryTable)
//         .where(eq(categoryTable.type, p[0].categoryType))
//         .then((r) => r[0]);

//       // REQUEST TOUS LES ATTRIBUTS DISPO POUR LA CREATION
//       const sq = db
//         .select()
//         .from(attributeCategoryJONC)
//         .where(eq(attributeCategoryJONC.categoryType, c.type))
//         .as("sq");
//       const a = await tx
//         .select()
//         .from(attributesTable)
//         .rightJoin(sq, eq(sq.attributeName, attributesTable.name));

//       //const subq = db.select().from(attributesTable).where(eq())
//       const attrs = await tx
//         .select()
//         .from(productAttributeJONC)
//         .leftJoin(
//           attributesTable,
//           eq(productAttributeJONC.attributeId, attributesTable.id)
//         )
//         .where(eq(productAttributeJONC.productId, p[0].id));

//       const u: SelectUser[] = await tx
//         .select()
//         .from(users)
//         .where(eq(users.id, p[0].userId));

//       const i: ImageSelect[] = await tx
//         .select()
//         .from(images)
//         .where(eq(images.productId, id));

//       const d = await tx
//         .select()
//         .from(productDeliveryLink)
//         .where(eq(productDeliveryLink.productId, id))
//         .leftJoin(
//           deliveries,
//           eq(productDeliveryLink.deliveryId, deliveries.id)
//         );

//       const l = await tx
//         .select()
//         .from(locations)
//         .where(eq(locations.id, p[0].locationId));

//       return {
//         product: p[0],
//         user: u[0],
//         images: i.map((item) => item.url),
//         del: d.map((item) => item.deliveries),
//         location: l[0],
//         category: c,
//         attributes: attrs,
//       };
//     });

//     return data;
//   } catch (error) {
//     console.log("ERROR FETCHING PRODUCT : ", error);
//     return null;
//   }
// };

export const getProductDetails = async (
  productId: string
): Promise<Details | undefined> => {
  try {
    const db = getDb();

    const p = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        seller: true,
        attributes: {
          with: {
            attribute: true,
          },
        },
        favorites: true,
        images: true,
        location: true,
        pdl: {
          with: {
            delivery: true,
          },
        },
      },
    });

    return p;
  } catch (error) {
    console.log("ERROR FETCHING PRODUCT DETAILS : ", error);
    return undefined;
  }
};

export const fetchProductsForSlider = async (
  category: CategoriesType
): Promise<ICard[]> => {
  try {
    const db = getDb();
    const cat = await db
      .select()
      .from(categoryTable)
      .where(eq(categoryTable.type, category))
      .then((r) => r[0]);
    const prods = await db.query.products.findMany({
      where: eq(products.categoryType, cat.type),
      with: {
        images: {
          columns: {
            url: true,
            id: false,
            productId: false,
          },
          limit: 1,
        },
        seller: {
          columns: {
            name: true,
            rating: true,
            rateNumber: true,
            password: false,
          },
        },
        pdl: {
          columns: {
            deliveryId: true,
          },
          limit: 1,
        },
        location: {
          columns: {
            postcode: true,
            city: true,
          },
        },
        favorites: true,
      },
      limit: 10,
    });
    return prods;
  } catch (error) {
    console.log("ERROR FETCHING PRODUCTS : ", error);
    return [];
  }
};

export const getProductsByCategory = async (
  category: CategoriesType
): Promise<ProductDataForList[]> => {
  try {
    const db = getDb();
    const session = await auth();

    const prods = await db.query.products.findMany({
      where: eq(products.categoryType, category),
      with: {
        images: {
          limit: 1,
        },
        location: true,
        favorites: {
          where: eq(favoritesTable.userId, session?.user?.id ?? "null"),
        },
      },
      limit: 10,
    });

    const mappedProds = prods.map((p) => {
      return {
        product: { ...p },
        images: p.images,
        location: p.location,
        favorites: !!p.favorites.length,
      };
    });

    return mappedProds;
  } catch (error) {
    console.log("ERROR FETCHING PORDS BY CATGEROY : ");
    return [];
  }
};

export const createProductOnDB = async (product: ProductInsert) => {
  try {
    const db = getDb();
    const newProduct = await db
      .insert(products)
      .values(product)
      .returning()
      .then((r) => r[0]);
    if (!newProduct) throw new Error("Failed to create product on DB");
    return true;
  } catch (error) {
    console.log("ERROR CREATE PRODUCT REQUEST ", error);
    return false;
  }
};

export const createProdAttrsOnDB = async (prodAttrs: ProdAttrInsert[]) => {
  try {
    const db = getDb();
    const pa = await db
      .insert(productAttributeJONC)
      .values(prodAttrs)
      .returning();
    if (!pa.length) {
      console.log("0 ROW INSERTED PRODATTR : ", prodAttrs);
    }
    return true;
  } catch (error) {
    console.log("ERROR CREATING PRODATTR REQUEST : ", error);
    return null;
  }
};

export const deleteProductOnDB = async (productId: string) => {
  try {
    const db = getDb();
    const deleted = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();
    console.log("DELETED : ", deleted);
    return true;
  } catch (error) {
    console.log("ERROR DELETING PRODUCT : ", error);
    return null;
  }
};

export const getProductsForUpdateList = async (
  userId: string
): Promise<ProductUpdateType[]> => {
  try {
    const db = getDb();

    const prods = await db.query.products.findMany({
      where: eq(products.userId, userId),
      with: {
        attributes: {
          with: {
            attribute: true,
          },
        },
        images: true,
        location: true,
        category: true,
        pdl: {
          with: {
            product: true,
          },
        },
      },
    });

    return prods;
  } catch (error) {
    console.log("ERROR FETCHING PRODUCT BY USERID : ", error);
    return [];
  }
};

export const getProductForUpdate = async (
  productId: string
): Promise<ProductUpdateType | undefined> => {
  try {
    const db = getDb();
    const prod = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        attributes: {
          with: {
            attribute: true,
          },
        },
        images: true,
        location: true,
        category: true,
        pdl: true,
      },
    });

    if (!prod) {
      throw new Error("No product with this id");
    }

    return prod;
  } catch (error) {
    console.log("ERROR FETCHING PRODUCT FOR UPDATE : ", error);
    return undefined;
  }
};

export const udpateProductOnDB = async (
  productId: string,
  values: Partial<ProductInsert>
) => {
  try {
    const db = getDb();
    const updatedProd = await db
      .update(products)
      .set(values)
      .where(eq(products.id, productId))
      .returning()
      .then((r) => r[0]);
    return updatedProd;
  } catch (error) {
    console.log("ERROR UPDATE PRODUCT ON DB ", error);
    return null;
  }
};

export const updateProdAttrOnDb = async (
  productId: string,
  attrs: { name: attrNameType; value: string }[]
) => {
  try {
    const db = getDb();
    const updated = [];

    //ON LOOP SUR LE PAYLOAD MAPPE
    for (let i = 0; i < attrs.length; i++) {
      //ON STOCKE L'ATTRIBUT CURRENT DU PAYLOAD
      const { name, value } = attrs[i];

      //ON RECUPERE L'ID DE L'ATTRIBUT DANS LA DB VIA SON NAME RECU DEPUIS LE PAYLOAD
      const attr = await db
        .select()
        .from(attributesTable)
        .where(eq(attributesTable.name, name))
        .then((r) => r[0]);

      //ON UPDATE LE PRODATTR GRACE A L'ID DE L'ATTRIBUT RECUPERE ET DU PRODUCT ID
      const up = await db
        .update(productAttributeJONC)
        .set({
          value,
        })
        .where(
          and(
            eq(productAttributeJONC.productId, productId),
            eq(productAttributeJONC.attributeId, attr.id)
          )
        )
        .returning()
        .then((r) => r[0]);

      //SI L'UPDATE A AFFECTE UNE LIGNE, ON LA STOCKE DANS updated
      if (up) {
        updated.push(up);
      }
    }

    //ET ON LE RETURN
    return updated;
  } catch (error) {
    console.log("ERROR UPDATING PRODATTR ON DB : ", error);
    return null;
  }
};

export const getProductsListByCategory = async (
  category: CategoriesType
): Promise<ProductForList[]> => {
  try {
    const db = getDb();
    const session = await auth();

    const sb = db.select().from(images).limit(1).as("image");
    const pr = await db
      .selectDistinctOn([products.id])
      .from(products)
      .leftJoin(
        favoritesTable,
        and(
          eq(products.id, favoritesTable.productId),
          eq(favoritesTable.userId, session?.user?.id ?? "1")
        )
      )
      .leftJoin(locations, eq(locations.id, products.locationId))
      .leftJoin(images, eq(images.productId, products.id))
      .where(eq(products.categoryType, category))
      .limit(10);

    return pr;
  } catch (error) {
    console.log("ERROR PR : ", error);
    return [];
  }
};

export const getProductsList = async (where: SQL<unknown>, limit: number = 10 ): Promise<ProductForList[]> => {
  try {
    const db = getDb();
    const session = await auth();

    const pr = await db
      .selectDistinctOn([products.id])
      .from(products)
      .leftJoin(
        favoritesTable,
        and(
          eq(products.id, favoritesTable.productId),
          eq(favoritesTable.userId, session?.user?.id ?? "1")
        )
      )
      .leftJoin(locations, eq(locations.id, products.locationId))
      .leftJoin(images, eq(images.productId, products.id))
      .where(where)
      .limit(limit);

    return pr;
  } catch (error) {
    console.log('ERROR GET PRODUCTS LIST : ', error);
    return [];      
  }
}

export const mapProductForList = (productsList: ProductForList[]) => {
  const mapped = productsList.reduce<ProductForList[]>((acc, row) => {
    let existing = false;
    for (let i = 0; i < acc.length; i++) {
      const curr = acc[i];
      if (curr.product && row.product && curr.product.id === row.product.id) {
        existing = true;
      }
    }
    if (!existing) {
      acc.push(row);
    }
    return acc;
  }, []);

  console.log("PRODUCLIST : ", productsList.length);
  console.log("MAPPED : ", mapped.length);
};

export const createWhereConditionFromKeyword = (keyword: string, titleOnly: boolean) => {
  const mappedKeyword = `%${keyword}%`;
  const withDescription = sql`product.title ILIKE ${mappedKeyword} OR product.description ILIKE ${mappedKeyword}`;
  const withoutDescription = sql`product.title ILIKE ${mappedKeyword}`;

  const where = titleOnly ? withoutDescription : withDescription;
  return where;
}

export const searchOnDb = async (
  keyword: string,
  titleOnly: boolean
): Promise<SearchResultType[]> => {
  try {
    const db = getDb();
   
    const where = createWhereConditionFromKeyword(keyword, titleOnly);

    //LA SUBQUERY POUR RECUPERER LE COUNT TOTAL DE PRODUCT CORRESPONDANT A LA RECHERCHE
    const sq = db.$with('count').as(db.select({total: count(products.id).as('compte')}).from(products).where(where))

    const result = await db.with(sq)
      .select()
      .from(sq)
      .leftJoin(products,where)
      .leftJoin(categoryTable, eq(products.categoryType, categoryTable.type))
      .limit(3)
    
    return result;
  } catch (error) {
    console.log("ERROR SEARCHING ON DB : ", error);
    return [];
  }
};

export const getProductListForSearch = async (keyword: string, titleOnly: boolean): Promise<ProductForList[]> => {
  try {
    const db = getDb();
    const data = await db.select().from(products)
      .leftJoin(locations, eq(locations.id, products.id))
    return [];
  } catch (error) {
    console.log('ERROR GET PRODUCT LIST FOR SEARCH : ', error);
    return [];
  }  
}
