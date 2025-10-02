import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyCredential } from '@/lib/auth';

/**
 * POST - Verify admin PIN
 */
export async function POST(request: Request) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json(
        { error: 'PIN is required' },
        { status: 400 }
      );
    }

    const adminSettings = await prisma.adminSettings.findFirst({
      where: { id: 1 },
    });

    if (!adminSettings) {
      return NextResponse.json(
        { error: 'Admin not configured' },
        { status: 400 }
      );
    }

    const isValid = await verifyCredential(pin, adminSettings.pin);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'PIN verified successfully',
    });
  } catch (error) {
    console.error('PIN verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify PIN' },
      { status: 500 }
    );
  }
}
