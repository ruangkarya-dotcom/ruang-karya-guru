export interface SoalUjian {
  id: number;
  pertanyaan: string;
  pilihan: {
    key: 'A' | 'B' | 'C' | 'D';
    teks: string;
  }[];
  kunciJawaban: 'A' | 'B' | 'C' | 'D';
  pembahasan: string;
}

export const SOAL_PRE_TEST: SoalUjian[] = [
  {
    id: 1,
    pertanyaan: "Dalam Kurikulum Merdeka, dokumen utama yang memuat capaian pembelajaran pada setiap akhir fase disebut dengan...",
    pilihan: [
      { key: 'A', teks: 'Alur Tujuan Pembelajaran (ATP)' },
      { key: 'B', teks: 'Capaian Pembelajaran (CP)' },
      { key: 'C', teks: 'Modul Proyek Penguatan Profil Pelajar Pancasila' },
      { key: 'D', teks: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)' }
    ],
    kunciJawaban: 'B',
    pembahasan: 'Capaian Pembelajaran (CP) merupakan kompetensi pembelajaran yang harus dicapai peserta didik pada setiap fase.'
  },
  {
    id: 2,
    pertanyaan: "Bagaimana peran Artificial Intelligence (AI) yang paling tepat dalam perancangan modul ajar diferensiasi?",
    pilihan: [
      { key: 'A', teks: 'Menggantikan peran guru sepenuhnya dalam proses belajar mengajar' },
      { key: 'B', teks: 'Menghasilkan lembar kerja siswa tanpa perlu telaah dan kurasi guru' },
      { key: 'C', teks: 'Sebagai asisten penunjang perumusan ide skenario, diferensiasi konten, dan rubrik asesmen' },
      { key: 'D', teks: 'Hanya digunakan untuk merekap nilai kehadiran siswa secara otomatis' }
    ],
    kunciJawaban: 'C',
    pembahasan: 'AI bertindak sebagai akselerator dan asisten perancangan modul ajar yang tetap memerlukan telaah profesional guru.'
  },
  {
    id: 3,
    pertanyaan: "Asesmen yang dilakukan di awal siklus pembelajaran untuk memetakan kesiapan dan gaya belajar peserta didik adalah...",
    pilihan: [
      { key: 'A', teks: 'Asesmen Sumatif Akhir Semester' },
      { key: 'B', teks: 'Asesmen Diagnostik Awal (Kognitif & Non-Kognitif)' },
      { key: 'C', teks: 'Asesmen Formatif Tengah Semester' },
      { key: 'D', teks: 'Ujian Standar Nasional Berbasis Komputer' }
    ],
    kunciJawaban: 'B',
    pembahasan: 'Asesmen diagnostik bertujuan memetakan kesiapan, minat, serta latar belakang awal peserta didik.'
  },
  {
    id: 4,
    pertanyaan: "Teknik 'Prompt Engineering' yang efektif untuk menyusun asesmen otentik berbantu AI mencakup komponen utama berupa...",
    pilihan: [
      { key: 'A', teks: 'Peran (Role), Konteks (Context), Instruksi (Task), dan Format Keluaran (Constraint/Output)' },
      { key: 'B', teks: 'Perintah singkat tanpa deskripsi fase dan jenjang' },
      { key: 'C', teks: 'Hanya memasukkan kata kunci judul materi' },
      { key: 'D', teks: 'Menyalin seluruh buku teks tanpa instruksi spesifik' }
    ],
    kunciJawaban: 'A',
    pembahasan: 'Struktur prompt yang jelas mencakup Role, Context, Task, dan Constraints/Output Format untuk menghasilkan respons presisi.'
  },
  {
    id: 5,
    pertanyaan: "Komponen minimum yang wajib ada dalam Modul Ajar Kurikulum Merdeka menurut regulasi BSKAP Kemendikbudristek adalah...",
    pilihan: [
      { key: 'A', teks: 'Hanya lembar soal pilihan ganda dan kunci jawaban' },
      { key: 'B', teks: 'Tujuan Pembelajaran, Langkah Kegiatan Pembelajaran, dan Rencana Asesmen' },
      { key: 'C', teks: 'Rincian anggaran operasional sekolah dan jadwal tahunan' },
      { key: 'D', teks: 'Daftar riwayat hidup guru dan surat pengangkatan' }
    ],
    kunciJawaban: 'B',
    pembahasan: 'Komponen inti minimum modul ajar meliputi Tujuan Pembelajaran, Langkah Kegiatan Pembelajaran, dan Rencana Asesmen Pembelajaran.'
  }
];

