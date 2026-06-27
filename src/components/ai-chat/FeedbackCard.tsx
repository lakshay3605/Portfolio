'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { submitFeedback } from '@/lib/analytics';

export interface FeedbackCardProps {
  sessionId: string;
  onDismiss: () => void;
  className?: string;
}

export function FeedbackCard({ sessionId, onDismiss, className }: FeedbackCardProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        sessionId,
        rating,
        writtenFeedback: feedback
      });
      setSubmitted(true);
      window.setTimeout(onDismiss, 1200);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-[#0f172a]/95 p-4 shadow-xl backdrop-blur-xl sm:p-5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-primary">How was your experience?</p>
          <p className="mt-1 text-xs text-text-tertiary">Quick feedback helps improve Lakshay AI.</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-text-tertiary transition-colors hover:text-text-secondary"
          aria-label="Dismiss feedback"
        >
          Dismiss
        </button>
      </div>

      <div className="mt-4 flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => {
          const active = value <= (hoverRating || rating);
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
              className={cn(
                'text-xl transition-transform hover:scale-110',
                active ? 'text-amber-300' : 'text-white/20'
              )}
            >
              ★
            </button>
          );
        })}
      </div>

      <textarea
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
        placeholder="What should Lakshay AI improve? (optional)"
        rows={3}
        className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary/40"
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-text-tertiary">
          {submitted ? 'Thanks for the feedback!' : 'Optional — helps us train better responses.'}
        </span>
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={rating === 0 || isSubmitting || submitted}
          className="rounded-full bg-primary/90 px-4 py-2 text-xs font-medium text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitted ? 'Saved' : isSubmitting ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
