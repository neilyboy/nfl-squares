import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET - Export all data as backup
 */
export async function GET() {
  try {
    const [adminSettings, boards, squares, winners, paymentConfigs] =
      await Promise.all([
        prisma.adminSettings.findMany(),
        prisma.board.findMany(),
        prisma.square.findMany(),
        prisma.winner.findMany(),
        prisma.paymentConfig.findMany(),
      ]);

    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      data: {
        adminSettings,
        boards,
        squares,
        winners,
        paymentConfigs,
      },
    };

    return NextResponse.json(backup);
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

/**
 * POST - Restore from backup
 */
export async function POST(request: Request) {
  try {
    const backup = await request.json();

    if (!backup.data) {
      return NextResponse.json(
        { error: 'Invalid backup format' },
        { status: 400 }
      );
    }

    // Clear existing data (except admin settings if not in backup)
    await prisma.square.deleteMany();
    await prisma.winner.deleteMany();
    await prisma.paymentConfig.deleteMany();
    await prisma.board.deleteMany();

    // Restore data
    const { boards, squares, winners, paymentConfigs } = backup.data;

    // Restore boards
    if (boards && boards.length > 0) {
      await prisma.board.createMany({
        data: boards,
      });
    }

    // Restore payment configs
    if (paymentConfigs && paymentConfigs.length > 0) {
      await prisma.paymentConfig.createMany({
        data: paymentConfigs,
      });
    }

    // Restore squares
    if (squares && squares.length > 0) {
      await prisma.square.createMany({
        data: squares,
      });
    }

    // Restore winners
    if (winners && winners.length > 0) {
      await prisma.winner.createMany({
        data: winners,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Backup restored successfully',
    });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}
