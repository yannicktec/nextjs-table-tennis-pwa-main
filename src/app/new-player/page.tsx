"use client";

import { useFormStatus } from "react-dom";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react"

import { addPlayer } from "./actions/addPlayer";
import { Label } from "@radix-ui/react-label";

export default function Page() {
  const addPlayerActionWithDefaultUser = addPlayer.bind(null, 1)
  const { pending } = useFormStatus()


  return (
    <div className=" h-screen w-screen p-4 bg-gray-100 flex flex-col items-center">
      <div className="flex justify-between w-full flex-wrap">
        <Button variant="link" asChild className="p-0 m-0">
          <Link href="/" ><ChevronLeft />zurück</Link>
        </Button>
        <h1 className="text-3xl font-bold ">Neuen Spieler hinzufügen</h1>
        <div />
      </div>
      <form action={addPlayerActionWithDefaultUser} className="flex flex-col justify-between mt-16 w-full h-full max-w-xl max-h-64  space-y-2">
        <div className="flex flex-wrap space-x-4">
          <div className="flex-1 ">
            <Label htmlFor='name'>Name</Label>
            <Input type='text' name='name' required />
          </div>
          <div className="w-24 ">
            <Label htmlFor='emoji'>Emoji</Label>
            <Input type="text" name='emoji' required />

          </div>
        </div>

        {pending ?
          <Button disabled></Button> :
          <Button type='submit'>
            Submit
          </Button>
        }
      </form>

    </div>
  );
}
