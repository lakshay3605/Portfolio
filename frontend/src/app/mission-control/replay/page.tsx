'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AI_API_BASE_URL } from '@/components/ai-chat/constants';
import {
  AdminNav,
  formatReplayDuration,
  formatReplayTime
} from '@/components/admin/AdminNav';
import { cn } from '@/lib/cn';

interface ReplayTurn {
  conversation_number: number;
  timestamp: string;
  user_message: string;
  ai_response: string;
  intent: string;
  confidence: number;
  response_time_ms: number;
  knowledge_docs_used: string[];
  is_low_confidence: boolean;
  is_unknown_question: boolean;
}

interface ReplayFeedback {
  rating: number;
  written_feedback: string | null;
  timestamp: string;
}

interface SessionReplay {
  session_id: string;
  start_time: string | null;
  duration_ms: number;
  turn_count: number;
  has_low_confidence: boolean;
  has_unknown_questions: boolean;
  has_negative_feedback: boolean;
  is_long_conversation: boolean;
  feedback: ReplayFeedback[];
  turns: ReplayTurn[];
}

interface ReplayFilters {
  low_confidence: boolean;
  negative_feedback: boolean;
  long_conversations: boolean;
  unknown_questions: boolean;
}

const FILTER_OPTIONS: Array<{ key: keyof ReplayFilters; label: string }> = [
  { key: 'low_confidence', label: 'Low-confidence conversations' },
  { key: 'negative_feedback', label: 'Negative feedback' },
  { key: 'long_conversations', label: 'Long conversations' },
  { key: 'unknown_questions', label: 'Unknown questions' }
];

