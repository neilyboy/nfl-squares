'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BoardView } from '@/components/board-view';
import { PinEntryDialog } from '@/components/pin-entry-dialog';
import { ChevronLeft, ChevronRight, ShoppingCart, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { calculateTotalPot, getLastDigit } from '@/lib/utils';
import { useResponsive } from '@/lib/use-responsive';

interface Board {
  id: string;
  name: string;
  gameId: string;
  teamHome: string;
  teamAway: string;
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

export default function HomePage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const [gameData, setGameData] = useState<Record<string, GameData>>({});
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isMobile } = useResponsive();

  useEffect(() => {
    checkSetup();
    fetchBoards();
  }, []);

  useEffect(() => {
    if (boards.length === 0) return;

    // Fetch game data for all active boards
    boards.forEach((board) => {
      fetchGameData(board.gameId);
    });

    // Set up polling for live games
    const interval = setInterval(() => {
      boards.forEach((board) => {
        fetchGameData(board.gameId);
      });
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [boards]);

  useEffect(() => {
    if (!autoRotate || boards.length <= 1 || isModalOpen) return;

    const interval = setInterval(() => {
      setCurrentBoardIndex((prev) => (prev + 1) % boards.length);
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [autoRotate, boards.length, isModalOpen]);

  const checkSetup = async () => {
    try {
      const response = await fetch('/api/admin/setup');
      const data = await response.json();
      setSetupComplete(data.setupComplete);
      
      if (!data.setupComplete) {
        router.push('/setup');
      }
    } catch (error) {
      console.error('Setup check error:', error);
    }
  };

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/boards?status=open,closed,live');
      const data = await response.json();
      setBoards(data.boards || []);
    } catch (error) {
      console.error('Fetch boards error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load boards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGameData = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      const data = await response.json();
      if (data.game) {
        setGameData((prev) => ({ ...prev, [gameId]: data.game }));
      }
    } catch (error) {
      console.error('Fetch game data error:', error);
    }
  };

  const handleAdminSuccess = () => {
    router.push('/admin');
  };

  const handleBuySquare = () => {
    router.push('/buy');
  };

  const handlePrevBoard = () => {
    setCurrentBoardIndex((prev) => (prev - 1 + boards.length) % boards.length);
    // Pause auto-rotation temporarily, then resume after 30 seconds
    setAutoRotate(false);
    setTimeout(() => setAutoRotate(true), 30000);
  };

  const handleNextBoard = () => {
    setCurrentBoardIndex((prev) => (prev + 1) % boards.length);
    // Pause auto-rotation temporarily, then resume after 30 seconds
    setAutoRotate(false);
    setTimeout(() => setAutoRotate(true), 30000);
  };

  const getCurrentPotentialWinner = (board: Board, game: GameData) => {
    if (!board.isFinalized || !board.rowNumbers || !board.colNumbers) return null;
    if (game.status.state !== 'in') return null;

    const homeLastDigit = getLastDigit(game.homeTeam.score);
    const awayLastDigit = getLastDigit(game.awayTeam.score);

    const rowNumbers = JSON.parse(board.rowNumbers);
    const colNumbers = JSON.parse(board.colNumbers);

    const winningRow = rowNumbers.indexOf(awayLastDigit);
    const winningCol = colNumbers.indexOf(homeLastDigit);

    return { row: winningRow, col: winningCol };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">🏈 NFL Squares</h1>
          <p className="text-muted-foreground mb-8">
            No active boards at the moment. Check back later or contact the admin.
          </p>
          <Button
            size="lg"
            onClick={() => setShowAdminDialog(true)}
            className="gap-2"
          >
            <Lock className="w-5 h-5" />
            Admin Login
          </Button>
        </div>

        <PinEntryDialog
          open={showAdminDialog}
          onOpenChange={setShowAdminDialog}
          onSuccess={handleAdminSuccess}
          allowPasswordReset
        />
      </div>
    );
  }

  const currentBoard = boards[currentBoardIndex];
  const currentGame = gameData[currentBoard.gameId];
  const potentialWinner = currentGame
    ? getCurrentPotentialWinner(currentBoard, currentGame)
    : null;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Board Navigation Overlay (if multiple boards) - Bottom Left */}
      {boards.length > 1 && (
        <div className="absolute bottom-2 left-2 md:bottom-16 md:left-4 z-50">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 md:px-3 py-1 md:py-2 shadow-lg">
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size={isMobile ? "icon" : "sm"}
                onClick={handlePrevBoard}
                className={isMobile ? "h-8 w-8" : "gap-1 h-8"}
              >
                <ChevronLeft className="w-4 h-4" />
                {!isMobile && "Prev"}
              </Button>
              <div className="text-center px-1 md:px-2">
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {isMobile ? `${currentBoardIndex + 1}/${boards.length}` : `Board ${currentBoardIndex + 1} of ${boards.length}`}
                </div>
              </div>
              <Button
                variant="ghost"
                size={isMobile ? "icon" : "sm"}
                onClick={handleNextBoard}
                className={isMobile ? "h-8 w-8" : "gap-1 h-8"}
              >
                {!isMobile && "Next"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin & Buy Square Buttons - Bottom Center */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 md:bottom-16 md:left-auto md:right-72 md:transform-none z-50 flex gap-1 md:gap-2">
        <Button
          size={isMobile ? "default" : "lg"}
          onClick={() => router.push('/buy')}
          className={isMobile ? "gap-1 text-sm px-3" : "gap-2"}
          disabled={currentBoard.status !== 'open'}
        >
          <ShoppingCart className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          Buy {isMobile ? "" : "Square"}
        </Button>
        <Button
          size={isMobile ? "default" : "lg"}
          variant="outline"
          onClick={() => setShowAdminDialog(true)}
          className={isMobile ? "gap-1 text-sm px-3" : "gap-2"}
        >
          <Lock className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          Admin
        </Button>
      </div>

      {/* Main Board View */}
      <BoardView
        board={currentBoard}
        gameData={currentGame}
        potentialWinner={potentialWinner}
        onModalStateChange={setIsModalOpen}
      />

      {/* Admin Dialog */}
      <PinEntryDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
        onSuccess={handleAdminSuccess}
        allowPasswordReset
      />
    </div>
  );
}
