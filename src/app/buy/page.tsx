'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SquaresGrid } from '@/components/squares-grid';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { OnScreenKeyboard } from '@/components/on-screen-keyboard';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Board {
  id: string;
  name: string;
  status: string;
  costPerSquare: number;
  squares: any[];
  paymentConfig: {
    paypalUsername: string | null;
    venmoUsername: string | null;
    allowCash: boolean;
  };
}

export default function BuyPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/boards?status=open');
      const data = await response.json();
      setBoards(data.boards || []);
      
      if (data.boards && data.boards.length === 1) {
        setSelectedBoard(data.boards[0]);
      }
    } catch (error) {
      console.error('Fetch boards error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load boards',
        variant: 'destructive',
      });
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    setSelectedSquare({ row, col });
  };

  const handleContinue = () => {
    if (!playerName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedSquare) {
      toast({
        title: 'Square Required',
        description: 'Please select a square',
        variant: 'destructive',
      });
      return;
    }

    setShowPaymentDialog(true);
  };

  const handlePayment = async (method: string) => {
    if (!selectedBoard || !selectedSquare) return;

    setLoading(true);

    try {
      const response = await fetch('/api/squares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: selectedBoard.id,
          row: selectedSquare.row,
          col: selectedSquare.col,
          playerName: playerName.trim(),
          paymentMethod: method,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Square claimed successfully!',
        });
        router.push('/');
      } else {
        if (response.status === 409) {
          toast({
            title: 'Square Taken',
            description: data.error || 'This square has already been claimed',
            variant: 'destructive',
          });
          // Refresh boards to show updated state
          fetchBoards();
          setSelectedSquare(null);
          setShowPaymentDialog(false);
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to claim square',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to claim square',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentUrl = (method: string) => {
    if (!selectedBoard) return '';
    
    const config = selectedBoard.paymentConfig;
    
    if (method === 'paypal' && config.paypalUsername) {
      return `https://www.paypal.com/paypalme/${config.paypalUsername}/${selectedBoard.costPerSquare}`;
    } else if (method === 'venmo' && config.venmoUsername) {
      return `https://account.venmo.com/u/${config.venmoUsername}`;
    }
    
    return '';
  };

  if (boards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">No Open Boards</h1>
        <p className="text-muted-foreground mb-8">
          All boards are currently closed or filled
        </p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  if (!selectedBoard) {
    return (
      <div className="min-h-screen flex flex-col p-4">
        <div className="container mx-auto max-w-2xl">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-6">Select a Board</h1>

          <div className="space-y-4">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => setSelectedBoard(board)}
                className="w-full p-6 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-left"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{board.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {board.squares.filter((s) => s.playerName).length}/100 squares filled
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      ${board.costPerSquare.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">per square</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="outline"
          onClick={() => {
            if (selectedSquare || playerName) {
              setSelectedBoard(null);
              setSelectedSquare(null);
              setPlayerName('');
            } else {
              router.push('/');
            }
          }}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{selectedBoard.name}</h1>
          <p className="text-muted-foreground">
            Select an available square and enter your name
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-6">
          {/* Grid */}
          <div>
            <SquaresGrid
              squares={selectedBoard.squares}
              onSquareClick={handleSquareClick}
              highlightSquare={selectedSquare}
              showNumbers={false}
            />
          </div>

          {/* Form */}
          <div className="lg:w-80 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  ref={nameInputRef}
                  id="name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onFocus={() => setShowKeyboard(true)}
                  placeholder="Enter your name"
                  maxLength={20}
                />
              </div>

              {selectedSquare && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Selected Square
                  </div>
                  <div className="text-2xl font-bold">
                    Row {selectedSquare.row}, Col {selectedSquare.col}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${selectedBoard.costPerSquare.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={!playerName.trim() || !selectedSquare}
                  className="w-full"
                  size="lg"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {showKeyboard && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <OnScreenKeyboard
              inputRef={nameInputRef}
              onChange={(input) => setPlayerName(input)}
            />
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you'd like to pay for your square
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedBoard.paymentConfig.paypalUsername && (
              <div className="text-center">
                <QRCodeDisplay
                  url={getPaymentUrl('paypal')}
                  title="PayPal"
                  logoSrc="/vendor_logos/PayPal_logo.svg"
                  size={200}
                />
                <Button
                  onClick={() => handlePayment('paypal')}
                  disabled={loading}
                  className="mt-4 w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'I Paid via PayPal'}
                </Button>
              </div>
            )}

            {selectedBoard.paymentConfig.venmoUsername && (
              <div className="text-center">
                <QRCodeDisplay
                  url={getPaymentUrl('venmo')}
                  title="Venmo"
                  logoSrc="/vendor_logos/Venmo_logo.svg"
                  size={200}
                />
                <Button
                  onClick={() => handlePayment('venmo')}
                  disabled={loading}
                  className="mt-4 w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'I Paid via Venmo'}
                </Button>
              </div>
            )}

            {selectedBoard.paymentConfig.allowCash && (
              <div className="text-center p-6 bg-secondary rounded-lg">
                <div className="text-4xl mb-4">💵</div>
                <h3 className="text-lg font-semibold mb-2">Cash Payment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please pay ${selectedBoard.costPerSquare.toFixed(2)} in cash to the admin
                </p>
                <Button
                  onClick={() => handlePayment('cash')}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'I Will Pay Cash'}
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
