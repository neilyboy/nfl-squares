'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Square {
  id: string;
  row: number;
  col: number;
  playerName: string | null;
  paymentMethod: string | null;
  isPaid: boolean;
}

interface SquaresGridProps {
  squares: Square[];
  rowNumbers?: number[] | null;
  colNumbers?: number[] | null;
  showNumbers?: boolean;
  onSquareClick?: (row: number, col: number) => void;
  highlightSquare?: { row: number; col: number } | null;
  highlightSquares?: Array<{ row: number; col: number }>;
  winningSquare?: { row: number; col: number } | null;
  potentialWinningSquare?: { row: number; col: number } | null;
  readOnly?: boolean;
  teamHomeAbbr?: string;
  teamAwayAbbr?: string;
  teamHomeColor?: string;
  teamAwayColor?: string;
  onModalStateChange?: (isOpen: boolean) => void;
}

export function SquaresGrid({
  squares,
  rowNumbers,
  colNumbers,
  showNumbers = false,
  onSquareClick,
  highlightSquare,
  highlightSquares = [],
  winningSquare,
  potentialWinningSquare,
  readOnly = false,
  teamHomeAbbr = 'HOME',
  teamAwayAbbr = 'AWAY',
  teamHomeColor = '#1e40af',
  teamAwayColor = '#dc2626',
  onModalStateChange,
}: SquaresGridProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Notify parent when modal state changes
  React.useEffect(() => {
    onModalStateChange?.(selectedSquare !== null);
  }, [selectedSquare, onModalStateChange]);

  const getSquare = (row: number, col: number): Square | undefined => {
    return squares.find((s) => s.row === row && s.col === col);
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return parts.map(p => p[0]).join('').toUpperCase().substring(0, 3);
  };

  const isSquareTaken = (row: number, col: number): boolean => {
    const square = getSquare(row, col);
    return !!square && !!square.playerName;
  };

  const isWinningSquare = (row: number, col: number): boolean => {
    return winningSquare?.row === row && winningSquare?.col === col;
  };

  const isPotentialWinningSquare = (row: number, col: number): boolean => {
    return (
      potentialWinningSquare?.row === row && potentialWinningSquare?.col === col
    );
  };
  const isHighlightedSquare = (row: number, col: number): boolean => {
    // Check single highlight first (for backward compatibility)
    if (highlightSquare?.row === row && highlightSquare?.col === col) {
      return true;
    }
    // Check multiple highlights
    return highlightSquares.some(s => s.row === row && s.col === col);
  };

  const handleSquareClick = (row: number, col: number) => {
    const square = getSquare(row, col);
    
    // If square is taken, show details
    if (square && square.playerName) {
      setSelectedSquare(square);
      return;
    }
    
    // If not taken and not readonly, allow selection
    if (!readOnly && !isSquareTaken(row, col) && onSquareClick) {
      onSquareClick(row, col);
    }
  };

  const getPaymentIcon = (paymentMethod: string | null) => {
    if (!paymentMethod) return null;
    
    switch (paymentMethod.toLowerCase()) {
      case 'paypal':
        return '💳';
        return '💵';
      case 'cash':
        return '💰';
      default:
        return '💳';
    }
  };

  return (
    <div style={{ width: '640px', height: '640px' }} className="mx-auto">
      <div className="grid grid-cols-11 gap-0.5 text-xs h-full" style={{ gridTemplateRows: 'repeat(11, 1fr)' }}>
        {/* Top-left corner cell */}
        <div className="aspect-square flex items-center justify-center bg-secondary/50 border border-border rounded-tl-lg">
        </div>

        {/* Top row - column numbers (home team) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
          <div
            key={`col-${col}`}
            className="aspect-square flex items-center justify-center border border-border font-bold text-lg text-white"
            style={{ backgroundColor: teamHomeColor }}
          >
            {showNumbers && colNumbers ? colNumbers[col] : '?'}
          </div>
        ))}

        {/* Rows with left column numbers (away team) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
          <React.Fragment key={`row-${row}`}>
            {/* Left column number */}
            <div 
              className="aspect-square flex items-center justify-center border border-border font-bold text-lg text-white"
              style={{ backgroundColor: teamAwayColor }}
            >
              {showNumbers && rowNumbers ? rowNumbers[row] : '?'}
            </div>

            {/* Grid cells */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => {
              const square = getSquare(row, col);
              const taken = isSquareTaken(row, col);
              const winner = isWinningSquare(row, col);
              const potential = isPotentialWinningSquare(row, col);
              const highlighted = isHighlightedSquare(row, col);

              return (
                <div
                  key={`${row}-${col}`}
                  className={cn(
                    'grid-cell text-xs sm:text-sm relative group',
                    {
                      'cursor-pointer hover:bg-accent': !readOnly && !taken,
                      'cursor-not-allowed': readOnly || taken,
                      'bg-secondary': taken,
                      'winner': winner,
                      'potential-winner': potential && !winner,
                      'ring-2 ring-primary': highlighted,
                    }
                  )}
                  onClick={() => handleSquareClick(row, col)}
                >
                  {taken && square && (
                    <div className="flex flex-col items-center justify-center text-center w-full h-full cursor-pointer hover:bg-secondary/80 transition-colors">
                      <div className="font-bold text-sm">
                        {getInitials(square.playerName!)}
                      </div>
                      {square.isPaid && (
                        <div className="text-xs mt-0.5">
                          {getPaymentIcon(square.paymentMethod)}
                        </div>
                      )}
                    </div>
                  )}
                  {!taken && !readOnly && (
                    <div className="text-muted-foreground text-xs">
                      {row},{col}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Square Details Modal */}
      {selectedSquare && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedSquare(null)}
        >
          <div 
            className="bg-card border border-border rounded-lg p-6 shadow-xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Square Details</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Player</div>
                <div className="font-semibold text-lg">{selectedSquare.playerName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Position</div>
                <div className="font-semibold">Row {selectedSquare.row + 1}, Column {selectedSquare.col + 1}</div>
              </div>
              {selectedSquare.paymentMethod && (
                <div>
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="font-semibold capitalize">{selectedSquare.paymentMethod}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Payment Status</div>
                <div className={`font-semibold ${selectedSquare.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {selectedSquare.isPaid ? '✓ Paid' : 'Pending'}
                </div>
              </div>
            </div>
            <button
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-semibold"
              onClick={() => setSelectedSquare(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
