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
