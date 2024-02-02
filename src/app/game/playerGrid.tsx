"use client";

import { Key, useState } from "react";
import PlayerTile from "./playerTile";
import { ConfirmationModal } from "./confirmationModal";
import { updatePlayerWins } from "../../../utils/supabase";
import { ToastContainer, toast } from "react-toastify";

export interface Player {
  id: React.Key;
  name: string;
  emoji: string;
  wins: number;
}

interface PlayerGridProps {
  players: Player[];
}

export default function PlayerGrid({ players }: PlayerGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedPlayer) {
      console.log(selectedPlayer.id, " wurde ausgewählt");
    }
    updatePlayerWins(selectedPlayer!)
      .then(() => setIsModalOpen(false))
      .then(() =>
      toast.success("erfolgreich eingetragen", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
      )
      .catch((e) =>
        toast.error("Fehler:" + e, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      );
  };

  return (
    <>
      <div className="flex justify-center min-h-screen">
        <div className="flex flex-wrap gap-10 justify-center">
          {players.map((player) => (
            <PlayerTile
              key={player.id}
              name={player.name}
              emoji={player.emoji}
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
