"use server"
import "dotenv/config";

import * as schema from "@/db/schema";
import * as z from "zod";
import { redirect } from "next/navigation";
import { getConnectedDBClient } from "@/db/TableTennisDrizzleClient";

const inputSchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    emoji: z.string().emoji({ message: "Emoji is required" }),
});

export async function addPlayer(formData: FormData) {
    const { name, emoji } = inputSchema.parse({ name: formData.get("name"), emoji: formData.get("emoji") });
    
    const db = await getConnectedDBClient()
    
    await db.insert(schema.players).values({
        name: name,
        emoji: emoji,
        createdAt: new Date(),
        createdBy: 1,
    }).execute();

    redirect("/game")
}