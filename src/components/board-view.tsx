'use client';

import React from 'react';
import { SquaresGrid } from '@/components/squares-grid';
import { getTeamColors, getTeamLogo, getTeamWordmark } from '@/lib/team-colors';
import { formatCurrency, getLastDigit } from '@/lib/utils';
import { useResponsive } from '@/lib/use-responsive';

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

  const { isMobile, isTablet } = useResponsive();
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
    <div className={`h-screen w-screen overflow-hidden bg-background flex flex-col ${isMobile ? 'overflow-y-auto' : ''}`}>
      {/* Top: Board Name & Total Pot */}
      <div className="bg-card border-b border-border px-2 md:px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-sm md:text-xl font-bold truncate">{board.name}</h1>
          <div className="text-xs md:text-lg font-semibold whitespace-nowrap ml-2">
            Total Pot: {formatCurrency(totalPot)}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden`}>
        {/* Center: Grid with Team Labels */}
        <div className={`flex-1 flex flex-col ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {/* Team Color Bars with Scores and Logos */}
          <div className={`flex ${isMobile ? 'h-16' : isTablet ? 'h-20' : 'h-24'} relative ${isMobile ? 'gap-2 px-2' : 'gap-4 px-4'} pt-2`}>
            {/* Away Team Bar with gradient */}
            <div
              className="flex-1 flex items-center justify-center relative rounded-l-2xl rounded-tr-2xl"
              style={{ 
                background: `linear-gradient(to left, ${awayColors.primary} 0%, ${awayColors.primary} 70%, ${awayColors.secondary} 100%)`
              }}
            >
              {/* Large Logo Overlapping */}
              {!isMobile && (
                <div className={`absolute ${isTablet ? 'left-4' : 'left-8'} bottom-0 transform translate-y-1/4 z-10`}>
                  <img
                    src={getTeamLogo(gameData.awayTeam.displayName)}
                    alt={gameData.awayTeam.displayName}
                    width={isTablet ? 80 : 120}
                    height={isTablet ? 80 : 120}
                    className="object-contain drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
                  />
                </div>
              )}
              <div className="flex items-center gap-2 md:gap-8">
                {/* Logo for mobile */}
                {isMobile && (
                  <img
                    src={getTeamLogo(gameData.awayTeam.displayName)}
                    alt={gameData.awayTeam.displayName}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                )}
                {/* White outline/stroke effect */}
                <div className={isMobile ? '' : isTablet ? 'ml-20' : 'ml-32'}>
                  <img
                    src={getTeamWordmark(gameData.awayTeam.displayName)}
                    alt={gameData.awayTeam.displayName}
                    width={isMobile ? 60 : isTablet ? 100 : 140}
                    height={isMobile ? 20 : isTablet ? 32 : 45}
                    className="object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 0 2px white) drop-shadow(0 0 2px white) drop-shadow(0 0 3px white) drop-shadow(0 0 4px white) drop-shadow(0 0 5px white)' 
                    }}
                  />
                </div>
              </div>
              {/* Score overlapping - right side */}
              <div 
                className={`absolute ${isMobile ? 'right-2' : 'right-6'} bottom-0 transform translate-y-1/3 z-10`}
              >
                <div 
                  className={`${isMobile ? 'text-3xl px-2 py-1' : isTablet ? 'text-4xl px-3 py-1' : 'text-6xl px-4 py-2'} font-black text-white bg-black/30 rounded-lg`}
                  style={{ 
                    textShadow: '0 0 3px black, 0 0 5px black, 0 0 8px black, 0 0 3px white, 0 2px 10px rgba(0,0,0,0.8)',
                    WebkitTextStroke: isMobile ? '1px black' : '2px black'
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
                className={`absolute ${isMobile ? 'left-2' : 'left-6'} bottom-0 transform translate-y-1/3 z-10`}
              >
                <div 
                  className={`${isMobile ? 'text-3xl px-2 py-1' : isTablet ? 'text-4xl px-3 py-1' : 'text-6xl px-4 py-2'} font-black text-white bg-black/30 rounded-lg`}
                  style={{ 
                    textShadow: '0 0 3px black, 0 0 5px black, 0 0 8px black, 0 0 3px white, 0 2px 10px rgba(0,0,0,0.8)',
                    WebkitTextStroke: isMobile ? '1px black' : '2px black'
                  }}
                >
                  {gameData.homeTeam.score}
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-8">
                {/* White outline/stroke effect */}
                <div className={isMobile ? '' : isTablet ? 'mr-20' : 'mr-32'}>
                  <img
                    src={getTeamWordmark(gameData.homeTeam.displayName)}
                    alt={gameData.homeTeam.displayName}
                    width={isMobile ? 60 : isTablet ? 100 : 140}
                    height={isMobile ? 20 : isTablet ? 32 : 45}
                    className="object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 0 2px white) drop-shadow(0 0 2px white) drop-shadow(0 0 3px white) drop-shadow(0 0 4px white) drop-shadow(0 0 5px white)' 
                    }}
                  />
                </div>
                {/* Logo for mobile */}
                {isMobile && (
                  <img
                    src={getTeamLogo(gameData.homeTeam.displayName)}
                    alt={gameData.homeTeam.displayName}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                )}
              </div>
              {/* Large Logo Overlapping */}
              {!isMobile && (
                <div className={`absolute ${isTablet ? 'right-4' : 'right-8'} bottom-0 transform translate-y-1/4 z-10`}>
                  <img
                    src={getTeamLogo(gameData.homeTeam.displayName)}
                    alt={gameData.homeTeam.displayName}
                    width={isTablet ? 80 : 120}
                    height={isTablet ? 80 : 120}
                    className="object-contain drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Grid Area with Team Labels */}
          <div className={`flex-1 flex items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
            <div className="flex flex-col">
              {/* Horizontal Team Bar (Home Team - Right Above Grid) */}
              <div className="flex">
                {/* Empty space to align with vertical bar */}
                <div style={{ width: isMobile ? '30px' : isTablet ? '40px' : '50px', height: isMobile ? '30px' : isTablet ? '40px' : '50px' }}></div>
                <div 
                  className="flex items-center justify-center"
                  style={{ 
                    backgroundColor: homeColors.primary, 
                    width: isMobile ? 'calc(100vw - 64px)' : isTablet ? '480px' : '640px',
                    maxWidth: isMobile ? '360px' : isTablet ? '480px' : '640px',
                    height: isMobile ? '30px' : isTablet ? '40px' : '50px'
                  }}
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <img
                      src={getTeamLogo(gameData.homeTeam.displayName)}
                      alt={gameData.homeTeam.displayName}
                      width={isMobile ? 20 : isTablet ? 28 : 35}
                      height={isMobile ? 20 : isTablet ? 28 : 35}
                    />
                    <div className={`${isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-base'} font-bold text-white tracking-wide`}>
                      {isMobile ? gameData.homeTeam.abbreviation : gameData.homeTeam.displayName.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid with Vertical Team on Left */}
              <div className="flex">
                {/* Vertical Team Label (Left of Grid) */}
                <div 
                  className="flex items-center justify-center"
                  style={{ 
                    backgroundColor: awayColors.primary, 
                    height: isMobile ? 'calc(100vw - 64px)' : isTablet ? '480px' : '640px',
                    maxHeight: isMobile ? '360px' : isTablet ? '480px' : '640px',
                    width: isMobile ? '30px' : isTablet ? '40px' : '50px'
                  }}
                >
                  <div 
                    className="flex items-center gap-1 md:gap-2" 
                    style={{ 
                      transform: 'rotate(-90deg)', 
                      width: isMobile ? 'calc(100vw - 64px)' : isTablet ? '480px' : '640px',
                      maxWidth: isMobile ? '360px' : isTablet ? '480px' : '640px',
                      height: isMobile ? '30px' : isTablet ? '40px' : '50px'
                    }}
                  >
                    <img
                      src={getTeamLogo(gameData.awayTeam.displayName)}
                      alt={gameData.awayTeam.displayName}
                      width={isMobile ? 20 : isTablet ? 28 : 35}
                      height={isMobile ? 20 : isTablet ? 28 : 35}
                    />
                    <div className={`${isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-base'} font-bold text-white tracking-wide whitespace-nowrap`}>
                      {isMobile ? gameData.awayTeam.abbreviation : gameData.awayTeam.displayName.toUpperCase()}
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
        <div className={`${isMobile ? 'w-full border-t' : 'w-64 border-l'} bg-card border-border p-4 overflow-y-auto ${isMobile ? 'max-h-96' : ''}`}>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
            <div>
              <h3 className="text-xs md:text-sm font-bold mb-2">Board Info</h3>
              <div className="text-xs space-y-1">
                <div>Cost: {formatCurrency(board.costPerSquare)} per square</div>
                <div>Status: <span className="capitalize">{board.status}</span></div>
                <div>Finalized: {board.isFinalized ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-bold mb-2">Game Status</h3>
              <div className="text-xs space-y-1">
                <div>Quarter: {gameData.status.period}</div>
                <div>Clock: {gameData.status.clock}</div>
                <div>Status: {gameData.status.detail}</div>
              </div>
            </div>

            <div className={isMobile ? 'col-span-2' : ''}>
              <h3 className="text-xs md:text-sm font-bold mb-2">Payouts</h3>
              <div className="text-xs space-y-1">
                <div>Q1: {board.payoutQ1}% - {formatCurrency(totalPot * board.payoutQ1 / 100)}</div>
                <div>Q2: {board.payoutQ2}% - {formatCurrency(totalPot * board.payoutQ2 / 100)}</div>
                <div>Q3: {board.payoutQ3}% - {formatCurrency(totalPot * board.payoutQ3 / 100)}</div>
                <div>Q4: {board.payoutQ4}% - {formatCurrency(totalPot * board.payoutQ4 / 100)}</div>
              </div>
            </div>

            {currentQuarterWinner && (
              <div className={`p-3 bg-primary/10 border border-primary rounded ${isMobile ? 'col-span-2' : ''}`}>
                <h3 className="text-xs md:text-sm font-bold mb-1 text-primary">Current Winner</h3>
                <div className="text-xs">
                  <div className="font-bold">{currentQuarterWinner.playerName}</div>
                  <div>Q{currentQuarterWinner.quarter}</div>
                  <div>{formatCurrency(currentQuarterWinner.payout)}</div>
                </div>
              </div>
            )}

            {board.winners.length > 0 && (
              <div className={isMobile ? 'col-span-2' : ''}>
                <h3 className="text-xs md:text-sm font-bold mb-2">All Winners</h3>
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
