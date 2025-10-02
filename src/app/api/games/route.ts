import { NextResponse } from 'next/server';
import { getUpcomingGames } from '@/lib/espn-api';

/**
 * GET - Get upcoming NFL games
 */
export async function GET() {
  try {
    const games = await getUpcomingGames();

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Get games error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
