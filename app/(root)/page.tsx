
import {games } from "@/constants/constants";
import GameCard from "@/components/GameCard";

// ------------------------------------------------------------
// Component: BrainDuel Games Page
// ------------------------------------------------------------
export default function BrainDuelPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 tracking-wide">BrainDuel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {games.map((game) => (
        <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
