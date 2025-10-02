'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnScreenKeyboard } from '@/components/on-screen-keyboard';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Keyboard } from 'lucide-react';

export default function SetupPage() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<'pin' | 'confirmPin' | 'password'>('pin');
  
  const pinInputRef = useRef<HTMLInputElement>(null);
  const confirmPinInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if setup is already complete
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const response = await fetch('/api/admin/setup');
      const data = await response.json();
      
      if (data.setupComplete) {
        router.push('/');
      }
    } catch (error) {
      console.error('Setup check error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (pin.length < 4 || (pin.length !== 4 && pin.length !== 6)) {
      toast({
        title: 'Invalid PIN',
        description: 'PIN must be 4 or 6 digits',
        variant: 'destructive',
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: 'PIN Mismatch',
        description: 'PINs do not match',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Setup Complete',
          description: 'Admin credentials configured successfully',
        });
        router.push('/');
      } else {
        toast({
          title: 'Setup Failed',
          description: data.error || 'Failed to complete setup',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete setup',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentInputRef = () => {
    switch (activeInput) {
      case 'pin':
        return pinInputRef;
      case 'confirmPin':
        return confirmPinInputRef;
      case 'password':
        return passwordInputRef;
    }
  };

  const handleKeyboardChange = (input: string) => {
    switch (activeInput) {
      case 'pin':
        setPin(input);
        break;
      case 'confirmPin':
        setConfirmPin(input);
        break;
      case 'password':
        setPassword(input);
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">🏈 NFL Squares</h1>
          <h2 className="text-2xl font-semibold mb-2">First-Time Setup</h2>
          <p className="text-muted-foreground">
            Configure your admin credentials to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Admin PIN (4 or 6 digits)</Label>
              <Input
                ref={pinInputRef}
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onFocus={() => setActiveInput('pin')}
                placeholder="Enter PIN"
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                This PIN will be used for quick admin access
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                ref={confirmPinInputRef}
                id="confirmPin"
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                onFocus={() => setActiveInput('confirmPin')}
                placeholder="Confirm PIN"
                maxLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Recovery Password (min 8 characters)</Label>
              <Input
                ref={passwordInputRef}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveInput('password')}
                placeholder="Enter password"
                required
              />
              <p className="text-xs text-muted-foreground">
                This password can be used to reset your PIN if forgotten
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="flex-1"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              {showKeyboard ? 'Hide' : 'Show'} Keyboard
            </Button>
            <Button type="submit" className="flex-1" size="lg" disabled={loading}>
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </div>
        </form>

        {showKeyboard && (
          <div className="mt-4">
            <OnScreenKeyboard
              inputRef={getCurrentInputRef()}
              onChange={handleKeyboardChange}
              layout={activeInput === 'password' ? 'default' : 'numeric'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
