import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getLastDigit, calculateQuarterPayout } from '@/lib/utils';

/**
 * POST - Record winner for a quarter
 */
export async function POST(request: Request) {
  try {
    const { boardId, quarter, scoreHome, scoreAway } = await request.json();

    // Get board with squares
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { squares: true },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    if (!board.isFinalized || !board.rowNumbers || !board.colNumbers) {
      return NextResponse.json(
        { error: 'Board not finalized' },
        { status: 400 }
      );
    }

    // Get last digits
    const homeLastDigit = getLastDigit(scoreHome);
    const awayLastDigit = getLastDigit(scoreAway);

    // Parse numbers
    const rowNumbers = JSON.parse(board.rowNumbers);
    const colNumbers = JSON.parse(board.colNumbers);

    // Find winning row and col
    const winningRow = rowNumbers.indexOf(awayLastDigit);
    const winningCol = colNumbers.indexOf(homeLastDigit);

    // Find winning square
    const winningSquare = board.squares.find(
      (s) => s.row === winningRow && s.col === winningCol
    );

    if (!winningSquare || !winningSquare.playerName) {
      return NextResponse.json(
        { error: 'No winner found for this square' },
        { status: 404 }
      );
    }

    // Calculate payout
    const payoutPercentage =
      quarter === 1
        ? board.payoutQ1
        : quarter === 2
        ? board.payoutQ2
        : quarter === 3
        ? board.payoutQ3
        : board.payoutQ4;

    const payout = calculateQuarterPayout(board.costPerSquare, payoutPercentage);

    // Create or update winner
    const winner = await prisma.winner.upsert({
      where: {
        boardId_quarter: {
          boardId,
          quarter,
        },
      },
      update: {
        playerName: winningSquare.playerName,
        scoreHome,
        scoreAway,
        payout,
      },
      create: {
        boardId,
        quarter,
        playerName: winningSquare.playerName,
        scoreHome,
        scoreAway,
        payout,
      },
    });

    return NextResponse.json({ winner });
  } catch (error) {
    console.error('Record winner error:', error);
    return NextResponse.json(
      { error: 'Failed to record winner' },
      { status: 500 }
    );
  }
}
