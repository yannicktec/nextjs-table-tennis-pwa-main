"use server"
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";
import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();
export async function getConnectedDBClient() {

    const client = new Client({
        port: 5432,
        database: process.env.DATABASE,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER,
        ssl: {
            rejectUnauthorized: false
        },
    });

    await client.connect();
    const db = drizzle(client, { schema });


    return db;
}