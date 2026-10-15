-- Migrasi 002: kolom tambahan untuk peta ide & karya tantangan
-- Cara pakai: buka Supabase Dashboard → SQL Editor → paste & Run
-- Setelah migrasi jalan, kabari developer untuk mengaktifkan penyimpanan kolom ini di kode.

-- Kumpulan kata di peta ide (halaman /limar/explore-peta)
alter table public.peta_ide
  add column if not exists kata_kunci text;

-- Detail tantangan pantun kedua (halaman /limar/tantangan)
alter table public.karya
  add column if not exists tantangan text,
  add column if not exists gagasan text,
  add column if not exists pesan text;
