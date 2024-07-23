"use server";
import * as Sentry from "@sentry/nextjs";
import * as schema from "@/db/schema";
import * as z from "zod";
import { getDBClient } from "@/db/TableTennisDrizzleClient";
import { formDataToObject } from "@/lib/formDataToObject";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const inputSchema = z.object({
  winnerIds: z.array(
    z.coerce.number({ required_error: "winnerId is required" })
  ),
  looserIds: z
    .array(z.coerce.number({ required_error: "winnerId is required" }))
    .optional(),
  timestamp: z.date().optional(),
});

export default async function addMatch(formData: FormData) {
  return await Sentry.withServerActionInstrumentation(
    "new-player/actions/addPlayer", // The name you want to associate this Server Action with in Sentry
    {
      formData, // Optionally pass in the form data
      headers: headers(), // Optionally pass in headers
      recordResponse: true, // Optionally record the server action response
    },
    async () => {
      const { connect, disconnect } = await getDBClient();

      const db = await connect();
      try {
        const { winnerIds, looserIds, timestamp } = inputSchema.parse(
          formDataToObject(formData)
        );

        // Insert the match and the playerMatches as a transaction to ensure consistency
        await db.transaction(async (tx) => {
          const results = await tx
            .insert(schema.matches)
            .values({
              createdAt: timestamp || new Date(),
              enteredBy: 1,
            })
            .returning({ id: schema.matches.id });
          console.log("inserted new match:", results);

          const matchId = results[0].id;

          winnerIds.forEach(async (winnerId) => {
            const playermatchResult = await tx
              .insert(schema.playerMatches)
              .values({
                type: "WON",
                match: matchId,
                player: winnerId,
              })
              .execute();
            console.log("inserted new playermatch:", playermatchResult);
          });
          
          if (looserIds) {
            looserIds.forEach(async (looserId) => {
              const playermatchResult = await tx
                .insert(schema.playerMatches)
                .values({
                  type: "LOST",
                  match: matchId,
                  player: looserId,
                })
                .execute();
              console.log("inserted new playermatch:", playermatchResult);
            });
          }
        });

        revalidatePath("/game");
      } catch (error) {
        console.error(error);
        throw new Error("Could not add match");
      } finally {
        await disconnect();
      }
    }
  );
}
