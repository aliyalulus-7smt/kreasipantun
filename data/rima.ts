// Referensi pilihan rima untuk kartu bantuan menyusun pantun (tahap Asah).
// Satu kelompok akhiran dipakai untuk baris 1 & 3 (rima A),
// kelompok lain untuk baris 2 & 4 (rima B) — pola sajak a-b-a-b.
export interface KelompokRima { akhiran: string; kata: string[] }

export const referensiRima: KelompokRima[] = [
  { akhiran: '-a', kata: ['cahaya', 'bahagia', 'ceria', 'nyata', 'dunia', 'senja'] },
  { akhiran: '-i', kata: ['hati', 'melati', 'sejati', 'pagi', 'budi', 'nanti'] },
  { akhiran: '-an', kata: ['awan', 'kawan', 'jalan', 'bulan', 'taman', 'teman'] },
  { akhiran: '-ang', kata: ['pulang', 'senang', 'datang', 'kenang', 'terbang', 'sayang'] },
  { akhiran: '-ar', kata: ['belajar', 'segar', 'sabar', 'mekar', 'benar', 'sadar'] },
  { akhiran: '-u', kata: ['ilmu', 'jamu', 'malu', 'baru', 'guru', 'rindu'] },
  { akhiran: '-ai', kata: ['damai', 'ramai', 'pandai', 'santai', 'capai', 'sungai'] },
  { akhiran: '-ih', kata: ['bersih', 'jernih', 'gigih', 'pedih', 'latih', 'putih'] },
  { akhiran: '-ah', kata: ['indah', 'mudah', 'ramah', 'cerah', 'megah', 'sekolah'] },
  { akhiran: '-at', kata: ['sehat', 'hebat', 'sahabat', 'taat', 'lebat', 'semangat'] },
]
