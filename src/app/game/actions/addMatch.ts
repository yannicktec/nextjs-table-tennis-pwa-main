"use server"

import { getConnectedDBClient } from "@/db/TableTennisDrizzleClient";
import * as schema from "@/db/schema";
import { formDataToObject } from "@/lib/formDataToObject";
import { revalidatePath } from "next/cache";
import * as z from "zod"

const inputSchema = z.object({
    winnerId1: z.coerce.number({ required_error: "winnerId is required" }),
    winnerId2: z.coerce.number({ required_error: "winnerId is required" }).optional(),
});
export default async function addMatch(formData: FormData) {
    "use server"

    try {
        const { winnerId1, winnerId2 } = inputSchema.parse(formDataToObject(formData))

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
                player: winnerId1,
            }).execute();
            console.log("inserted new playermatch:", playermatchResult)
            if(winnerId2){
                const playermatchResult2 = await tx.insert(schema.playerMatches).values({
                    type: "WON",
                    match: matchId,
                    player: winnerId2,
                }).execute();
                console.log("inserted new playermatch:", playermatchResult2)
            }
            
        })

        revalidatePath("/game")

    } catch (error) {
        console.error(error);
        throw new Error("Could not add match");
    }
}