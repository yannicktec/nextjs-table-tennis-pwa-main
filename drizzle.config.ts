import type { Config } from "drizzle-kit";
import { Config as SST_Config } from "sst/node/config";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: `postgres://${SST_Config.DB_USER}:${encodeURIComponent(
      SST_Config.DB_PASSWORD!
    )}@${SST_Config.DB_HOST}:5432/${SST_Config.DATABASE}?sslmode=no-verify`,
  },
} satisfies Config;
