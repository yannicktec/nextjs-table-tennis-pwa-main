"use client";

import addMatch from "../actions/addMatch";
import { useState } from "react";

import PlayerTile from "./playerTile";
import { ToastAction } from "@radix-ui/react-toast";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationModal } from "./confirmationModal";

export interface Player {
  id: number;
  name: string;
  emoji: string | null;
}

interface PlayerGridProps {
  players: Player[];
}

export default function PlayerGrid({ players }: PlayerGridProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedPlayer) {
      console.log(selectedPlayer.id, " wurde ausgewählt");
      addMatch({ winnerId: selectedPlayer.id, loserId: 1 }).then(() => {
        toast({ title: "Match hinzugefügt", duration: 5000, description: ` ${selectedPlayer.name} wurde als Sieger eintragen`, variant: "default" })
        setSelectedPlayer(null);
        setIsModalOpen(false);
      }).catch((error) => {
        toast({
          title: "Fehler!",
          description: `Wer hat denn diese Scheiße programmiert?`,
          action: <ToastAction altText="Erneut veruschen"><button onClick={handleConfirm}>Erneut versuchen</button></ToastAction>
        })
      });
    }

  };

  return (
    <>
      <div className="flex justify-center ">
        <div className="flex flex-wrap gap-10 justify-center">
          {players.map((player) => (
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

    </>
  );
}
