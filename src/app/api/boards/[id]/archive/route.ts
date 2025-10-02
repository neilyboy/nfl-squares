import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST - Archive board
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const board = await prisma.board.update({
      where: { id: params.id },
      data: { status: 'archived' },
    });

    return NextResponse.json({ board });
  } catch (error) {
    console.error('Archive board error:', error);
    return NextResponse.json(
      { error: 'Failed to archive board' },
      { status: 500 }
    );
  }
}
