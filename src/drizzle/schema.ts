import { ILocation } from '@/interfaces/ILocation';

import {
  timestamp,
  pgTable,
  primaryKey,
  integer,
  pgEnum,
  numeric,
  json,
  text,
  uuid,
  real,
  decimal,
  varchar
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"
import { CategoriesType } from '@/interfaces/IProducts';
import { relations } from 'drizzle-orm';
 
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 20 }).notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password").notNull(),
  locationId: text('location_id').notNull().references(() => locations.id, { onDelete: "cascade"}),
  rating: real('rating'),
  rateNumber: integer('rate_number'),
  createdAt: timestamp('created_at').defaultNow(),
  phone: varchar('phone', { length: 10 }),
  phoneVerified: timestamp('phone_verified')
})

export const usersRelations = relations(users, ({ many, one }) => ({
  products: many(products),
  location: one(locations, {
    fields: [users.locationId],
    references: [locations.id]
  })
}))

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
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
)

export const products = pgTable("product", {
  id: text('id').primaryKey(),
  userId: text("user_id")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" }),
  title: varchar('title').notNull(),
  price: integer('price').notNull(),
  locationId: text('location_id').notNull().references(() => locations.id, { onDelete: "cascade"}),
  createdAt: timestamp('created_at').defaultNow(),
  category: text('category').$type<CategoriesType>().notNull(),
  description: text('description').notNull()
})

export const productsRelations = relations(products, ({ one, many}) => ({
  seller: one(users, {
    fields: [products.userId],
    references: [users.id]
  }),
  location: one(locations, {
    fields: [products.locationId],
    references: [locations.id]
  }),
  images: many(images),
  pdl: many(productDeliveryLink)
}))

export type ProductInsert = typeof products.$inferInsert;
export type ProductSelect = typeof products.$inferSelect;

export const images = pgTable('image', {
  id: text('id').notNull(),
  productId: text('product_id').references(() => products.id, { onDelete: "cascade"}),
  url: text('url').notNull()
})

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id]
  })
}))

export type ImageSelect = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;

export const deliveriesEnum = pgEnum('type', ['colissimo', 'laposte', 'mondialrelay', 'chronopost']);

export const deliveries = pgTable('deliveries', {
  id: text('id').primaryKey(),
  type: deliveriesEnum('type').notNull(),
  label: text('label').notNull(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  iconUrl: text('icon_url').notNull(),
})

export const deliveriesRelations = relations(deliveries, ({ many }) => ({
  pdl: many(productDeliveryLink)
}))


export type DeliverySelect = typeof deliveries.$inferSelect;
export type DeliveryInsert = typeof deliveries.$inferInsert;

export const productDeliveryLink = pgTable('product_delivery_link', {
  productId: text('product_id').notNull().references(() => products.id),
  deliveryId: text('delivery_id').notNull().references(() => deliveries.id)
})

export const pdlRelations = relations(productDeliveryLink, ({ one }) => ({
  delivery: one(deliveries, {
    fields: [productDeliveryLink.deliveryId],
    references: [deliveries.id]
  }),
  product: one(products, {
    fields: [productDeliveryLink.productId],
    references: [products.id]
})
}))

export type DeliveryLinkInsert = typeof productDeliveryLink.$inferInsert;
export type DeliveryLinkSelect = typeof productDeliveryLink.$inferSelect;

export const locations = pgTable('location', {
  id: text("id").primaryKey().notNull(),
  label: text('label'),
  streetName: text('street_name'),
  postal: integer('postcode').notNull(),
  city: text('city').notNull(),
  coordonates: json('coordonates').$type<{ lat: number, lng: number }>().default({ lat: 0, lng: 0 }),
})

export type LocationInsert = typeof locations.$inferInsert;
export type LocationSelect = typeof locations.$inferSelect;