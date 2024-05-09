import { CategoriesType, ICard } from "@/interfaces/IProducts";
import { getDb } from "@/drizzle/db";
import {
  ImageSelect,
  ProductSelect,
  SelectUser,
  deliveries,
  images,
  locations,
  productDeliveryLink,
  products,
  users,
} from "@/drizzle/schema";
import { eq, count, sql } from "drizzle-orm";
import { ProductDataForList } from "@/components/product-list/ProductList";

export const getProductDetailsById = async (id: string) => {
  try {
    const db = getDb();
    const data = await db.transaction(async (tx) => {
      const p: ProductSelect[] = await tx
        .select()
        .from(products)
        .where(eq(products.id, id));

      const u: SelectUser[] = await tx
        .select()
        .from(users)
        .where(eq(users.id, p[0].userId));

      const i: ImageSelect[] = await tx
        .select()
        .from(images)
        .where(eq(images.productId, id));

      const d = await tx
        .select()
        .from(productDeliveryLink)
        .where(eq(productDeliveryLink.productId, id))
        .leftJoin(
          deliveries,
          eq(productDeliveryLink.deliveryId, deliveries.id)
        );

      const l = await tx
        .select()
        .from(locations)
        .where(eq(locations.id, p[0].locationId));

      return {
        product: p[0],
        user: u[0],
        images: i.map((item) => item.url),
        del: d.map((item) => item.deliveries),
        location: l[0],
      };
    });

    return data;
  } catch (error) {
    console.log("ERROR FETCHING PRODUCT : ", error);
    return null;
  }
};

export const fetchProductsForSlider = async (
  category: CategoriesType
): Promise<ICard[]> => {
  try {
    const db =  getDb();

    const prods = await db.query.products.findMany({
      where: eq(products.category, category),
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
            postal: true,
            city: true,
          },
        },
      }, limit: 10
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
    const db = await getDb();
    const prods = await db.query.products.findMany({
      where: eq(products.category, category),
      with: {
        images: {
          limit: 1,
        },
        location: true,
      },
    });
    const mappedProds = prods.map((p) => {
      return { product: { ...p }, images: p.images, location: p.location };
    });
    return mappedProds;
  } catch (error) {
    console.log("ERROR FETCHING PORDS BY CATGEROY : ");
    return [];
  }
};


