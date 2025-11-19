'use client'

import React from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface Game {
  id: number;
  name: string;
  image: string;
  description: string;
  link: string; // 👈 add this
}

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <Link href={`/${game.link}`} className="block"> {/* 👈 full-card clickable */}
      <Card
        key={game.id}
        className="rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 bg-white cursor-pointer"
      >
        <CardContent className="p-4">
          <div className="relative w-full h-40 mb-3">
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{game.name}</h2>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                  {/* prevent opening link when clicking info */}
                  <Info className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 text-sm leading-snug bg-black text-white rounded-xl shadow-xl">
                  {game.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameCard;
