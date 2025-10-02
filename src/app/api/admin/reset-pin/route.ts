import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyCredential, hashCredential, isValidPin } from '@/lib/auth';

/**
 * POST - Reset PIN using password
 */
export async function POST(request: Request) {
  try {
    const { password, newPin } = await request.json();

    if (!password || !newPin) {
      return NextResponse.json(
        { error: 'Password and new PIN are required' },
        { status: 400 }
      );
    }

    if (!isValidPin(newPin)) {
      return NextResponse.json(
        { error: 'PIN must be 4 or 6 digits' },
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

    const isValidPassword = await verifyCredential(
      password,
      adminSettings.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const hashedPin = await hashCredential(newPin);

    await prisma.adminSettings.update({
      where: { id: 1 },
      data: { pin: hashedPin },
    });

    return NextResponse.json({
      success: true,
      message: 'PIN reset successfully',
    });
  } catch (error) {
    console.error('PIN reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset PIN' },
      { status: 500 }
    );
  }
}
