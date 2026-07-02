import type { ProjectData } from './types';

export const FEATURED_PROJECTS: ProjectData[] = [
  {
    id: 'business-intelligence-assistant',
    status: {
      emoji: '🚧',
      label: 'Under Development',
      description: 'This project is actively being built.',
      variant: 'under-development'
    },
    title: 'Business Intelligence Assistant',
    description:
      'An AI-powered business intelligence platform that transforms complex business data into meaningful insights using intelligent AI workflows.',
    media: { type: 'placeholder', alt: 'Business Intelligence Assistant product preview' },
    technologies: ['LLMs', 'RAG', 'FastAPI', 'Agentic AI'],
    layout: 'text-left',
    aiExplainPrompt: 'Explain the Business Intelligence Assistant project in detail.'
  },
  {
    id: 'multi-tool-ai-agent',
    status: {
      emoji: '📝',
      label: 'In Planning',
      description:
        'The product has been conceptualized and is currently in the planning and design phase. Development has not started yet.',
      variant: 'planning'
    },
    title: 'Multi-Tool AI Agent',
    description:
      'An intelligent AI agent capable of reasoning, tool calling, memory management and workflow automation across multiple tools.',
    media: { type: 'placeholder', alt: 'Multi-Tool AI Agent product preview' },
    technologies: ['LangGraph', 'MCP', 'FastAPI', 'Tool Calling'],
    layout: 'text-right',
    aiExplainPrompt: 'Explain the Multi-Tool AI Agent project in detail.'
  },
  {
    id: 'jagrukmahila',
    status: {
      emoji: '✅',
      label: 'Live',
      description: 'This project is completed and publicly available.',
      variant: 'live'
    },
    title: 'jagrukmahila.in',
    description:
      'An AI-powered legal awareness platform developed under an ICSSR-sponsored research initiative to make legal information more accessible.',
    media: { type: 'placeholder', alt: 'jagrukmahila.in website preview' },
    technologies: ['Gemini', 'AI Chatbot', 'Next.js', 'Node.js'],
    layout: 'text-left',
    liveUrl: 'https://jagrukmahila.in',
    aiExplainPrompt: 'Explain the jagrukmahila.in project in detail.'
  }
];

export const PROJECTS_SECTION = {
  title: 'Projects'
} as const;
