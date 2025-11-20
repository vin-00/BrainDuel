// components/ChatSidebar.jsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Assuming these functions are correctly defined in your lib/ws.js or equivalent
import {
  connectWS,
  onWSMessage,
  sendToRoom,
  joinRoom, // We'll call joinRoom when the component mounts
} from "@/lib/ws";

const ChatSidebar = ({ room , messages , setMessages }) => {
  
  const [msg, setMsg] = useState("");
  // Use JSDoc types to avoid JSX/TSX generic parsing in a .jsx file
  const scrollRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  // Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // WebSocket Connection and Event Listener Setup
  
  const sendMessage = () => {
    if (!msg.trim() || !room) return;

    // Send message via WebSocket
    sendToRoom(room, { text: msg });
    
    // Clear input field
    setMsg("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission if applicable
      sendMessage();
    }
  };
  
  return (
    <Card className="flex flex-col h-full border-none">
      <CardHeader className="p-4 border-b">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Room Chat
          </span>
          <span className="text-sm font-normal text-gray-500">Code: {room}</span>
        </CardTitle>
      </CardHeader>
      
      {/* Scrollable Message Area */}
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-200px)] p-4">
          <div className="space-y-4" ref={scrollRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}
              >
                {m.system ? (
                  <p className="text-xs text-center w-full text-gray-500 italic">
                    — {m.text} —
                  </p>
                ) : (
                  <div
                    className={`max-w-[80%] rounded-xl p-3 shadow ${
                      m.self 
                        ? 'bg-indigo-600 text-white rounded-br-sm' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm">{m.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      
      {/* Input and Send Button */}
      <CardFooter className="p-4 border-t">
        <div className="flex w-full space-x-2">
          <Input 
            placeholder="Type message..."
            className="flex-grow"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!room}
          />
          <Button 
            type="button" 
            size="icon" 
            onClick={sendMessage}
            disabled={!room || !msg.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatSidebar;