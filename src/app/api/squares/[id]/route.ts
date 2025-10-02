import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * PATCH - Update square (admin only - mark as paid, etc.)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const square = await prisma.square.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ square });
  } catch (error) {
    console.error('Update square error:', error);
    return NextResponse.json(
      { error: 'Failed to update square' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete square (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.square.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Square deleted successfully',
    });
  } catch (error) {
    console.error('Delete square error:', error);
    return NextResponse.json(
      { error: 'Failed to delete square' },
      { status: 500 }
    );
  }
}
