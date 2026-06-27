export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessageStatus = 'complete' | 'streaming' | 'error';

export type ChatPhase = 'idle' | 'thinking' | 'streaming';

/** Reserved for future avatar animation sync. */
export type AvatarState = 'idle' | 'thinking' | 'speaking';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  status: ChatMessageStatus;
  createdAt: number;
  /** Future: tie message lifecycle to avatar animations. */
  avatarState?: AvatarState;
}

export interface SuggestedQuestion {
  id: string;
  label: string;
  prompt: string;
}
