import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST - Claim a square (with race condition handling)
 */
export async function POST(request: Request) {
  try {
    const { boardId, row, col, playerName, paymentMethod } = await request.json();

    // Validate inputs
    if (!boardId || row === undefined || col === undefined || !playerName || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (row < 0 || row > 9 || col < 0 || col > 9) {
      return NextResponse.json(
        { error: 'Invalid square coordinates' },
        { status: 400 }
      );
    }

    // Check if board exists and is open
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    if (board.status !== 'open') {
      return NextResponse.json(
        { error: 'Board is not accepting new squares' },
        { status: 400 }
      );
    }

    // Try to create the square (will fail if already exists due to unique constraint)
    try {
      const square = await prisma.square.create({
        data: {
          boardId,
          row,
          col,
          playerName,
          paymentMethod,
          isPaid: false,
        },
      });

      return NextResponse.json({ square });
    } catch (error: any) {
      // Check if it's a unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'This square has already been claimed. Please select another.' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Create square error:', error);
    return NextResponse.json(
      { error: 'Failed to claim square' },
      { status: 500 }
    );
  }
}
