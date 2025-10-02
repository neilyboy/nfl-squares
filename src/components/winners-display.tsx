'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Trophy } from 'lucide-react';

interface Winner {
  quarter: number;
  playerName: string;
  scoreHome: number;
  scoreAway: number;
  payout: number;
}

interface WinnersDisplayProps {
  winners: Winner[];
  currentQuarter?: number;
}

export function WinnersDisplay({ winners, currentQuarter }: WinnersDisplayProps) {
  const quarters = [1, 2, 3, 4];

  const getWinnerForQuarter = (quarter: number) => {
    return winners.find((w) => w.quarter === quarter);
  };

  const isCurrentQuarter = (quarter: number) => {
    return quarter === currentQuarter;
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Quarter Winners</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quarters.map((quarter) => {
          const winner = getWinnerForQuarter(quarter);
          const isCurrent = isCurrentQuarter(quarter);

          return (
            <div
              key={quarter}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                winner
                  ? 'border-primary bg-primary/10'
                  : isCurrent
                  ? 'border-primary/50 bg-primary/5 animate-pulse'
                  : 'border-border bg-secondary/20'
              }`}
            >
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Quarter {quarter}
                {isCurrent && !winner && (
                  <span className="ml-2 text-primary text-xs">(In Progress)</span>
                )}
              </div>

              {winner ? (
                <>
                  <div className="flex items-start gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="font-bold text-lg break-words">
                      {winner.playerName}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Score: {winner.scoreAway} - {winner.scoreHome}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(winner.payout)}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">🏈</div>
                  <div className="text-sm text-muted-foreground">
                    {isCurrent ? 'TBD' : 'Not played'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
