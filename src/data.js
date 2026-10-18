export const phenomena = [
  { id:'teknologi', title:'Bijak Berteknologi', tag:'Dunia digital', code:'01', mark:'Aa', color:'mint', ready:true, description:'Jelajahi ide, pilih kata, lalu ciptakan drafmu. Lima ruang, satu perjalanan yang kamu tentukan.' },
  { id:'lingkungan', title:'Cinta Lingkungan', tag:'Sekitar kita', code:'02', mark:'∿', color:'sand' },
  { id:'menolong', title:'Tolong Menolong', tag:'Kepedulian', code:'03', mark:'↗', color:'rose' },
  { id:'perundungan', title:'Stop Perundungan!', tag:'Ruang aman', code:'04', mark:'≠', color:'lavender' },
  { id:'belajar', title:'Semangat Belajar', tag:'Tumbuh bersama', code:'05', mark:'✳', color:'sky' },
  { id:'budaya', title:'Lestarikan Budaya!', tag:'Warisan kita', code:'06', mark:'⌘', color:'sand' },
  { id:'berbeda', title:'Berbeda Itu Istimewa', tag:'Keberagaman', code:'07', mark:'∞', color:'rose' },
  { id:'sehat', title:'Hidup Sehat', tag:'Keseharian', code:'08', mark:'＋', color:'mint' }
];
export const stages = [
  { id:'kenali', short:'Kenali', title:'Kenali Fenomena', label:'Amati sebuah situasi', prompt:'Skenario sintetis: tokoh Demo A sedang menulis pesan, lalu memilih berhenti sejenak sebelum mengirim. Apa yang ingin kamu tanyakan tentang situasi ini?', field:'Catatan pengamatan demo', placeholder:'Tulis ide pengamatanmu…', hint:'Stimulus singkat ini hanya untuk menguji alur, bukan artikel atau pemantik final.' },
  { id:'eksplorasi', short:'Eksplorasi', title:'Eksplorasi Fenomena', label:'Jelajahi kemungkinan', prompt:'Dalam simulasi, pilih tindakan tokoh Demo A. Tidak ada jawaban benar/salah atau nilai pada prototipe ini.', field:'Alasan pilihan demo', placeholder:'Jelaskan alasan pilihanmu…', hint:'Pilihan dan alasan disimpan sebagai respons, bukan bukti penguasaan.' },
  { id:'ekspresikan', short:'Ekspresikan', title:'Ekspresikan Pengetahuan', label:'Bermain dengan susunan kata', prompt:'Gunakan empat baris di bawah untuk mencoba menyusun larik. Boleh berupa fragmen percobaan; aplikasi belum memeriksa rima, suku kata, atau sampiran–isi.', field:'Percobaan empat larik', placeholder:'Larik percobaan 1\nLarik percobaan 2\nLarik percobaan 3\nLarik percobaan 4', hint:'Belum ada contoh pantun, kunci jawaban, atau penilaian bahasa yang disahkan.' },
  { id:'kreativitas', short:'Kreativitas', title:'Asah Kreativitas', label:'Beri ruang untuk idemu', prompt:'Konteks demo tetap: “jeda sebelum mengirim pesan”. Cobalah menulis draf tentang gagasan itu. Konteks ini tidak diacak saat kamu kembali.', field:'Draf karya demo', placeholder:'Tulis percobaan drafmu di sini…', hint:'Karya ini hanya tersimpan dalam browser untuk demo. Jangan masukkan identitas atau pengalaman pribadi.' },
  { id:'evaluasi', short:'Evaluasi', title:'Evaluasi Karya', label:'Lihat kembali prosesmu', prompt:'Simpan refleksi sementara, bahkan jika belum membuat draf. Tahap ini tidak terkunci oleh tahap lain.', field:'Refleksi demo', placeholder:'Apa yang ingin kamu coba atau perbaiki nanti?', hint:'Daftar periksa ini untuk demonstrasi interaksi, bukan rubrik akademik atau penilaian Guru.' }
];
export const sliceIds = stages.map(stage => `teknologi:${stage.id}`);
