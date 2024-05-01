import {
  CategoriesType,
  ICard,
  IProduct,
  IProductCard,
  IProductDetails,
} from "@/interfaces/IProducts";
import data from "../../../data.json";
import { getDb } from "@/drizzle/db";
import {
  DeliveryLinkSelect,
  DeliverySelect,
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
import { count, eq } from "drizzle-orm";


export const getProductsByCategory = async (category: CategoriesType) => {
  try {
    const db = await getDb();
    const data = await db
      .select({
        product: products,
        user: {
          name: users.name,
          rating: users.rating,
          rateNumber: users.rateNumber,
        },
        image: images,
        del: count(productDeliveryLink.productId),
      })
      .from(products)
      .limit(10)
      .where(eq(products.category, category))
      .leftJoin(users, eq(products.userId, users.id))
      .leftJoin(images, eq(images.productId, products.id))
      .leftJoin(
        productDeliveryLink,
        eq(productDeliveryLink.productId, products.id)
      )
      .groupBy(products.id);

    console.log("PRODS LENGTH : ", data.length);
    data.forEach((i) => console.log(i.product));
    //prods.forEach(prod => console.log('prod ID : ', prod.id))
    const prods = data.reduce<Record<string, IProductCard>>((acc, current) => {
      const { product, user, image } = current;
      const p = {
        product: { ...product },
        user: { ...user! },
        imagesUrl: image?.url ? [image.url] : [],
      };

      if (!acc[product.id]) {
        acc[product.id] = p;
      } else if (image?.url) {
        acc[product.id].imagesUrl.push(image.url);
      }
      return acc;
    }, {});

    //console.log('PRODS AVEC RECORD : ', prods);

    const prodsMapped = Object.values(prods).map((p) => p);
    //return prods as IProductCard[];
    return prodsMapped as IProductCard[];
  } catch (error) {
    console.log("Error with fetching products : ", error);
    return [];
  }
};

export const getImagesUrlByProductId = async (productId: string) => {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(images)
      .where(eq(images.productId, productId));
    const imgUrl = data.map((item) => {
      return item.url;
    });
    return imgUrl;
  } catch (error) {
    // console.log('ERROR GETTING IMAGE : ', error);
    return null;
  }
};

export const getProductDetailsById = async (id: string) => {
  try {
    const db = await getDb();
    const data = await db.transaction(async (tx) => {
      const p: ProductSelect[] = await tx
        .select()
        .from(products)
        .where(eq(products.id, id));
      console.log('p : ', p);
      const u: SelectUser[] = await tx
        .select()
        .from(users)
        .where(eq(users.id, p[0].userId));
      console.log('u : ', u);
      const i: ImageSelect[] = await tx
        .select()
        .from(images)
        .where(eq(images.productId, id));
      console.log('i : ', i);
      const d = await tx
        .select()
        .from(productDeliveryLink)
        .where(eq(productDeliveryLink.productId, id))
        .leftJoin(
          deliveries,
          eq(productDeliveryLink.deliveryId, deliveries.id)
      );
      console.log('d : ', d);
      const l = await tx.select().from(locations).where(eq(locations.id, p[0].locationId))
      console.log('l : ', l);
      return {
        product: p[0],
        user: u[0],
        images: i.map((item) => item.url),
        del: d.map((item) => item.deliveries),
        location: l[0]
      };
    });

    console.log('DATA : ', data);
    return data;
  } catch (error) {
    console.log("ERROR FETCHING PRODUCT : ", error);
    return null;
  }
};

export const fetchProductsForSlider = async (category: CategoriesType): Promise<ICard[]> => {
  try {
     const db = await getDb();
 
    const prods = await db.query.products.findMany({
      where: eq(products.category, category),
      with: {
        images: { 
          columns: {
            url: true,
            id: false,
            productId: false
          },
          limit: 1,

        },
        seller: {
          columns: {
            name: true,
            rating: true,
            rateNumber: true,
            password: false,
          }
        },
        pdl: {
          columns: {
            deliveryId: true
          },
          limit: 1
        }
       }
    })
    return prods;
  } catch (error) {
    console.log("ERROR FETCHING PRODUCTS : ", error);
    return [];
  }
};
