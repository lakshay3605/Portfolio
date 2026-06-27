'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BETA_MODE } from '@/lib/beta';
import { BackgroundEffects } from './BackgroundEffects';
import { GlassPanel } from './GlassPanel';
import { GlowButton } from './GlowButton';
import { ProgressBar } from './ProgressBar';
import { TypingText } from './TypingText';

const LOADING_MESSAGES = [
  'Loading neural network...',
  'Loading memories...',
  'Synchronizing experiences...',
  'Preparing conversation...',
  'Authenticating personality...'
] as const;

const INTRO_MESSAGES = [
  'Hello.',
  "I'm Lakshay's AI Twin.",
  'Instead of reading another portfolio...',
  "Let's have a conversation."
] as const;

const MESSAGE_PAUSE_MS = 1800;

const fadeTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1] as const
};

export function BootScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [introIndex, setIntroIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const handleProgressComplete = useCallback(() => {
    setIsLoading(false);
    setIntroIndex(0);
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (introIndex >= INTRO_MESSAGES.length - 1) {
      const buttonTimer = setTimeout(() => {
        setShowButton(true);
      }, MESSAGE_PAUSE_MS);

      return () => {
        clearTimeout(buttonTimer);
      };
    }

    const nextMessageTimer = setTimeout(() => {
      setIntroIndex((current) => current + 1);
    }, MESSAGE_PAUSE_MS);

    return () => {
      clearTimeout(nextMessageTimer);
    };
  }, [introIndex, isLoading]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundEffects />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <GlassPanel className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={fadeTransition}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...fadeTransition, delay: 0.1 }}
                  className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2"
                >
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-boot-status-glow" />
                  </span>
                  <span className="text-xs font-medium tracking-[0.18em] text-text-secondary uppercase sm:text-sm">
                    <span aria-hidden="true">● </span>
                    AI Core Online
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...fadeTransition, delay: 0.15 }}
                  className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-[2.75rem] md:leading-tight"
                >
                  Initializing AI Twin
                </motion.h1>

                <div className="mt-5 w-full">
                  <TypingText messages={[...LOADING_MESSAGES]} active={isLoading} />
                </div>

                <div className="mt-10 w-full">
                  <ProgressBar duration={3} onComplete={handleProgressComplete} />
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.8 }}
                  className="mt-8 max-w-sm text-sm leading-relaxed text-text-tertiary sm:text-base"
                >
                  Creating the most authentic version of Lakshay...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={fadeTransition}
                className="flex min-h-[18rem] flex-col items-center justify-center text-center"
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={INTRO_MESSAGES[introIndex]}
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    transition={fadeTransition}
                    className="text-2xl font-medium tracking-tight text-text-primary sm:text-3xl md:text-4xl"
                    aria-live="polite"
                  >
                    {INTRO_MESSAGES[introIndex]}
                  </motion.p>
                </AnimatePresence>

                <AnimatePresence>
                  {showButton && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ ...fadeTransition, delay: 0.2 }}
                      className="mt-10"
                    >
                      <GlowButton
                        aria-label="Start a conversation with Lakshay's AI Twin"
                        onClick={() => router.push(BETA_MODE ? '/ai' : '/choose')}
                      >
                        Start Conversation
                      </GlowButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassPanel>
      </main>
    </div>
  );
}
