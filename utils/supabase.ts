import { Player } from "@/app/game/components/playerGrid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://inghdawjqxpbbgbnowgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZ2hkYXdqcXhwYmJnYm5vd2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI3NjA1ODAsImV4cCI6MTk4ODMzNjU4MH0.pri3Gob77JKY2kcD2eME_Qy4nswe7bJHMPvmKR5Y5gg"
);

export const getScoreBoard = async () => {
  const players = supabase
    .from("players")
    .select()
    .order("wins", { ascending: false });
  return players;
};

export const getGameBoard = async () => {
  const { data: players, error } = await supabase
    .from("players")
    .select()
    .order("priority", { ascending: true });
  if (error) {
    throw error.message;
  }
  return players;
};

export const postNewPlayer = async (playerName: string, emoji: string) => {
  const { data, error } = await supabase
    .from("players")
    .insert([{ name: playerName, emoji: emoji }]);
  if (error) {
    throw error.message;
  }
};

export const updatePlayerWins = async (player: Player) => {
  const { data, error } = await supabase
    .from("players")
    .update({ wins: player.wins ? player.wins + 1 : 1 })
    .eq("id", player.id);
  if (error) {
    throw error.message;
  }
};
export default supabase;
