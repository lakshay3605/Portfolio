/**
 * Ensures NEXT_PUBLIC_AI_API_URL is always an absolute origin.
 * Values without a scheme (e.g. "foo.up.railway.app") are resolved relative
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

export const AI_API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_AI_API_URL);
