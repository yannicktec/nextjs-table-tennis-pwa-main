export const dynamic = 'force-dynamic';
import Link from "next/link";
import { getCurrentMonthResult } from "@/db/getCurrentMonthResult";


export default async function ScoreBoard() {
  const thisMonthResult = await getCurrentMonthResult()

  const firstThreePlayers = thisMonthResult.slice(0, 3);
  const restOfPlayers = thisMonthResult.slice(3);


  return (
    <main>
      <div className="h-screen w-screen p-6 bg-gray-100">
        <div className="">
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
          {firstThreePlayers.map((player, index) => (
            <div
              key={player.id}
              className={`p-8 rounded-md ${index === 0
                ? "bg-gold"
                : index === 1
                  ? "bg-silver"
                  : index === 2
                    ? "bg-bronze"
                    : "bg-gray-200"
                } ${index <= 3 ? `shadow-lg` : `shadow`} relative`}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="  text-xl font-medium">
                  {player.name} {player.emoji}
                </div>
                <div className="  text-m font-light">
                  {player.wins}
                </div>
              </div>
              <div className="absolute inset-2 flex items-center justify-start">
                <p className="text-8xl font-bold opacity-50 z-10 ">
                  {index === 0
                    ? "🥇"
                    : index === 1
                      ? "🥈"
                      : index === 2
                        ? "🥉"
                        : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {restOfPlayers.map((player, index) => (
            <div key={player.id} className="p-4 bg-white rounded-md">
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

    </main>
  );
}
