"use client";

import { useState, useEffect } from "react";

export default function ThreePieceTicTacToe() {
  const emptyBoard = Array(9).fill(null);

  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [history, setHistory] = useState({ X: [], O: [] });
  const [winner, setWinner] = useState(null);

  
  const checkWinner = (b) => {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b1, c] of wins) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  // Effect to set random first turn on component mount
  useEffect(() => {
    setTurn(Math.random() < 0.5 ? "X" : "O");
  }, []);

  
  const getRemovablePiece = (player) => {
    const list = history[player];
    return list.length >= 3 ? list[0] : null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    const newHistory = { X: [...history.X], O: [...history.O] };

    newHistory[turn].push(index);

    if (newHistory[turn].length > 3) {
      const removed = newHistory[turn].shift();
      newBoard[removed] = null;
    }

    newBoard[index] = turn;

    setBoard(newBoard);
    setHistory(newHistory);

    const newWinner = checkWinner(newBoard);

    if (newWinner) {
      setWinner(newWinner);
      
    } else {
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(emptyBoard);
    setHistory({ X: [], O: [] });
    setWinner(null);
    setTurn(Math.random() < 0.5 ? "X" : "O");
  };

  
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-blue-100 to-indigo-200 min-h-screen relative">
      <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-md">
        Tic Tac Shift
      </h1>

      {/* Timer Display - Top Right Corner */}
      {!winner && (
        <div className="absolute top-4 right-4 z-10 flex flex-col items-center">
          
          <p className="text-sm font-medium text-gray-600 mt-1">
            {turn}'s Turn
          </p>
        </div>
      )}

      {/* Game Status/Turn Indicator */}
      <div className="flex flex-col items-center w-full max-w-sm mt-16 mb-2">
        <div className="flex items-center justify-between w-64">
          <div
            className={`text-2xl font-bold ${
              turn === "X" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            Player X
          </div>
          <div className="text-2xl font-bold text-gray-700">vs</div>
          <div
            className={`text-2xl font-bold ${
              turn === "O" ? "text-red-600" : "text-gray-400"
            }`}
          >
            Player O
          </div>
        </div>
      </div>

      {winner && (
        <div className="text-3xl font-bold text-green-700 animate-bounce mt-4">
          Winner: {winner}! 🎉
        </div>
      )}

      {/* Tic Tac Toe Grid */}
      <div className="grid grid-cols-3 gap-3 w-80 h-80 bg-gray-500 p-3 rounded-xl shadow-2xl">
        {board.map((cell, idx) => {
          const removable = getRemovablePiece(turn);
          const isAboutToBeRemoved = removable === idx;

          let cellClasses = `aspect-square flex items-center justify-center text-5xl font-extrabold rounded-lg shadow-md cursor-pointer 
                             transition-all duration-200 transform hover:scale-105`;

          if (cell === null) {
            cellClasses += " bg-gray-100 hover:bg-gray-200 active:bg-gray-300";
          } else {
            cellClasses +=
              cell === "X"
                ? " bg-blue-400 text-white"
                : " bg-red-400 text-white";
            if (isAboutToBeRemoved) {
              // Apply a pulsating ring to the piece about to be removed
              cellClasses += " ring-4 ring-yellow-400 animate-pulse";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              disabled={cell !== null || !!winner}
              className={cellClasses}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <button
        onClick={resetGame}
        className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white text-xl font-semibold shadow-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
      >
        Reset Game
      </button>
    </div>
  );
}
