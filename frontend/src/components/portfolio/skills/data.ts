import type { SkillCategory } from './types';

export const SKILLS_SECTION = {
  title: 'Skills'
} as const;

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    skills: ['LLM Engineering', 'Prompt Engineering', 'AI APIs', 'Multimodal AI']
  },
  {
    id: 'rag-systems',
    title: 'RAG Systems',
    skills: ['RAG', 'Embeddings', 'Vector Databases', 'Hybrid Search', 'Context Compression']
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    skills: ['LangGraph', 'CrewAI', 'MCP', 'Tool Calling', 'Memory Systems']
  },
  {
    id: 'backend-infrastructure',
    title: 'Backend & Infrastructure',
    skills: ['FastAPI', 'Next.js', 'Docker', 'REST APIs', 'Async Python']
  },
  {
    id: 'llmops',
    title: 'LLMOps',
    skills: ['Evaluation', 'Langfuse', 'Guardrails', 'Monitoring', 'Tracing']
  }
];
