'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnScreenKeyboard } from '@/components/on-screen-keyboard';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Keyboard } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function NewBoardPage() {
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [boardName, setBoardName] = useState('');
  const [costPerSquare, setCostPerSquare] = useState('');
  const [payoutQ1, setPayoutQ1] = useState('25');
  const [payoutQ2, setPayoutQ2] = useState('25');
  const [payoutQ3, setPayoutQ3] = useState('25');
  const [payoutQ4, setPayoutQ4] = useState('25');
  const [paypalUsername, setPaypalUsername] = useState('');
  const [venmoUsername, setVenmoUsername] = useState('');
  const [allowPaypal, setAllowPaypal] = useState(true);
  const [allowVenmo, setAllowVenmo] = useState(true);
  const [allowCash, setAllowCash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<string>('');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const costInputRef = useRef<HTMLInputElement>(null);
  const paypalInputRef = useRef<HTMLInputElement>(null);
  const venmoInputRef = useRef<HTMLInputElement>(null);
  const q1InputRef = useRef<HTMLInputElement>(null);
  const q2InputRef = useRef<HTMLInputElement>(null);
  const q3InputRef = useRef<HTMLInputElement>(null);
  const q4InputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGames(data.games || []);
    } catch (error) {
      console.error('Fetch games error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load games',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const totalPayout =
      parseFloat(payoutQ1) +
      parseFloat(payoutQ2) +
      parseFloat(payoutQ3) +
      parseFloat(payoutQ4);

    if (Math.abs(totalPayout - 100) > 0.01) {
      toast({
        title: 'Invalid Payouts',
        description: 'Payouts must add up to 100%',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedGame) {
      toast({
        title: 'Game Required',
        description: 'Please select a game',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const game = games.find((g) => g.id === selectedGame);
      if (!game) throw new Error('Game not found');

      const homeTeam = game.competitions[0].competitors.find(
        (c: any) => c.homeAway === 'home'
      );
      const awayTeam = game.competitions[0].competitors.find(
        (c: any) => c.homeAway === 'away'
      );

      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: boardName,
          gameId: selectedGame,
          teamHome: homeTeam.team.displayName,
          teamAway: awayTeam.team.displayName,
          costPerSquare: parseFloat(costPerSquare),
          payoutQ1: parseFloat(payoutQ1),
          payoutQ2: parseFloat(payoutQ2),
          payoutQ3: parseFloat(payoutQ3),
          payoutQ4: parseFloat(payoutQ4),
          paypalUsername: allowPaypal && paypalUsername ? paypalUsername : null,
          venmoUsername: allowVenmo && venmoUsername ? venmoUsername : null,
          allowCash,
          allowPaypal,
          allowVenmo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Board created successfully',
        });
        router.push('/admin/boards');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create board',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create board',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentInputRef = () => {
    switch (activeInput) {
      case 'name': return nameInputRef;
      case 'cost': return costInputRef;
      case 'paypal': return paypalInputRef;
      case 'venmo': return venmoInputRef;
      case 'q1': return q1InputRef;
      case 'q2': return q2InputRef;
      case 'q3': return q3InputRef;
      case 'q4': return q4InputRef;
      default: return nameInputRef;
    }
  };

  const handleKeyboardChange = (input: string) => {
    switch (activeInput) {
      case 'name': setBoardName(input); break;
      case 'cost': setCostPerSquare(input); break;
      case 'paypal': setPaypalUsername(input); break;
      case 'venmo': setVenmoUsername(input); break;
      case 'q1': setPayoutQ1(input); break;
      case 'q2': setPayoutQ2(input); break;
      case 'q3': setPayoutQ3(input); break;
      case 'q4': setPayoutQ4(input); break;
    }
  };

  const totalPayout =
    parseFloat(payoutQ1 || '0') +
    parseFloat(payoutQ2 || '0') +
    parseFloat(payoutQ3 || '0') +
    parseFloat(payoutQ4 || '0');

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Create New Board</h1>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowKeyboard(!showKeyboard)}
            >
              <Keyboard className="w-4 h-4 mr-2" />
              {showKeyboard ? 'Hide' : 'Show'} Keyboard
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/boards')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
          {/* Game Selection */}
          <div className="space-y-2">
            <Label htmlFor="game">Select Game</Label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => {
                  const home = game.competitions[0].competitors.find(
                    (c: any) => c.homeAway === 'home'
                  );
                  const away = game.competitions[0].competitors.find(
                    (c: any) => c.homeAway === 'away'
                  );
                  return (
                    <SelectItem key={game.id} value={game.id}>
                      {away?.team.displayName} @ {home?.team.displayName} -{' '}
                      {new Date(game.date).toLocaleDateString()}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Board Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Board Name</Label>
            <Input
              ref={nameInputRef}
              id="name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onFocus={() => setActiveInput('name')}
              placeholder="e.g., $1 Per Square"
              required
            />
          </div>

          {/* Cost Per Square */}
          <div className="space-y-2">
            <Label htmlFor="cost">Cost Per Square ($)</Label>
            <Input
              ref={costInputRef}
              id="cost"
              type="number"
              step="0.01"
              min="0.01"
              value={costPerSquare}
              onChange={(e) => setCostPerSquare(e.target.value)}
              onFocus={() => setActiveInput('cost')}
              placeholder="e.g., 1.00"
              required
            />
          </div>

          {/* Payouts */}
          <div className="space-y-4">
            <Label>Quarter Payouts (%)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="q1">Q1</Label>
                <Input
                  ref={q1InputRef}
                  id="q1"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={payoutQ1}
                  onChange={(e) => setPayoutQ1(e.target.value)}
                  onFocus={() => setActiveInput('q1')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="q2">Q2</Label>
                <Input
                  ref={q2InputRef}
                  id="q2"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={payoutQ2}
                  onChange={(e) => setPayoutQ2(e.target.value)}
                  onFocus={() => setActiveInput('q2')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="q3">Q3</Label>
                <Input
                  ref={q3InputRef}
                  id="q3"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={payoutQ3}
                  onChange={(e) => setPayoutQ3(e.target.value)}
                  onFocus={() => setActiveInput('q3')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="q4">Q4</Label>
                <Input
                  ref={q4InputRef}
                  id="q4"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={payoutQ4}
                  onChange={(e) => setPayoutQ4(e.target.value)}
                  onFocus={() => setActiveInput('q4')}
                  required
                />
              </div>
            </div>
            <div
              className={`text-sm ${
                Math.abs(totalPayout - 100) < 0.01
                  ? 'text-green-500'
                  : 'text-destructive'
              }`}
            >
              Total: {totalPayout.toFixed(1)}% {Math.abs(totalPayout - 100) < 0.01 ? '✓' : '(must equal 100%)'}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Accepted Payment Methods</Label>
            <p className="text-sm text-muted-foreground">Select which payment methods players can use</p>
            
            {/* PayPal */}
            <div className="space-y-2 border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allow-paypal"
                  checked={allowPaypal}
                  onChange={(e) => setAllowPaypal(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="allow-paypal" className="font-semibold">PayPal</Label>
              </div>
              {allowPaypal && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="paypal" className="text-sm">PayPal Username</Label>
                  <Input
                    ref={paypalInputRef}
                    id="paypal"
                    value={paypalUsername}
                    onChange={(e) => setPaypalUsername(e.target.value)}
                    onFocus={() => setActiveInput('paypal')}
                    placeholder="your-paypal-username"
                  />
                </div>
              )}
            </div>

            {/* Venmo */}
            <div className="space-y-2 border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allow-venmo"
                  checked={allowVenmo}
                  onChange={(e) => setAllowVenmo(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="allow-venmo" className="font-semibold">Venmo</Label>
              </div>
              {allowVenmo && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="venmo" className="text-sm">Venmo Username</Label>
                  <Input
                    ref={venmoInputRef}
                    id="venmo"
                    value={venmoUsername}
                    onChange={(e) => setVenmoUsername(e.target.value)}
                    onFocus={() => setActiveInput('venmo')}
                    placeholder="your-venmo-username"
                  />
                </div>
              )}
            </div>

            {/* Cash */}
            <div className="space-y-2 border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allow-cash"
                  checked={allowCash}
                  onChange={(e) => setAllowCash(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="allow-cash" className="font-semibold">Cash</Label>
              </div>
              {allowCash && (
                <p className="ml-6 text-sm text-muted-foreground">Players will pay cash directly to you</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Creating...' : 'Create Board'}
          </Button>
        </form>

        {showKeyboard && (
          <div className="mt-4">
            <OnScreenKeyboard
              inputRef={getCurrentInputRef()}
              onChange={handleKeyboardChange}
              layout={activeInput === 'cost' || activeInput.startsWith('q') ? 'numeric' : 'default'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
