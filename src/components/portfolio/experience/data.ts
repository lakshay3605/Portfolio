import type { ExperienceData } from './types';

export const EXPERIENCE_SECTION = {
  title: 'Experience'
} as const;

export const FEATURED_EXPERIENCE: ExperienceData = {
  id: 'kvgai',
  company: 'KVGAI',
  role: 'AI Developer',
  duration: 'January 2026 — Present',
  description:
    'Building AI-powered solutions, designing LLM workflows, and developing end-to-end AI applications with a focus on real-world impact.',
  technologies: ['LLMs', 'Prompt Engineering', 'FastAPI', 'Next.js', 'AI APIs']
};
