import { ISearchParams } from "@/context/search.context";
import {
  timestamp,
  pgTable,
  primaryKey,
  integer,
  pgEnum,
  numeric,
  json,
  text,
  real,
  varchar,
  boolean,
  AnyPgColumn,
  decimal,
  customType,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const genderEnum = pgEnum("gender", ["0", "1", "2"]);
export const attributeTypeEnum = pgEnum("attribute_type_enum", [
  "text",
  "number",
  "select",
  "boolean",
]);
export const StateEnum = pgEnum("state_enum", [
  "Etat neuf",
  "Très bon état",
  "Bon état",
  "Etat satisfaisant",
]);
export const deliveriesEnum = pgEnum("type", [
  "colissimo",
  "laposte",
  "mondialrelay",
  "chronopost",
]);
export const AttributeType = pgEnum("attribute_type", [
  "text",
  "select",
  "number",
]);
export const CategoryEnum = pgEnum("category_enum", [
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
]);

export const AttributeNameEnum = pgEnum("attribute_name_enum", [
  "carBrand",
  "year",
  "milling",
  "fuel",
  "power",
  "doors",
  "livingSpace",
  "habitationType",
  "garden",
  "color",
  "clothMaterial",
  "objectMaterial",
  "model",
  "brand",
  "stockage",
  "memory",
  "age",
  "size",
  "contractType",
  "wage",
]);

export const SortEnum = pgEnum("sort_enum", [
  "createdAt_asc",
  "createdAt_desc",
  "price_asc",
  "price_desc",
]);

export type attrNameType = (typeof AttributeNameEnum.enumValues)[number];

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password").notNull(),
  locationId: text("location_id")
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  rating: real("rating"),
  rateNumber: integer("rate_number"),
  createdAt: timestamp("created_at").defaultNow(),
  phone: varchar("phone", { length: 10 }),
  phoneVerified: timestamp("phone_verified"),
  lastname: text("lastname"),
  firstname: text("firstname"),
  gender: genderEnum("gender"),
  birthday: timestamp("birthday"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  products: many(products),
  location: one(locations, {
    fields: [users.locationId],
    references: [locations.id],
  }),
  favorites: many(favoritesTable),
}));

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const products = pgTable("product", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  price: integer("price").notNull(),
  locationId: text("location_id")
    .notNull()
    .references(() => locations.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  categoryType: CategoryEnum("category_type")
    .notNull()
    .references(() => categoryTable.type),
  description: text("description").notNull(),
  state: StateEnum("state").notNull(),
  // deliveryAvailable: boolean('delivery_available').default(true)
});

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [products.locationId],
    references: [locations.id],
  }),
  images: many(images),
  pdl: many(productDeliveryLink),
  category: one(categoryTable, {
    fields: [products.categoryType],
    references: [categoryTable.type],
  }),
  attributes: many(productAttributeJONC),
  favorites: many(favoritesTable),
}));

export type ProductInsert = typeof products.$inferInsert;
export type ProductSelect = typeof products.$inferSelect;

export const images = pgTable("image", {
  id: text("id").notNull(),
  productId: text("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
});

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

export type ImageSelect = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;

export const deliveries = pgTable("deliveries", {
  id: text("id").primaryKey(),
  type: deliveriesEnum("type").notNull(),
  label: text("label").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  iconUrl: text("icon_url").notNull(),
  requirement: text("requirement"),
  maxWeight: numeric("max_weight"),
});

export const deliveriesRelations = relations(deliveries, ({ many }) => ({
  pdl: many(productDeliveryLink),
}));

export type DeliverySelect = typeof deliveries.$inferSelect;
export type DeliveryInsert = typeof deliveries.$inferInsert;

export const productDeliveryLink = pgTable("product_delivery_link", {
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  deliveryId: text("delivery_id")
    .notNull()
    .references(() => deliveries.id, { onDelete: "cascade" }),
});

export const pdlRelations = relations(productDeliveryLink, ({ one }) => ({
  delivery: one(deliveries, {
    fields: [productDeliveryLink.deliveryId],
    references: [deliveries.id],
  }),
  product: one(products, {
    fields: [productDeliveryLink.productId],
    references: [products.id],
  }),
}));

export type DeliveryLinkInsert = typeof productDeliveryLink.$inferInsert;
export type DeliveryLinkSelect = typeof productDeliveryLink.$inferSelect;

export const locations = pgTable("location", {
  id: text("id").primaryKey().notNull(),
  label: text("label"),
  streetName: text("street_name"),
  postcode: integer("postcode").notNull(),
  city: text("city").notNull(),
  coordonates: json("coordonates")
    .$type<{ lat: number; lng: number }>()
    .default({ lat: 0, lng: 0 }),
});

export type LocationInsert = typeof locations.$inferInsert;
export type LocationSelect = typeof locations.$inferSelect;

export const categoryTable = pgTable("category", {
  id: text("id").primaryKey().notNull(),
  parentId: text("parent_id").references((): AnyPgColumn => categoryTable.id, {
    onDelete: "cascade",
  }),
  label: text("label").notNull(),
  description: text("description"),
  target: text("target").notNull(),
  imageUrl: text("image_url").notNull(),
  type: CategoryEnum("category_enum").notNull().unique(),
  availableToDelivery: boolean("available_to_delivery").default(true),
  gotPrice: boolean("got_price").default(true),
  gotState: boolean("got_state").default(true),
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  attrRel: many(attributesTable),
}));

