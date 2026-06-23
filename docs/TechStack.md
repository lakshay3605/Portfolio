# Tech Stack

## Frontend
- Next.js 15 App Router
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- GSAP
- React Three Fiber

## Backend / Data (future)
- FastAPI
- Supabase
- Qdrant

## AI
- OpenAI API
- ElevenLabs

## Tooling
- ESLint
- Prettier
- TypeScript compiler
- GitHub workflows (future)

## Integration strategy
- Use Supabase for persistence and auth
- Keep AI client wrappers in `src/lib`
- Reserve backend API routing for FastAPI services
- Implement vector search using Qdrant for future RAG content
