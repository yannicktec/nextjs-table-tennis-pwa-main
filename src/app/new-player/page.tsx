"use client";
import Link from "next/link";
import { FormEvent } from "react";
import PlayerForm from "./PlayerForm";
import { postNewPlayer } from "../../../utils/supabase";
import { ToastContainer, toast } from "react-toastify";


export default function Page() {
  return (
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
      <h1 className="text-3xl font-bold mb-4 text-center">Neuer Spieler</h1>
      <PlayerForm
        onSubmit={(playerName, emoji) =>
          postNewPlayer(playerName, emoji)
            .then(() =>
              toast.success(playerName + emoji + " erfolgreich hinzugefügt", {
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
            )
        }
      />
      <ToastContainer />
    </div>
  );
}
