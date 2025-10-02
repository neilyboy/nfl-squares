'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  List, 
  Archive, 
  Download, 
  Upload,
  ArrowLeft 
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeBoards: 0,
    totalSquaresSold: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/boards');
      const data = await response.json();
      
      const activeBoards = data.boards?.filter(
        (b: any) => b.status === 'open' || b.status === 'live'
      ).length || 0;

      const totalSquaresSold = data.boards?.reduce(
        (sum: number, board: any) =>
          sum + board.squares.filter((s: any) => s.playerName).length,
        0
      ) || 0;

      const totalRevenue = data.boards?.reduce(
        (sum: number, board: any) =>
          sum +
          board.squares.filter((s: any) => s.playerName).length *
            board.costPerSquare,
        0
      ) || 0;

      setStats({ activeBoards, totalSquaresSold, totalRevenue });
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleBackup = async () => {
    try {
      const response = await fetch('/api/backup');
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nfl-squares-backup-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Backup error:', error);
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const backup = JSON.parse(text);

        const response = await fetch('/api/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backup),
        });

        if (response.ok) {
          alert('Backup restored successfully');
          fetchStats();
        } else {
          alert('Failed to restore backup');
        }
      } catch (error) {
        console.error('Restore error:', error);
        alert('Failed to restore backup');
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">Active Boards</div>
            <div className="text-4xl font-bold text-primary">
              {stats.activeBoards}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Squares Sold
            </div>
            <div className="text-4xl font-bold text-primary">
              {stats.totalSquaresSold}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Total Revenue
            </div>
            <div className="text-4xl font-bold text-primary">
              ${stats.totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            size="lg"
            onClick={() => router.push('/admin/boards/new')}
            className="h-32 text-lg"
          >
            <PlusCircle className="w-8 h-8 mr-3" />
            Create New Board
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/admin/boards')}
            className="h-32 text-lg"
          >
            <List className="w-8 h-8 mr-3" />
            Manage Boards
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/admin/boards?status=archived')}
            className="h-32 text-lg"
          >
            <Archive className="w-8 h-8 mr-3" />
            View Archives
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleBackup}
            className="h-32 text-lg"
          >
            <Download className="w-8 h-8 mr-3" />
            Backup Data
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleRestore}
            className="h-32 text-lg"
          >
            <Upload className="w-8 h-8 mr-3" />
            Restore Data
          </Button>
        </div>
      </div>
    </div>
  );
}
