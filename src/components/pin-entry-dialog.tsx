'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnScreenKeyboard } from '@/components/on-screen-keyboard';
import { useToast } from '@/components/ui/use-toast';
import { Keyboard } from 'lucide-react';

interface PinEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  allowPasswordReset?: boolean;
}

export function PinEntryDialog({
  open,
  onOpenChange,
  onSuccess,
  allowPasswordReset = false,
}: PinEntryDialogProps) {
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<'pin' | 'password' | 'newPin'>('pin');
  
  const pinInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const newPinInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handlePinSubmit = async () => {
    if (!pin) {
      toast({
        title: 'Error',
        description: 'Please enter your PIN',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'PIN verified successfully',
        });
        onSuccess();
        handleClose();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        toast({
          title: 'Error',
          description: data.error || 'Invalid PIN',
          variant: 'destructive',
        });

        if (newAttempts >= 3) {
          toast({
            title: 'Too many attempts',
            description: 'Returning to main screen',
            variant: 'destructive',
          });
          handleClose();
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify PIN',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!password || !newPin) {
      toast({
        title: 'Error',
        description: 'Please enter both password and new PIN',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, newPin }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'PIN reset successfully',
        });
        setShowPasswordReset(false);
        setPassword('');
        setNewPin('');
        setAttempts(0);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to reset PIN',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset PIN',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setPassword('');
    setNewPin('');
    setAttempts(0);
    setShowPasswordReset(false);
    setShowKeyboard(false);
    onOpenChange(false);
  };

  const getCurrentInputRef = () => {
    switch (activeInput) {
      case 'pin':
        return pinInputRef;
      case 'password':
        return passwordInputRef;
      case 'newPin':
        return newPinInputRef;
    }
  };

  const handleKeyboardChange = (input: string) => {
    switch (activeInput) {
      case 'pin':
        setPin(input);
        break;
      case 'password':
        setPassword(input);
        break;
      case 'newPin':
        setNewPin(input);
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showPasswordReset ? 'Reset PIN' : 'Admin Login'}
          </DialogTitle>
          <DialogDescription>
            {showPasswordReset
              ? 'Enter your password and new PIN'
              : 'Enter your PIN to access admin features'}
          </DialogDescription>
        </DialogHeader>

        {!showPasswordReset ? (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                ref={pinInputRef}
                id="pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onFocus={() => setActiveInput('pin')}
                placeholder="Enter 4 or 6 digit PIN"
                maxLength={6}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Attempts: {attempts}/3
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={passwordInputRef}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveInput('password')}
                placeholder="Enter your password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPin">New PIN</Label>
              <Input
                ref={newPinInputRef}
                id="newPin"
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                onFocus={() => setActiveInput('newPin')}
                placeholder="Enter new 4 or 6 digit PIN"
                maxLength={6}
              />
            </div>
          </div>
        )}

        {showKeyboard && (
          <OnScreenKeyboard
            inputRef={getCurrentInputRef()}
            onChange={handleKeyboardChange}
            layout={activeInput === 'password' ? 'default' : 'numeric'}
          />
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="sm:mr-auto"
            type="button"
          >
            <Keyboard className="h-4 w-4 mr-2" />
            {showKeyboard ? 'Hide' : 'Show'} Keyboard
          </Button>
          {!showPasswordReset ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {allowPasswordReset && attempts >= 1 && (
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordReset(true)}
                >
                  Forgot PIN?
                </Button>
              )}
              <Button onClick={handlePinSubmit} disabled={loading}>
                {loading ? 'Verifying...' : 'Submit'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordReset(false);
                  setPassword('');
                  setNewPin('');
                }}
              >
                Back
              </Button>
              <Button onClick={handlePasswordReset} disabled={loading}>
                {loading ? 'Resetting...' : 'Reset PIN'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
