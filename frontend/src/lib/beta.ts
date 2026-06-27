const DISABLED = new Set(['false', '0', 'no', 'off']);
const ENABLED = new Set(['true', '1', 'yes', 'on']);

/**
 * Resolve beta mode from one or more env values.
 * Defaults to enabled unless an explicit "false" value is found.
 */
export function parseBetaModeFlag(...values: Array<string | undefined>): boolean {
  for (const value of values) {
    if (value === undefined || value === null) {
      continue;
    }

    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      continue;
    }

    if (DISABLED.has(normalized)) {
      return false;
    }

    if (ENABLED.has(normalized)) {
      return true;
    }
  }

  return true;
}

/**
 * Client/build-time beta flag (from NEXT_PUBLIC_BETA_MODE).
 * Set NEXT_PUBLIC_BETA_MODE=false to re-enable the full portfolio experience.
 */
export const BETA_MODE = parseBetaModeFlag(process.env.NEXT_PUBLIC_BETA_MODE);
