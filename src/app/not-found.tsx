'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-24 h-24 text-red-500" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-6">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
