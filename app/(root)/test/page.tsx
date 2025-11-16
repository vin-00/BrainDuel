"use client";

import { useEffect, useState } from "react";
import {
  connectWS,
  onWSMessage,
  createRoom,
  joinRoom,
  sendToRoom,
} from "@/lib/ws";

export default function RoomsTest() {
  const [room, setRoom] = useState("");
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  
  useEffect(() => {
    const ws = connectWS();

    onWSMessage((data) => {
      console.log("WS:", data);

      // Store ID when received
      
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

      if (data.type === "room_message") {
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

  const sendMessage = () => {
    if (!msg.trim() || !room) return;

    sendToRoom(room, { text: msg });
    setMsg("");
  };

  return (
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

      {room && (
        <>
          <h2 className="text-lg font-semibold">Room: {room}</h2>

          <div className="border p-4 rounded h-64 overflow-y-auto bg-gray-50 space-y-2">
            {messages.map((m, i) => (
              <div key={i}>
                {m.system ? (
                  <p className="text-sm text-gray-500 italic">{m.text}</p>
                ) : m.self ? (
                  <p className="text-right text-blue-700 font-medium">
                    You: {m.text}
                  </p>
                ) : (
                  <p className="text-left text-green-700 font-medium">
                    Opponent: {m.text}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="border p-2 rounded flex-1"
              placeholder="Type message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </>
      )}

      <p className="text-gray-700">{status}</p>
    </div>
  );
}