export type CategorySelect = typeof categoryTable.$inferSelect;
export type CategoryInsert = typeof categoryTable.$inferInsert;

export const attributesTable = pgTable("attribute", {
  id: text("id").primaryKey().notNull(),
  name: AttributeNameEnum("name").notNull().unique(),
  type: attributeTypeEnum("type").notNull(),
  label: text("label").notNull(),
  required: boolean("required").default(true),
  possibleValue: json("possible_value").$type<string[]>(),
});

export const attributeRelations = relations(attributesTable, ({ many }) => ({
  attrToCat: many(categoryTable),
  attrProd: many(products),
}));

export type AttributeSelect = typeof attributesTable.$inferSelect;
export type AttributeInsert = typeof attributesTable.$inferInsert;

export const attributeCategoryJONC = pgTable("attribute_category_jonc", {
  id: text("id").primaryKey().notNull(),
  categoryType: CategoryEnum("category_type")
    .notNull()
    .references(() => categoryTable.type),
  attributeName: AttributeNameEnum("attribute_name")
    .notNull()
    .references(() => attributesTable.name),
});

export const attrCatRelations = relations(attributeCategoryJONC, ({ one }) => ({
  attribute: one(attributesTable, {
    fields: [attributeCategoryJONC.attributeName],
    references: [attributesTable.id],
  }),
  category: one(categoryTable, {
    fields: [attributeCategoryJONC.categoryType],
    references: [categoryTable.type],
  }),
}));

export type AttrCatSelect = typeof attributeCategoryJONC.$inferSelect;
export type AttrCatInsert = typeof attributeCategoryJONC.$inferInsert;

export const productAttributeJONC = pgTable("product_attribute_jonc", {
  id: text("id").primaryKey().notNull(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  attributeId: text("attribute_id")
    .notNull()
    .references(() => attributesTable.id),
  value: text("value").notNull(),
});

export const prodAttrRelations = relations(productAttributeJONC, ({ one }) => ({
  product: one(products, {
    fields: [productAttributeJONC.productId],
    references: [products.id],
  }),
  attribute: one(attributesTable, {
    fields: [productAttributeJONC.attributeId],
    references: [attributesTable.id],
  }),
}));

export type ProdAttrSelect = typeof productAttributeJONC.$inferSelect;
export type ProdAttrInsert = typeof productAttributeJONC.$inferInsert;

export const favoritesTable = pgTable("favorites", {
  id: text("id").primaryKey().notNull(),
  productId: text("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
});

export const favoritesRelations = relations(favoritesTable, ({ one }) => ({
  productId: one(products, {
    fields: [favoritesTable.productId],
    references: [products.id],
  }),
  userId: one(users, {
    fields: [favoritesTable.userId],
    references: [users.id],
  }),
}));

export type FavoriteSelect = typeof favoritesTable.$inferSelect;
export type Favoriteinsert = typeof favoritesTable.$inferInsert;

type NumericConfig = {
  precision?: number;
  scale?: number;
};

export const numericCasted = customType<{
  data: number;
  driverData: string;
  config: NumericConfig;
}>({
  dataType: (config) => {
    if (config?.precision && config?.scale) {
      return `numeric(${config.precision}, ${config.scale})`;
    }
    return "numeric";
  },
  fromDriver: (value: string) => Number.parseFloat(value), // note: precision loss for very large/small digits so area to refactor if needed
  toDriver: (value: number) => value.toString(),
});

export const searchTable = pgTable("search", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  locationId: text("location_id").references(() => locations.id, {
    onDelete: "set null",
  }),
  min: integer("min"),
  max: integer("max"),
  keyword: text("keyword").notNull(),
  titleOnly: boolean("title_only").default(false),
  radius: integer("radius"),
  delivery: boolean("delivery").default(false),
  sort: SortEnum("sort"),
  categorySelectedType: CategoryEnum("category_selected_type"),
  categorySelectedLabel: text("category_selected_label"),
  donation: boolean("donation").default(false),
  page: integer("page").default(1),
  lat: numericCasted("lat", { precision: 10, scale: 6 }),
  lng: numericCasted("lng", { precision: 10, scale: 6 }),
});

export type SearchInsert = typeof searchTable.$inferInsert;
export type SearchSelect = typeof searchTable.$inferSelect;

export const conversationTable = pgTable("conversation", {
  id: text("id").primaryKey().notNull(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ConversationInsert = typeof conversationTable.$inferInsert;
export type ConversationSelect = typeof conversationTable.$inferSelect;

export const messageTable = pgTable("message", {
  id: text("id").primaryKey().notNull(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversationTable.id, { onDelete: "cascade" }),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export type MessageInsert = typeof messageTable.$inferInsert;
export type MessageSelect = typeof messageTable.$inferSelect;
