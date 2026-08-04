import { normalizeApiBaseUrl } from './api-url';

/**
 * Backend origin for server-side proxy routes.
 * Prefer AI_API_URL (runtime on Vercel) over NEXT_PUBLIC_AI_API_URL.
 */
export function getBackendBaseUrl(): string {
  const raw = process.env.AI_API_URL ?? process.env.NEXT_PUBLIC_AI_API_URL ?? '';
  const normalized = normalizeApiBaseUrl(raw);

  if (!normalized) {
    throw new Error(
      'AI backend URL is not configured. Set AI_API_URL or NEXT_PUBLIC_AI_API_URL.'
    );
  }

  return normalized;
}
