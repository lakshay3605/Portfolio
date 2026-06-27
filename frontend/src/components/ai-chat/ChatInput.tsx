'use client';

import { ArrowUp } from 'lucide-react';
import { useCallback, useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { INPUT_PLACEHOLDER } from './constants';

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({ onSend, disabled = false, className }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(() => {
    const value = textareaRef.current?.value ?? '';
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
  }, [disabled, onSend]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const handleInput = () => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  };

  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)}>
      <div
        className={cn(
          'flex items-end gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-2',
          'shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md',
          'focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20',
          disabled && 'opacity-70'
        )}
      >
        <label htmlFor="ai-chat-input" className="sr-only">
          Message Lakshay
        </label>
        <textarea
          id="ai-chat-input"
          ref={textareaRef}
          rows={1}
          disabled={disabled}
          placeholder={INPUT_PLACEHOLDER}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          className={cn(
            'max-h-40 min-h-[2.75rem] flex-1 resize-none bg-transparent px-3 py-2.5',
            'text-sm text-text-primary placeholder:text-text-tertiary',
            'focus:outline-none disabled:cursor-not-allowed'
          )}
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          aria-label="Send message"
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            'bg-primary text-background transition-transform',
            'hover:brightness-110 active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
            'disabled:cursor-not-allowed disabled:opacity-40'
          )}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-text-tertiary">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
