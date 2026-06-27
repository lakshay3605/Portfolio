import { parseBetaModeFlag } from './beta';

/**
 * Server-side beta flag for route rendering.
 * Checks BETA_MODE first (runtime on Vercel), then NEXT_PUBLIC_BETA_MODE.
 */
export function isBetaModeEnabled(): boolean {
  return parseBetaModeFlag(process.env.BETA_MODE, process.env.NEXT_PUBLIC_BETA_MODE);
}
