"use server"

import { getConnectedDBClient } from "@/db/TableTennisDrizzleClient";
import * as schema from "@/db/schema";
import { formDataToObject } from "@/lib/formDataToObject";
import { revalidatePath } from "next/cache";
import * as z from "zod"

const inputSchema = z.object({
    winnerId: z.coerce.number({ required_error: "winnerId is required" }),
});
export default async function addMatch(formData: FormData) {
    "use server"

    try {
        const { winnerId } = inputSchema.parse(formDataToObject(formData))
        // Create a connection to the database
        const db = await getConnectedDBClient()
        console.log("got DB Connection")

        // Insert the match and the playerMatches as a transaction to ensure consistency
        await db.transaction(async tx => {
            const results = await tx.insert(schema.matches).values({
                createdAt: new Date(),
                enteredBy: 1,
            }).returning({ id: schema.matches.id });
            console.log("inserted new match:", results)
            const matchId = results[0].id
            const playermatchResult = await tx.insert(schema.playerMatches).values({
                type: "WON",
                match: matchId,
                player: winnerId,
            }).execute();
            console.log("inserted new playermatch:", playermatchResult)
        })

        revalidatePath("/game")

    } catch (error) {
        console.error(error);
        throw new Error("Could not add match");
    }
}