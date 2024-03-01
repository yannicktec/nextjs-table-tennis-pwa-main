import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "@/db/schema"
import { and, eq, gt, lt, count, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentMonthResult } from "@/db/getCurrentMonthResult";

export async function GET() {
    const response = new NextResponse()

    const connection = connect({
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
    });

    const db = drizzle(connection, { schema });



    const playerWins = await getCurrentMonthResult()

    try {
        await db.transaction(async tx => {
            const { insertId: monthResultId } = await tx.insert(schema.monthResult).values({
                createdAt: new Date(),
                enteredBy: 1,

            }).onDuplicateKeyUpdate({ set: { id: sql`id` } })
            console.log(`Inserted monthResultId: ${monthResultId}`)
            const dbInsertValues = playerWins.map(playerWin => ({
                monthResult: Number.parseInt(monthResultId),
                player: playerWin.id,
                points: playerWin.wins,
            }))

            console.log(`dbInsertValues:`, dbInsertValues)
            await tx.insert(schema.monthResultPlayers).values(dbInsertValues)

        })

        return NextResponse.json({ message: `Successfully insterted new MonthResult!` }, { status: 200 })

    } catch (error) {

        console.log(`Error: ${error}`)
        return NextResponse.json({ error: error }, { status: 500 })
    }


}