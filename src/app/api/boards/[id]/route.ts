import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET - Get single board by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const board = await prisma.board.findUnique({
      where: { id: params.id },
      include: {
        squares: true,
        paymentConfig: true,
        winners: true,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ board });
  } catch (error) {
    console.error('Get board error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch board' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update board
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const board = await prisma.board.update({
      where: { id: params.id },
      data,
      include: {
        squares: true,
        paymentConfig: true,
      },
    });

    return NextResponse.json({ board });
  } catch (error) {
    console.error('Update board error:', error);
    return NextResponse.json(
      { error: 'Failed to update board' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete board
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.board.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Board deleted successfully',
    });
  } catch (error) {
    console.error('Delete board error:', error);
    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    );
  }
}
