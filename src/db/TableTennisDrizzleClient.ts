import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";
import { Client } from "pg";
import * as dotenv from "dotenv";
dotenv.config();
console.log("DOTENV HERE", process.env )
export async function getConnectedDBClient() {
    /**
     *  database: "postgres",
    host: "database-1.cluster-cv84auq62wfc.eu-central-1.rds.amazonaws.com",
    password: "~EP3>q}ooC6#*l2(qt9aT)*1Z:wG",
    user:"postgres"
     host: process.env.DATABASE_HOST,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
     */
    const client = new Client({
        port: 5432,
        database: process.env.DATABASE,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER
    });

    console.log(`DB Connection: ${{
        database: process.env.DATABASE,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER
    }}`)

    await client.connect();
    const db = drizzle(client, { schema });


    return db;
}