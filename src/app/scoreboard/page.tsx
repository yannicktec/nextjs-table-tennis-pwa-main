"use client"
import { PostgrestError} from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";
import Link from "next/link";

type Players = {
  name: string;
  id: number;
  wins: number;
  emoji: string;
  priority: string;
  createdAt: Date;
};

  export default function  ScoreBoard() {
  const [players, setPlayers] = useState<Players[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PostgrestError|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("players")
          .select()
          .order("wins", { ascending: false });

        if (error) throw error;
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error as PostgrestError );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <span>loading</span>;
  if (error) return <span>Error: {error.message}</span>;

    return (
      <main>
        {players ? (
          <div className="container mx-auto mt-8 p-4 bg-gray-100 rounded-md">
          <div className="absolute top-11 left-8">
            <Link
              href="/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center">Scoreboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
              {[1, 2, 3].map((position) => (
                <div
                  key={position}
                  className={`p-8 rounded-md ${
                    position === 1
                      ? "bg-gold"
                      : position === 2
                      ? "bg-silver"
                      : position === 3
                      ? "bg-bronze"
                      : "bg-gray-200"
                  } ${position <= 3 ? `shadow-lg` : `shadow`} relative`}
                >
                  <div className=" flex flex-col items-center justify-center">
                    <div className="  text-xl font-medium">
                      {players[position - 1].name} {players[position - 1].emoji}
                    </div>
                    <div className="  text-m font-light">
                      {players[position - 1].wins}
                    </div>
                  </div>
                  <div className="absolute inset-2 flex items-center justify-start">
                    <p className="text-8xl font-bold opacity-50 z-10 ">
                      {position === 1
                        ? "🥇"
                        : position === 2
                        ? "🥈"
                        : position === 3
                        ? "🥉"
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {players.slice(3).map((player, index) => (
                <div key={index + 4} className="p-4 bg-white rounded-md">
                  <p className="text-xl font-bold">{index + 4}.</p>
                  <div className="flex justify-between">
                    <div className="mt-2">
                      {player.name} {player.emoji}
                    </div>
                    <div className="mt-2">{player.wins}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <span>Loading</span>
        )}
      </main>
    );
  }
