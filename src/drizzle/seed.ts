import { CategoriesType } from "./../interfaces/IProducts";
import { hashPassword } from "./../lib/password";
import { faker, fakerFR } from "@faker-js/faker";
import { getDb } from "./db";
import {
  DeliveryInsert,
  DeliveryLinkInsert,
  InsertImage,
  InsertUser,
  LocationInsert,
  ProductInsert,
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

export const insertRandomUsers = async (count: number) => {
  // console.log("Seeding with random users...");
  try {
    const db = await getDb();

    await db.delete(users);
    const locsId = await getLocationIdForSeedind();

    if (!locsId.length) {
      throw new Error('You need to seed DB with location first.');
    }
    const hash = await hashPassword("dinasty");

    const createRandomUser = (): InsertUser => {
      const loc = locsId[Math.floor(Math.random() * locsId.length)]
      return {
        id: uuidv4(),
        name: faker.internet.userName().slice(0,19),
        email: faker.internet.email(),
        password: hash,
        locationId: loc,
        rating: faker.number.float({ fractionDigits: 1, min: 0, max: 5 }),
        rateNumber: faker.number.int({ min: 1, max: 40 }),
        createdAt: new Date()
      };
    };
    const usersList: InsertUser[] = faker.helpers.multiple(createRandomUser, {
      count,
    });
    console.log('USERLIST : ', usersList.map(item => item.id));

    const res = await db
      .insert(users)
      .values(usersList).returning()
    console.log("ALL GOOD", res);
    return true;
  } catch (error) {
    console.log("ERROR WHEN USER SEEDING : ", error);
    return null;
  }
};

export const insertRandomProducts = async (count: number) => {
  try {
    const db = await getDb();

    await db.delete(products);
    const locsId = await getLocationIdForSeedind();
    const usersList = await db.select().from(users);

    if (!usersList.length || !locsId.length)
      throw new Error("You need to seed DB with user and location first.");

    const createRandomProduct = (): ProductInsert => {
      const cat: CategoriesType[] = [
        "immobilier",
        "vehicule",
        "vacance",
        "job",
        "mode",
        "jardin",
        "famille",
        "electronique",
        "loisir",
        "autre",
      ];
      const loc = locsId[Math.floor(Math.random() * locsId.length)];
      return {
        id: uuidv4(),
        userId: usersList[Math.floor(Math.random() * usersList.length)].id,
        title: faker.commerce.productName(),
        price: faker.number.int({ min: 10, max: 1500 }),
        category: faker.helpers.arrayElement(cat),
        description: faker.commerce.productDescription(),
        locationId: loc
      };
    };

    const productsList = faker.helpers.multiple(createRandomProduct, {
      count,
    });

    await db.insert(products).values(productsList);
    return true;
  } catch (error) {
    // console.log("ERROR SEEDING PRODUCTS : ", error);
    return null;
  }
};

export const insertRandomImageUrl = async (count: number) => {
  try {
    // console.log('Seeding imagesUrl...');
    const db = await getDb();
    await db.delete(images);
    const p = (await db.select({ id: products.id }).from(products)).map(
      (item) => item.id
    );

    if (!p.length) throw new Error("You need to seed products first.");

    const createRandomImageURL = (): InsertImage => {
      return {
        id: uuidv4(),
        productId: faker.helpers.arrayElement(p),
        url: faker.image.urlLoremFlickr(),
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
    const db = await getDb();
    await db.delete(deliveries);
    const list = deliveryList.map((item, index): DeliveryInsert => {
      return { ...item, id: (index + 1).toString(), price: item.price.toString() };
    })
    await db.insert(deliveries).values(list);
    return true;
  } catch (error) {
    console.log('ERROR WHEN SEEDING DELIVERIES ', error);
    return null;
  }
}

export const insertDeliveriesLink = async () => {
  try {

    // console.log('SEEDING DELIVERY LINK...');
    const db = await getDb();
    await db.delete(productDeliveryLink)
    const prods = await db.select({id: products.id}).from(products);
    const deliverieslist = (await db.select({ id: deliveries.id }).from(deliveries)).map(item => item.id);
    console.log('deliveryllist id : ', deliverieslist);
    if (!deliverieslist.length) throw new Error('You need to seed deliveries first.');

    const data: DeliveryLinkInsert[] = [];

    prods.forEach(({id}) => {
      const length = Math.floor(Math.random() * deliverieslist.length + 1);
      console.log('length : ', length);
      if (Math.random() > 0.4) {
        for (let i = 0; i < length; i++){
          const link: DeliveryLinkInsert = {
            productId: id,
            deliveryId: deliverieslist[i]
          }
          data.push(link);
        } 
      }
    })
    console.log(data)
    await db.insert(productDeliveryLink).values(data);
    // console.log('DONE');
    return true
  } catch (error) {
    console.log('ERROR INSERT DELIVERIES', error);
    return false;
  }
}

export const insertLocation = async (count: number) => {
  try {
      const db = await getDb();

    const createLocation = (): LocationInsert => {
      const [lat, lng] = fakerFR.location.nearbyGPSCoordinate({ isMetric: true, radius: 300, origin:[43.598235, 1.483408]})
      return {
        id: uuidv4(),
        city: fakerFR.location.city(),
        postal: +fakerFR.location.zipCode(),
        coordonates: {
          lat,
          lng
        },
        streetName: fakerFR.location.streetAddress(true)
      }
    }

    const data = faker.helpers.multiple(createLocation, { count });
    await db.insert(locations).values(data);
  } catch (error) {
    console.log('ERROR SEEDING LOCATION : ', error);
    return null;
  }
}

const getLocationIdForSeedind = async () => {
  try {
    const db = await getDb();
    const locsId = (await db.select({ id: locations.id }).from(locations)).map(l => l.id);
    return locsId;
  } catch (error) {
    console.log('ERROR FETCHING LOCATION : ', error);
    return [];
  }
}

export const fullSeedDB = async () => {
  try {
    await insertLocation(100);
    await insertDeliveries();
    await insertRandomUsers(30);
    await insertRandomProducts(70);
    await insertDeliveriesLink();
    await insertRandomImageUrl(200);
    return true;
  } catch (error) {
    console.log('SOMETHING WENT WRONG : ', error);
    return false;
  }
}