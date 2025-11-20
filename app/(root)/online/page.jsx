"use client";

import { useEffect, useState } from "react";
import {
  connectWS,
  onWSMessage,
  createRoom,
  joinRoom,
  sendToRoom,
} from "@/lib/ws";
import ChatSidebar from "@/components/ChatSidebar";
import { games } from "@/constants/constants";
import GameCard from "@/components/GameCard";

export default function OnlinePage() {
  const [room, setRoom] = useState("");
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(room);
  useEffect(() => {
    const ws = connectWS();

    onWSMessage((data) => {
      console.log("WS:", data);

      if (data.type === "room_created") {
        setRoom(data.code);
        setStatus(`Room created: ${data.code}`);
      }

      if (data.type === "join_success") {
        setRoom(data.code);
        setStatus(`Joined room: ${data.code}`);
      }

      if (data.type === "join_failed") {
        setStatus(`Join failed: ${data.error}`);
      }

      if (data.type === "player_joined") {
        setMessages((prev) => [
          ...prev,
          { system: true, text: `A player joined (${data.players} players)` },
        ]);
      }

      // Handle chat messages
      if (data.type === "room_message") {
        console.log("There");
        const mine = data.senderId === data.myId; 
        setMessages((prev) => [
          ...prev,
          {
            text: data.payload.text,
            self: mine,
            system: false,
          },
        ]);
      }
    });

    return () => ws?.close();
  }, []);

  return (
    <>
      {room ? (
        <div className="flex min-h-screen">
          {/* 1. Main Content Area (Game Selection) */}
          <main className="flex-1 overflow-y-auto p-8">
            {/* ... (Your game list layout) ... */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
              {/* ... (Your Room Lobby and Code display) ... */}
              <div className="text-right">
                <span className="block text-sm font-medium text-gray-500">
                  Room Code:
                </span>
                <span className="text-2xl font-extrabold text-indigo-700">
                  {room}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </main>

          {/* 2. Sidebar Area (Chat) */}
          <aside className="w-[350px] flex-shrink-0 border-l bg-white p-0">
            {/* Pass the room code to the chat sidebar */}
            <ChatSidebar
              room={room}
              messages={messages}
              setMessages={setMessages}
            />
          </aside>
        </div>
      ) : (
        <div className="p-8 space-y-6 max-w-xl mx-auto">
          <h1 className="text-3xl font-bold">Room Test</h1>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => createRoom()}
          >
            Create Room
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              const code = prompt("Enter room code") || "";
              joinRoom(code);
            }}
          >
            Join Room
          </button>
        </div>
      )}
    </>
  );
}
