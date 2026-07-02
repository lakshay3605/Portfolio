export const HERO_GREETING = "Hi, I'm Lakshay Mahajan.";

export const HERO_HEADLINE = 'I build AI products that solve real problems.';

export const HERO_DESCRIPTION =
  'AI Developer at KVGAI, National Hackathon Winner, and a builder passionate about taking ideas from concept to deployment.';

export const HERO_OVERLINE = 'AI Engineer • Product Builder • Community Leader';

export const HERO_HEADLINE_LEGACY = ['Engineering AI products', 'that people actually use.'] as const;

export const HERO_STATEMENTS = [
  'Taking ownership from idea to deployment.',
  'Turning complex AI into intuitive products.',
  'Building systems that people actually use.',
  'Combining engineering with product thinking.'
] as const;

export const HERO_ACHIEVEMENTS = [
  { icon: '🏆', label: 'National Hackathon Winner' },
  { icon: '💼', label: 'AI Developer — KVGAI' },
  { icon: '🚀', label: 'President — THINK AI' },
  { icon: '🌐', label: 'President — HackSphere IPEC' }
] as const;

export const HERO_CREDENTIALS = [
  'AI Developer @ KVGAI',
  'National Hackathon Winner',
  'President — THINK AI',
  'AI Engineer'
] as const;

export const HERO_PHOTO = {
  src: undefined as string | undefined,
  alt: 'Lakshay Mahajan'
} as const;

export const ENGINEERING_PROFILE = {
  label: 'Engineering Profile',
  title: 'AI Engineering',
  specializationsSection: 'Specializations',
  specializations: [
    'LLM Engineering',
    'Agentic AI',
    'RAG Systems',
    'Vector Databases',
    'FastAPI',
    'LLMOps'
  ] as const,
  cta: 'Explore with AI'
} as const;

export const STATEMENT_INTERVAL_MS = 3500;
