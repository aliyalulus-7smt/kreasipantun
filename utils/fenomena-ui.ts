/**
 * Peta tampilan per fenomena (kelas Tailwind statis agar terbaca JIT).
 * Dipakai kartu fenomena, kartu lanjutkan, dan item aktivitas.
 */
export const GAYA_FENOMENA: Record<string, { tile: string; bar: string; badge: string; teks: string }> = {
  sky: { tile: 'from-sky-100 to-sky-200', bar: 'bg-sky-400', badge: 'bg-sky-100 text-sky-700', teks: 'text-sky-600' },
  emerald: { tile: 'from-emerald-100 to-emerald-200', bar: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700', teks: 'text-emerald-600' },
  amber: { tile: 'from-amber-100 to-amber-200', bar: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', teks: 'text-amber-600' },
  rose: { tile: 'from-rose-100 to-rose-200', bar: 'bg-rose-400', badge: 'bg-rose-100 text-rose-700', teks: 'text-rose-600' },
  violet: { tile: 'from-violet-100 to-violet-200', bar: 'bg-violet-400', badge: 'bg-violet-100 text-violet-700', teks: 'text-violet-600' },
  orange: { tile: 'from-orange-100 to-orange-200', bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700', teks: 'text-orange-600' },
  pink: { tile: 'from-pink-100 to-pink-200', bar: 'bg-pink-400', badge: 'bg-pink-100 text-pink-700', teks: 'text-pink-600' },
  lime: { tile: 'from-lime-100 to-lime-200', bar: 'bg-lime-500', badge: 'bg-lime-100 text-lime-700', teks: 'text-lime-600' },
}

export const GAYA_DEFAULT = GAYA_FENOMENA.emerald

/** Warna identitas fenomena (hex) — selaras token Stitch "Colorful Clean". */
export const HEX_FENOMENA: Record<string, string> = {
  sky: '#38BDF8',
  emerald: '#34D399',
  amber: '#FBBF24',
  rose: '#FB7185',
  violet: '#A78BFA',
  orange: '#FB923C',
  pink: '#F472B6',
  lime: '#A3E635',
}

/** Warna identitas per tahap (hex + kelas Tailwind statis). */
export const WARNA_TAHAP: Record<string, { hex: string; bg: string; bgSoft: string; teks: string; badge: string }> = {
  kenali: { hex: '#0EA5E9', bg: 'bg-sky-500', bgSoft: 'bg-sky-100', teks: 'text-sky-600', badge: 'bg-sky-100 text-sky-700' },
  eksplorasi: { hex: '#14B8A6', bg: 'bg-teal-500', bgSoft: 'bg-teal-100', teks: 'text-teal-600', badge: 'bg-teal-100 text-teal-700' },
  ekspresikan: { hex: '#8B5CF6', bg: 'bg-violet-500', bgSoft: 'bg-violet-100', teks: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' },
  asah: { hex: '#F59E0B', bg: 'bg-amber-500', bgSoft: 'bg-amber-100', teks: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  evaluasi: { hex: '#10B981', bg: 'bg-emerald-500', bgSoft: 'bg-emerald-100', teks: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
}

export const WARNA_TAHAP_DEFAULT = WARNA_TAHAP.kenali

/** Ikon per tahap untuk daftar aktivitas. */
export const IKON_TAHAP: Record<string, string> = {
  kenali: '🔍',
  eksplorasi: '🧭',
  ekspresikan: '💡',
  asah: '✏️',
  evaluasi: '⭐',
}

/** Format waktu ramah: "Hari ini, 09.41" / "Kemarin, 16.05" / "12 Okt 2026, 10.12". */
export function waktuRamah(ms: number): string {
  const d = new Date(ms)
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.')
  const hariIni = new Date(); hariIni.setHours(0, 0, 0, 0)
  const kemarin = new Date(hariIni); kemarin.setDate(kemarin.getDate() - 1)
  const tgl = new Date(d); tgl.setHours(0, 0, 0, 0)
  if (tgl.getTime() === hariIni.getTime()) return `Hari ini, ${jam}`
  if (tgl.getTime() === kemarin.getTime()) return `Kemarin, ${jam}`
  return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, ${jam}`
}
