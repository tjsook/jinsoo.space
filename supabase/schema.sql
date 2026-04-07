create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  content text not null,
  label text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_status_check check (status in ('draft', 'published'))
);

create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_label_idx on public.posts (label);
create index if not exists posts_created_at_idx on public.posts (created_at desc);

drop trigger if exists posts_set_updated_at on public.posts;

create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

alter table public.posts enable row level security;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  github_url text not null,
  image_url text,
  description text not null,
  stack text[] not null default '{}',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check check (status in ('draft', 'published'))
);

create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_created_at_idx
on public.projects (created_at desc);

drop trigger if exists projects_set_updated_at on public.projects;

create trigger projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

alter table public.projects enable row level security;
