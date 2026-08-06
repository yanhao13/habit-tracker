-- Run this in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  streak integer not null default 0,
  last_completed_date date,
  created_at timestamptz not null default now()
);

alter table habits enable row level security;

create policy "Users can view own habits" on habits
  for select using (auth.uid() = user_id);

create policy "Users can insert own habits" on habits
  for insert with check (auth.uid() = user_id);

create policy "Users can update own habits" on habits
  for update using (auth.uid() = user_id);

create policy "Users can delete own habits" on habits
  for delete using (auth.uid() = user_id);

create index if not exists habits_user_id_idx on habits(user_id);
