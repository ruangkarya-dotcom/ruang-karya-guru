export type FileFormat = 'PDF' | 'DOCX' | 'PPTX' | 'MP4' | 'MP3' | 'HTML5' | 'ZIP';

export type CategoryType = 
  | 'Modul Ajar / RPP'
  | 'Media Interaktif (HTML5)'
  | 'Video Pembelajaran'
  | 'Lembar Kerja (LKPD)'
  | 'Bank Soal & Asesmen'
  | 'Presentasi / PPT'
  | 'E-Book & Panduan';

export type VerificationStatus = 'Pending' | 'Disetujui' | 'Ditolak';

export interface Review {
  id: string;
  nama: string;
  instansi: string;
  teks: string;
  tanggal: string;
  rating?: number;
}

export interface Karya {
  id: string;
  judul: string;
  deskripsi: string;
  tujuanPembelajaran?: string;
  namaGuru: string;
  authorId?: string;
  nipOrInstansi: string;
  mataPelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA/SMK' | 'Umum';
  kategori: CategoryType;
  formatFile: FileFormat;
  ukuranFile: string;
  tanggalUpload: string;
  status: VerificationStatus;
  jumlahDownload: number;
  jumlahView: number;
  fileUrl?: string;
  previewUrl?: string;
  catatanVerifikasi?: string;
  reviews?: Review[];
  isMasterTemplate?: boolean;
  visibility?: 'public' | 'internal';
  petunjukPenggunaan?: string;
  trainingTopic?: string;
  fase?: string;
  externalLink?: string;
  version?: string;
  batchProgram?: string;
}

export interface Pelatihan {
  id: string;
  judul: string;
  penyelenggara: string;
  narasumber: string;
  tanggal: string;
  waktu: string;
  tipe: 'Webinar' | 'Workshop' | 'Sertifikasi';
  kuota: number;
  terdaftar: number;
  deskripsi: string;
  gambar: string;
  status: 'Buka' | 'Segera' | 'Selesai';
}

export interface Artikel {
  id: string;
  judul: string;
  penulis: string;
  tanggal: string;
  kategori: string;
  ringkasan: string;
  konten: string;
  waktuBaca: string;
  gambar: string;
}

export type AdminRole = 'super_admin' | 'admin_kurator';

export interface AdminProfileData {
  id?: string;
  nama: string;
  gelar?: string;
  nip?: string;
  idAdmin?: string;
  instansi: string;
  jabatan: string;
  adminRole: AdminRole;
  email?: string;
  noWhatsapp?: string;
  lokasi?: string;
  bio?: string;
  avatarUrl?: string;
  spesialisasi?: string[];
  skPenugasan?: string;
  nomorRegistrasiKurator?: string;
}

export interface AdminTeamMember {
  id: string;
  email: string;
  nama: string;
  adminRole: AdminRole;
  password?: string;
  ditambahkan: string;
  status: 'Aktif' | 'Nonaktif';
}

export type UserStatus = 'active' | 'pending_approval' | 'rejected';

export interface User {
  id: string;
  email: string;
  nama: string;
  role: 'admin' | 'guru';
  adminRole?: AdminRole;
  status?: UserStatus;
  instansi?: string;
  nip?: string;
  nuptk?: string;
  noWhatsapp?: string;
  jenjang?: 'PAUD' | 'SD' | 'SMP' | 'SMA/SMK' | 'Umum' | 'Lainnya' | string;
  kabupatenKota?: string;
  tanggalDaftar?: string;
  avatarUrl?: string;
}

export interface Peserta {
  id: string;
  namaLengkapGelar: string;
  nuptkOrNip: string;
  asalInstansi: string;
  jenjang: 'PAUD' | 'SD' | 'SMP' | 'SMA/SMK' | 'Umum' | 'Lainnya' | string;
  kabupatenKota: string;
  emailAktif: string;
  noWhatsapp: string;
  statusValidasi: 'Valid' | 'Belum Verifikasi' | 'Tidak Valid';
  kehadiranH1: boolean;
  kehadiranH2: boolean;
  kehadiranH3: boolean;
  statusTugas: 'Sudah Mengumpulkan' | 'Belum Mengumpulkan' | 'Perlu Revisi';
  nilaiTugas?: number;
  statusKelulusan: 'Lulus' | 'Proses' | 'Tidak Lulus';
  tanggalDaftar: string;
}

export interface BroadcastTemplate {
  id: string;
  kode: 'konfirmasi' | 'pengingat_h1' | 'pengingat_h2jam' | 'followup_tugas';
  judul: string;
  saluran: 'WhatsApp' | 'Email' | 'Keduanya';
  subjekEmail?: string;
  pesanBody: string;
}

export interface BroadcastLog {
  id: string;
  waktu: string;
  penerima: string;
  tipePesan: string;
  saluran: 'WhatsApp' | 'Email';
  status: 'Terkirim' | 'Gagal' | 'Pending';
  keterangan?: string;
}

export interface ChartDataMonthly {
  bulan: string;
  totalUpload: number;
  disetujui: number;
}

export interface ChartDataFormat {
  name: string;
  value: number;
  color: string;
}
