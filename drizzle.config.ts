import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: `postgres://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD!)}@${process.env.DB_HOST}:5432/${process.env.DATABASE}?sslmode=no-verify`,
  },
} satisfies Config;
