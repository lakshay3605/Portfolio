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

export const FLOATING_ASSISTANT_WELCOME_MESSAGE = `👋 Welcome! I'm Lakshay AI.

I was built to represent Lakshay during recruiter conversations. I can explain his projects, internship, hackathon wins, technical decisions, leadership experience, and answer follow-up questions just as he would.`;

export const AI_TWIN_MODAL_WELCOME_MESSAGE = FLOATING_ASSISTANT_WELCOME_MESSAGE;

export const AI_TWIN_MODAL_PROMPT_CARDS = [
  {
    id: 'different',
    emoji: '🧠',
    label: 'What makes you different?',
    prompt: 'What makes you different from other candidates?'
  },
  {
    id: 'hackathon',
    emoji: '🏆',
    label: 'National Hackathon',
    prompt: 'Tell me about your national hackathon win.'
  },
  {
    id: 'kvgai',
    emoji: '💼',
    label: 'Internship at KVGAI',
    prompt: 'Explain your work at KVGAI during your internship.'
  },
  {
    id: 'project',
    emoji: '🚀',
    label: 'Best AI Project',
    prompt: 'Tell me about your best AI project.'
  },
  {
    id: 'stack',
    emoji: '⚙️',
    label: 'Tech Stack',
    prompt: 'What tech stack do you use and why?'
  },
  {
    id: 'resume',
    emoji: '📄',
    label: 'Resume Summary',
    prompt: 'Give me a concise summary of your resume.'
  }
] as const;

export const AI_TWIN_MODAL_INPUT_PLACEHOLDER = 'Ask Lakshay AI anything...';

export const AI_TWIN_MODAL_FOOTER =
  'This AI was personally built and trained to represent Lakshay.';

export const FLOATING_ASSISTANT_AUTO_OPEN_DELAY_MS = 1250;

export const AI_TWIN_MODAL_AUTO_OPEN_DELAY_MS = FLOATING_ASSISTANT_AUTO_OPEN_DELAY_MS;

export const THINKING_LABEL = 'Lakshay is thinking...';

export const THINKING_DELAY_MS = 8000;

export const FRIENDLY_ERROR_MESSAGE =
  'Looks like I had a small brain freeze 😅\n\nCould you try asking that again?';

export const BETA_IMPROVEMENT_FOOTER =
  'This AI is continuously improving through beta feedback.';

export const INPUT_PLACEHOLDER = 'Ask Lakshay anything...';

export { AI_API_BASE_URL } from '@/lib/api-url';
