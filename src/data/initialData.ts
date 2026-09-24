import { Karya, Pelatihan, Artikel, ChartDataMonthly, ChartDataFormat, Peserta, BroadcastTemplate, BroadcastLog } from '../types';

export const DEFAULT_OFFICIAL_MASTER_TEMPLATES: Karya[] = [
  {
    id: 'TMPL-MST-001',
    judul: 'Master Template Modul Ajar Deep Learning (Mindful, Meaningful, Joyful)',
    deskripsi: 'Format baku acuan penyusunan Modul Ajar berbasis Deep Learning terintegrasi Kurikulum Merdeka. Memuat panduan pemetaan Capaian Pembelajaran, alur diferensiasi konten & proses, serta instrumen asesmen bermakna.',
    tujuanPembelajaran: 'Format acuan resmi standar penjaminan mutu kurasi nasional bagi pendidik dalam menyusun modul ajar interaktif.',
    namaGuru: 'Drs. Hendra Suwandi, M.Pd.',
    nipOrInstansi: 'Pusat Kurasi Mutu Nasional / Kemendikbudristek',
    mataPelajaran: 'Umum / Semua Mata Pelajaran',
    jenjang: 'SMA/SMK',
    kategori: 'Modul Ajar / RPP',
    formatFile: 'DOCX',
    ukuranFile: '2.4 MB',
    tanggalUpload: '01 Feb 2026',
    status: 'Disetujui',
    jumlahDownload: 842,
    jumlahView: 2340,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isMasterTemplate: true,
    visibility: 'public',
    petunjukPenggunaan: 'Unduh file format DOCX, sesuaikan identitas mata pelajaran, capaian pembelajaran, dan rubrik asesmen sesuai karakteristik peserta didik Anda.',
    trainingTopic: 'Standardisasi Modul Deep Learning 2026',
    fase: 'Fase E & F',
    version: 'v2.4'
  },
  {
    id: 'TMPL-MST-002',
    judul: 'Template Lembar Kerja Peserta Didik (LKPD) Interaktif Berdiferensiasi',
    deskripsi: 'Desain format LKPD kontekstual dengan teknik scaffolding bertingkat (level dasar, menengah, pengayaan). Dilengkapi instruksi aktivitas studi kasus dan refleksi metakognitif.',
    tujuanPembelajaran: 'Menyediakan panduan terstruktur bagi siswa dalam mengeksplorasi konsep dan memecahkan permasalahan nyata.',
    namaGuru: 'Prof. Dr. Agus Setiawan',
    nipOrInstansi: 'Tim Asesor Mutu Perangkat Ajar Nasional',
    mataPelajaran: 'Umum / Tematik',
    jenjang: 'SMP',
    kategori: 'Lembar Kerja (LKPD)',
    formatFile: 'PDF',
    ukuranFile: '1.9 MB',
    tanggalUpload: '05 Feb 2026',
    status: 'Disetujui',
    jumlahDownload: 615,
    jumlahView: 1820,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isMasterTemplate: true,
    visibility: 'public',
    petunjukPenggunaan: 'Dapat langsung dicetak atau disematkan dalam Google Classroom/LMS untuk pengerjaan digital oleh peserta didik.',
    trainingTopic: 'Desain LKPD Berdiferensiasi',
    fase: 'Fase D',
    version: 'v1.8'
  },
  {
    id: 'TMPL-MST-003',
    judul: 'Panduan & Format Rubrik Asesmen Otentik HOTS (Diagnostik, Formatif, Sumatif)',
    deskripsi: 'Paket instrumen evaluasi komprehensif memuat rubrik analitik skala 4, pedoman penskoran unjuk kerja proyek, kisi-kisi asesmen sumatif, dan format umpan balik kualitatif.',
    tujuanPembelajaran: 'Standar baku instrumen asesmen yang sahih, adil, dan berorientasi pada penalaran tingkat tinggi (HOTS).',
    namaGuru: 'Drs. Hendra Suwandi, M.Pd.',
    nipOrInstansi: 'Pusat Kurasi Mutu Nasional',
    mataPelajaran: 'Umum / Lintas Disiplin',
    jenjang: 'SMA/SMK',
    kategori: 'Bank Soal & Asesmen',
    formatFile: 'DOCX',
    ukuranFile: '3.1 MB',
    tanggalUpload: '10 Feb 2026',
    status: 'Disetujui',
    jumlahDownload: 529,
    jumlahView: 1540,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isMasterTemplate: true,
    visibility: 'public',
    petunjukPenggunaan: 'Gunakan rubrik analitik pada lampiran untuk menilai asesmen kinerja portofolio atau presentasi projek murid.',
    trainingTopic: 'Asesmen Otentik Berbasis HOTS',
    fase: 'Semua Fase',
    version: 'v3.0'
  },
  {
    id: 'TMPL-MST-004',
    judul: 'Master Template Alur Tujuan Pembelajaran (ATP) & Program Semester Adaptif',
    deskripsi: 'Matriks pemetaan Capaian Pembelajaran (CP) ke Alur Tujuan Pembelajaran (ATP) dan Program Semester. Lengkap dengan alokasi JP, rincian materi inti, serta glosarium istilah.',
    tujuanPembelajaran: 'Perencanaan kurikuler tahunan dan semesteran yang sistematis dan mudah diaudit saat akreditasi sekolah.',
    namaGuru: 'Anisa Rahmawati, S.Kom.',
    nipOrInstansi: 'Tim Teknis Kurikulum Digital',
    mataPelajaran: 'Umum / Semua Mata Pelajaran',
    jenjang: 'SD',
    kategori: 'Modul Ajar / RPP',
    formatFile: 'DOCX',
    ukuranFile: '1.6 MB',
    tanggalUpload: '14 Feb 2026',
    status: 'Disetujui',
    jumlahDownload: 410,
    jumlahView: 1290,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isMasterTemplate: true,
    visibility: 'public',
    petunjukPenggunaan: 'Sesuaikan target capaian mingguan dengan kalender pendidikan daerah masing-masing.',
    trainingTopic: 'Penyusunan ATP & Prosem Kurikulum Merdeka',
    fase: 'Fase A, B, C',
    version: 'v2.1'
  },
  {
    id: 'TMPL-MST-005',
    judul: 'Template Slide Presentasi Interaktif Pembelajaran Digital (Canva & PPTX)',
    deskripsi: 'Master template slide presentasi kelas berstandar pedagogik modern. Memuat layout apersepsi interaktif, pemantik diskusi, infografis visual materi, dan kuis refleksi akhir sesi.',
    tujuanPembelajaran: 'Meningkatkan keterlibatan aktif dan daya serap visual peserta didik di era pembelajaran multimedia.',
    namaGuru: 'Tim Kreatif Multimedia Pusdiklat RKG',
    nipOrInstansi: 'RuangKarya Guru Indonesia',
    mataPelajaran: 'Umum / Semua Mata Pelajaran',
    jenjang: 'Umum',
    kategori: 'Presentasi / PPT',
    formatFile: 'PPTX',
    ukuranFile: '8.7 MB',
    tanggalUpload: '18 Feb 2026',
    status: 'Disetujui',
    jumlahDownload: 938,
    jumlahView: 3120,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isMasterTemplate: true,
    visibility: 'public',
    petunjukPenggunaan: 'Dapat dibuka dan diedit menggunakan Microsoft PowerPoint 2016+ atau diimpor langsung ke Canva.',
    trainingTopic: 'Media Pembelajaran Digital Interaktif',
    fase: 'Semua Fase',
    version: 'v1.5'
  },
  {
    id: 'TMPL-MST-006',
    judul: 'Format Portofolio Bukti Karya & Laporan Diseminasi Pelatihan 32 JP',
    deskripsi: 'Bundel arsip resmi kelulusan diklat: Lembar pengesahan Kepala Sekolah, catatan jurnal refleksi aksi nyata, dokumentasi diseminasi rekan sejawat, dan instrumen monev.',
    tujuanPembelajaran: 'Format pelaporan wajib bagi peserta pelatihan untuk memenuhi syarat verifikasi dan penerbitan Sertifikat 32 JP.',
    namaGuru: 'Direktorat Standardisasi Kurikulum & Diklat',
    nipOrInstansi: 'Pusat Layanan Sertifikasi Nasional',
    mataPelajaran: 'Pengembangan Keprofesian Berkelanjutan (PKB)',
    jenjang: 'Umum',
    kategori: 'E-Book & Panduan',
    formatFile: 'ZIP',
    ukuranFile: '11.5 MB',
    tanggalUpload: '20 Feb 2026',
    status: 'Disetujui',
    jumlahDownload: 1240,
    jumlahView: 4210,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isMasterTemplate: true,
    visibility: 'public',
    petunjukPenggunaan: 'Ekstrak file ZIP dan lengkapi berkas PDF/Word di dalamnya sebelum diunggah ke meja verifikasi kurator.',
    trainingTopic: 'Pelatihan Nasional 32 JP',
    fase: 'Semua Fase',
    version: 'v3.2'
  }
];

