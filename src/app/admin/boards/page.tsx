'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  Trash2,
  CheckCircle,
  Archive,
  Eye,
} from 'lucide-react';

interface Board {
  id: string;
  name: string;
  gameId: string;
  teamHome: string;
  teamAway: string;
  costPerSquare: number;
  status: string;
  isFinalized: boolean;
  squares: any[];
  createdAt: string;
}

export default function ManageBoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const statusFilter = searchParams.get('status');

  useEffect(() => {
    fetchBoards();
  }, [statusFilter]);

  const fetchBoards = async () => {
    try {
      const url = statusFilter
        ? `/api/boards?status=${statusFilter}`
        : '/api/boards';
      const response = await fetch(url);
      const data = await response.json();
      setBoards(data.boards || []);
    } catch (error) {
      console.error('Fetch boards error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load boards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (boardId: string) => {
    if (!confirm('Are you sure you want to delete this board?')) return;

    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Board deleted successfully',
        });
        fetchBoards();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete board',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete board',
        variant: 'destructive',
      });
    }
  };

  const handleFinalize = async (boardId: string) => {
    if (!confirm('Are you sure you want to finalize this board? Numbers will be revealed.')) return;

    try {
      const response = await fetch(`/api/boards/${boardId}/finalize`, {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Board finalized successfully',
        });
        fetchBoards();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to finalize board',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to finalize board',
        variant: 'destructive',
      });
    }
  };

  const handleArchive = async (boardId: string) => {
    if (!confirm('Are you sure you want to archive this board?')) return;

    try {
      const response = await fetch(`/api/boards/${boardId}/archive`, {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Board archived successfully',
        });
        fetchBoards();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to archive board',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive board',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-green-500/20 text-green-500',
      closed: 'bg-yellow-500/20 text-yellow-500',
      live: 'bg-red-500/20 text-red-500',
      completed: 'bg-blue-500/20 text-blue-500',
      archived: 'bg-gray-500/20 text-gray-500',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || ''}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            {statusFilter === 'archived' ? 'Archived Boards' : 'Manage Boards'}
          </h1>
          <Button variant="outline" onClick={() => router.push('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No boards found</p>
            <Button onClick={() => router.push('/admin/boards/new')}>
              Create New Board
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {boards.map((board) => (
              <div
                key={board.id}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{board.name}</h2>
                    <p className="text-muted-foreground">
                      {board.teamAway} @ {board.teamHome}
                    </p>
                  </div>
                  {getStatusBadge(board.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Cost</div>
                    <div className="text-lg font-bold">
                      ${board.costPerSquare.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Filled</div>
                    <div className="text-lg font-bold">
                      {board.squares.filter((s) => s.playerName).length}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Finalized</div>
                    <div className="text-lg font-bold">
                      {board.isFinalized ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Pot</div>
                    <div className="text-lg font-bold">
                      ${(board.costPerSquare * 100).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/boards/${board.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>

                  {!board.isFinalized && board.status === 'open' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFinalize(board.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalize
                    </Button>
                  )}

                  {board.status !== 'archived' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchive(board.id)}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(board.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
