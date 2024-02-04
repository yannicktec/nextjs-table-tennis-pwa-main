"use server";


import * as schema from "@/db/schema";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { revalidatePath } from "next/cache";

export default async function addMatch({ winnerId, loserId }: { winnerId: number; loserId: number; }) {
    if (!winnerId || !loserId) throw new Error("winnerId and loserId are required");

    try {
        // Create a connection to the database
        const connection = connect({
            host: process.env.DATABASE_HOST,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
        });

        const db = drizzle(connection, { schema });

        // Insert the match and the playerMatches as a transaction to ensure consistency
        await db.transaction(async tx => {
            const { insertId } = await tx.insert(schema.matches).values({
                createdAt: new Date(),
                enteredBy: 1,
            }).execute();
            const matchId = Number.parseInt(insertId);
            await tx.insert(schema.playerMatches).values({
                type: "WON",
                match: matchId,
                player: winnerId,
            }).execute();
            await tx.insert(schema.playerMatches).values({
                type: "LOST",
                match: matchId,
                player: loserId,
            }).execute();
        })

        revalidatePath("/game")

    } catch (error) {
        console.error(error);
        throw new Error("Could not add match");
    }
}