export default function AdminReplayPage() {
  const [sessions, setSessions] = useState<SessionReplay[]>([]);
  const [filters, setFilters] = useState<ReplayFilters>({
    low_confidence: false,
    negative_feedback: false,
    long_conversations: false,
    unknown_questions: false
  });
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    for (const [key, enabled] of Object.entries(filters)) {
      if (enabled) {
        params.set(key, 'true');
      }
    }
    params.set('limit', '50');
    return params.toString();
  }, [filters]);

  const loadReplays = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${AI_API_BASE_URL}/mission-control/replay?${queryString}`);
      if (!response.ok) {
        throw new Error('Failed to load conversation replays.');
      }

      const payload = (await response.json()) as { sessions: SessionReplay[] };
      setSessions(payload.sessions);
      setError(null);

      if (
        expandedSessionId &&
        !payload.sessions.some((session) => session.session_id === expandedSessionId)
      ) {
        setExpandedSessionId(null);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load replays.');
    } finally {
      setIsLoading(false);
    }
  }, [expandedSessionId, queryString]);

  useEffect(() => {
    void loadReplays();
  }, [loadReplays]);

  const toggleFilter = (key: keyof ReplayFilters) => {
    setFilters((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-10 text-text-primary sm:px-8">
      <div className="mx-auto max-w-6xl">
        <AdminNav />

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Beta training tool</p>
            <h1 className="mt-2 text-3xl font-semibold">Conversation Replay</h1>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Review full sessions in chat format with routing metadata, response timing, and feedback.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadReplays()}
            className="rounded-full bg-primary/90 px-4 py-2 text-sm font-medium text-black"
          >
            Refresh
          </button>
        </div>

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-text-tertiary">Filters</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => {
              const active = filters[option.key];
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => toggleFilter(option.key)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm transition-colors',
                    active
                      ? 'bg-amber-400/20 text-amber-100 ring-1 ring-amber-300/30'
                      : 'border border-white/10 text-text-secondary hover:bg-white/5'
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading conversation replays...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-text-secondary">No sessions match the selected filters.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const expanded = expandedSessionId === session.session_id;
              return (
                <section
                  key={session.session_id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSessionId(expanded ? null : session.session_id)
                    }
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02]"
                  >
                    <div>
                      <p className="font-mono text-sm text-primary">{session.session_id}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-tertiary">
                        <span>Start: {formatReplayTime(session.start_time)}</span>
                        <span>Duration: {formatReplayDuration(session.duration_ms)}</span>
                        <span>{session.turn_count} turns</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {session.has_low_confidence ? (
                          <Badge label="Low confidence" tone="amber" />
                        ) : null}
                        {session.has_unknown_questions ? (
                          <Badge label="Unknown questions" tone="red" />
                        ) : null}
                        {session.has_negative_feedback ? (
                          <Badge label="Negative feedback" tone="red" />
                        ) : null}
                        {session.is_long_conversation ? (
                          <Badge label="Long conversation" tone="blue" />
                        ) : null}
                      </div>
                    </div>
                    <span className="text-sm text-text-tertiary">{expanded ? 'Hide' : 'Replay'}</span>
                  </button>

                  {expanded ? (
                    <div className="border-t border-white/10 px-5 py-5">
                      {session.feedback.length > 0 ? (
                        <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-500/10 p-4">
                          <h3 className="text-sm font-medium text-amber-100">User feedback</h3>
                          <div className="mt-3 space-y-3">
                            {session.feedback.map((item) => (
                              <div key={`${item.timestamp}-${item.rating}`}>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-amber-300">{'★'.repeat(item.rating)}</span>
                                  <span className="text-xs text-text-tertiary">
                                    {formatReplayTime(item.timestamp)}
                                  </span>
                                </div>
                                {item.written_feedback ? (
                                  <p className="mt-2 text-sm text-text-secondary">
                                    {item.written_feedback}
                                  </p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="space-y-6">
                        {session.turns.map((turn) => (
                          <div
                            key={`${session.session_id}-${turn.conversation_number}`}
                            className="rounded-xl border border-white/5 bg-black/20 p-4"
                          >
                            <div className="mb-4 flex flex-wrap gap-2 text-xs">
                              <MetaPill label={`Turn ${turn.conversation_number}`} />
                              <MetaPill label={`Intent: ${turn.intent}`} />
                              <MetaPill label={`Confidence: ${turn.confidence}`} />
                              <MetaPill label={`${Math.round(turn.response_time_ms)} ms`} />
                              {turn.is_low_confidence ? (
                                <MetaPill label="Low confidence" highlight />
                              ) : null}
                              {turn.is_unknown_question ? (
                                <MetaPill label="Unknown question" highlight />
                              ) : null}
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-text-tertiary">User</p>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-text-primary">
                                  {turn.user_message}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs uppercase tracking-wide text-text-tertiary">Lakshay</p>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">
                                  {turn.ai_response}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                              <p className="text-xs uppercase tracking-wide text-text-tertiary">
                                Documents retrieved
                              </p>
                              {turn.knowledge_docs_used.length > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {turn.knowledge_docs_used.map((doc) => (
                                    <span
                                      key={`${turn.conversation_number}-${doc}`}
                                      className="rounded-full border border-white/10 px-2 py-1 font-mono text-[11px] text-text-secondary"
                                    >
                                      {doc}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-2 text-sm text-text-tertiary">No document metadata recorded.</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function Badge({
  label,
  tone
}: {
  label: string;
  tone: 'amber' | 'red' | 'blue';
}) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[11px]',
        tone === 'amber' && 'bg-amber-400/15 text-amber-100',
        tone === 'red' && 'bg-red-500/15 text-red-200',
        tone === 'blue' && 'bg-sky-400/15 text-sky-100'
      )}
    >
      {label}
    </span>
  );
}

function MetaPill({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <span
      className={cn(
        'rounded-full border px-2.5 py-1 text-text-tertiary',
        highlight
          ? 'border-amber-400/30 bg-amber-400/10 text-amber-100'
          : 'border-white/10 bg-white/[0.03]'
      )}
    >
      {label}
    </span>
  );
}
