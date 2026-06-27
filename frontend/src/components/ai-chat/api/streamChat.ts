import { AI_API_BASE_URL } from '../constants';

export interface ChatStreamMeta {
  intent: string;
  confidence: number;
  knowledge_docs_used: string[];
  build_instructions_ms: number;
  is_low_confidence: boolean;
  response_time_ms: number;
  llm_ms: number;
  tokens_generated: number;
  documents_retrieved: number;
  session_id: string;
  conversation_number: number;
}

export interface StreamChatHandlers {
  onStart?: () => void;
  onDelta: (delta: string) => void;
  onMeta?: (meta: ChatStreamMeta) => void;
  onError?: (message: string) => void;
}

export interface StreamChatOptions {
  sessionId: string;
  conversationNumber: number;
}

export async function streamChatMessage(
  message: string,
  handlers: StreamChatHandlers,
  signal?: AbortSignal,
  options?: StreamChatOptions
): Promise<void> {
  if (!AI_API_BASE_URL) {
    throw new Error('AI backend URL is not configured.');
  }

  const response = await fetch(`${AI_API_BASE_URL}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      session_id: options?.sessionId,
      conversation_number: options?.conversationNumber
    }),
    signal
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(detail || `Request failed (${response.status})`);
  }

  if (!response.body) {
    throw new Error('Streaming is not supported in this browser.');
  }

  handlers.onStart?.();

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith('data:')) continue;

      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return;

      try {
        const parsed = JSON.parse(payload) as {
          delta?: string;
          error?: string;
          meta?: ChatStreamMeta;
        };

        if (parsed.error) {
          handlers.onError?.(parsed.error);
          throw new Error(parsed.error);
        }

        if (parsed.meta) {
          handlers.onMeta?.(parsed.meta);
        }

        if (parsed.delta) {
          handlers.onDelta(parsed.delta);
        }
      } catch (error) {
        if (error instanceof SyntaxError) continue;
        throw error;
      }
    }
  }
}
