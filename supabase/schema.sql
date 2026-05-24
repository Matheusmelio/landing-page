-- MotStart — execute no SQL Editor do Supabase (Dashboard → SQL → New query)

-- Perfis de usuário (demo / sync com login local)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null default 'student' check (role in ('student', 'enterprise')),
  company_name text,
  enterprise_plan text,
  active_plan_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Pedidos de assinatura de plano
create table if not exists public.plan_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  plan_id text not null,
  payer_name text not null,
  payer_email text not null,
  card_last4 text,
  user_email text not null,
  created_at timestamptz not null default now()
);

-- Compras avulsas de curso
create table if not exists public.course_purchases (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  course_id text not null,
  payer_name text not null,
  payer_email text not null,
  card_last4 text,
  created_at timestamptz not null default now()
);

-- Progresso por curso
create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  course_id text not null,
  status text not null check (status in ('em-andamento', 'disponivel', 'concluido')),
  updated_at timestamptz not null default now(),
  unique (user_email, course_id)
);

-- Vagas publicadas por empresas
create table if not exists public.published_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  stack text not null default '—',
  modality text not null default 'Remoto',
  author_email text not null,
  created_at timestamptz not null default now()
);

-- Cursos publicados por criadores (estudantes)
create table if not exists public.creator_courses (
  id text primary key,
  title text not null,
  category text default '',
  description text default '',
  price_label text default '',
  price_cents integer default 0,
  author_email text not null,
  author_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_course_progress_user on public.course_progress (user_email);
create index if not exists idx_published_jobs_created on public.published_jobs (created_at desc);
create index if not exists idx_creator_courses_author on public.creator_courses (author_email);

-- RLS: API usa service_role (bypass). Para acesso direto do browser no futuro, ajuste políticas.
alter table public.profiles enable row level security;
alter table public.plan_orders enable row level security;
alter table public.course_purchases enable row level security;
alter table public.course_progress enable row level security;
alter table public.published_jobs enable row level security;
alter table public.creator_courses enable row level security;
