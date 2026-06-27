'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ChatMessage } from '../types';

export interface AssistantMessageProps {
  message: ChatMessage;
  className?: string;
}

export function AssistantMessage({ message, className }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);
  const isStreaming = message.status === 'streaming';
  const isError = message.status === 'error';
  const canCopy = !isStreaming && message.content.trim().length > 0;

  const handleCopy = async () => {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex items-start gap-3', className)}
      role="article"
      aria-label="Lakshay's response"
      aria-busy={isStreaming}
      data-avatar-state={message.avatarState ?? 'idle'}
    >
      <div
        className={cn(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a88a] to-[#141b2d] ring-1 ring-white/10',
          isStreaming && 'ring-primary/30'
        )}
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold text-white/90">LM</span>
      </div>

      <div className="min-w-0 max-w-[85%] sm:max-w-[80%]">
        <div
          className={cn(
            'rounded-2xl rounded-tl-md border px-4 py-3',
            isError
              ? 'border-red-500/20 bg-red-500/5'
              : 'border-white/8 bg-white/[0.04]'
          )}
        >
          <p
            className={cn(
              'whitespace-pre-wrap text-sm leading-relaxed sm:text-[0.9375rem]',
              isError ? 'text-red-200' : 'text-text-primary'
            )}
          >
            {message.content}
            {isStreaming && (
              <motion.span
                className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-primary"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                aria-hidden="true"
              />
            )}
          </p>
        </div>

        {canCopy ? (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-text-tertiary transition-colors hover:bg-white/5 hover:text-text-secondary"
              aria-label={copied ? 'Copied response' : 'Copy response'}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
