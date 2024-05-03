export const dynamic = "force-dynamic";

import * as schema from "@/db/schema";
import { NextResponse } from "next/server";
import { getMonthResult } from "@/db/queries/getMonthResult";
import { getConnectedDBClient } from "@/db/TableTennisDrizzleClient";

export async function GET() {
  const db = await getConnectedDBClient();

  const date = new Date(2024,3,30);
  const playerWins = await getMonthResult(date);
  console.log("trying to save following MonthResult:", playerWins);
  try {
    await db.transaction(async (tx) => {
      const res = await tx
        .insert(schema.monthResult)
        .values({
          createdAt: new Date(date),
          enteredBy: 1,
        })
        .returning({ id: schema.monthResult.id });
      const monthResultId = res[0].id;
      console.log(`Inserted monthResultId: ${monthResultId}`);
      const dbInsertValues = playerWins.map((playerWin) => ({
        monthResult: monthResultId,
        player: playerWin.id,
        points: playerWin.wins,
      }));

      console.log(`dbInsertValues:`, dbInsertValues);
      await tx.insert(schema.monthResultPlayers).values(dbInsertValues);
    });

    return NextResponse.json(
      { message: `Successfully insterted new MonthResult for date ${date.toLocaleDateString('de-DE')}! ` },
      { status: 200 }
    );
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
