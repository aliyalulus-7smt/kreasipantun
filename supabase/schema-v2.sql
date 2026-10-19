-- ============================================================
-- KREASI PANTUN — Skema v2 (Konsep Baru)
-- 3 role, kelas + kode, session opaque, progres per tahap,
-- sync versioning, karya privat, penilaian guru terpisah.
--
-- Cara pakai: Supabase Dashboard > SQL Editor > paste > Run.
-- PERHATIAN: sesuai perintah pemilik, data siswa lama DIHAPUS.
-- ============================================================

-- ---- Hapus skema lama ----
drop table if exists public.refleksi cascade;
drop table if exists public.peta_ide cascade;
drop table if exists public.karya cascade;
drop table if exists public.kata_rima cascade;
drop table if exists public.pola cascade;
drop table if exists public.fenomena cascade;
drop table if exists public.siswa cascade;

-- Hapus tabel v2 bila ada (urutan FK)
drop table if exists public.sync_conflicts cascade;
drop table if exists public.evaluations cascade;
drop table if exists public.works cascade;
drop table if exists public.stage_progress cascade;
drop table if exists public.sessions cascade;
drop table if exists public.class_members cascade;
drop table if exists public.classes cascade;
drop table if exists public.users cascade;

-- ============================================================
-- USERS: super_admin | guru | siswa
-- ============================================================
create table public.users (
  id uuid primary key default gen_random_uuid(),
  username citext not null unique,
  password_hash text not null,
  role text not null check (role in ('super_admin','guru','siswa')),
  nama_lengkap text not null,
  no_absen text,
  created_at timestamptz not null default now()
);
create index users_role_idx on public.users(role);

-- ============================================================
-- CLASSES: dibuat guru, kode 6 karakter alfanumerik
-- ============================================================
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  guru_id uuid not null references public.users(id) on delete cascade,
  nama text not null,
  kode varchar(6) not null unique check (kode ~ '^[A-Za-z0-9]{6}$'),
  created_at timestamptz not null default now()
);
create index classes_guru_idx on public.classes(guru_id);
create index classes_kode_idx on public.classes(kode);

-- ============================================================
-- CLASS_MEMBERS: satu siswa = satu kelas aktif
-- ============================================================
create table public.class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(user_id)
);
create index class_members_class_idx on public.class_members(class_id);

-- ============================================================
-- SESSIONS: opaque session token (hash disimpan)
-- ============================================================
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index sessions_user_idx on public.sessions(user_id);
create index sessions_expires_idx on public.sessions(expires_at);

-- ============================================================
-- STAGE_PROGRESS: progres per siswa x fenomena x tahap
-- versioning untuk sync + deteksi konflik
-- ============================================================
create table public.stage_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  phenomenon_id text not null,
  stage_id text not null,
  content_version text not null default 'v1',
  version int not null default 1,
  response_payload jsonb not null default '{}'::jsonb,
  context jsonb,
  server_updated_at timestamptz not null default now(),
  unique(user_id, phenomenon_id, stage_id)
);
create index stage_progress_user_idx on public.stage_progress(user_id);

-- ============================================================
-- SYNC_CONFLICTS: arsip konflik versi
-- ============================================================
create table public.sync_conflicts (
  id uuid primary key default gen_random_uuid(),
  progress_id uuid not null references public.stage_progress(id) on delete cascade,
  base_version int not null,
  current_version int not null,
  current_payload jsonb not null,
  incoming_payload jsonb not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- WORKS: karya pantun siswa (privat: pemilik + guru kelasnya)
-- ============================================================
create table public.works (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  phenomenon_id text not null,
  judul text,
  larik1 text not null,
  larik2 text not null,
  larik3 text not null,
  larik4 text not null,
  is_final boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index works_user_idx on public.works(user_id);

-- ============================================================
-- EVALUATIONS: penilaian guru (terpisah, tidak ubah karya)
-- ============================================================
create table public.evaluations (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references public.works(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  guru_id uuid not null references public.users(id) on delete cascade,
  phenomenon_id text not null,
  nilai text,
  komentar text,
  created_at timestamptz not null default now()
);
create index evaluations_user_idx on public.evaluations(user_id);
create index evaluations_guru_idx on public.evaluations(guru_id);

-- ============================================================
-- RLS: aktif, akses lewat BFF (service_role). Anon ditolak.
-- ============================================================
alter table public.users enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.sessions enable row level security;
alter table public.stage_progress enable row level security;
alter table public.sync_conflicts enable row level security;
alter table public.works enable row level security;
alter table public.evaluations enable row level security;
-- Tidak ada policy untuk anon/authenticated: hanya service_role via BFF.
