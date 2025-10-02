import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRandomNumbers } from '@/lib/utils';

/**
 * GET - Get all boards (optionally filter by status)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    // Handle comma-separated status values
    const statusFilter = statusParam
      ? { status: { in: statusParam.split(',') } }
      : undefined;

    const boards = await prisma.board.findMany({
      where: statusFilter,
      include: {
        squares: true,
        paymentConfig: true,
        winners: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ boards });
  } catch (error) {
    console.error('Get boards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create new board
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      name,
      gameId,
      teamHome,
      teamAway,
      costPerSquare,
      payoutQ1,
      payoutQ2,
      payoutQ3,
      payoutQ4,
      paypalUsername,
      venmoUsername,
      allowCash,
      allowPaypal,
      allowVenmo,
    } = data;

    // Validate payouts add up to 100
    const totalPayout = payoutQ1 + payoutQ2 + payoutQ3 + payoutQ4;
    if (Math.abs(totalPayout - 100) > 0.01) {
      return NextResponse.json(
        { error: 'Payouts must add up to 100%' },
        { status: 400 }
      );
    }

    // Create board with payment config
    const board = await prisma.board.create({
      data: {
        name,
        gameId,
        teamHome,
        teamAway,
        costPerSquare: parseFloat(costPerSquare),
        payoutQ1: parseFloat(payoutQ1),
        payoutQ2: parseFloat(payoutQ2),
        payoutQ3: parseFloat(payoutQ3),
        payoutQ4: parseFloat(payoutQ4),
        status: 'open',
        paymentConfig: {
          create: {
            paypalUsername,
            venmoUsername,
            allowCash: allowCash !== undefined ? allowCash : true,
            allowPaypal: allowPaypal !== undefined ? allowPaypal : true,
            allowVenmo: allowVenmo !== undefined ? allowVenmo : true,
          },
        },
      },
      include: {
        paymentConfig: true,
      },
    });

    return NextResponse.json({ board });
  } catch (error) {
    console.error('Create board error:', error);
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    );
  }
}
