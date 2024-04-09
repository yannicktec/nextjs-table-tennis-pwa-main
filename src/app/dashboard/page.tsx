
import { and, count, eq, gt, lt } from "drizzle-orm";
import * as schema from "@/db/schema";


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import { getConnectedDBClient } from "@/db/TableTennisDrizzleClient";

export default async function Dashboard() {

    const db = await getConnectedDBClient()

    const date = new Date()

    const firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // get all players and their won matches
    const matchesResult = await db
        .select({
            id: schema.players.id,
            name: schema.players.name,
            emoji: schema.players.emoji,
            wonMatches: count(schema.playerMatches.id)
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

    const monthFormatter = new Intl.DateTimeFormat('de', { month: 'long' });
    const monthText = monthFormatter.format(date);

    return (
        <div className="h-screen w-screen p-4 bg-gray-100 flex flex-col items-center">
            <div className="w-full">
                <Button variant="link" asChild className="p-0 m-0">
                    <Link href="/" ><ChevronLeft />zurück</Link>
                </Button>
            </div>
            <div>
                <h1 className="text-3xl font-bold">Rangliste für {monthText}</h1>
                <Table className="max-w-xl mt-3">

                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">Rang</TableHead>
                            <TableHead className="w-40 text-center">Name</TableHead>
                            <TableHead className="w-10">Punkte</TableHead>

                        </TableRow>

                    </TableHeader>
                    <TableBody>
                        <Suspense fallback={
                            <TableRow>
                                <TableCell>Loading...</TableCell>
                            </TableRow>

                        }>

                            {matchesResult.map((result, index) => (
                                <TableRow key={result.id}>
                                    <TableCell>{index + 1}.</TableCell>
                                    <TableCell className="text-center">{result.emoji} {result.name}</TableCell>
                                    <TableCell>{result.wonMatches}</TableCell>

                                </TableRow>
                            ))}
                        </Suspense>
                    </TableBody>
                </Table>
            </div>
        </div>
    )

}