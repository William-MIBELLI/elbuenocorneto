import {  Pool } from "pg";
import * as schema from "./schema";
import { sql } from '@vercel/postgres'
import { drizzle } from "drizzle-orm/vercel-postgres/driver";

export const pool = new Pool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

export const db = drizzle(sql,{ schema });

export const getDb =  () => {
  return db;
};
