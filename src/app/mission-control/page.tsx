'use client';

import { useCallback, useEffect, useState } from 'react';
import { AI_API_BASE_URL } from '@/components/ai-chat/constants';
import { AdminNav } from '@/components/admin/AdminNav';
import { downloadAdminExport } from '@/lib/analytics';

interface AdminStats {
  total_conversations: number;
  total_questions: number;
  average_conversation_length: number;
  average_response_time_ms: number;
  total_feedback: number;
  average_rating: number | null;
  unknown_questions_count: number;
  recent_conversations: Array<{
    session_id: string;
    timestamp: string;
    user_message: string;
    ai_response: string;
    response_time_ms: number;
    conversation_number: number;
  }>;
  top_questions: Array<{ question: string; count: number }>;
  recent_feedback: Array<{
    session_id: string;
    rating: number;
    written_feedback: string | null;
    timestamp: string;
  }>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(`${AI_API_BASE_URL}/mission-control/stats`);
      if (!response.ok) {
        throw new Error('Failed to load analytics.');
      }
      setStats((await response.json()) as AdminStats);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load analytics.');
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const handleExport = async (resource: 'conversations' | 'questions' | 'feedback') => {
    setIsExporting(resource);
    try {
      await downloadAdminExport(resource);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Export failed.');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] px-4 py-10 text-text-primary sm:px-8">
      <div className="mx-auto max-w-6xl">
        <AdminNav />

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-text-tertiary">Local beta testing</p>
            <h1 className="mt-2 text-3xl font-semibold">Lakshay AI Admin</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Conversation analytics, feedback, export tools, and replay review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleExport('conversations')}
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              {isExporting === 'conversations' ? 'Exporting...' : 'Export Conversations'}
            </button>
            <button
              type="button"
              onClick={() => void handleExport('questions')}
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              {isExporting === 'questions' ? 'Exporting...' : 'Export Questions'}
            </button>
            <button
              type="button"
              onClick={() => void handleExport('feedback')}
              className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
            >
              {isExporting === 'feedback' ? 'Exporting...' : 'Export Feedback'}
            </button>
            <button
              type="button"
              onClick={() => void loadStats()}
              className="rounded-full bg-primary/90 px-4 py-2 text-sm font-medium text-black"
            >
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {!stats ? (
          <p className="text-sm text-text-secondary">Loading analytics...</p>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Total conversations', stats.total_conversations],
                ['Total questions', stats.total_questions],
                ['Avg turns / session', stats.average_conversation_length],
                ['Avg response time (ms)', stats.average_response_time_ms],
                ['Feedback received', stats.total_feedback],
                ['Average rating', stats.average_rating ?? '—'],
                ['Unknown questions', stats.unknown_questions_count]
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-text-tertiary">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-lg font-medium">Top 20 questions</h2>
                <div className="mt-4 space-y-3">
                  {stats.top_questions.length === 0 ? (
                    <p className="text-sm text-text-tertiary">No questions yet.</p>
                  ) : (
                    stats.top_questions.map((item) => (
                      <div
                        key={`${item.question}-${item.count}`}
                        className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-b-0"
                      >
                        <p className="text-sm text-text-secondary">{item.question}</p>
                        <span className="shrink-0 text-xs text-text-tertiary">{item.count}×</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-lg font-medium">Recent feedback</h2>
                <div className="mt-4 space-y-3">
                  {stats.recent_feedback.length === 0 ? (
                    <p className="text-sm text-text-tertiary">No feedback yet.</p>
                  ) : (
                    stats.recent_feedback.map((item) => (
                      <div
                        key={`${item.timestamp}-${item.session_id}`}
                        className="rounded-xl border border-white/5 bg-black/20 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-amber-300">{'★'.repeat(item.rating)}</span>
                          <span className="text-xs text-text-tertiary">{item.timestamp}</span>
                        </div>
                        {item.written_feedback ? (
                          <p className="mt-2 text-sm text-text-secondary">{item.written_feedback}</p>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-medium">Recent conversations</h2>
              <div className="mt-4 space-y-4">
                {stats.recent_conversations.length === 0 ? (
                  <p className="text-sm text-text-tertiary">No conversations yet.</p>
                ) : (
                  stats.recent_conversations.map((item) => (
                    <div
                      key={`${item.timestamp}-${item.conversation_number}-${item.session_id}`}
                      className="rounded-xl border border-white/5 bg-black/20 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-tertiary">
                        <span>Session {item.session_id.slice(0, 8)}…</span>
                        <span>Turn {item.conversation_number}</span>
                        <span>{Math.round(item.response_time_ms)} ms</span>
                      </div>
                      <p className="mt-3 text-sm text-text-primary">
                        <span className="text-text-tertiary">User:</span> {item.user_message}
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        <span className="text-text-tertiary">AI:</span> {item.ai_response}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
