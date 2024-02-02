"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import emojiRegex from 'emoji-regex';

 export type NewPlayerProps = {
    onSubmit: (playerName: string, emoji: string)=> void;
  }; 


  export default function PlayerForm ({ onSubmit }: NewPlayerProps) {
    const [playerName, setPlayerName] = useState<string>('');
    const [emoji, setEmoji] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(playerName, emoji);
    };

    const handleEmojiChange = (e: ChangeEvent<HTMLInputElement>) => {
        const regex = emojiRegex();
        const input = e.target.value;
        if ((input === '' || regex.test(input))) {
            console.log("🤨")
            setEmoji(input);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">Player Name</label>
                    <input
                        type="text"
                        id="playerName"
                        name="playerName"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">Emoji</label>
                    <input
                        type="text"
                        id="emoji"
                        name="emoji"
                        value={emoji}
                        onChange={handleEmojiChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-prm-blue hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-slate-800"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

