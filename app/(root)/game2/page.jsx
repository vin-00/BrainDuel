// Enhanced Knight's Siege with shadcn/ui + lucide-react styling
// Using Button, Card, Badge, Alert, and icons

'use client'

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Swords, ShieldHalf, Skull, Crown, ChessKnight } from "lucide-react";

// ================= CORE GAME LOGIC =====================
const BOARD_SIZE = 8;
const INITIAL_X = [0, 0];
const INITIAL_O = [7, 7];
const KNIGHT_MOVES = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [2, -1], [2, 1], [1, -2], [1, 2]
];

const to1D = (r, c) => r * BOARD_SIZE + c;
const to2D = (i) => [Math.floor(i / BOARD_SIZE), i % BOARD_SIZE];
const isInside = (r, c) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;

const getMoves = (r, c, board) => {
  return KNIGHT_MOVES
    .map(([dr, dc]) => [r + dr, c + dc])
    .filter(([nr, nc]) => isInside(nr, nc) && board[to1D(nr, nc)] === null);
};

const checkLoss = (r, c, board) => getMoves(r, c, board).length === 0;

const nextState = (state, nr, nc) => {
  const { board, turn, knightX, knightO, winner } = state;
  if (winner) return state;

  const [cr, cc] = turn === 'X' ? knightX : knightO;
  const moves = getMoves(cr, cc, board);
  if (!moves.some(([r, c]) => r === nr && c === nc)) return state;

  const nBoard = [...board];
  nBoard[to1D(cr, cc)] = 'BLOCKED';
  nBoard[to1D(nr, nc)] = turn === 'X' ? 'X_KNIGHT' : 'O_KNIGHT';

  const newX = turn === 'X' ? [nr, nc] : knightX;
  const newO = turn === 'O' ? [nr, nc] : knightO;
  const nextTurn = turn === 'X' ? 'O' : 'X';

  const [r2, c2] = nextTurn === 'X' ? newX : newO;
  const loss = checkLoss(r2, c2, nBoard);

  return {
    board: nBoard,
    turn: nextTurn,
    knightX: newX,
    knightO: newO,
    winner: loss ? turn : null,
  };
};

const initState = () => {
  const board = Array(BOARD_SIZE * BOARD_SIZE).fill(null);
  board[to1D(...INITIAL_X)] = 'X_KNIGHT';
  board[to1D(...INITIAL_O)] = 'O_KNIGHT';
  return { board, turn: Math.random() < 0.5 ? "X" : "O", knightX: INITIAL_X, knightO: INITIAL_O, winner: null };
};

// ================= UI ICON COMPONENTS ===================
const KnightIcon = ({ color }) => <ChessKnight className="w-8 h-8" color={color} strokeWidth={2.4} />;
const BlockedIcon = () => <Skull className="w-5 h-5 text-gray-500" strokeWidth={2.4} />;

// ================= MAIN COMPONENT =======================
export default function KnightsSiege() {
  const [game, setGame] = useState(initState());
  const [hoverMoves, setHoverMoves] = useState([]);

  const { board, turn, knightX, knightO, winner } = game;
  const [cr, cc] = turn === 'X' ? knightX : knightO;

  const moves = useMemo(() => getMoves(cr, cc, board), [cr, cc, board]);

  const onCellClick = (r, c) => {
    if (winner) return;
    setGame(nextState(game, r, c));
    setHoverMoves([]);
  };

  const reset = () => {
    setGame(initState());
    setHoverMoves([]);
  };

  const renderCell = (piece, r, c) => {
    if (piece === 'X_KNIGHT') return <KnightIcon color="#2563eb" />;
    if (piece === 'O_KNIGHT') return <KnightIcon color="#dc2626" />;
    if (piece === 'BLOCKED') return <BlockedIcon />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-10 flex flex-col items-center gap-8">

      <Card className="w-full max-w-3xl shadow-2xl border-indigo-200">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold flex items-center justify-center gap-3">
            <Swords className="w-10 h-10 text-indigo-600" /> Knight's Siege
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">

          {/* TURN INDICATOR */}
          {!winner ? (
            <Alert className="border-indigo-300 bg-indigo-50">
              <AlertDescription className="flex items-center justify-center gap-3 text-xl font-semibold">
                <ShieldHalf className="w-6 h-6 text-indigo-700" />
                Turn:
                <Badge
                  className={`text-lg px-3 py-1 ${turn === 'X' ? 'bg-blue-600' : 'bg-red-600'}`}
                >
                  Player {turn}
                </Badge>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-green-50 border-green-400">
              <AlertDescription className="text-3xl font-bold text-green-700 flex items-center gap-2">
                <Crown className="w-8 h-8" /> Player {winner} Wins!
              </AlertDescription>
            </Alert>
          )}

          {/* BOARD */}
          <div
            className="grid border-4 border-gray-700 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
              width: 'min(90vw, 550px)',
              height: 'min(90vw, 550px)'
            }}
          >
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
              const [r, c] = to2D(i);
              const piece = board[i];

              const base = (r + c) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300';
              const isMove = moves.some(([mr, mc]) => mr === r && mc === c);

              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center cursor-pointer transition-all
                    ${base}
                    ${isMove ? (turn==="X" ? 'border-4 border-indigo-400' : 'border-4 border-red-400') : ''}`}
                  onClick={() => onCellClick(r, c)}
                >
                  {renderCell(piece, r, c)}
                </div>
              );
            })}
          </div>

          {/* RESET BUTTON */}
          <Button onClick={reset} className="text-lg px-6 py-3 shadow-md">
            {winner ? 'Play Again' : 'Reset Game'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
