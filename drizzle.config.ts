import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    port: 5432,
    database: process.env.DATABASE!,
    host: process.env.DB_HOST!,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER
  }
} satisfies Config;
