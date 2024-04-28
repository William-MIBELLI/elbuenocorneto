import { CategoriesType } from "./../interfaces/IProducts";
import { hashPassword } from "./../lib/password";
import { faker } from "@faker-js/faker";
import { getDb } from "./db";
import { InsertImage, InsertUser, ProductInsert, images, products, users } from "./schema";
import { v4 as uuidv4 } from "uuid";

export const insertRandomUsers = async (count: number) => {
  console.log("Seeding with random users...");
  try {
    const db = await getDb();

    await db.delete(users);
    const hash = await hashPassword("dinasty");

    const createRandomUser = (): InsertUser => {
      return {
        id: uuidv4(),
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: hash,
        location: {
          city: faker.location.city(),
          postal: +faker.string.numeric(5),
        },
        rating: faker.number.float({ fractionDigits: 1, min: 0, max: 5 }),
        rateNumber: faker.number.int({ min: 1, max: 40 }),
      };
    };

    const usersList: InsertUser[] = faker.helpers.multiple(createRandomUser, {
      count,
    });

    const res = await db
      .insert(users)
      .values(usersList as InsertUser[])
      .returning();
    console.log("ALL GOOD", res);
    return true;
  } catch (error) {
    console.log("ERROR WHEN SEEDING : ", error);
    return null;
  }
};

export const insertRandomProducts = async (count: number) => {
  try {
    const db = await getDb();

    await db.delete(products);
    const usersList = await db.select().from(users);

    if (!usersList.length)
      throw new Error("You need to seed DB with user first.");

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

      return {
        id: uuidv4(),
        userId: usersList[Math.floor(Math.random() * usersList.length)].id,
        title: faker.commerce.productName(),
        price: faker.number.int({ min: 10, max: 1500 }),
        coordonates: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        location: {
          city: faker.location.city(),
          postal: +faker.string.numeric(5),
        },
        category: faker.helpers.arrayElement(cat),
        description: faker.commerce.productDescription(),
      };
    };

    const productsList = faker.helpers.multiple(createRandomProduct, {
      count,
    });

    await db.insert(products).values(productsList);
  } catch (error) {
    console.log("ERROR SEEDING PRODUCTS : ", error);
    return null;
  }
};

export const insertRandomImageUrl = async (count: number) => {
  try {

    console.log('Seeding imagesUrl...');
    const db = await getDb();
    await db.delete(images);
    const p = (await db.select({ id: products.id }).from(products)).map(item => item.id);

    if (!p.length) throw new Error('You need to seed products first.');

    const createRandomImageURL = ():InsertImage => {
      return {
        id: uuidv4(),
        productId: faker.helpers.arrayElement(p),
        url: faker.image.urlLoremFlickr(),
      }
    }

    const data = faker.helpers.multiple(createRandomImageURL, { count });

    await db.insert(images).values(data);
    return true

  } catch (error) {
    console.log('ERROR SEEDING IMAGE : ', error);
    return null;
  }
}
