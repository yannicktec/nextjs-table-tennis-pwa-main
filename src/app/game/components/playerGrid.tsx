"use client";

import addMatch from "../actions/addMatch";
import { useState } from "react";

import PlayerTile from "./playerTile";
import { ToastAction } from "@radix-ui/react-toast";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationModal } from "./confirmationModal";
import { Input } from "@/components/ui/input";

export interface Player {
  id: number;
  name: string;
  emoji: string | null;
  priority: number;
}

interface PlayerGridProps {
  players: Player[];
}

export default function PlayerGrid({ players }: Readonly<PlayerGridProps>) {
  "use client"
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [filter, setFilter] = useState("")

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };



  const handleConfirm = () => {
    if (selectedPlayer) {
      const formData = new FormData()
      formData.append("winnerId", selectedPlayer.id.toString())
      console.log("sending Formdata:", formData.keys().next().value, formData.entries().next().value)

      addMatch(formData).then(() => {
        toast({ title: "Match hinzugefügt", duration: 5000, description: ` ${selectedPlayer.name} wurde als Sieger eintragen`, variant: "default" })
        setSelectedPlayer(null);
        setIsModalOpen(false);
      }).catch((error) => {
        toast({
          title: "Fehler!",
          description: `${error}`,
          action: <ToastAction altText="Erneut veruschen"><button onClick={handleConfirm}>Erneut versuchen</button></ToastAction>
        })

      });
    }

  };

  return (
    <div className="flex justify-center flex-col gap-3 p-3 ">
      <Input type='text' name='filter' placeholder="Spieler suchen..."  required value={filter} onChange={(e) => setFilter(e.target.value)} />

      <div className="flex flex-wrap gap-10 justify-center">
        {players.
          filter(player => player.name.includes(filter))
          .toSorted((a, b) => a.priority - b.priority)
          .map((player) => (
            <PlayerTile
              key={player.id}
              name={player.name}
              emoji={player.emoji || "👾"}
              onClick={() => handlePlayerClick(player)}
            />
          ))}
      </div>
      {selectedPlayer && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          playerName={selectedPlayer.name}
        />
      )}
    </div>
  );
}
