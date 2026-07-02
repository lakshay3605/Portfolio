'use client';

import { ArrowUp, Mic, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { AI_TWIN_MODAL_INPUT_PLACEHOLDER } from './constants';

export interface AiTwinModalInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function AiTwinModalInput({
  onSend,
  disabled = false,
  autoFocus = false,
  className
}: AiTwinModalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }

    const timer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [autoFocus]);

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
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`;
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'flex items-end gap-2 rounded-[1.35rem] border border-white/12 bg-white/[0.05] p-2.5',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_40px_rgba(0,0,0,0.22)]',
          'focus-within:border-violet-400/30 focus-within:ring-1 focus-within:ring-violet-400/20',
          disabled && 'opacity-70'
        )}
      >
        <button
          type="button"
          disabled
          aria-label="Prompt suggestions"
          className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary/70"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </button>

        <label htmlFor="ai-twin-modal-input" className="sr-only">
          Ask Lakshay AI
        </label>
        <textarea
          id="ai-twin-modal-input"
          ref={textareaRef}
          rows={1}
          disabled={disabled}
          placeholder={AI_TWIN_MODAL_INPUT_PLACEHOLDER}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          className={cn(
            'max-h-[120px] min-h-[3rem] flex-1 resize-none bg-transparent px-1 py-2.5',
            'text-sm text-text-primary placeholder:text-text-tertiary sm:text-[0.9375rem]',
            'focus:outline-none disabled:cursor-not-allowed'
          )}
        />

        <button
          type="button"
          disabled
          aria-label="Voice input coming soon"
          title="Voice input coming soon"
          className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-tertiary opacity-50"
        >
          <Mic className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          aria-label="Send message"
          className={cn(
            'mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            'bg-primary text-background transition-transform',
            'hover:brightness-110 active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
            'disabled:cursor-not-allowed disabled:opacity-40'
          )}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
