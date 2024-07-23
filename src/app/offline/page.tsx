"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { OfflineMatch, useOfflineActions } from "../hooks/useOfflineActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import addMatch from "../game/actions/addMatch";
import { toast } from "sonner";

export default function Offline() {
  const { offlineMatches, removeOfflineMatch } = useOfflineActions();

  const handleAddMatch = (match: OfflineMatch) => {
    try {
      const addMatchFormData = new FormData();
      addMatchFormData.append("winnerId1", match.player.toString());
      addMatchFormData.append("timestamp", match.timestamp.toISOString());

      addMatch(addMatchFormData);
      toast.success("Match erfolgreich nachgetragen");
      removeOfflineMatch(match);
    } catch (e) {
      console.error("Error adding offline match", e);
      toast.error("Fehler beim Nachtragen des Matches");
    }
  };

  return (
    <main className="h-screen w-screen p-4 bg-gray-100 ">
      <div className="w-full">
        <Button variant="link" asChild className="p-0 m-0">
          <Link href="/">
            <ChevronLeft />
            zurück
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">
        Offline eingespeicherte Siege
      </h1>
      <h2 className="mb-4 text-xl text-center">aka Ansgars Hall of Shame</h2>
      {offlineMatches ? (
        offlineMatches.length > 0 && (
          <div className="my-4 flex justify-center">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead>Spieler</TableHead>
                  <TableHead>Zeitpunkt</TableHead>
                  <TableHead> Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offlineMatches.map((playerMatch) => (
                  <TableRow
                    key={
                      playerMatch.timestamp.toISOString() +
                      playerMatch.displayName
                    }
                  >
                    <TableCell>{playerMatch.displayName}</TableCell>
                    <TableCell>
                      {new Date(playerMatch.timestamp).toLocaleString("de-DE")}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button className="m-2">Nachtragen</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogContent>
                            <AlertDialogTitle>
                              Möchtest du {playerMatch.displayName} nachtragen?
                            </AlertDialogTitle>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleAddMatch(playerMatch)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button className="m-2" variant="destructive">
                            Löschen
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogContent>
                            <AlertDialogTitle>
                              Möchtest diesen Sieg löschen?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Der Sieg von {playerMatch.displayName} am{" "}
                              {playerMatch.timestamp.toLocaleString("de-DE")}{" "}
                              wird unwiderruflich gelöscht.
                            </AlertDialogDescription>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={()=> removeOfflineMatch(playerMatch)}
                              >
                                Löschen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <p className="text-center"> keine offline Matches gefunden!</p>
      )}
    </main>
  );
}
