/**
 * Ensures backend URLs are always an absolute origin.
 * Values without a scheme (e.g. "api.example.northflank.app") are resolved relative
 * to the current page origin by fetch(), producing malformed URLs on Vercel.
 */
export function normalizeApiBaseUrl(raw: string | undefined): string {
  const value = (raw ?? '').trim();
  if (!value) {
    return '';
  }

  const withoutTrailingSlash = value.replace(/\/+$/, '');

  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }

  return `https://${withoutTrailingSlash.replace(/^\/+/, '')}`;
}

/**
 * Client-visible API base URL.
 * Falls back to same-origin `/api` proxy routes when NEXT_PUBLIC_AI_API_URL is unset.
 */
export function resolveClientApiBaseUrl(): string {
  const configured = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_AI_API_URL);
  return configured || '/api';
}

export const AI_API_BASE_URL = resolveClientApiBaseUrl();
