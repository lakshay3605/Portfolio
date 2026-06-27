import { AI_API_BASE_URL } from '@/components/ai-chat/constants';

export async function submitIssueReport(input: {
  sessionId: string;
  issue: string;
}): Promise<void> {
  const response = await fetch(`${AI_API_BASE_URL}/analytics/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: input.sessionId,
      rating: 1,
      written_feedback: `[Report Issue] ${input.issue.trim()}`
    })
  });

  if (!response.ok) {
    throw new Error('Failed to save issue report.');
  }
}

export async function submitFeedback(input: {
  sessionId: string;
  rating: number;
  writtenFeedback?: string;
}): Promise<void> {
  const response = await fetch(`${AI_API_BASE_URL}/analytics/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: input.sessionId,
      rating: input.rating,
      written_feedback: input.writtenFeedback?.trim() || null
    })
  });

  if (!response.ok) {
    throw new Error('Failed to save feedback.');
  }
}

export async function downloadAdminExport(
  resource: 'conversations' | 'questions' | 'feedback'
): Promise<void> {
  const response = await fetch(`${AI_API_BASE_URL}/mission-control/export/${resource}`);
  if (!response.ok) {
    throw new Error(`Failed to export ${resource}.`);
  }

  const data = await response.json();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${resource}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
