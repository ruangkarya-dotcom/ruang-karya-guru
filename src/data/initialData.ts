import { Karya, Pelatihan, Artikel, ChartDataMonthly, ChartDataFormat, Peserta, BroadcastTemplate, BroadcastLog } from '../types';

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
