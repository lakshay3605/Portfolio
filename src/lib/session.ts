const SESSION_STORAGE_KEY = 'lakshay_ai_session_id';

export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}
