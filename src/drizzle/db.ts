import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export const client =  new Client({
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
  if (!db) {
    await client.connect();
    db = drizzle(client, { schema });
  }
}

export const getDb = async () => {
  if (!db) {
    await connectDb()
  }
  return db;
}

//export type SelectUser = typeof user.$inferSelect;