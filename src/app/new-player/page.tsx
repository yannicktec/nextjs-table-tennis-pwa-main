"use server"
import "dotenv/config";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import * as schema from "@/db/schema";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react"

import NewPlayerForm from "./components/newPlayerForm";
import { redirect } from "next/navigation";

export default async function Page() {
  "use server"
  
  return (
    <div className=" h-screen w-screen p-4 bg-gray-100 flex flex-col items-center">
      <div className="flex justify-between w-full flex-wrap">
        <Button variant="link" asChild className="p-0 m-0">
          <Link href="/" ><ChevronLeft />zurück</Link>
        </Button>
        <h1 className="text-3xl font-bold ">Neuen Spieler hinzufügen</h1>
        <div />
      </div>
      <NewPlayerForm />

    </div>
  );
}
