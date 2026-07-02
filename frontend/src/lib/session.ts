const SESSION_STORAGE_KEY = 'lakshay_ai_session_id';
const WELCOME_AUTO_OPEN_KEY = 'lakshay_ai_welcome_auto_open_handled';

export function isWelcomeAutoOpenHandled(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return window.sessionStorage.getItem(WELCOME_AUTO_OPEN_KEY) === '1';
}

export function markWelcomeAutoOpenHandled(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(WELCOME_AUTO_OPEN_KEY, '1');
}

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
