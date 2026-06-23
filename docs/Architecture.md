# Architecture

## Overview
The architecture separates frontend experience, shared design system, AI integration, and future backend services.

## Frontend
- Next.js 15 App Router
- TypeScript
- Tailwind CSS and shadcn/ui
- Framer Motion and GSAP for animations
- React Three Fiber for immersive 3D interactive scenes

### Core frontend layers
- `src/app` — app routes, layout, metadata, and filler scaffolding
- `src/components` — reusable visual and domain components
- `src/components/ui` — design system primitives and component library
- `src/lib` — SDK clients, helpers, environment utilities, and composables

## Data and persistence
- Supabase for authentication, profile data, and content storage
- Future backend layer through FastAPI for API orchestration and vector storage
- Qdrant for semantic search and retrieval augmented generation workflows

## AI integration
- OpenAI API for conversation, prompt management, and persona behavior
- ElevenLabs for speech synthesis and audio generation

## Future backend architecture
- FastAPI microservices: auth orchestration, portfolio content API, conversation router, and RAG endpoint
- Qdrant vector database for embedding storage and search
- Supabase for user session data and content management

## Architectural principles
- Modular boundaries between UI, AI, data, and backend integration
- Incremental development with frontend scaffolding and mock-ready client wrappers
- Maintainability through clean naming, single-responsibility components, and typed interfaces
