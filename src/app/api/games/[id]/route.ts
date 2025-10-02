import { NextResponse } from 'next/server';
import { getGameById } from '@/lib/espn-api';

/**
 * GET - Get single game data by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const game = await getGameById(params.id);

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Get game error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}
