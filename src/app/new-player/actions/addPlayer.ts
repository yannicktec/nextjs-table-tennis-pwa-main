"use server";

import "dotenv/config";
import * as Sentry from "@sentry/nextjs";

import * as schema from "@/db/schema";
import * as z from "zod";
import { redirect } from "next/navigation";
import { getConnectedDBClient } from "@/db/TableTennisDrizzleClient";
import { formDataToObject } from "@/lib/formDataToObject";
import { headers } from "next/headers";

export default async function withSentryAddPlayer(formData: FormData) {
  return await Sentry.withServerActionInstrumentation(
    "new-player/actions/addPlayer", // The name you want to associate this Server Action with in Sentry
    {
      formData, // Optionally pass in the form data
      headers: headers(), // Optionally pass in headers
      recordResponse: true, // Optionally record the server action response
    },
    async () => addPlayer(formData)
  );
}

const inputSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  emoji: z.string().emoji({ message: "Emoji is required" }),
});

async function addPlayer(formData: FormData) {
  const { name, emoji } = inputSchema.parse(formDataToObject(formData));

  const db = await getConnectedDBClient();

  const players = await db.query.players.findMany();

  if (
    players.some((player) => player.name === name && player.emoji === emoji)
  ) {
    console.log("hier geht er net rein");
  }

  await db
    .insert(schema.players)
    .values({
      name: name,
      emoji: emoji,
      createdAt: new Date(),
      createdBy: 1,
    })
    .execute();

  redirect("/game");
}
