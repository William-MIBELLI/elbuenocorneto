import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export const pool = new Pool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

// { schema } is used for relational queries
//export const db = drizzle(client, { schema });
let db: NodePgDatabase<typeof schema>;

const connectDb = async () => {
  console.log('CONNECT DB', pool.totalCount);
  if (!db) {
    console.log('DB NULL, CLIENT CONNECT');
    await pool.connect();
    db = drizzle(pool, { schema });
  }
};

export const getDb = async () => {
  console.log('GETDB');
  if (!db) {
    await connectDb();
  }
  return db;
};

//export type SelectUser = typeof user.$inferSelect;
