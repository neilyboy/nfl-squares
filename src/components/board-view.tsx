'use client';

import React from 'react';
import { SquaresGrid } from '@/components/squares-grid';
import { getTeamColors, getTeamLogo, getTeamWordmark } from '@/lib/team-colors';
import { formatCurrency, getLastDigit } from '@/lib/utils';

interface GameData {
  homeTeam: {
    name: string;
    displayName: string;
    abbreviation: string;
    score: number;
    logo: string;
  };
  awayTeam: {
    name: string;
    displayName: string;
    abbreviation: string;
    score: number;
    logo: string;
  };
  status: {
    period: number;
    clock: string;
    state: 'pre' | 'in' | 'post';
    detail: string;
  };
}

interface Board {
  id: string;
  name: string;
  costPerSquare: number;
  payoutQ1: number;
  payoutQ2: number;
  payoutQ3: number;
  payoutQ4: number;
  status: string;
  isFinalized: boolean;
  rowNumbers: string | null;
  colNumbers: string | null;
  squares: any[];
  winners: any[];
}

interface BoardViewProps {
  board: Board;
  gameData: GameData | null;
  potentialWinner: { row: number; col: number } | null;
  onModalStateChange?: (isOpen: boolean) => void;
}

export function BoardView({ board, gameData, potentialWinner, onModalStateChange }: BoardViewProps) {
  if (!gameData) return null;

  const homeColors = getTeamColors(gameData.homeTeam.displayName);
  const awayColors = getTeamColors(gameData.awayTeam.displayName);
  const totalPot = board.costPerSquare * 100;

  // Determine current quarter winner
  const currentQuarter = gameData.status.period;
  const currentQuarterWinner = board.winners.find(w => w.quarter === currentQuarter);

  return (
    <>
      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
      `}</style>
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Top: Board Name & Total Pot */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{board.name}</h1>
          <div className="text-lg font-semibold">
            Total Pot: {formatCurrency(totalPot)}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center: Grid with Team Labels */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Team Color Bars with Scores and Logos */}
          <div className="flex h-24 relative gap-4 px-4 pt-2">
            {/* Away Team Bar with gradient */}
            <div
              className="flex-1 flex items-center justify-center relative rounded-l-2xl rounded-tr-2xl"
              style={{ 
                background: `linear-gradient(to left, ${awayColors.primary} 0%, ${awayColors.primary} 70%, ${awayColors.secondary} 100%)`
              }}
            >
              {/* Large Logo Overlapping */}
              <div className="absolute left-8 bottom-0 transform translate-y-1/4 z-10">
                <img
                  src={getTeamLogo(gameData.awayTeam.displayName)}
                  alt={gameData.awayTeam.displayName}
                  width={120}
                  height={120}
                  className="object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
                />
              </div>
              <div className="flex items-center gap-8">
                {/* White outline/stroke effect */}
                <div className="ml-32">
                  <img
                    src={getTeamWordmark(gameData.awayTeam.displayName)}
                    alt={gameData.awayTeam.displayName}
                    width={140}
                    height={45}
                    className="object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 0 2px white) drop-shadow(0 0 2px white) drop-shadow(0 0 3px white) drop-shadow(0 0 4px white) drop-shadow(0 0 5px white)' 
                    }}
                  />
                </div>
              </div>
              {/* Score overlapping - right side */}
              <div 
                className="absolute right-6 bottom-0 transform translate-y-1/3 z-10"
              >
                <div 
                  className="text-6xl font-black text-white bg-black/30 px-4 py-2 rounded-lg"
                  style={{ 
                    textShadow: '0 0 3px black, 0 0 5px black, 0 0 8px black, 0 0 3px white, 0 2px 10px rgba(0,0,0,0.8)',
                    WebkitTextStroke: '2px black'
                  }}
                >
                  {gameData.awayTeam.score}
                </div>
              </div>
            </div>

            {/* Home Team Bar with gradient */}
            <div
              className="flex-1 flex items-center justify-center relative rounded-r-2xl rounded-tl-2xl"
              style={{ 
                background: `linear-gradient(to right, ${homeColors.primary} 0%, ${homeColors.primary} 70%, ${homeColors.secondary} 100%)`
              }}
            >
              {/* Score overlapping - left side */}
              <div 
                className="absolute left-6 bottom-0 transform translate-y-1/3 z-10"
              >
                <div 
                  className="text-6xl font-black text-white bg-black/30 px-4 py-2 rounded-lg"
                  style={{ 
                    textShadow: '0 0 3px black, 0 0 5px black, 0 0 8px black, 0 0 3px white, 0 2px 10px rgba(0,0,0,0.8)',
                    WebkitTextStroke: '2px black'
                  }}
                >
                  {gameData.homeTeam.score}
                </div>
              </div>
              <div className="flex items-center gap-8">
                {/* White outline/stroke effect */}
                <div className="mr-32">
                  <img
                    src={getTeamWordmark(gameData.homeTeam.displayName)}
                    alt={gameData.homeTeam.displayName}
                    width={140}
                    height={45}
                    className="object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 0 2px white) drop-shadow(0 0 2px white) drop-shadow(0 0 3px white) drop-shadow(0 0 4px white) drop-shadow(0 0 5px white)' 
                    }}
                  />
                </div>
              </div>
              {/* Large Logo Overlapping */}
              <div className="absolute right-8 bottom-0 transform translate-y-1/4 z-10">
                <img
                  src={getTeamLogo(gameData.homeTeam.displayName)}
                  alt={gameData.homeTeam.displayName}
                  width={120}
                  height={120}
                  className="object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
                />
              </div>
            </div>
          </div>

          {/* Grid Area with Team Labels */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="flex flex-col">
              {/* Horizontal Team Bar (Home Team - Right Above Grid) */}
              <div className="flex">
                {/* Empty space to align with vertical bar */}
                <div style={{ width: '50px', height: '50px' }}></div>
                <div 
                  className="flex items-center justify-center"
                  style={{ backgroundColor: homeColors.primary, width: '640px', height: '50px' }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={getTeamLogo(gameData.homeTeam.displayName)}
                      alt={gameData.homeTeam.displayName}
                      width={35}
                      height={35}
                    />
                    <div className="text-base font-bold text-white tracking-wide">
                      {gameData.homeTeam.displayName.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid with Vertical Team on Left */}
              <div className="flex">
                {/* Vertical Team Label (Left of Grid) */}
                <div 
                  className="flex items-center justify-center"
                  style={{ backgroundColor: awayColors.primary, height: '640px', width: '50px' }}
                >
                  <div className="flex items-center gap-2" style={{ transform: 'rotate(-90deg)', width: '640px', height: '50px' }}>
                    <img
                      src={getTeamLogo(gameData.awayTeam.displayName)}
                      alt={gameData.awayTeam.displayName}
                      width={35}
                      height={35}
                    />
                    <div className="text-base font-bold text-white tracking-wide whitespace-nowrap">
                      {gameData.awayTeam.displayName.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Actual Grid */}
                <div>
            <SquaresGrid
              squares={board.squares}
              rowNumbers={
                board.isFinalized && board.rowNumbers
                  ? JSON.parse(board.rowNumbers)
                  : null
              }
              colNumbers={
                board.isFinalized && board.colNumbers
                  ? JSON.parse(board.colNumbers)
                  : null
              }
              showNumbers={board.isFinalized}
              readOnly
              potentialWinningSquare={potentialWinner}
              teamHomeAbbr={gameData.homeTeam.abbreviation}
              teamAwayAbbr={gameData.awayTeam.abbreviation}
              teamHomeColor={homeColors.primary}
              teamAwayColor={awayColors.primary}
              onModalStateChange={onModalStateChange}
            />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="w-64 bg-card border-l border-border p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold mb-2">Board Info</h3>
              <div className="text-xs space-y-1">
                <div>Cost: {formatCurrency(board.costPerSquare)} per square</div>
                <div>Status: <span className="capitalize">{board.status}</span></div>
                <div>Finalized: {board.isFinalized ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2">Game Status</h3>
              <div className="text-xs space-y-1">
                <div>Quarter: {gameData.status.period}</div>
                <div>Clock: {gameData.status.clock}</div>
                <div>Status: {gameData.status.detail}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2">Payouts</h3>
              <div className="text-xs space-y-1">
                <div>Q1: {board.payoutQ1}% - {formatCurrency(totalPot * board.payoutQ1 / 100)}</div>
                <div>Q2: {board.payoutQ2}% - {formatCurrency(totalPot * board.payoutQ2 / 100)}</div>
                <div>Q3: {board.payoutQ3}% - {formatCurrency(totalPot * board.payoutQ3 / 100)}</div>
                <div>Q4: {board.payoutQ4}% - {formatCurrency(totalPot * board.payoutQ4 / 100)}</div>
              </div>
            </div>

            {currentQuarterWinner && (
              <div className="p-3 bg-primary/10 border border-primary rounded">
                <h3 className="text-sm font-bold mb-1 text-primary">Current Winner</h3>
                <div className="text-xs">
                  <div className="font-bold">{currentQuarterWinner.playerName}</div>
                  <div>Q{currentQuarterWinner.quarter}</div>
                  <div>{formatCurrency(currentQuarterWinner.payout)}</div>
                </div>
              </div>
            )}

            {board.winners.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-2">All Winners</h3>
                <div className="space-y-2">
                  {board.winners.map((winner) => (
                    <div
                      key={winner.id}
                      className="text-xs p-2 bg-secondary rounded"
                    >
                      <div className="font-bold">{winner.playerName}</div>
                      <div>Q{winner.quarter} - {formatCurrency(winner.payout)}</div>
                      <div className="text-muted-foreground">
                        Score: {winner.scoreAway}-{winner.scoreHome}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Game Info & Navigation */}
      <div className="bg-card border-t border-border px-4 py-2">
        <div className="text-xs text-muted-foreground text-center">
          {gameData.status.detail}
        </div>
      </div>
    </div>
    </>
  );
}
