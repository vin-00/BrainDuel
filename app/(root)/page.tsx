"use client";

import React, { useEffect, useState } from "react";
import { games } from "@/constants/constants"; // Assuming this is defined
import GameCard from "@/components/GameCard"; // Assuming this is defined


export default function BrainDuelPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  
  
  const [roomError, setRoomError] = useState<string | null>(null);
  
  const STORAGE_KEY = "brainDuelUsername";

  // ... (Username useEffect and submitUsername functions are unchanged) ...
  useEffect(() => {

    try {
      if (typeof window !== "undefined") {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (existing && existing.trim().length > 0) {
          setUsername(existing);
          setShowUsernameModal(false);
        } else {
          setShowUsernameModal(true);
        }
      }
    } catch (e) {
      setShowUsernameModal(true);
    }
  }, []);

  function submitUsername(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length < 1) {
      setRoomError("Please enter a name."); // Using roomError state for modal error
      return;
    }
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, trimmed);
      }
    } catch (e) {
      // ignore localStorage errors
    }
    setUsername(trimmed);
    setShowUsernameModal(false);
    setRoomError(null);
  }

  function initialsFromName(name: string) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // --- JSX Rendering ---

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Top-right avatar / username (Unchanged) */}
      {username && (
        <div className="absolute top-6 right-6 z-30">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-md">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              {initialsFromName(username)}
            </div>
            <div className="text-sm font-medium text-gray-800">{username}</div>
          </div>
        </div>
      )}

      {/* Main content (Mode Selection) */}
      <div className="max-w-4xl mx-auto text-center py-12 px-6 bg-white rounded-xl shadow-2xl mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to <span className="text-indigo-600">BrainDuel</span> 🧠⚔️
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Challenge your intellect in thrilling, fast-paced duels! Choose your
          mode below to get started.
        </p>

        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2">
          Choose Your Duel Mode
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="/local-play"
            className="flex-1 min-w-48 p-6 bg-green-500 text-white rounded-lg shadow-xl hover:bg-green-600 transition duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            <h3 className="text-2xl font-bold mb-2">Play Locally 🧑‍🤝‍🧑</h3>
            <p className="text-sm">
              Two players, one screen. Perfect for practice or challenging a
              friend sitting right next to you!
            </p>
          </a>

          <a href="/online" className="flex-1 min-w-48 p-6 bg-indigo-600 text-white rounded-lg shadow-xl transition duration-300 transform hover:scale-[1.02]">
            <h3 className="text-2xl font-bold mb-3">Play Online 🌐</h3>

            <p className="text-sm">
              Have a friend across town? Create or join a private room to duel
            </p>

          </a>
        </div>
      </div>

      {/* Available Games Section (Unchanged) */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6 border-b-2 border-gray-300 pb-2">
          Explore Available Games
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8">
          BrainDuel offers a growing library of unique brain challenges, from
          classics with a twist to original mind-benders. Click any game to view
          rules and jump into a match!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      {/* -------------------- 1. Username Modal (Unchanged) -------------------- */}
      {showUsernameModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          {/* ... (Username modal content remains here) ... */}
          <form
            onSubmit={submitUsername}
            className="relative z-50 w-full max-w-md bg-white rounded-xl p-6 shadow-2xl mx-4"
          >
            <h3 className="text-xl font-semibold mb-3">Welcome to BrainDuel!</h3>
            <p className="text-sm text-gray-600 mb-4">Please enter a display name to continue.</p>

            <label className="block">
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitUsername();
                }}
                placeholder="Your display name"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>
            {roomError && <div className="text-sm text-red-500 mt-2">{roomError}</div>}

            <div className="mt-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  const anon = `Player_${Math.floor(Math.random() * 9000) + 1000}`;
                  setInput(anon);
                  setRoomError(null);
                }}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Suggest
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700"
              >
                Continue
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-400">You can change this later in your browser storage.</div>
          </form>
        </div>
      )}

    </div>
  );
}