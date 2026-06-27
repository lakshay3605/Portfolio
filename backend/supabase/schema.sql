-- Lakshay AI beta analytics (Supabase)
-- Run in the Supabase SQL editor before deployment.

create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    session_id text not null,
    timestamp timestamptz not null default now(),
    user_message text not null,
    ai_response text not null,
    response_time_ms double precision not null,
    conversation_number integer not null,
    intent text,
    confidence double precision,
    knowledge_docs_used jsonb not null default '[]'::jsonb,
    build_instructions_ms double precision,
    llm_ms double precision,
    tokens_generated integer
);

create index if not exists idx_conversations_session_id
    on public.conversations (session_id);

create index if not exists idx_conversations_timestamp
    on public.conversations (timestamp desc);

create table if not exists public.feedback (
    id uuid primary key default gen_random_uuid(),
    session_id text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    written_feedback text,
    timestamp timestamptz not null default now()
);

create index if not exists idx_feedback_session_id
    on public.feedback (session_id);

create index if not exists idx_feedback_timestamp
    on public.feedback (timestamp desc);

create table if not exists public.unknown_questions (
    id uuid primary key default gen_random_uuid(),
    session_id text not null,
    timestamp timestamptz not null default now(),
    question text not null,
    response text not null,
    confidence double precision not null,
    knowledge_docs_used jsonb not null default '[]'::jsonb
);

create index if not exists idx_unknown_questions_session_id
    on public.unknown_questions (session_id);

create index if not exists idx_unknown_questions_timestamp
    on public.unknown_questions (timestamp desc);

-- Backend uses the service role key. Keep RLS enabled with no public policies,
-- or disable RLS on these tables if only the backend writes/reads them.
alter table public.conversations enable row level security;
alter table public.feedback enable row level security;
alter table public.unknown_questions enable row level security;
