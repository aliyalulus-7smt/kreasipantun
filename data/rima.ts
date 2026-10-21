// Referensi pilihan rima untuk kartu bantuan menyusun pantun (tahap Asah),
// model panel Rima A / Rima B seperti /limar/elaborate v1.
// Satu kelompok akhiran dipakai untuk baris 1 & 3 (rima A),
// kelompok lain untuk baris 2 & 4 (rima B) — pola sajak a-b-a-b.
export interface KataRimaRef { teks: string; kategori: 'benda' | 'sifat' | 'kerja' }
export interface KelompokRima { akhiran: string; kata: KataRimaRef[] }

const b = (teks: string): KataRimaRef => ({ teks, kategori: 'benda' })
const s = (teks: string): KataRimaRef => ({ teks, kategori: 'sifat' })
const k = (teks: string): KataRimaRef => ({ teks, kategori: 'kerja' })

export const referensiRima: KelompokRima[] = [
  { akhiran: '-a', kata: [b('cahaya'), s('bahagia'), s('ceria'), s('nyata'), b('dunia'), b('senja')] },
  { akhiran: '-i', kata: [b('hati'), b('melati'), s('sejati'), b('pagi'), b('budi'), k('pergi')] },
  { akhiran: '-an', kata: [b('awan'), b('kawan'), b('jalan'), b('bulan'), b('taman'), b('teman')] },
  { akhiran: '-ang', kata: [k('pulang'), s('senang'), k('datang'), k('kenang'), k('terbang'), s('sayang')] },
  { akhiran: '-ar', kata: [k('belajar'), s('segar'), s('sabar'), s('mekar'), s('benar'), s('sadar')] },
  { akhiran: '-u', kata: [b('ilmu'), b('jamu'), s('malu'), s('baru'), b('guru'), s('rindu')] },
  { akhiran: '-ai', kata: [s('damai'), s('ramai'), s('pandai'), s('santai'), k('capai'), b('sungai')] },
  { akhiran: '-ih', kata: [s('bersih'), s('jernih'), s('gigih'), s('pedih'), k('latih'), s('putih')] },
  { akhiran: '-ah', kata: [s('indah'), s('mudah'), s('ramah'), s('cerah'), s('megah'), b('sekolah')] },
  { akhiran: '-at', kata: [s('sehat'), s('hebat'), b('sahabat'), s('taat'), s('lebat'), b('semangat')] },
]

export const labelKategori: Record<KataRimaRef['kategori'], string> = {
  benda: 'Kata benda', sifat: 'Kata sifat', kerja: 'Kata kerja',
}
