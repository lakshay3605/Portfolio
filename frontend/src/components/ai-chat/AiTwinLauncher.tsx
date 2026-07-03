'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useFloatingAssistant } from './FloatingAssistantProvider';

export function AiTwinLauncher() {
  const { isOpen, open } = useFloatingAssistant();

  return (
    <AnimatePresence>
      {!isOpen ? (
        <motion.div
          key="ai-twin-launcher"
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-4 z-[90] sm:bottom-6 sm:right-6"
        >
          <button
            type="button"
            onClick={open}
            aria-label="Open Lakshay AI"
            className="ai-fab"
          >
            <span className="spark">✨</span>
            <span>Ask Lakshay AI</span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
