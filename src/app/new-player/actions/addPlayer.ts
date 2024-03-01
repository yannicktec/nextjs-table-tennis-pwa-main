"use server"
import "dotenv/config";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "@/db/schema";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { redirect } from "next/navigation";

const inputSchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    emoji: z.string().emoji({ message: "Emoji is required" }),
});

export async function addPlayer(formData: FormData) {
    const { name, emoji } = inputSchema.parse({ name: formData.get("name"), emoji: formData.get("emoji") });

    // create the connection
    const connection = connect({
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
    });

    const db = drizzle(connection, { schema });
    await db.insert(schema.players).values({
        name: name,
        emoji: emoji,
        createdAt: new Date(),
        createdBy: 1,
    }).execute();

    redirect("/game")
}