"use client";

import addMatch from "../actions/addMatch";
import { useEffect, useState } from "react";

import PlayerTile from "./playerTile";
import { ToastAction } from "@radix-ui/react-toast";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationModal } from "./confirmationModal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface Player {
  id: number;
  name: string;
  emoji: string | null;
  priority: number;
}

interface PlayerGridProps {
  players?: Player[];
}

export default function PlayerGrid(props: Readonly<PlayerGridProps>) {
  "use client";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [filter, setFilter] = useState("");

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (!props.players) {
      toast.error("Lol DB mal wieder kaputt, nehme offline Backup", {
        dismissible: true,
      });
    }
  }, [props.players]);
  
  if (props.players) writeOfflinePlayers(props.players);
  const players = props.players || getOfflinePlayers();

  if (!players) {
    return <p>Keine Spieler gefunden, sowohl online, als auch offline</p>;
  }

  type OfflinePlayerMatch = {
    player: number;
    displayName: string;
    timestamp: string;
  };
  const writePlayerMatchToLocalStorage = (player: Player) => {
    const playerMatch = {
      player: player.id,
      displayName: player.name + player.emoji,

      timestamp: new Date().toISOString(),
    };
    const playerMatches: OfflinePlayerMatch[] = JSON.parse(
      localStorage.getItem("playerMatches") || "[]"
    );
    playerMatches.push(playerMatch);
    localStorage.setItem("playerMatches", JSON.stringify(playerMatches));
    toast.success(
      `Sieg von ${player.name}${player.emoji} offline gespeichert`,
      { dismissible: true }
    );
  };

  const handleConfirm = () => {
    if (selectedPlayer) {
      const formData = new FormData();
      formData.append("winnerId", selectedPlayer.id.toString());
      console.log(
        "sending Formdata:",
        formData.keys().next().value,
        formData.entries().next().value
      );
      const addPlayerAndToast = (i = 1) => {
        if (i === 4) {
          toast.error(
            "Der Schissl scheint nicht zu funktionieren, der Punkt wird erstmal offline gespeichert.",
            { dismissible: true }
          );
          writePlayerMatchToLocalStorage(selectedPlayer);
        } else {
          const addMatchPromise = addMatch(formData);
          toast.promise(addMatchPromise, {
            closeButton: true,
            loading:
              i == 1
                ? `Versuche ${selectedPlayer.name}${selectedPlayer.emoji} einzutragen...`
                : `Dann probieren wir es halt noch ein ${i}tes mal ${selectedPlayer.name}${selectedPlayer.emoji}  einzutragen...`,
            success: `Na endlich!, ${selectedPlayer.name}${selectedPlayer.emoji} wurde eingetragen!`,
            error: (error) => {
              addPlayerAndToast(i + 1);
              return `Fehler beim ${i}ten Versuch, ${selectedPlayer.name}${selectedPlayer.emoji} einzutragen...`;
            },
          });
        }
      };
      addPlayerAndToast();
      setSelectedPlayer(null);
      setIsModalOpen(false);
    }
  };

  const currentOfflinePlayerMatches: OfflinePlayerMatch[] =
    localStorage && JSON.parse(localStorage.getItem("playerMatches") || "[]");

  return (
    <div className="flex justify-center flex-col gap-3 p-3 ">
      <Input
        type="text"
        name="filter"
        placeholder="Spieler suchen..."
        required
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="flex flex-wrap gap-10 justify-center">
        {players
          .filter((player) => player.name.includes(filter))
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
      {currentOfflinePlayerMatches.length > 0 && (
        <div>
          <h3>Offline gespeicherte Siege:</h3>
          <ul>
            {currentOfflinePlayerMatches.map((playerMatch) => (
              <li key={playerMatch.timestamp}>
                {playerMatch.displayName} - {playerMatch.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function getOfflinePlayers(): Player[] | undefined {
  try {
    const offlinePlayerJSON = localStorage.getItem("playerBackup");
    if (!offlinePlayerJSON) return undefined;
    return JSON.parse(offlinePlayerJSON) as Player[];
  } catch (e) {
    return undefined;
  }
}

function writeOfflinePlayers(players: Player[]) {
  localStorage.setItem("playerBackup", JSON.stringify(players));
}
