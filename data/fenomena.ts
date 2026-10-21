/**
 * Konten 8 Fenomena x 5 Tahap — dari KONSEP_MEDIA_BARU.docx
 * Struktur generik agar tiap tahap bisa dirender komponen yang sesuai.
 */

export type IdFenomena =
  | 'bijak-berteknologi' | 'cinta-lingkungan' | 'tolong-menolong'
  | 'stop-perundungan' | 'semangat-belajar' | 'lestarikan-budaya'
  | 'berbeda-itu-istimewa' | 'hidup-sehat'

export type IdTahap = 'kenali' | 'eksplorasi' | 'ekspresikan' | 'asah' | 'evaluasi'

export interface Pilihan { teks: string; benar?: boolean; label?: string; penjelasan?: string }
export interface TahapKonten {
  judul: string
  tipe: string
  data: Record<string, any>
}

export interface Fenomena {
  id: IdFenomena
  nama: string
  icon: string
  warna: string
  tahap: Record<IdTahap, TahapKonten>
}

export const DAFTAR_TAHAP: { id: IdTahap; nama: string }[] = [
  { id: 'kenali', nama: 'Kenali Fenomena' },
  { id: 'eksplorasi', nama: 'Eksplorasi Fenomena' },
  { id: 'ekspresikan', nama: 'Ekspresikan Pengetahuan' },
  { id: 'asah', nama: 'Asah Kreativitas' },
  { id: 'evaluasi', nama: 'Evaluasi Karya' },
]

