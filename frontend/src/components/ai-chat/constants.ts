import type { SuggestedQuestion } from './types';

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: 'about',
    label: 'Tell me about yourself',
    prompt: 'Tell me about yourself'
  },
  {
    id: 'hire',
    label: 'Why should we hire you?',
    prompt: 'Why should we hire you?'
  },
  {
    id: 'kvgai',
    label: 'Tell me about KVGAI',
    prompt: 'Tell me about KVGAI'
  },
  {
    id: 'flagship',
    label: 'Explain your flagship project',
    prompt: 'Explain your flagship project'
  },
  {
    id: 'strengths',
    label: 'What are your strengths?',
    prompt: 'What are your strengths?'
  },
  {
    id: 'career',
    label: 'Give me career advice',
    prompt: 'Give me career advice'
  }
];

export const EMPTY_STATE = {
  greeting: "Hi, I'm Lakshay's AI Twin.",
  body: "Ask me about my projects, engineering decisions, leadership experience, or anything else you'd like to know."
} as const;

export const THINKING_LABEL = 'Lakshay is thinking...';

export const THINKING_DELAY_MS = 8000;

export const FRIENDLY_ERROR_MESSAGE =
  'Looks like I had a small brain freeze 😅\n\nCould you try asking that again?';

export const BETA_IMPROVEMENT_FOOTER =
  'This AI is continuously improving through beta feedback.';

export const INPUT_PLACEHOLDER = 'Ask Lakshay anything...';

export { AI_API_BASE_URL } from '@/lib/api-url';
