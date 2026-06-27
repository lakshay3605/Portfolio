# Lakshay.ai

Monorepo for the Lakshay.ai public beta — a conversational AI portfolio with a Next.js frontend and FastAPI backend.

## Repository structure

```
.
├── frontend/          # Next.js 15 app (deploy to Vercel)
├── backend/           # FastAPI API (deploy to Railway)
├── docs/              # Product and architecture notes
└── README.md
```

## Local development

### Prerequisites

- Node.js 20+
- Python 3.11+
- Supabase project (for analytics)
- Gemini API key

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000).

### Backend

```bash
cd backend
cp .env.example .env
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8090
```

Runs at [http://127.0.0.1:8090](http://127.0.0.1:8090).

### From repository root

```bash
npm run dev              # frontend only
npm run dev:backend      # backend only
npm run build            # production frontend build
```

## Deployment

| Service  | Platform | Root directory |
|----------|----------|----------------|
| Frontend | Vercel   | `frontend`     |
| Backend  | Railway  | `backend`      |
| Database | Supabase | —              |

### Vercel (frontend)

Set **Root Directory** to `frontend` in project settings. Environment variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_AI_API_URL`
- `NEXT_PUBLIC_BETA_MODE`

### Railway (backend)

Set **Root Directory** to `backend`. Environment variables:

- `APP_ENV=production`
- `DEBUG=false`
- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGINS` (your Vercel domain)

Apply the Supabase schema from `backend/supabase/schema.sql` before launch.

## Tech stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** FastAPI, Google Gemini, Supabase (analytics)
- **Deploy:** Vercel + Railway + Supabase
