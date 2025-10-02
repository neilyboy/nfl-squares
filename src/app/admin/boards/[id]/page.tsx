'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SquaresGrid } from '@/components/squares-grid';
import { WinnersDisplay } from '@/components/winners-display';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Board {
  id: string;
  name: string;
  teamHome: string;
  teamAway: string;
  costPerSquare: number;
  payoutQ1: number;
  payoutQ2: number;
  payoutQ3: number;
  payoutQ4: number;
  status: string;
  isFinalized: boolean;
  rowNumbers: string | null;
  colNumbers: string | null;
  squares: any[];
  winners: any[];
  paymentConfig: any;
}

export default function BoardDetailPage({ params }: { params: { id: string } }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchBoard();
  }, [params.id]);

  const fetchBoard = async () => {
    try {
      const response = await fetch(`/api/boards/${params.id}`);
      const data = await response.json();
      setBoard(data.board);
    } catch (error) {
      console.error('Fetch board error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load board',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSquare = async (squareId: string) => {
    if (!confirm('Are you sure you want to delete this square?')) return;

    try {
      const response = await fetch(`/api/squares/${squareId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Square deleted successfully',
        });
        fetchBoard();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete square',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete square',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePaid = async (squareId: string, currentPaidStatus: boolean) => {
    try {
      const response = await fetch(`/api/squares/${squareId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid: !currentPaidStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Payment status updated',
        });
        fetchBoard();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update payment status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Board Not Found</h1>
          <Button onClick={() => router.push('/admin/boards')}>
            Back to Boards
          </Button>
        </div>
      </div>
    );
  }

  const filledSquares = board.squares.filter((s) => s.playerName);
  const paidSquares = board.squares.filter((s) => s.isPaid);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">{board.name}</h1>
          <Button variant="outline" onClick={() => router.push('/admin/boards')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Filled</div>
            <div className="text-2xl font-bold">{filledSquares.length}/100</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Paid</div>
            <div className="text-2xl font-bold">{paidSquares.length}/{filledSquares.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Revenue</div>
            <div className="text-2xl font-bold">
              ${(paidSquares.length * board.costPerSquare).toFixed(2)}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total Pot</div>
            <div className="text-2xl font-bold">
              ${(board.costPerSquare * 100).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mb-8">
          <SquaresGrid
            squares={board.squares}
            rowNumbers={
              board.isFinalized && board.rowNumbers
                ? JSON.parse(board.rowNumbers)
                : null
            }
            colNumbers={
              board.isFinalized && board.colNumbers
                ? JSON.parse(board.colNumbers)
                : null
            }
            showNumbers={board.isFinalized}
            readOnly
            teamHomeAbbr={board.teamHome.split(' ').pop()}
            teamAwayAbbr={board.teamAway.split(' ').pop()}
          />
        </div>

        {/* Winners */}
        {board.winners.length > 0 && (
          <div className="mb-8">
            <WinnersDisplay winners={board.winners} />
          </div>
        )}

        {/* Square Details */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Square Details</h2>
          
          {filledSquares.length === 0 ? (
            <p className="text-muted-foreground">No squares have been filled yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2">Position</th>
                    <th className="text-left p-2">Player</th>
                    <th className="text-left p-2">Payment</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filledSquares.map((square) => (
                    <tr key={square.id} className="border-b border-border">
                      <td className="p-2">
                        [{square.row}, {square.col}]
                      </td>
                      <td className="p-2 font-semibold">{square.playerName}</td>
                      <td className="p-2">
                        {square.paymentMethod === 'paypal' && (
                          <Image
                            src="/vendor_logos/PayPal_logo.svg"
                            alt="PayPal"
                            width={60}
                            height={20}
                            className="object-contain"
                          />
                        )}
                        {square.paymentMethod === 'venmo' && (
                          <Image
                            src="/vendor_logos/Venmo_logo.svg"
                            alt="Venmo"
                            width={60}
                            height={20}
                            className="object-contain"
                          />
                        )}
                        {square.paymentMethod === 'cash' && (
                          <span className="text-sm">💵 Cash</span>
                        )}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            square.isPaid
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}
                        >
                          {square.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePaid(square.id, square.isPaid)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {square.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSquare(square.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
