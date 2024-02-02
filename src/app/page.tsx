import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto mt-8 p-6 bg-gray-200 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        TT Crew
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <Link
          href="/game"
          className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-prm-blue hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-slate-800"
        >
          Spiel
        </Link>
        <Link
          className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-prm-blue hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-slate-800"
          href="/scoreboard"
        >
          Score
        </Link>
        <Link
          href="/new-player"
          className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-prm-blue hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-slate-800"
        >
          Neuer Spieler
        </Link>
      </div>
    </div>
  );
}
