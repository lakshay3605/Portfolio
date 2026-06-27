'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { ChatMessage } from '../types';

export interface UserMessageProps {
  message: ChatMessage;
  className?: string;
}

export function UserMessage({ message, className }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex justify-end', className)}
    >
      <div
        className="max-w-[85%] rounded-2xl rounded-tr-md border border-primary/20 bg-primary/10 px-4 py-3 sm:max-w-[75%]"
        role="article"
        aria-label="Your message"
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary sm:text-[0.9375rem]">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
}
