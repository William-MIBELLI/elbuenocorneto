import 'dotenv/config'; // make sure to install dotenv package
// import type { Config } from 'drizzle-kit';

// export default {
//   driver: 'pg',
//   out: './src/drizzle',
//   schema: './src/drizzle/schema.ts',
//   dbCredentials: {
//     host: process.env.DB_HOST!,
//     port: Number(process.env.DB_PORT!),
//     user: process.env.DB_USERNAME!,
//     password: process.env.DB_PASSWORD!,
//     database: process.env.DB_NAME!,
//   },
//   // Print all statements
//   verbose: true,
//   // Always ask for confirmation
//   strict: true,
  
// } satisfies Config;
import { defineConfig } from 'drizzle-kit';
 
export default defineConfig({
  schema: './src/drizzle/schema.ts',
  dialect: 'postgresql',
  out: './src/drizzle',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  migrations: {
    schema: 'public'
  },
  extensionsFilters: ['postgis']

});