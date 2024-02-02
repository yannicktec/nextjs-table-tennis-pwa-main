"use client"
import { PostgrestError, createClient } from "@supabase/supabase-js";
import PlayerTile from "./playerTile";
import PlayerGrid from "./playerGrid";
import Link from "next/link";
import supabase from "../../../utils/supabase";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { CircleLoader } from "react-spinners";

type Players = {
  name: string;
  id: number;
  wins: number;
  emoji: string;
  priority: string;
  createdAt: Date;
};

export default function Notes() {
  const [players, setPlayers] = useState<Players[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PostgrestError|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("players")
          .select()
          .order("priority", { ascending: true });

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
    <main className="container mx-auto mt-8 p-4 bg-gray-100 rounded-md"> <div className="absolute top-11 left-8">
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
  <h1 className="text-3xl font-bold mb-4 text-center">Spiel</h1>{players ? <PlayerGrid players={players}/> : <span>Loading</span>}
  <ToastContainer /></main>
  
  );
}
