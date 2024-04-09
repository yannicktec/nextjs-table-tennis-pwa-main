export const dynamic = 'force-dynamic';

import * as schema from "@/db/schema"
import { and, count, desc, eq, gt, lt } from "drizzle-orm";
import { getConnectedDBClient } from "./TableTennisDrizzleClient";


export const getCurrentMonthResult = async () => {
    // create the db connection
    const db = await getConnectedDBClient()
    const date = new Date()

    const firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);


    const lastMonthResultOrdered = await db
        .select({
            playerId: schema.monthResultPlayers.player,
            points: schema.monthResultPlayers.points,
            createdAt: schema.monthResult.createdAt,
            resultId: schema.monthResult.id
        })
        .from(schema.monthResult)
        .leftJoin(schema.monthResultPlayers, eq(schema.monthResult.id, schema.monthResultPlayers.monthResult))
        .orderBy(desc(schema.monthResultPlayers.points))



   // console.log(`Last Month results`, lastMonthResultOrdered)

    const pointsMultiplicationRules = [
        - 0.5,
        - 0.4,
        - 0.3,
        - 0.2,
        - 0.1,
        0,
        0,
        0,
        0,
        0,
    ] as const
    const offsetPoints = lastMonthResultOrdered.map(({ playerId, points }, index) => {

        const multiplier = pointsMultiplicationRules[index] || 1
        const offset = points ? Math.round(points * multiplier) : 0
        return { playerId, offset }
    })

    console.log(`offsetPoints`, offsetPoints)
    const thisMonthPlayerWins = await db
        .select({
            id: schema.players.id,
            name: schema.players.name,
            emoji: schema.players.emoji,
            wins: count(schema.playerMatches.id)
        })
        .from(schema.players)
        .leftJoin(schema.playerMatches, eq(schema.players.id, schema.playerMatches.player))
        .leftJoin(schema.matches, eq(schema.playerMatches.match, schema.matches.id))
        .where(
            and(
                eq(schema.playerMatches.type, "WON"),
                gt(schema.matches.createdAt, firstDayOfThisMonth),
                lt(schema.matches.createdAt, lastDayOfThisMonth)
            )
        )
        .groupBy(schema.players.id)
        .orderBy(desc(count(schema.playerMatches.id)))

   console.log("matchesInOrder", thisMonthPlayerWins)

    const thisMonthResult = thisMonthPlayerWins.map(player => {
        const offset = offsetPoints.find(({ playerId }) => playerId === player.id)?.offset || 0
        return {
            ...player,
            wins: player.wins + offset
        }
    }).sort((a,b)=>b.wins-a.wins)
    
    return thisMonthResult
}