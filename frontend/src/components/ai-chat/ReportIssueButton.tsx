'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { submitIssueReport } from '@/lib/analytics';

export interface ReportIssueButtonProps {
  sessionId: string;
  className?: string;
  placement?: 'fixed' | 'inline';
}

export function ReportIssueButton({
  sessionId,
  className,
  placement = 'fixed'
}: ReportIssueButtonProps) {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setIssue('');
    setSubmitted(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    const trimmed = issue.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitIssueReport({ sessionId, issue: trimmed });
      setSubmitted(true);
      window.setTimeout(handleClose, 1400);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          placement === 'fixed'
            ? 'fixed right-4 z-30 rounded-full border border-white/10 bg-[#0f172a]/95 px-4 py-2.5 text-xs font-medium text-text-secondary shadow-lg backdrop-blur-xl transition-colors hover:border-white/20 hover:text-text-primary max-sm:bottom-[calc(9.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-28 sm:right-6 sm:text-sm'
            : 'rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary',
          className
        )}
      >
        Report Issue
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-issue-title"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="report-issue-title" className="text-base font-medium text-text-primary">
                What went wrong?
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-text-tertiary transition-colors hover:text-text-secondary"
              >
                Close
              </button>
            </div>

            <textarea
              value={issue}
              onChange={(event) => setIssue(event.target.value)}
              placeholder="Tell us what happened..."
              rows={4}
              className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary/40"
            />

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs text-text-tertiary">
                {submitted ? 'Thanks — this helps improve Lakshay AI.' : 'Your report is saved for beta review.'}
              </span>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!issue.trim() || isSubmitting || submitted}
                className="rounded-full bg-primary/90 px-4 py-2 text-xs font-medium text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitted ? 'Submitted' : isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
