"use client";

import addMatch from "../actions/addMatch";
import { useEffect, useState } from "react";

import PlayerTile from "./playerTile";
import { ConfirmationModal } from "./confirmationModal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useOfflineActions } from "@/app/hooks/useOfflineActions";
import { Player } from "@/types";

interface PlayerGridProps {
  players: Player[];
}

export default function PlayerGrid({ players }: Readonly<PlayerGridProps>) {
  "use client";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiSelection, setIsMultiSelection] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const { addOfflineMatch } = useOfflineActions();

  const [filter, setFilter] = useState("");

  const handlePlayerClick = (player: Player) => {
    if (isMultiSelection) {
      if (selectedPlayers.includes(player)) {
        setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
      } else {
        setSelectedPlayers([...selectedPlayers, player]);
        if (selectedPlayers.length === 1) {
          setIsModalOpen(true);
        }
      }
    } else {
      setSelectedPlayers([player]);
      setIsModalOpen(true);
    }
  };

  const handleConfirm = () => {
    const formData = new FormData();
    selectedPlayers.forEach((winner, i) => {
      formData.append(`winnerId${i + 1}`, winner.id.toString());
    });

    toastPlayerMatchRecursive({
      currIteration: 1,
      maxIterations: 4,
      promise: addMatch(formData),
      fallBackAction: () => {
        selectedPlayers.forEach((winner) => {
          addOfflineMatch({
            displayName: winner.name + winner.emoji,
            player: winner.id,
            timestamp: new Date(),
          });
        });
      },
      successMessage: `Wuhu Cola und Forntnite für ${selectedPlayers
        .map(({ name, emoji }) => `${name}${emoji}`)
        .join(" und ")}!`,
      errorMessage: `Fehler beim Versuch, ${selectedPlayers
        .map(({ name, emoji }) => `${name}${emoji}`)
        .join(" und ")} einzutragen...`,
    });
    setSelectedPlayers([]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center flex-col gap-3 p-3 ">
      <div className="flex gap-3 justify-end">
        Losers Cup
        <Switch
          onClick={(e) => {
            setIsMultiSelection((isMultiSelection) => !isMultiSelection);
            setSelectedPlayers([]);
          }}
        />
      </div>
      {isMultiSelection && <p>Wähle zwei Spieler aus, die gewonnen haben</p>}
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
          .filter(
            (player) =>
              player.name.toLowerCase().includes(filter.toLowerCase()) &&
              player.status === "ACTIVE"
          )
          .toSorted((a, b) => a.priority - b.priority)
          .map((player) => (
            <PlayerTile
              key={player.id}
              name={player.name}
              selected={selectedPlayers.includes(player)}
              emoji={player.emoji || "👾"}
              onClick={() => handlePlayerClick(player)}
            />
          ))}
      </div>
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlayers([]);
          }}
          onConfirm={handleConfirm}
          message={
            selectedPlayers.length > 1
              ? `Haben ${selectedPlayers[0].name} und ${selectedPlayers[1].name} gewonnen?`
              : `Hat ${selectedPlayers[0].name} gewonnen?`
          }
        />
      )}
    </div>
  );
}

export function toastPlayerMatchRecursive({
  currIteration = 1,
  maxIterations = 4,
  promise,
  fallBackAction,
  successMessage,
  errorMessage,
}: {
  currIteration: number;
  maxIterations: number;
  promise: Promise<any>;
  fallBackAction: () => void;
  successMessage: string;
  errorMessage: string;
}) {
  if (currIteration !== maxIterations) {
    toast.promise(promise, {
      closeButton: true,
      loading:
        currIteration == 1
          ? `Versuche Sieg einzutragen...`
          : `Dann probieren wir es halt noch ein ${currIteration}tes mal den Sieg einzutragen...`,
      success: successMessage,

      error: () => {
        toastPlayerMatchRecursive({
          currIteration: currIteration + 1,
          maxIterations,
          promise,
          fallBackAction,
          successMessage,
          errorMessage,
        });
        return `Fehler beim ${currIteration}ten Versuch..`;
      },
    });
  } else {
    toast.error(
      "Der Schissl scheint nicht zu funktionieren, der Punkt wird erstmal offline gespeichert.",
      { dismissible: true }
    );
    fallBackAction();
  }
}
