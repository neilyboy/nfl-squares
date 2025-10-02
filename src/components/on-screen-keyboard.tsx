'use client';

import React, { useEffect, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

interface OnScreenKeyboardProps {
  inputRef?: React.RefObject<HTMLInputElement>;
  onKeyPress?: (button: string) => void;
  onChange?: (input: string) => void;
  layout?: 'default' | 'shift' | 'numeric';
}

export function OnScreenKeyboard({
  inputRef,
  onKeyPress,
  onChange,
  layout = 'default',
}: OnScreenKeyboardProps) {
  const keyboardRef = useRef<any>(null);

  useEffect(() => {
    if (inputRef?.current) {
      const handleFocus = () => {
        if (keyboardRef.current) {
          keyboardRef.current.setInput(inputRef.current?.value || '');
        }
      };

      const inputElement = inputRef.current;
      inputElement.addEventListener('focus', handleFocus);

      return () => {
        inputElement.removeEventListener('focus', handleFocus);
      };
    }
  }, [inputRef]);

  const handleKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') {
      handleShift();
    }
    onKeyPress?.(button);
  };

  const handleShift = () => {
    const currentLayout = keyboardRef.current?.options.layoutName;
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';
    keyboardRef.current?.setOptions({
      layoutName: shiftToggle,
    });
  };

  const handleChange = (input: string) => {
    onChange?.(input);
    if (inputRef?.current) {
      inputRef.current.value = input;
      // Trigger input event for React controlled components
      const event = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div className="w-full bg-background/95 backdrop-blur-sm border-t border-border p-4 rounded-t-lg">
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layout}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        theme="hg-theme-default dark-theme"
        layout={{
          default: [
            '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            '{tab} q w e r t y u i o p [ ] \\',
            "{lock} a s d f g h j k l ; ' {enter}",
            '{shift} z x c v b n m , . / {shift}',
            '.com @ {space}',
          ],
          shift: [
            '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
            '{tab} Q W E R T Y U I O P { } |',
            '{lock} A S D F G H J K L : " {enter}',
            '{shift} Z X C V B N M < > ? {shift}',
            '.com @ {space}',
          ],
          numeric: [
            '1 2 3',
            '4 5 6',
            '7 8 9',
            '. 0 {bksp}',
          ],
        }}
        display={{
          '{bksp}': 'backspace ⌫',
          '{enter}': 'enter ↵',
          '{shift}': '⇧',
          '{tab}': 'tab ⇥',
          '{lock}': 'caps lock ⇪',
          '{space}': ' ',
        }}
        buttonTheme={[
          {
            class: 'hg-red',
            buttons: '{bksp}',
          },
          {
            class: 'hg-highlight',
            buttons: '{enter} {shift} {tab} {lock}',
          },
        ]}
      />
      <style jsx global>{`
        .hg-theme-default {
          background-color: hsl(var(--background));
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
        }
        .hg-theme-default .hg-button {
          background: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
          border: 1px solid hsl(var(--border));
          border-radius: 0.375rem;
          box-shadow: none;
          font-size: 1rem;
          height: 50px;
        }
        .hg-theme-default .hg-button:active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .hg-theme-default .hg-button.hg-highlight {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        .hg-theme-default .hg-button.hg-red {
          background: hsl(var(--destructive));
          color: hsl(var(--destructive-foreground));
        }
      `}</style>
    </div>
  );
}