export const INITIAL_KARYA_LIST: Karya[] = [];

export const INITIAL_PELATIHAN_LIST: Pelatihan[] = [];

export const INITIAL_ARTIKEL_LIST: Artikel[] = [];

export const MONTHLY_TREND_DATA: ChartDataMonthly[] = [];

export const FILE_FORMAT_DISTRIBUTION: ChartDataFormat[] = [];

export const INITIAL_PESERTA_LIST: Peserta[] = [];

export const INITIAL_BROADCAST_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 'TMPL-001',
    kode: 'konfirmasi',
    judul: '1. Pesan Konfirmasi Pendaftaran & Akses Grup WA',
    saluran: 'Keduanya',
    subjekEmail: '[KONFIRMASI] Pendaftaran Workshop Nasional Telah Diterima - Ruang Karya Guru',
    pesanBody: `Selamat! Pendaftaran Bpk/Ibu [Nama Peserta] dalam kegiatan *"[Judul Workshop]"* telah berhasil tercatat di sistem Ruang Karya Guru.

📋 **Data Kepesertaan Anda:**
• Nama Lengkap & Gelar: [Nama Peserta]
• NUPTK/NIP: [NUPTK atau NIP]
• Instansi: [Nama Instansi]
• ID Registrasi: [ID Peserta]

🔗 **Langkah Wajib Selanjutnya:**
Silakan bergabung ke Grup Resmi WhatsApp Peserta untuk koordinasi teknis dan informasi tautan ruang belajar virtual:
[Link Grup WhatsApp]

Sampai jumpa di ruang belajar virtual! ✨
_Salam Hangat, Tim Panitia Ruang Karya Guru_`
  },
  {
    id: 'TMPL-002',
    kode: 'pengingat_h1',
    judul: '2. Pengingat H-1 Pelaksanaan & Tautan Ruang Virtual',
    saluran: 'Keduanya',
    subjekEmail: '[PENGINGAT H-1] Workshop *"[Judul Workshop]"* Dimulai Besok!',
    pesanBody: `Halo Bpk/Ibu [Nama Peserta],

Mengingatkan kembali bahwa agenda Workshop Nasional *"[Judul Workshop]"* akan diselenggarakan **BESOK**:
📅 **Hari, Tanggal:** [Tanggal Pelaksanaan]
⏰ **Pukul:** [Waktu Pelaksanaan] WIB
💻 **Media:** Zoom Meeting (Link interaktif)

🔗 **Tautan Ruang Virtual:**
• Link Zoom: [Link Zoom]
• Meeting ID: [Meeting ID]
• Passcode: [Passcode]

Mohon hadir 10 menit sebelum acara dimulai untuk presensi awal. Pastikan audio dan video berfungsi dengan baik.

Salam inovasi pendidikan! 🚀`
  },
  {
    id: 'TMPL-003',
    kode: 'pengingat_h2jam',
    judul: 'Pengingat H-2 Jam Sebelum Sesi Live Dimulai',
    saluran: 'WhatsApp',
    subjekEmail: '',
    pesanBody: `[PENGINGAT PENTING - 2 JAM LAGI! ⏰]

Yth. Bpk/Ibu [Nama Peserta], 

Sesi Workshop *"[Judul Workshop]"* akan segera dimulai dalam waktu **2 JAM**!

🚀 **Akses Langsung Ruang Virtual:**
• Link Zoom: [Link Zoom]
• Meeting ID: [Meeting ID]
• Passcode: [Passcode]

Pastikan koneksi internet stabil dan perangkat Anda dalam kondisi siap. Mari manfaatkan sesi interaktif ini bersama Narasumber Ahli.

Sampai jumpa di Ruang Zoom! ✨`
  },
  {
    id: 'TMPL-004',
    kode: 'followup_tugas',
    judul: '3. Pesan Follow-up Pengumpulan Tugas & Link Presensi',
    saluran: 'Keduanya',
    subjekEmail: '[PENGINGAT] Presensi & Pengumpulan Tugas Akhir Workshop - [Judul Workshop]',
    pesanBody: `Yth. Bpk/Ibu [Nama Peserta],

Terima kasih banyak atas partisipasi antusias Bpk/Ibu dalam sesi Workshop *"[Judul Workshop]"*.

📝 **1. Link Form Presensi Kehadiran:**
Bagi Bpk/Ibu yang belum mengisi daftar hadir hari ini, silakan isi form presensi berikut:
[Link Presensi]

📤 **2. Pengumpulan Tugas Mandiri & Karya Guru:**
Sebagai syarat kelulusan penerbitan **Sertifikat Resmi 32 JP**, mohon mengunggah hasil karya/modul pembelajaran sebelum batas waktu:
• **Batas Waktu Pengumpulan:** [Deadline Tugas]
• **Portal Pengumpulan Tugas:** [Link Upload Tugas]
• **Template Modul/LKPD:** [Link Template]

Setiap karya yang dikirimkan akan diverifikasi oleh Tim Penilai sebelum sertifikat diterbitkan.

Tetap semangat berkarya demi kemajuan pendidikan Indonesia! 🎓🇮🇩`
  }
];

export const INITIAL_BROADCAST_LOGS: BroadcastLog[] = [];