export const FENOMENA: Fenomena[] = [
  // ================= 1. BIJAK BERTEKNOLOGI =================
  {
    id: 'bijak-berteknologi', nama: 'Bijak Berteknologi', icon: '📱', warna: 'sky',
    tahap: {
      kenali: {
        judul: 'Kenali Fenomena', tipe: 'artikel',
        data: {
          // Naskah artikel dari lampiran pemilik (diterima 21 Okt 2026)
          artikel: `Bijak Berteknologi: Manfaatkan Internet, Jaga Diri!

Internet dan teknologi digital sudah menjadi bagian dari kehidupan remaja. Melalui internet, kita dapat mencari informasi, belajar hal baru, menonton video pembelajaran, berkomunikasi dengan teman, serta mengembangkan kreativitas. Namun, teknologi perlu digunakan secara bijak agar manfaatnya dapat dirasakan tanpa mengabaikan keselamatan diri.

Penggunaan internet juga memiliki risiko. Berdasarkan laporan UNICEF Indonesia (2025), hanya 37,5% anak yang pernah menerima informasi tentang cara menjaga keamanan saat menggunakan internet. Selain itu, 42% anak mengaku pernah merasa tidak nyaman atau takut akibat pengalaman mereka di dunia daring. Data tersebut menunjukkan bahwa kemampuan menggunakan teknologi perlu disertai pengetahuan tentang cara melindungi diri di internet.

Ada beberapa cara untuk menggunakan teknologi dengan bijak. Pertama, manfaatkan internet untuk belajar dan mencari informasi dari sumber yang tepercaya. Kedua, periksa kebenaran informasi sebelum membagikannya kepada orang lain. Ketiga, gunakan bahasa yang sopan ketika berkomunikasi di media sosial dan hindari komentar yang menyakiti orang lain. Keempat, jangan sembarangan membagikan informasi pribadi, seperti alamat rumah, kata sandi, atau nomor telepon, kepada orang yang tidak dikenal.

Dengan demikian, teknologi bukan hanya alat untuk mencari hiburan, tetapi juga sarana untuk belajar, berkarya, dan menyebarkan pesan positif. Remaja dapat memanfaatkan teknologi untuk menghasilkan karya kreatif, termasuk pantun yang mengajak teman sebaya menggunakan internet secara bertanggung jawab.`,
          catatan: 'Artikel tentang penggunaan teknologi secara bijak (lampiran).',
          pertanyaan: [
            'Sudahkah kamu menggunakan teknologi untuk hal-hal yang bermanfaat? Apa buktinya?',
          ],
        },
      },
      eksplorasi: {
        judul: 'Eksplorasi Fenomena', tipe: 'benar-salah',
        data: {
          pernyataan: [
            { teks: 'Internet dapat dimanfaatkan untuk mencari informasi, belajar, dan mengembangkan kreativitas.', benar: true, penjelasan: 'Internet memang berguna untuk mencari informasi, belajar, dan mengembangkan kreativitas jika digunakan dengan bijak.' },
            { teks: 'Semua informasi yang ditemukan di internet dapat langsung dipercaya dan dibagikan kepada orang lain.', benar: false, penjelasan: 'Tidak semua informasi di internet benar. Kita harus memeriksa kebenarannya dulu sebelum percaya atau membagikannya.' },
            { teks: 'Remaja dapat memanfaatkan teknologi untuk menghasilkan karya kreatif, termasuk pantun yang berisi pesan positif.', benar: true, penjelasan: 'Teknologi dapat dipakai untuk berkarya, misalnya membuat pantun digital yang berisi pesan positif.' },
            { teks: 'Menjaga keamanan di internet dapat dilakukan dengan membagikan kata sandi kepada teman agar akun lebih mudah diakses.', benar: false, penjelasan: 'Kata sandi adalah rahasia pribadi. Membagikannya kepada orang lain justru membuat akun tidak aman.' },
          ] as Pilihan[],
          kartuFakta: [
            'Teknologi memberikan hiburan dan akses informasi, tetapi penggunaannya tanpa kendali dapat membawa pelajar pada aktivitas yang merugikan.',
            'Bermain gim secara berlebihan dapat mengganggu keseimbangan antara waktu belajar, istirahat, aktivitas fisik, dan interaksi sosial.',
            'Informasi yang dibagikan di media sosial dapat tersebar luas dan sulit dihapus sepenuhnya, sehingga remaja perlu berhati-hati saat membagikan foto, alamat, atau informasi pribadi.',
          ],
        },
      },
      ekspresikan: {
        judul: 'Ekspresikan Pengetahuan', tipe: 'susun-larik',
        data: {
          acak: [
            'Tidur cukup belajar pun tenang',
            'Pergi ke kebun memetik jambu',
            'Main gim bijak atur waktu',
            'Dibawa pulang dalam keranjang',
          ],
          benar: [
            'Pergi ke kebun memetik jambu',
            'Dibawa pulang dalam keranjang',
            'Main gim bijak atur waktu',
            'Tidur cukup belajar pun tenang',
          ],
        },
      },
      asah: {
        judul: 'Asah Kreativitas', tipe: 'tulis-kata-kunci',
        data: {
          instruksi: 'Tulis isi pantun (baris 3-4) berdasarkan kata kunci berikut.',
          kataKunci: ['Becak', 'Kayutangan', 'Bijak', 'Kecanduan'],
        },
      },
      evaluasi: {
        judul: 'Evaluasi Karya', tipe: 'checklist',
        data: {
          item: [
            'Setiap baris terdiri atas 8-12 suku kata',
            'Akhir baris membentuk sajak a-b-a-b',
            'Isi pantunku memuat gagasan/pesan tentang fenomena penggunaan teknologi',
            'Pilihan kata dalam pantunku tepat dan indah',
          ],
        },
      },
    },
  },

  // ================= 2. CINTA LINGKUNGAN =================
  {
    id: 'cinta-lingkungan', nama: 'Cinta Lingkungan', icon: '🌱', warna: 'emerald',
    tahap: {
      kenali: {
        judul: 'Kenali Fenomena', tipe: 'video',
        data: {
          videoUrl: 'https://youtu.be/Q0Ej9W5s_RQ?si=Is5bIaZvnH-1ujiB',
          judulVideo: 'Permasalahan sampah di Indonesia',
          pertanyaan: [
            'Apa permasalahan lingkungan yang kamu temukan dalam video tersebut?',
            'Mengapa sampah yang tidak dikelola dengan baik dapat merugikan manusia dan lingkungan?',
          ],
        },
      },
      eksplorasi: {
        judul: 'Eksplorasi Fenomena', tipe: 'pilah',
        data: {
          instruksi: 'Kelompokkan jenis sampah menjadi organik dan anorganik.',
          kelompok: ['Organik', 'Anorganik'],
          item: [
            { teks: 'Kantong plastik', kelompok: 'Anorganik' },
            { teks: 'Kulit pisang', kelompok: 'Organik' },
            { teks: 'Sisa nasi', kelompok: 'Organik' },
            { teks: 'Botol plastik', kelompok: 'Anorganik' },
            { teks: 'Daun kering', kelompok: 'Organik' },
            { teks: 'Kaleng bekas', kelompok: 'Anorganik' },
          ],
          kartuFakta: [
            'Sampah plastik membutuhkan waktu sangat lama untuk terurai secara alami, bahkan dapat bertahan di lingkungan selama ratusan tahun.',
            'Penebangan pohon secara berlebihan dapat menyebabkan erosi tanah karena akar pohon tidak lagi membantu mengikat tanah.',
            'Sampah yang dibuang ke sungai dapat menyumbat aliran air dan meningkatkan risiko banjir, terutama saat hujan deras.',
          ],
        },
      },
      ekspresikan: {
        judul: 'Ekspresikan Pengetahuan', tipe: 'identifikasi-sampiran-isi',
        data: {
          instruksi: 'Tentukan mana sampiran dan mana isi dari larik berikut.',
          larik: [
            { teks: 'Menanam padi di tepi kali', kunci: 'sampiran' },
            { teks: 'Kupu-kupu hinggap di bunga', kunci: 'sampiran' },
            { teks: 'Burung camar terbang berputar', kunci: 'sampiran' },
            { teks: 'Agar bumi bersih dan lestari', kunci: 'isi' },
            { teks: 'Jaga pohon sepenuh hati', kunci: 'isi' },
            { teks: 'Buang sampah pada tempatnya', kunci: 'isi' },
          ],
        },
      },
      asah: {
        judul: 'Asah Kreativitas', tipe: 'tulis-sampiran',
        data: {
          instruksi: 'Tulis sampiran (baris 1-2) untuk isi pantun berikut.',
          isi: ['Sayangi lingkungan jaga bumi', 'Agar hidup sehat dan sejahtera'],
        },
      },
      evaluasi: {
        judul: 'Evaluasi Karya', tipe: 'checklist',
        data: {
          item: [
            'Setiap baris terdiri atas 8-12 suku kata',
            'Akhir baris membentuk sajak a-b-a-b',
            'Isi pantunku memuat gagasan/pesan tentang fenomena lingkungan',
            'Pilihan kata dalam pantunku tepat dan indah',
          ],
        },
      },
    },
  },

  // ================= 3. TOLONG MENOLONG =================
  {
    id: 'tolong-menolong', nama: 'Tolong Menolong', icon: '🤝', warna: 'amber',
    tahap: {
      kenali: {
        judul: 'Kenali Fenomena', tipe: 'artikel',
        data: {
          // Cerita dari lampiran pemilik (diterima 21 Okt 2026)
          artikel: `Uluran Tangan untuk Sesama

Saat pulang sekolah, Raka melihat berita tentang warga yang terdampak banjir di daerah sekitar tempat tinggalnya. Banyak rumah terendam air dan beberapa keluarga kesulitan mendapatkan makanan serta pakaian bersih. Raka mengajak teman-temannya mengumpulkan bantuan berupa makanan, pakaian layak pakai, dan perlengkapan kebersihan. Mereka juga membantu memilah dan mengemas barang-barang tersebut agar mudah dibagikan. Awalnya, hanya beberapa teman yang ikut, tetapi semakin banyak siswa bergabung setelah mengetahui kegiatan itu. Melihat semangat teman-temannya, Raka menyadari bahwa membantu sesama tidak harus menunggu menjadi kaya atau memiliki banyak barang. Kepedulian, tenaga, dan tindakan sederhana pun dapat meringankan beban orang lain.`,
          catatan: 'Cerita tentang bantuan bagi korban bencana banjir (lampiran).',
          pertanyaan: [
            'Masalah apa yang dialami warga dalam cerita tersebut?',
            'Mengapa tindakan Raka dan teman-temannya dapat membantu meringankan beban warga yang terdampak banjir?',
          ],
        },
      },
      eksplorasi: {
        judul: 'Eksplorasi Fenomena', tipe: 'pilih-tindakan',
        data: {
          instruksi: 'Pilih tindakan yang tepat untuk tiap situasi.',
          situasi: [
            {
              teks: 'Warga mengungsi dan kedinginan.',
              pilihan: [
                'Memotret lalu mengunggahnya ke sosial media',
                'Mengumpulkan selimut dan pakaian layak',
                'Menonton saja',
              ],
              kunci: 1, penjelasan: 'Saat warga kedinginan, bantuan yang paling tepat adalah memberikan selimut dan pakaian layak, bukan sekadar memotret atau menonton.'
            },
            {
              teks: 'Teman sekelas kehilangan buku karena banjir.',
              pilihan: ['Meminjamkan dan menyumbang buku', 'Menjual buku yang kita punya', 'Pura-pura tidak tahu'],
              kunci: 0, penjelasan: 'Meminjamkan atau menyumbang buku membantu teman tetap bisa belajar setelah kehilangan bukunya.'
            },
            {
              teks: 'Ada ajakan donasi dari akun tak dikenal.',
              pilihan: ['Langsung transfer', 'Menyebarkannya tanpa cek', 'Cek dulu lembaganya yang terpercaya'],
              kunci: 2, penjelasan: 'Sebelum berdonasi, pastikan dulu lembaga atau akunnya terpercaya agar bantuan tidak disalahgunakan.'
            },
          ],
          kartuFakta: [
            'Menolong orang lain dapat meningkatkan rasa empati, yaitu kemampuan memahami perasaan dan keadaan orang lain.',
            'Kerja sama dan gotong royong dapat meringankan pekerjaan karena tugas dilakukan bersama-sama.',
            'Menolong sesama tidak selalu membutuhkan uang atau barang, tetapi juga dapat dilakukan dengan memberikan waktu, tenaga, perhatian, atau dukungan.',
          ],
        },
      },
      ekspresikan: {
        judul: 'Ekspresikan Pengetahuan', tipe: 'pasang-rima',
        data: {
          instruksi: 'Pasangkan kata yang memiliki kesamaan rima.',
          kata: ['Ketan', 'Jambu', 'Kali', 'Pantai', 'Hati', 'Teman', 'Damai', 'Syahdu'],
          pasangan: [['Ketan', 'Teman'], ['Jambu', 'Syahdu'], ['Kali', 'Hati'], ['Pantai', 'Damai']],
        },
      },
      asah: {
        judul: 'Asah Kreativitas', tipe: 'lengkapi-isi',
        data: {
          instruksi: 'Lengkapi isi pantun dari sampiran berikut. Gunakan kata "menolong" dan "sesama".',
          sampiran: ['Di atas meja ada gelas kosong', 'Gelas bunga milik mama'],
        },
      },
      evaluasi: {
        judul: 'Evaluasi Karya', tipe: 'checklist',
        data: {
          item: [
            'Setiap baris terdiri atas 8-12 suku kata',
            'Akhir baris membentuk sajak a-b-a-b',
            'Isi pantunku memuat gagasan/pesan tentang fenomena tolong menolong',
            'Pilihan kata dalam pantunku tepat dan indah',
          ],
        },
      },
    },
  },

  // ================= 4. STOP PERUNDUNGAN! =================
  {
    id: 'stop-perundungan', nama: 'Stop Perundungan!', icon: '🛡️', warna: 'rose',
    tahap: {
      kenali: {
        judul: 'Kenali Fenomena', tipe: 'gambar',
        data: {
          gambarUrl: '/fenomena/stop-perundungan.jpg',
          pinUrl: 'https://www.pinterest.com/pin/798192733999662735/',
          catatan: 'Poster tentang perundungan.',
          pertanyaan: [
            'Perilaku apa yang termasuk perundungan berdasarkan poster tersebut?',
            'Bagaimana perasaan seseorang yang mengalami perundungan, dan apa dampaknya bagi dirinya?',
          ],
        },
      },
      eksplorasi: {
        judul: 'Eksplorasi Fenomena', tipe: 'pilah',
        data: {
          instruksi: 'Kelompokkan kalimat berdasarkan sifatnya.',
          kelompok: ['Menyakiti', 'Tidak menyakiti'],
          item: [
            { teks: 'Kamu tidak boleh ikut bermain bersama kami!', kelompok: 'Menyakiti' },
            { teks: 'Ayo, aku bantu kamu memahami soal yang sulit itu.', kelompok: 'Tidak menyakiti' },
            { teks: 'Dasar jelek! Wajahmu aneh sekali!', kelompok: 'Menyakiti' },
            { teks: 'Tidak apa-apa kalau pendapatmu berbeda denganku.', kelompok: 'Tidak menyakiti' },
            { teks: 'Ayo, bergabung dengan kelompok kami agar kita bisa mengerjakan tugas bersama.', kelompok: 'Tidak menyakiti' },
            { teks: 'Kalau kamu melaporkan aku, awas saja nanti!', kelompok: 'Menyakiti' },
          ],
          kartuFakta: [
            'Perundungan (bullying) dapat terjadi secara langsung maupun melalui media digital, seperti pesan pribadi dan komentar di media sosial.',
            'Perundungan yang dilakukan berulang kali dapat menyebabkan korban merasa takut, kehilangan kepercayaan diri, dan mengalami kesulitan berkonsentrasi saat belajar.',
            'Saksi perundungan dapat membantu menghentikannya dengan tidak ikut mengejek, memberikan dukungan kepada korban, dan melaporkan kejadian kepada guru atau orang dewasa tepercaya.',
          ],
        },
      },
      ekspresikan: {
        judul: 'Ekspresikan Pengetahuan', tipe: 'lengkapi-rumpang',
        data: {
          pantun: ['Anak itik berenang di kali', 'Burung hantu bertengger di dahan', '___', 'Sekolah ramah semua teman'],
          rumpangKe: 2,
          pilihan: ['Bersama teman selalu', 'Stop perundungan kita saling peduli', 'Jangan ada perundungan'],
          kunci: 1,
        },
      },
      asah: {
        judul: 'Asah Kreativitas', tipe: 'tulis-tantangan',
        data: {
          instruksi: 'Pilih satu tantangan, lalu tulis pantunmu.',
          tantangan: [
            'Gunakan kata "berani" dan "teman"; isi pantun mengajak menolong korban perundungan.',
            'Gunakan kata "aman" dan "sekolah"; isi pantun mengajak sekolah ramah.',
            'Gunakan kata "hargai" dan "kata"; isi pantun menasihati agar tidak mengejek.',
          ],
        },
      },
      evaluasi: {
        judul: 'Evaluasi Karya', tipe: 'checklist',
        data: {
          item: [
            'Setiap baris terdiri atas 8-12 suku kata',
            'Akhir baris membentuk sajak a-b-a-b',
            'Isi pantunku memuat gagasan/pesan tentang fenomena perundungan',
            'Pilihan kata dalam pantunku tepat dan indah',
          ],
        },
      },
    },
  },

  // ================= 5. SEMANGAT BELAJAR =================
  {
    id: 'semangat-belajar', nama: 'Semangat Belajar', icon: '📚', warna: 'violet',
    tahap: {
      kenali: {
        judul: 'Kenali Fenomena', tipe: 'gambar',
        data: {
          gambarUrl: '/fenomena/semangat-belajar.jpg',
          pinUrl: 'https://www.pinterest.com/pin/1128081406676011727/',
          catatan: 'Foto tentang semangat belajar dalam berbagai kondisi.',
          pertanyaan: [
            'Apa pesan yang ingin disampaikan melalui poster tersebut?',
            'Mengapa semangat belajar penting bagi peserta didik meskipun menghadapi kesulitan?',
          ],
        },
      },
      eksplorasi: {
        judul: 'Eksplorasi Fenomena', tipe: 'pilah',
        data: {
          instruksi: 'Identifikasi perilaku positif seorang pelajar.',
          kelompok: ['Positif', 'Negatif'],
          item: [
            { teks: 'Begadang bermain game', kelompok: 'Negatif' },
            { teks: 'Berlatih rutin setiap hari', kelompok: 'Positif' },
            { teks: 'Bertanya jika belum paham', kelompok: 'Positif' },
            { teks: 'Menyontek saat ulangan', kelompok: 'Negatif' },
            { teks: 'Membantu teman yang kesulitan', kelompok: 'Positif' },
            { teks: 'Menunda tugas sampai besok', kelompok: 'Negatif' },
          ],
          kartuFakta: [],
        },
      },
      ekspresikan: {
        judul: 'Ekspresikan Pengetahuan', tipe: 'hitung-suku-kata',
        data: {
          instruksi: 'Hitung jumlah suku kata pada tiap larik berikut.',
          larik: [
            { teks: 'Gi-at be-la-jar se-ti-ap ha-ri', kunci: 8 },
            { teks: 'Un-tuk-me-ra-ih-ci-ta-ci-ta', kunci: 8 },
          ],
        },
      },
      asah: {
        judul: 'Asah Kreativitas', tipe: 'tulis-tantangan',
        data: {
          instruksi: 'Pilih satu tantangan, lalu tulis pantunmu.',
          tantangan: [
            'Gunakan kata "keterbatasan" dan "impian"; pesan: keterbatasan bukan halangan berprestasi.',
            'Gunakan kata "tekun" dan "cita"; pesan: ketekunan membuat kita juara.',
            'Gunakan kata "ilmu" dan "semangat"; pesan: ajak teman rajin belajar.',
          ],
        },
      },
      evaluasi: {
        judul: 'Evaluasi Karya', tipe: 'checklist',
        data: {
          item: [
            'Setiap baris terdiri atas 8-12 suku kata',
            'Akhir baris membentuk sajak a-b-a-b',
            'Isi pantunku memuat gagasan/pesan tentang fenomena semangat dalam belajar',
            'Pilihan kata dalam pantunku tepat dan indah',
          ],
        },
      },
    },
  },

  // ================= 6. LESTARIKAN BUDAYA! =================
  {
    id: 'lestarikan-budaya', nama: 'Lestarikan Budaya!', icon: '🎭', warna: 'orange',
    tahap: {
      kenali: {
        judul: 'Kenali Fenomena', tipe: 'gambar',
        data: {
          gambarUrl: '/fenomena/lestarikan-budaya.jpg',
          pinUrl: 'https://www.pinterest.com/pin/1066438386758892835/',
          catatan: 'Foto kesenian tradisional Indonesia.',
          pertanyaan: [
            'Menurutmu, apa nama kesenian tradisional yang ditampilkan pada gambar tersebut?',
            'Dari daerah mana kesenian tradisional tersebut berasal?',
          ],
        },
      },
      eksplorasi: {
        judul: 'Eksplorasi Fenomena', tipe: 'kuis',
        data: {
          soal: [
            { teks: 'Tari Saman merupakan kesenian tradisional yang berasal dari?', pilihan: ['Aceh', 'Bali', 'Jawa Barat'], kunci: 0, penjelasan: 'Tari Saman berasal dari Aceh dan dikenal dengan gerakan tangan yang cepat dan serempak.' },
            { teks: 'Alat musik angklung menghasilkan bunyi ketika dimainkan dengan cara?', pilihan: ['Dipetik', 'Digoyangkan', 'Ditiup'], kunci: 1, penjelasan: 'Angklung terbuat dari bambu dan berbunyi saat digoyangkan.' },
            { teks: 'Mengapa kesenian tradisional Indonesia perlu dilestarikan?', pilihan: ['Agar hanya dikenal oleh masyarakat daerah asalnya', 'Agar tidak tergantikan oleh kesenian dari luar negeri', 'Agar tetap dikenal dan diwariskan kepada generasi berikutnya'], kunci: 2, penjelasan: 'Kesenian tradisional perlu dilestarikan agar tetap dikenal dan dapat diwariskan kepada generasi berikutnya.' },
          ],
          kartuFakta: [
            'Indonesia memiliki ribuan warisan budaya, termasuk bahasa daerah, tarian tradisional, musik, pakaian adat, dan upacara adat yang mencerminkan keberagaman masyarakatnya.',
            'Mempelajari kesenian tradisional merupakan salah satu cara generasi muda menjaga agar budaya Indonesia tetap dikenal.',
            'Budaya Indonesia dapat diperkenalkan kepada masyarakat luas melalui pertunjukan seni, festival budaya, media sosial, dan kegiatan di sekolah.',
          ],
        },
      },
      ekspresikan: {
        judul: 'Ekspresikan Pengetahuan', tipe: 'pilih-kata',
        data: {
          soal: [
            {
              pantun: ['Pergi ke Ponorogo naik delman', 'Menonton reog di malam hari', 'Budaya bangsa mari kita ___', 'Agar lestari sepanjang hari'],
              rumpangKe: 2, tanya: 'Kata yang tepat?',
              pilihan: ['Lupakan', 'Lestarikan', 'Abaikan'], kunci: 1,
            },
            {
              pantun: ['Gamelan berbunyi ___ sekali'],
              rumpangKe: 0, tanya: 'Kata yang paling indah?',
              pilihan: ['Sumbang', 'Keras', 'Merdu'], kunci: 2,
            },
          ],
        },
      },
      asah: {
        judul: 'Asah Kreativitas', tipe: 'tulis-gagasan',
        data: {
          instruksi: 'Tulis pantun berdasarkan gagasan berikut.',
          gagasan: 'Bangga pada budaya Indonesia dan mengajak melestarikannya.',
        },
      },
      evaluasi: {
        judul: 'Evaluasi Karya', tipe: 'checklist',
        data: {
          item: [
            'Setiap baris terdiri atas 8-12 suku kata',
            'Akhir baris membentuk sajak a-b-a-b',
            'Isi pantunku memuat gagasan/pesan tentang fenomena pelestarian budaya',
            'Pilihan kata dalam pantunku tepat dan indah',
          ],
        },
      },
    },
  },

  // ================= 7. BERBEDA ITU ISTIMEWA =================
  {
    id: 'berbeda-itu-istimewa', nama: 'Berbeda Itu Istimewa', icon: '🌈', warna: 'pink',
    tahap: {
      kenali: {
        judul: 'Kenali Fenomena', tipe: 'video',
        data: {
          videoUrl: 'https://youtu.be/dUGBT2n0YLA?si=F_iuuh6a5lkHSqK-',
          judulVideo: 'Keberagaman Indonesia',
          pertanyaan: ['Mengapa kita perlu bangga terhadap keberagaman yang dimiliki bangsa Indonesia?'],
        },
      },
      eksplorasi: {
        judul: 'Eksplorasi Fenomena', tipe: 'pilah',
        data: {
          instruksi: 'Tentukan sikap yang sesuai dengan keberagaman.',
          kelompok: ['Sesuai', 'Tidak sesuai'],
          item: [
            { teks: 'Berteman dengan siapa saja', kelompok: 'Sesuai' },
            { teks: 'Mengejek logat teman', kelompok: 'Tidak sesuai' },
            { teks: 'Ikut merayakan hari besar teman', kelompok: 'Sesuai' },
            { teks: 'Tidak mau sebangku karena beda suku', kelompok: 'Tidak sesuai' },
            { teks: 'Belajar lagu daerah teman', kelompok: 'Sesuai' },
            // Catatan PRD: kunci sumber "tidak sesuai" untuk kerja kelompok perlu ditinjau; dinonaktifkan sementara
          ],
          kartuFakta: [],
        },
      },
      ekspresikan: {
        judul: 'Ekspresikan Pengetahuan', tipe: 'pasang-sampiran-isi',
        data: {
          instruksi: 'Pilih isi yang sesuai dengan sampiran dan menunjukkan keberagaman.',
          sampiran: ['Pelangi indah di langit biru', 'Tujuh warna bersanding rapi.'],
          pilihan: [
            { isi: ['Rajin belajar setiap waktu', 'Raih cita dengan berani'], benar: false },
            { isi: ['Mari tanam pohon yang baru', 'Agar bumi tetap lestari'], benar: false },
            { isi: ['Berbeda bukanlah hal tabu', 'Bersatu kita menjaga negeri'], benar: true },
          ],
        },
      },
      asah: {
        judul: 'Asah Kreativitas', tipe: 'tulis-pesan',
        data: {
          instruksi: 'Tulis pantun berdasarkan pesan berikut.',
          pesan: 'Berbeda adalah hal yang istimewa, kita harus saling menghargai perbedaan dan keberagaman yang ada.',
        },
      },
      evaluasi: {
        judul: 'Evaluasi Karya', tipe: 'checklist',
        data: {
          item: [
            'Setiap baris terdiri atas 8-12 suku kata',
            'Akhir baris membentuk sajak a-b-a-b',
            'Isi pantunku memuat gagasan/pesan tentang fenomena keberagaman dan toleransi',
            'Pilihan kata dalam pantunku tepat dan indah',
          ],
        },
      },
    },
  },

  // ================= 8. HIDUP SEHAT =================
  {
    id: 'hidup-sehat', nama: 'Hidup Sehat', icon: '🍎', warna: 'lime',
    tahap: {
      kenali: {
        judul: 'Kenali Fenomena', tipe: 'pilih-makanan',
        data: {
          instruksi: 'Pilih makanan yang sehat dan bergizi, lalu letakkan dalam piringmu!',
          makanan: [
            { nama: 'Nasi', sehat: true }, { nama: 'Minuman soda', sehat: false },
            { nama: 'Susu', sehat: true }, { nama: 'Brokoli', sehat: true },
            { nama: 'Permen', sehat: false }, { nama: 'Telur', sehat: true },
            { nama: 'Donat', sehat: false }, { nama: 'Kentang goreng', sehat: false },
            { nama: 'Apel', sehat: true }, { nama: 'Ikan', sehat: true },
          ],
          pertanyaan: [
            'Makanan bergizi apa saja yang sudah kamu konsumsi hari ini?',
            'Mengapa kita perlu membiasakan diri mengonsumsi makanan bergizi setiap hari?',
          ],
        },
      },
      eksplorasi: {
        judul: 'Eksplorasi Fenomena', tipe: 'benar-salah',
        data: {
          pernyataan: [
            { teks: 'Melewatkan sarapan dapat membantu tubuh menjadi lebih sehat dan bugar.', benar: false, penjelasan: 'Sarapan memberi energi untuk beraktivitas dan belajar, jadi melewatkannya justru membuat tubuh lemas.' },
            { teks: 'Tidur yang cukup membantu tubuh memulihkan energi dan menjaga konsentrasi saat belajar.', benar: true, penjelasan: 'Saat tidur, tubuh memulihkan energi dan memperbaiki diri, sehingga kita lebih fokus saat belajar.' },
            { teks: 'Mencuci tangan dengan sabun dan air mengalir dapat membantu mencegah penyebaran kuman penyebab penyakit.', benar: true, penjelasan: 'Sabun dan air mengalir membersihkan kuman di tangan, sehingga penyakit lebih sulit menyebar.' },
            { teks: 'Minum air putih hanya diperlukan ketika kita merasa haus.', benar: false, penjelasan: 'Tubuh membutuhkan air secara teratur sepanjang hari, bukan hanya saat merasa haus.' },
          ] as Pilihan[],
          kartuFakta: [
            'Tubuh membutuhkan beragam zat gizi, seperti karbohidrat, protein, lemak, vitamin, dan mineral, agar dapat tumbuh dan berfungsi dengan baik.',
            'Remaja usia 13–18 tahun dianjurkan tidur selama 8–10 jam setiap malam untuk mendukung pertumbuhan, kesehatan, dan konsentrasi belajar.',
            'Aktivitas fisik secara teratur membantu menjaga kesehatan jantung, memperkuat otot dan tulang, serta meningkatkan kebugaran tubuh.',
          ],
        },
      },
      ekspresikan: {
        judul: 'Ekspresikan Pengetahuan', tipe: 'perbaiki-rima',
        data: {
          pantun: [
            'Pergi ke pasar membeli ikan',
            'Ikan dimasak bersama kari',
            'Rajin olahraga setiap hari',
            'Agar tubuh sehat dan berseri.',
          ],
          soal: [
            {
              tanya: 'Baris manakah yang menunjukkan ketidaksesuaian pola rima pantun tersebut?',
              pilihan: ['Baris pertama', 'Baris kedua', 'Baris ketiga'], kunci: 1,
            },
            {
              tanya: 'Apa alasan pola rima pada baris tersebut perlu diperbaiki?',
              pilihan: [
                'Karena pantun harus memiliki empat baris dengan jumlah kata yang sama.',
                'Karena bunyi akhir baris pertama dan ketiga serta baris kedua dan keempat harus bersajak a-b-a-b.',
                'Karena bagian sampiran harus menyampaikan pesan tentang kesehatan.',
              ],
              kunci: 1,
            },
          ],
        },
      },
      asah: {
        judul: 'Asah Kreativitas', tipe: 'tulis-mandiri',
        data: { instruksi: 'Tulis pantun utuh secara mandiri bertema hidup sehat.' },
      },
      evaluasi: {
        judul: 'Evaluasi Karya', tipe: 'checklist',
        data: {
          item: [
            'Setiap baris terdiri atas 8-12 suku kata',
            'Akhir baris membentuk sajak a-b-a-b',
            'Isi pantunku memuat gagasan/pesan tentang fenomena hidup sehat',
            'Pilihan kata dalam pantunku tepat dan indah',
          ],
        },
      },
    },
  },
]

export function cariFenomena(id: string): Fenomena | undefined {
  return FENOMENA.find(f => f.id === id)
}
