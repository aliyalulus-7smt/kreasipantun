-- Arsip progres siswa untuk fitur "Ulangi dari Awal" (reset putaran).
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor (atau via koneksi Postgres).
-- Aman diulang (IF NOT EXISTS).

create table if not exists public.stage_progress_archive (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  run_no integer not null,
  phenomenon_id text not null,
  stage_id text not null,
  content_version text,
  response_payload jsonb not null default '{}'::jsonb,
  context jsonb,
  version integer not null default 1,
  archived_at timestamptz not null default now(),
  unique (user_id, run_no, phenomenon_id, stage_id)
);

create index if not exists idx_stage_progress_archive_user_run
  on public.stage_progress_archive (user_id, run_no);

-- Akses hanya lewat BFF (service_role); samakan dengan tabel lain:
alter table public.stage_progress_archive enable row level security;
