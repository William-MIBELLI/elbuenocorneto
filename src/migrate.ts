import { loadEnvConfig } from "@next/env";
import 'dotenv/config'; // make sure to install dotenv package

import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { sql } from "@vercel/postgres";

const dev = process.env.NODE_ENV !== "production";
//loadEnvConfig("./", dev);

const db = drizzle(sql);
await migrate(db, { migrationsFolder: "src/drizzle" });
await sql.end();

//0035_cooing_black_tarantula.sql

// {
//   "idx": 0,
//   "version": "5",
//   "when": 1713368873183,
//   "tag": "0000_famous_iron_fist",
//   "breakpoints": true
// },
// {
//   "idx": 1,
//   "version": "5",
//   "when": 1713523242155,
//   "tag": "0001_aberrant_kingpin",
//   "breakpoints": true
// },
// {
//   "idx": 2,
//   "version": "5",
//   "when": 1713523436667,
//   "tag": "0002_mushy_tattoo",
//   "breakpoints": true
// },
// {
//   "idx": 3,
//   "version": "5",
//   "when": 1713524701838,
//   "tag": "0003_breezy_pestilence",
//   "breakpoints": true
// },
// {
//   "idx": 4,
//   "version": "5",
//   "when": 1713525294956,
//   "tag": "0004_complex_lightspeed",
//   "breakpoints": true
// },