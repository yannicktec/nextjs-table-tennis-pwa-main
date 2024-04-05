"use server";


import { getConnectedDBClient } from "@/db/TableTennisDrizzleClient";
import * as schema from "@/db/schema";
import { revalidatePath } from "next/cache";

export default async function addMatch({ winnerId, loserId }: { winnerId: number; loserId: number; }) {
    if (!winnerId || !loserId) throw new Error("winnerId and loserId are required");

    try {
        // Create a connection to the database
        const db = await getConnectedDBClient()
        const date = new Date();
        // Insert the match and the playerMatches as a transaction to ensure consistency
        await db.transaction(async tx => {
            const results = await tx.insert(schema.matches).values({
                createdAt: new Date(),
                enteredBy: 1,
            }).returning({ id: schema.matches.id });

            const matchId = results[0].id
            await tx.insert(schema.playerMatches).values({
                type: "WON",
                match: matchId,
                player: winnerId,
            }).execute();
        })

        revalidatePath("/game")

    } catch (error) {
        console.error(error);
        throw new Error("Could not add match");
    }
}