export const SOAL_POST_TEST: SoalUjian[] = [
  {
    id: 1,
    pertanyaan: "Dalam perancangan modul ajar berbasis Kurikulum Merdeka Fase E/F, dasar utama dalam penentuan bukti ketercapaian Tujuan Pembelajaran (TP) adalah...",
    pilihan: [
      { key: 'A', teks: 'Jumlah halaman LKPD yang dikerjakan peserta didik' },
      { key: 'B', teks: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) dan Rubrik Kinerja' },
      { key: 'C', teks: 'Tingkat kesulitan materi menurut buku referensi asing' },
      { key: 'D', teks: 'Alokasi anggaran laboratorium digital sekolah' }
    ],
    kunciJawaban: 'B',
    pembahasan: 'KKTP dan rubrik kinerja menjadi panduan otentik untuk memvalidasi apakah peserta didik telah mencapai tujuan pembelajaran.'
  },
  {
    id: 2,
    pertanyaan: "Manakah strategi diferensiasi yang paling tepat diterapkan ketika peserta didik memiliki variasi kesiapan belajar (readiness)?",
    pilihan: [
      { key: 'A', teks: 'Memberikan materi dan perlakuan seragam kepada seluruh peserta didik' },
      { key: 'B', teks: 'Diferensiasi proses melalui pemberian scaffolding berjenjang dan media interaktif bertingkat' },
      { key: 'C', teks: 'Menurunkan standar kelulusan menjadi tidak terukur' },
      { key: 'D', teks: 'Memisahkan peserta didik ke ruang kelas berbeda secara permanen' }
    ],
    kunciJawaban: 'B',
    pembahasan: 'Diferensiasi proses dengan scaffolding memungkinkan murid bertumbuh dari titik awal kompetensinya masing-masing.'
  },
  {
    id: 3,
    pertanyaan: "Saat menyusun Media Pembelajaran Interaktif (HTML5/Digital), prinsip 'Multimodal Learning' diwujudkan melalui...",
    pilihan: [
      { key: 'A', teks: 'Hanya menampilkan teks panjang tanpa ilustrasi' },
      { key: 'B', teks: 'Kombinasi visual grafis, audio narasi, simulasi interaktif, dan kuis langsung' },
      { key: 'C', teks: 'Menggunakan video animasi tanpa keterkaitan dengan tujuan pembelajaran' },
      { key: 'D', teks: 'Membuat dokumen PDF hasil scan yang tidak dapat dicari kata kuncinya' }
    ],
    kunciJawaban: 'B',
    pembahasan: 'Multimodalitas memperkuat retensi belajar melalui kombinasi visual, kinestetik/interaktif, dan auditori.'
  },
  {
    id: 4,
    pertanyaan: "Bagaimana cara guru memastikan etika dan integritas akademik saat memanfaatkan Generative AI dalam perangkat ajar?",
    pilihan: [
      { key: 'A', teks: 'Menyalin langsung seluruh respons AI tanpa verifikasi kontekstual' },
      { key: 'B', teks: 'Melakukan validasi materi, penyesuaian konteks karakteristik murid di sekolah, dan mencantumkan atribusi' },
      { key: 'C', teks: 'Menghindari pemeriksaan kesesuaian kurikulum nasional' },
      { key: 'D', teks: 'Menggunakan AI secara sembunyi-sembunyi tanpa kurasi' }
    ],
    kunciJawaban: 'B',
    pembahasan: 'Guru wajib melakukan validasi substansi ilmiah, kontekstualisasi kearifan lokal, dan penjaminan mutu pedagogik.'
  },
  {
    id: 5,
    pertanyaan: "Portofolio perangkat ajar yang lolos kurasi mutu RuangKarya Guru dapat dimanfaatkan untuk pemenuhan sasaran kinerja di PMM, yaitu sebagai...",
    pilihan: [
      { key: 'A', teks: 'Dokumen bukti fisik Bukti Karya & Pengembangan Kompetensi (RHK PMM)' },
      { key: 'B', teks: 'Pengganti SK Penetapan Angka Kredit Jabatan Fungsional Guru' },
      { key: 'C', teks: 'Hanya sebagai arsip pribadi tanpa nilai pengembangan diri' },
      { key: 'D', teks: 'Alat promosi komersial di luar ranah pendidikan' }
    ],
    kunciJawaban: 'A',
    pembahasan: 'Portofolio modul ajar dan laporan pelatihan 32 JP diakui sebagai bukti fisik pengembangan kompetensi pada Platform Merdeka Mengajar (PMM).'
  }
];
