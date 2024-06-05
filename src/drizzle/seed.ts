import { CategoriesType, attributesList, categoriesList } from "./../interfaces/IProducts";
import { hashPassword } from "./../lib/password";
import { faker, fakerFR } from "@faker-js/faker";
import { getDb } from "./db";
import {
  AttrCatInsert,
  AttributeInsert,
  DeliveryInsert,
  DeliveryLinkInsert,
  InsertImage,
  InsertUser,
  LocationInsert,
  ProductInsert,
  attributeCategoryJONC,
  attributesTable,
  categoryTable,
  deliveries,
  images,
  locations,
  productDeliveryLink,
  products,
  users,
} from "./schema";
import { v4 as uuidv4 } from "uuid";
import { ILocation } from "@/interfaces/ILocation";
import { deliveryList } from "@/interfaces/IDelivery";
import { attributeCategoryList } from "@/interfaces/IAttribute";
import { sql } from "drizzle-orm";

export const insertRandomUsers = async (count: number) => {
  // console.log("Seeding with random users...");
  try {
    const db = await getDb();

    await db.delete(users);
    const locsId = await getLocationIdForSeedind();

    if (!locsId.length) {
      throw new Error("You need to seed DB with location first.");
    }
    const hash = await hashPassword("dinasty");

    const createRandomUser = (): InsertUser => {
      const loc = locsId[Math.floor(Math.random() * locsId.length)];
      return {
        id: uuidv4(),
        name: faker.internet.userName().slice(0, 19),
        email: faker.internet.email(),
        password: hash,
        locationId: loc,
        rating: faker.number.float({ fractionDigits: 1, min: 0, max: 5 }),
        rateNumber: faker.number.int({ min: 1, max: 40 }),
        createdAt: new Date(),
      };
    };
    const usersList: InsertUser[] = faker.helpers.multiple(createRandomUser, {
      count,
    });

    const res = await db.insert(users).values(usersList).returning();
    return true;
  } catch (error) {
    console.log("ERROR WHEN USER SEEDING : ", error);
    return null;
  }
};

export const insertRandomProducts = async (count: number) => {
  try {
    const db =  getDb();

    await db.delete(products);
    //const locsId = await getLocationIdForSeedind();
    const locs = await db.select({ id: locations.id }).from(locations);
    const usersList = await db.select().from(users);
    const cat = await db.select().from(categoryTable);
    console.log('CAT : ', cat);
    if (!usersList.length || !locs.length || !cat.length)
      throw new Error("You need to seed DB with user, location and categories first.");

    const createRandomProduct = (): ProductInsert => {

      const loc = locs[Math.floor(Math.random() * locs.length)];
      //console.log('LOC ', loc);
      return {
        id: uuidv4(),
        userId: usersList[Math.floor(Math.random() * usersList.length)].id,
        title: faker.commerce.productName(),
        price: faker.number.int({ min: 10, max: 1500 }),
        categoryType: cat[Math.floor(Math.random() * cat.length)].type,
        description: faker.commerce.productDescription(),
        locationId: loc.id,
        state: 'Etat neuf'
      };
    };

    const productsList = faker.helpers.multiple(createRandomProduct, {
      count,
    });

    //console.log('PRODUCT LIST : ', productsList);
    const p = await db.insert(products).values(productsList).returning();
    return true;
  } catch (error) {
    console.log("ERROR SEEDING PRODUCTS : ", error);
    return null;
  }
};

export const insertRandomImageUrl = async (count: number) => {
  try {
    // console.log('Seeding imagesUrl...');
    const db = getDb();
    const categoriesImages = ['nature', 'food', 'cats', 'cats', 'transport']
    await db.delete(images);
    const p = (await db.select({ id: products.id }).from(products)).map(
      (item) => item.id
    );

    if (!p.length) throw new Error("You need to seed products first.");

    const createRandomImageURL = (): InsertImage => {
      const category = categoriesImages[Math.floor(Math.random() * categoriesImages.length)]
      return {
        id: uuidv4(),
        productId: faker.helpers.arrayElement(p),
        url: faker.image.urlLoremFlickr({ category }),
      };
    };

    const data = faker.helpers.multiple(createRandomImageURL, { count });

    await db.insert(images).values(data);
    return true;
  } catch (error) {
    // console.log('ERROR SEEDING IMAGE : ', error);
    return null;
  }
};

export const insertDeliveries = async () => {
  try {
    const db = getDb();
    await db.delete(deliveries);
    const list = deliveryList.map((item, index): DeliveryInsert => {
      return {
        ...item,
        id: (index + 1).toString(),
        price: item.price.toString(),
        maxWeight: item.maxWeight.toString()
      };
    });
    await db.insert(deliveries).values(list);
    return true;
  } catch (error) {
    console.log("ERROR WHEN SEEDING DELIVERIES ", error);
    return null;
  }
};

