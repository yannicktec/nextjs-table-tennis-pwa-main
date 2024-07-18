import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: `postgres://${process.env.DB_USER}:${encodeURIComponent(
      process.env.DB_PASSWORD
    )}@${process.env.DB_HOST}:5432/${process.env.DATABASE}?sslmode=no-verify`,
  },
});
