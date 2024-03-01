import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "@/db/schema"

const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
});


console.log(`DB Connection: ${process.env.DATABASE_HOST}, ${process.env.DATABASE_USERNAME}, ${process.env.DATABASE_PASSWORD}`)

const db = drizzle(connection, { schema });

const winnerData = [
    { id: 36, name: 'Yannick', wins: 29 },
    { id: 33, name: 'Sören', wins: 49 },
    { id: 23, name: 'Tomothy', wins: 11 },
    { id: 35, name: 'Paul', wins: 20 },
    { id: 21, name: 'Marvin', wins: 7 },
    { id: 25, name: 'Aaron', wins: 13 },
    { id: 26, name: 'Tristan', wins: 6 },
    { id: 29, name: 'Jakob', wins: 5 },
    { id: 15, name: 'Gimbledore', wins: 7 },
    { id: 9, name: 'Ansgar', wins: 9 },
    { id: 34, name: 'Felix', wins: 7 },
    { id: 11, name: 'Marco', wins: 3 },
    { id: 22, name: 'Basti', wins: 4 },
    { id: 5, name: 'Michi', wins: 9 },
    { id: 14, name: 'Leo', wins: 2 },
    { id: 16, name: 'Nico', wins: 4 }]

const insertWin = async (date: Date, playerId: number) => {
    console.log(`Inserting win for player ${playerId} at ${date}`)
    await db.transaction(async tx => {
        const { insertId } = await tx.insert(schema.matches).values({
            createdAt: date,
            enteredBy: 1,
        }).execute();
        const matchId = Number.parseInt(insertId);
        await tx.insert(schema.playerMatches).values({
            type: "WON",
            match: matchId,
            player: playerId,
        }).execute();
    })
}
/*
// insert wins for februar with random date in januar
winnerData.forEach(async (win) => {
    const date = new Date(2024, 1, 10);
    for (let i = 0; i < win.wins; i++) {
        await insertWin(date, win.id);
    }
})*/