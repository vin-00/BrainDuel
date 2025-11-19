
import { games } from "@/constants/constants";
import GameCard from "@/components/GameCard";


export default function BrainDuelPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* --- Section 1: Welcome & Call to Action --- */}
      <div className="max-w-4xl mx-auto text-center py-12 px-6 bg-white rounded-xl shadow-2xl mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to <span className="text-indigo-600">BrainDuel</span> 🧠⚔️
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Challenge your intellect in thrilling, fast-paced duels! Choose your
          mode below to get started.
        </p>

        {/* --- Section 2: Play Mode Options --- */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2">
          Choose Your Duel Mode
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {/* Option 1: Local Play */}

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

          {/* Option 2: Online Play */}
          <div className="flex-1 min-w-48 p-6 bg-indigo-600 text-white rounded-lg shadow-xl transition duration-300 transform hover:scale-[1.02]">
            <h3 className="text-2xl font-bold mb-3">Play Online 🌐</h3>
            <div className="flex justify-between gap-4">
              <a
                href="/online/create"
                className="flex-1 py-2 px-4 bg-indigo-500 border border-white rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-200 text-center"
              >
                Create Room
              </a>

              <a
                href="/online/join"
                className="flex-1 py-2 px-4 bg-indigo-500 border border-white rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-200 text-center"
              >
                Join Room
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 3: Available Games List --- */}
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
    </div>
  );
}
