"use server";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";
import { Client } from "pg";
import env from "@/env";

/**
 *
 * @deprecated use getDBClient instead
 */
export async function getConnectedDBClient() {
  try {
    const client = new Client({
      port: 5432,
      database: env.DATABASE,
      host: env.DB_HOST,
      password: env.DB_PASSWORD,
      user: env.DB_USER,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();
    const db = drizzle(client, { schema });

    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Failed to connect to the database");
  }
}

export async function getDBClient() {
  try {
    const client = new Client({
      port: 5432,
      database: env.DATABASE,
      host: env.DB_HOST,
      password: env.DB_PASSWORD,
      user: env.DB_USER,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    const connect = async () => {
      await client.connect();
      const db = drizzle(client, { schema });
      return db;
    };
    
    const disconnect = async () => {
      return client.end();
    };

    return {
      connect,
      disconnect,
    };
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Failed to connect to the database");
  }
}
