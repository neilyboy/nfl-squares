'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  boardName: string;
  homeTeam: {
    name: string;
    abbreviation: string;
    score: number;
    logo?: string;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
    score: number;
    logo?: string;
  };
  gameStatus: {
    period: number;
    clock: string;
    state: 'pre' | 'in' | 'post';
    detail: string;
  };
  totalPot?: number;
  className?: string;
}

export function GameHeader({
  boardName,
  homeTeam,
  awayTeam,
  gameStatus,
  totalPot,
  className,
}: GameHeaderProps) {
  const getStatusBadge = () => {
    if (gameStatus.state === 'in') {
      return (
        <div className="status-badge live">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      );
    } else if (gameStatus.state === 'pre') {
      return <div className="status-badge open">UPCOMING</div>;
    } else {
      return <div className="status-badge completed">FINAL</div>;
    }
  };

  const getQuarterDisplay = () => {
    if (gameStatus.state === 'pre') return gameStatus.detail;
    if (gameStatus.state === 'post') return 'FINAL';
    
    const quarterNames = ['', '1st', '2nd', '3rd', '4th', 'OT'];
    return `${quarterNames[gameStatus.period] || 'Q' + gameStatus.period} - ${gameStatus.clock}`;
  };

  return (
    <div className={cn('w-full bg-card border-b border-border', className)}>
      <div className="container mx-auto p-4">
        {/* Board name and pot */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{boardName}</h1>
          {totalPot !== undefined && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Pot</div>
              <div className="text-xl sm:text-2xl font-bold text-primary">
                ${totalPot.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Game info */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Away Team */}
          <div className="flex items-center justify-end gap-3">
            <div className="text-right">
              <div className="text-lg sm:text-xl font-semibold">
                {awayTeam.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {awayTeam.abbreviation}
              </div>
            </div>
            {awayTeam.logo && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Image
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="text-4xl sm:text-5xl font-bold">
              {awayTeam.score}
            </div>
          </div>

          {/* Center - Status */}
          <div className="flex flex-col items-center gap-2 px-4">
            {getStatusBadge()}
            <div className="text-sm text-center text-muted-foreground whitespace-nowrap">
              {getQuarterDisplay()}
            </div>
          </div>

          {/* Home Team */}
          <div className="flex items-center gap-3">
            <div className="text-4xl sm:text-5xl font-bold">
              {homeTeam.score}
            </div>
            {homeTeam.logo && (
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <Image
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="text-left">
              <div className="text-lg sm:text-xl font-semibold">
                {homeTeam.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {homeTeam.abbreviation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
