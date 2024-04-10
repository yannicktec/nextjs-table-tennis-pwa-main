export const dynamic = 'force-dynamic';

import PlayerGrid from "./components/playerGrid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import { getConnectedDBClient } from "@/db/TableTennisDrizzleClient";

export default async function Game() {

  const db = await getConnectedDBClient()
  const players = await db.query.players.findMany()

  return (
    <main className="h-screen w-screen p-4 bg-gray-100 ">
      <div className="w-full">
        <Button variant="link" asChild className="p-0 m-0">
          <Link href="/" ><ChevronLeft />zurück</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Spiel</h1>
      <PlayerGrid players={players} />
    </main>
  );
}
