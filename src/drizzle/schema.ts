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
  real
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"
import { CategoriesType } from '@/interfaces/IProducts';
 
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password").notNull(),
  location: json('location').$type<ILocation>(),
  rating: real('rating'),
  rateNumber: integer('rate_number'),
})

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
  userId: text("userId")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" }),
  title: text('title').notNull(),
  price: integer('price').notNull(),
  coordonates: json('coordonates').$type<{ lat: number, lng: number }>().default({ lat: 0, lng: 0 }),
  location: json('location').$type<ILocation>().default({ city: 'Carcassonne', postal: 11000 }),
  createdAt: timestamp('created_at').defaultNow(),
  category: text('category').$type<CategoriesType>().notNull(),
  description: text('description').notNull()
})

export type ProductInsert = typeof products.$inferInsert;
export type ProductSelect = typeof products.$inferSelect;

export const images = pgTable('image', {
  id: text('id').notNull(),
  productId: text('product_id').references(() => products.id),
  url: text('url').notNull()
})

export type ImageSelect = typeof images.$inferSelect;

export type InsertImage = typeof images.$inferInsert;

export const deliveriesEnum = pgEnum('type', ['colissimo', 'laposte', 'mondialrelay', 'chronopost']);

export const deliveries = pgTable('deliveries', {
  id: text('id').primaryKey(),
  type: deliveriesEnum('type'),
  label: text('label').notNull(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  iconUrl: text('icon_url').notNull(),
})

export const productDeliveryLink = pgTable('product_delivery_link', {
  productId: text('product_id').notNull().references(() => products.id),
  deliveryId: text('delivery_id').notNull().references(() => deliveries.id)
})

export const locations = pgTable('location', {
  id: text("id").primaryKey(),
  label: text('label'),
  streetName: text('street_name'),
  postal: integer('postcode').notNull(),
  city: text('city').notNull(),
})