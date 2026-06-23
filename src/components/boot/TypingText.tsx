'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface TypingTextProps {
  messages: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  active?: boolean;
  className?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

export function TypingText({
  messages,
  typingSpeed = 42,
  deletingSpeed = 24,
  pauseDuration = 1400,
  active = true,
  className = '',
  'aria-live': ariaLive = 'polite'
}: TypingTextProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!active || messages.length === 0) {
      return;
    }

    const currentMessage = messages[messageIndex] ?? '';
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentMessage) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && displayText === '') {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 280);
    } else {
      timeoutId = setTimeout(
        () => {
          const nextLength = isDeleting ? displayText.length - 1 : displayText.length + 1;
          setDisplayText(currentMessage.slice(0, nextLength));
        },
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    active,
    displayText,
    isDeleting,
    messageIndex,
    messages,
    pauseDuration,
    deletingSpeed,
    typingSpeed
  ]);

  useEffect(() => {
    if (!active) {
      return;
    }

    setMessageIndex(0);
    setDisplayText('');
    setIsDeleting(false);
  }, [active, messages]);

  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`min-h-[1.75rem] font-mono text-sm tracking-wide text-text-secondary sm:text-base ${className}`}
      aria-live={ariaLive}
    >
      <span>{displayText}</span>
      <motion.span
        className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-primary/80"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </motion.p>
  );
}
