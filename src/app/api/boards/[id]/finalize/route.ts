import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRandomNumbers } from '@/lib/utils';

/**
 * POST - Finalize board (generate random numbers)
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const board = await prisma.board.findUnique({
      where: { id: params.id },
      include: { squares: true },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    if (board.isFinalized) {
      return NextResponse.json(
        { error: 'Board already finalized' },
        { status: 400 }
      );
    }

    // Generate random numbers for rows and columns
    const rowNumbers = generateRandomNumbers();
    const colNumbers = generateRandomNumbers();

    const updatedBoard = await prisma.board.update({
      where: { id: params.id },
      data: {
        isFinalized: true,
        status: 'closed',
        rowNumbers: JSON.stringify(rowNumbers),
        colNumbers: JSON.stringify(colNumbers),
      },
      include: {
        squares: true,
        paymentConfig: true,
      },
    });

    return NextResponse.json({ board: updatedBoard });
  } catch (error) {
    console.error('Finalize board error:', error);
    return NextResponse.json(
      { error: 'Failed to finalize board' },
      { status: 500 }
    );
  }
}
