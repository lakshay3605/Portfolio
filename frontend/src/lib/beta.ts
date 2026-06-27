/**
 * Beta mode hides the traditional portfolio, routes visitors to AI chat,
 * and skips the boot screen and avatar introduction.
 * Set NEXT_PUBLIC_BETA_MODE=false to re-enable the full portfolio experience.
 */
export const BETA_MODE = process.env.NEXT_PUBLIC_BETA_MODE !== 'false';