export const insertDeliveriesLink = async () => {
  try {
    const db =  getDb();
    await db.delete(productDeliveryLink);
    const prods = await db.select({ id: products.id }).from(products);
    const deliverieslist = (
      await db.select({ id: deliveries.id }).from(deliveries)
    ).map((item) => item.id);

    if (!deliverieslist.length)
      throw new Error("You need to seed deliveries first.");

    const data: DeliveryLinkInsert[] = [];

    prods.forEach(({ id }) => {
      const length = Math.floor(Math.random() * deliverieslist.length + 1);
      if (Math.random() > 0.4) {
        for (let i = 0; i < length; i++) {
          const link: DeliveryLinkInsert = {
            productId: id,
            deliveryId: deliverieslist[i],
          };
          data.push(link);
        }
      }
    });
    await db.insert(productDeliveryLink).values(data);
    return true;
  } catch (error) {
    console.log("ERROR INSERT DELIVERIES", error);
    return false;
  }
};

export const insertLocation = async (count: number) => {
  try {
    const db = getDb();
    await db.delete(locations)
    const createLocation = (): LocationInsert => {
      const [lat, lng] = fakerFR.location.nearbyGPSCoordinate({
        isMetric: true,
        radius: 300,
        origin: [43.598235, 1.483408],
      });
      return {
        id: uuidv4(),
        city: fakerFR.location.city(),
        postcode: +fakerFR.location.zipCode(),
        label: fakerFR.location.street(),
        coordonates: {
          lat,
          lng,
        },
        streetName: fakerFR.location.streetAddress(true),
      };
    };

    const data = faker.helpers.multiple(createLocation, { count });
    await db.insert(locations).values(data);
  } catch (error) {
    console.log("ERROR SEEDING LOCATION : ", error);
    return null;
  }
};

const getLocationIdForSeedind = async () => {
  try {
    const db = await getDb();
    const locsId = (await db.select({ id: locations.id }).from(locations)).map(
      (l) => l.id
    );
    return locsId;
  } catch (error) {
    console.log("ERROR FETCHING LOCATION : ", error);
    return [];
  }
};

export const insertCategories = async () => {
  const mappedCat = Object.values(categoriesList).map(cat => cat)
  try {
    const db = getDb()
    await db.delete(categoryTable)
    const cat = await db.insert(categoryTable).values(mappedCat).returning();
    if (!cat.length) throw new Error('0 Rows created.');
    return cat;
  } catch (error) {
    console.log('ERROR SEEDING CATEGORIES ', error);
    return null;
  }
}

export const insertAttributes = async () => {

  const mappedAttrs: AttributeInsert[] = attributesList.map(attr => {
    return {
      id: uuidv4(),
      ...attr
    }
  })
  try {

    const db = getDb();
    await db.delete(attributesTable);
    const attrs = await db.insert(attributesTable).values(mappedAttrs).returning();
    if (!attrs.length) throw new Error('0 attributes creatded.');

    return attrs;
  } catch (error) {
    console.log('ERROR SEEDING ATTRIBUTES : ', error);
    return null;
  }
}

export const insertAttrCatJONC = async () => {

  const mappedAttrCatlist: AttrCatInsert[] = attributeCategoryList.map(item => {
    return {
      id: uuidv4(),
      ...item
    }
  })

  try {
    const db = getDb();
    await db.delete(attributeCategoryJONC);
    const res = await db.insert(attributeCategoryJONC).values(mappedAttrCatlist).returning();
    if (!res.length) throw new Error('O row created.');
    return res;
  } catch (error) {
    console.log('ERROR SEEDING ATTRCATJONC : ', error);
    return null;
  }
}

export const clearDb = async () => {
  try {
    const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;
    const db = getDb();
    const tables = await db.execute(query);

    tables.rows.forEach(async (row) => {
      const query = sql.raw(`TRUNCATE TABLE ${row.table_name} CASCADE;`);
      await db.execute(query); // Truncate (clear all the data) the table
    })
    return true;
  } catch (error: any) {
    console.log('ERROR CLEAR DB : ', error?.message);
    return null;
  }
}

export const fullSeedDB = async () => {
  try {
    //await clearDb();
    await insertLocation(150);
    await insertDeliveries();
    await insertRandomUsers(70);
    await insertCategories();
    await insertAttributes();
    await insertAttrCatJONC();
    await insertRandomProducts(200);
    await insertDeliveriesLink();
    await insertRandomImageUrl(400);
    return true;
  } catch (error) {
    console.log("SOMETHING WENT WRONG : ", error);
    return false;
  }
};

//insertCategories();
