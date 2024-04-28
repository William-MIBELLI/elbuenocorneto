import {
  CategoriesType,
  IProduct,
  IProductCard,
  IProductDetails,
} from "@/interfaces/IProducts";
import data from "../../../data.json";
import { getDb } from "@/drizzle/db";
import {
  ImageSelect,
  ProductSelect,
  SelectUser,
  images,
  products,
  users,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getProductById = async (
  id: string
): Promise<IProductDetails | null>=> {
  try {
    const db = await getDb();
    const data = await db
      .select({
        product: products,
        user: {...users, password: ''}
      })
      .from(products)
      .leftJoin(users, eq(users.id, products.userId))
      .fullJoin(images, eq(images.productId, id))
      .where(eq(products.id, id))
    
    const row = data[0];
    if (!row?.product || !row?.user ) {
      throw new Error('Something missing in data')
    }

    return row;

  } catch (error) {
    console.log("ERROR FETCHING PRODUCT ", error);
    return null;
  }
};

export const getProductsByCategory = async (category: CategoriesType) => {
  try {
    const db = await getDb();
    const prods = await db
      .select({
        name: users.name,
        rating: users.rating,
        rateNumber: users.rateNumber,
        id: products.id,
        product: products,
        images: {
          url: images.url,
        },
      })
      .from(products)
      .where(eq(products.category, category))
      .limit(10)
      .leftJoin(users, eq(products.userId, users.id))
      .rightJoin(images, eq(images.productId, products.id));

    return prods as IProductCard[];
  } catch (error) {
    console.log("Error with fetching products : ", error);
    return [];
  }
};

export const getImagesUrlByProductId = async (productId: string) => {
  try {
    const db = await getDb();
    const data = await db.select().from(images).where(eq(images.productId, productId));
    const imgUrl = data.map(item => {
      return item.url
    })
    return imgUrl;
  } catch (error) {
    console.log('ERROR GETTING IMAGE : ', error);
    return null;
  }
}
