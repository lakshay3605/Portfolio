# LakshayOS

LakshayOS is an immersive AI-powered portfolio platform where recruiters interact with an AI version of Lakshay Mahajan instead of browsing a conventional website.

## Vision

Build a production-grade experience that blends conversational AI, generative audio, and interactive storytelling to present the portfolio as a living digital persona.

## Architecture

The project follows a modern frontend-first architecture with a future-ready backend design.

- Next.js 15 App Router for UI composition and page routing
- TypeScript for end-to-end type safety
- Tailwind CSS plus shadcn/ui for scalable design and reusable UI primitives
- Framer Motion and GSAP for motion, entrance animations, and immersive transitions
- React Three Fiber for interactive 3D narrative scenes
- Supabase for auth, user data, and content persistence
- FastAPI reserved for future backend microservices
- Qdrant reserved for future vector search and RAG pipelines
- OpenAI API for conversational intelligence
- ElevenLabs for voice synthesis and immersive audio rendering

## Tech Stack

- Frontend: Next.js 15, React, TypeScript
- Styling: Tailwind CSS, shadcn/ui
- Animation: Framer Motion, GSAP
- 3D: React Three Fiber
- Data: Supabase
- Backend (future): FastAPI
- RAG / Vector DB (future): Qdrant
- AI: OpenAI, ElevenLabs

## Folder Structure

- `src/app` — application routes, layout, metadata, and page composition
- `src/components` — reusable UI and domain components
- `src/components/ui` — shared design-system primitives and shadcn-inspired components
- `src/lib` — low-level SDK wrappers, API clients, feature utilities, and environment helpers
- `docs` — product requirements, architecture, roadmap, features, design system, user journey, and tech stack
- `.github` — repository-level automation and contributor guidance

## Development Workflow

1. Install dependencies: `npm install`
2. Run local development: `npm run dev`
3. Typecheck: `npm run typecheck`
4. Lint: `npm run lint`
5. Format: `npm run format`

> This repository is intentionally initialized as scaffolding and documentation only. UI implementation and backend services are planned for later phases.

## Future Roadmap

1. Define data contracts and API surface for FastAPI backend
2. Build vector retrieval pipeline with Qdrant for RAG scenarios
3. Implement OpenAI conversational experience with stateful memory
4. Add ElevenLabs voice output for spoken AI responses
5. Develop 3D portfolio interactions with React Three Fiber
