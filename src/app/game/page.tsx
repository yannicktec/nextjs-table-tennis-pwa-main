"use server"
import PlayerGrid from "./components/playerGrid";
import Link from "next/link";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import * as schema from "@/db/schema";
import { connect } from "@planetscale/database";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";


export default async function Game() {


  // create the connection
  const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  });

  const db = drizzle(connection, { schema });

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
