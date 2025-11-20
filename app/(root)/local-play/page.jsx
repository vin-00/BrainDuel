
// app/local/page.jsx (or pages/local.jsx)

import GameCard from '@/components/GameCard';
import { ChevronRight, Gamepad2, Brain, Puzzle } from 'lucide-react';

// Mock data for games
const gamesData = [
  { id: 1, name: 'HexaMind', slug: 'hexamind', description: 'A strategic tile-placement challenge.', players: '1-2', icon: <Brain className="w-5 h-5 text-indigo-500" /> },
  { id: 2, name: 'ChainReaction', slug: 'chainreaction', description: 'Match colors and trigger explosions.', players: '1-4', icon: <Gamepad2 className="w-5 h-5 text-pink-500" /> },
  { id: 3, name: 'CipherGrid', slug: 'ciphergrid', description: 'Deduce the hidden code sequence.', players: '1', icon: <Puzzle className="w-5 h-5 text-teal-500" /> },
  { id: 4, name: 'QuantumTicTacToe', slug: 'qttt', description: 'The classic game with an uncertainty twist.', players: '2', icon: <Brain className="w-5 h-5 text-red-500" /> },
];

export default function LocalPlayPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 border-b-4 border-indigo-200 inline-block pb-1">
          Explore Local Games
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Challenge yourself against the clock or a friend, all on one screen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {gamesData.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-md text-gray-500 flex items-center justify-center">
          More games coming soon! <ChevronRight className="ml-1 h-4 w-4" />
        </p>
      </div>
    </div>
  );
}