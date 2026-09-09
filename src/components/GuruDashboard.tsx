import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download, 
  Printer, 
  Video, 
  Calendar, 
  UserCheck, 
  Settings, 
  ExternalLink, 
  Eye, 
  EyeOff,
  Sparkles, 
  FileCheck, 
  ShieldCheck, 
  School, 
  FolderCheck,
  Mail, 
  Phone, 
  Key, 
  Save, 
  RefreshCw, 
  Plus, 
  Check, 
  X,
  PlayCircle,
  FileSpreadsheet,
  QrCode,
  Share2,
  Lock,
  BadgeCheck,
  Building2,
  BookMarked,
  Trash2
} from 'lucide-react';
import { User, Karya, Peserta, CategoryType, FileFormat } from '../types';
import { SOAL_PRE_TEST, SOAL_POST_TEST, SoalUjian } from '../data/soalTesData';

interface GuruDashboardProps {
  currentUser: User;
  karyaList: Karya[];
  onUploadKarya: (newKarya: Karya) => void;
  onUpdateUser: (updatedUser: User) => void;
  onSelectKaryaForPreview: (karya: Karya) => void;
  onDeleteKarya?: (id: string) => void;
  onDownloadKarya?: (id: string) => void;
  onViewPublicProfile?: () => void;
  initialSubTab?: 'pelatihan' | 'karya' | 'laporan' | 'pengaturan';
  autoOpenUpload?: boolean;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({
  currentUser,
  karyaList,
  onUploadKarya,
  onUpdateUser,
  onSelectKaryaForPreview,
  onDeleteKarya,
  onDownloadKarya,
  onViewPublicProfile,
  initialSubTab = 'pelatihan',
  autoOpenUpload = false,
}) => {
  // Navigation sub-tabs for Guru
  const [activeTab, setActiveTab] = useState<'pelatihan' | 'karya' | 'laporan' | 'pengaturan'>(initialSubTab);

  // Teacher Profile state for "Pengaturan Akun"
  const [profileNama, setProfileNama] = useState(currentUser.nama || '');
  const [profileNip, setProfileNip] = useState(currentUser.nip || '');
  const [profileNuptk, setProfileNuptk] = useState(currentUser.nuptk || '');
  const [profileInstansi, setProfileInstansi] = useState(currentUser.instansi || '');
  const [profileJenjang, setProfileJenjang] = useState<'PAUD' | 'SD' | 'SMP' | 'SMA/SMK' | 'Umum' | 'Lainnya' | string>(
    currentUser.jenjang || 'SMA/SMK'
  );
  const [profileKota, setProfileKota] = useState(currentUser.kabupatenKota || '');
  const [profileEmail, setProfileEmail] = useState(currentUser.email || '');
  const [profileWa, setProfileWa] = useState(currentUser.noWhatsapp || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [passwordSaveSuccess, setPasswordSaveSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Upload Form State for "Ruang Karya Saya"
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(autoOpenUpload || initialSubTab === 'karya' && autoOpenUpload);

  const [judulKarya, setJudulKarya] = useState('');
  const [mapelKarya, setMapelKarya] = useState('Matematika');
  const [jenjangKarya, setJenjangKarya] = useState<'SD' | 'SMP' | 'SMA/SMK' | 'Umum'>('SMA/SMK');
  const [kategoriKarya, setKategoriKarya] = useState<CategoryType>('Modul Ajar / RPP');
  const [formatKarya, setFormatKarya] = useState<FileFormat>('PDF');
  const [tujuanKarya, setTujuanKarya] = useState('');
  const [deskripsiKarya, setDeskripsiKarya] = useState('');
  const [fileUrlKarya, setFileUrlKarya] = useState('');
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);
  const [karyaToDelete, setKaryaToDelete] = useState<Karya | null>(null);

  // Filter Teacher's Karya List
  const myKaryaList = karyaList.filter(k => 
    (currentUser.nama && k.namaGuru && k.namaGuru.toLowerCase().includes(currentUser.nama.toLowerCase())) ||
    (currentUser.nip && k.nipOrInstansi && k.nipOrInstansi.includes(currentUser.nip)) ||
    (currentUser.instansi && k.nipOrInstansi && k.nipOrInstansi.toLowerCase().includes(currentUser.instansi.toLowerCase()))
  );

  const displayKaryaList = myKaryaList;

  const approvedKaryaCount = displayKaryaList.filter(k => k.status === 'Disetujui').length;
  const pendingKaryaCount = displayKaryaList.filter(k => k.status === 'Pending').length;
  const revisionKaryaCount = displayKaryaList.filter(k => k.status === 'Ditolak').length;

  // Workshop Attendance & Progress
  const attendanceProgress = 100; // 32 JP Lulus
  const hasRevisionNotice = displayKaryaList.some(k => k.catatanVerifikasi && k.status === 'Pending');

  // Pre-Test & Post-Test States
  const [preTestStatus, setPreTestStatus] = useState<'selesai' | 'belum'>('selesai');
  const [preTestScore, setPreTestScore] = useState<number>(80);
  const [postTestStatus, setPostTestStatus] = useState<'selesai' | 'belum'>('belum');
  const [postTestScore, setPostTestScore] = useState<number | null>(null);

  // Active Exam Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [activeTestType, setActiveTestType] = useState<'pre' | 'post'>('post');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [testTimeRemaining, setTestTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [submittedScoreResult, setSubmittedScoreResult] = useState<{ correct: number; total: number; score: number } | null>(null);

  // Open Test Modal Handler
  const handleOpenTestModal = (type: 'pre' | 'post') => {
    setActiveTestType(type);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestTimeRemaining(1800);
    setIsTestSubmitted(false);
    setSubmittedScoreResult(null);
    setIsTestModalOpen(true);
  };

  // Select Answer Handler
  const handleSelectAnswer = (qId: number, answerKey: 'A' | 'B' | 'C' | 'D') => {
    if (isTestSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: answerKey,
    }));
  };

  // Submit Test Handler
  const handleSubmitTest = () => {
    const questionList = activeTestType === 'pre' ? SOAL_PRE_TEST : SOAL_POST_TEST;
    let correctCount = 0;

    questionList.forEach(q => {
      if (userAnswers[q.id] === q.kunciJawaban) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / questionList.length) * 100);
    setSubmittedScoreResult({
      correct: correctCount,
      total: questionList.length,
      score: calculatedScore,
    });
    setIsTestSubmitted(true);

    if (activeTestType === 'pre') {
      setPreTestStatus('selesai');
      setPreTestScore(calculatedScore);
    } else {
      setPostTestStatus('selesai');
      setPostTestScore(calculatedScore);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      nama: profileNama,
      nip: profileNip,
      nuptk: profileNuptk,
      instansi: profileInstansi,
      jenjang: profileJenjang,
      kabupatenKota: profileKota,
      email: profileEmail,
      noWhatsapp: profileWa,
    };
    onUpdateUser(updated);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3500);
  };

  // Handle Password Reset
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setPasswordSaveSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaveSuccess(false), 3500);
  };

  // Handle New Karya Upload
  const handleFormUploadKarya = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulKarya || !deskripsiKarya) {
      alert('Mohon lengkapi judul dan deskripsi karya.');
      return;
    }

    const newKaryaItem: Karya = {
      id: `KRG-${Date.now().toString().slice(-4)}`,
      judul: judulKarya,
      deskripsi: deskripsiKarya,
      tujuanPembelajaran: tujuanKarya || 'Meningkatkan kompetensi berpikir kritis peserta didik sesuai Kurikulum Merdeka.',
      namaGuru: currentUser.nama,
      nipOrInstansi: `NIP. ${currentUser.nip || profileNip} / ${currentUser.instansi || profileInstansi}`,
      mataPelajaran: mapelKarya,
      jenjang: jenjangKarya,
      kategori: kategoriKarya,
      formatFile: formatKarya,
      ukuranFile: '3.4 MB',
      tanggalUpload: new Date().toISOString().split('T')[0],
      status: 'Pending',
      jumlahDownload: 0,
      jumlahView: 1,
      fileUrl: fileUrlKarya || '',
    };

    onUploadKarya(newKaryaItem);
    setIsUploadFormOpen(false);
    setJudulKarya('');
    setDeskripsiKarya('');
    setTujuanKarya('');
    setFileUrlKarya('');
    setUploadSuccessAlert(true);
    setTimeout(() => setUploadSuccessAlert(false), 4000);
  };

  const handlePrintLaporan = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* 1. HERO GREETING & MOTIVATION BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/50 relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-extrabold shadow-2xs">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>Portal Peserta Guru Pembelajar</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Peserta Terverifikasi (32 JP)</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-800/80 border-2 border-cyan-400/40 text-white flex items-center justify-center font-black text-2xl shadow-xl overflow-hidden shrink-0">
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.nama} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  currentUser.nama?.charAt(0) || 'G'
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  Selamat Datang, {currentUser.nama}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-2xl leading-relaxed">
                  {currentUser.instansi || profileInstansi} &bull; NIP. {currentUser.nip || profileNip}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed bg-white/5 border border-white/10 p-3.5 rounded-2xl">
              ✨ <em>"Terima kasih atas dedikasi Ibu/Bapak Guru dalam mengikuti rangkaian Workshop Nasional. Tetap semangat berinovasi dan berkarya menciptakan perangkat ajar bermutu demi kemajuan pendidikan Indonesia!"</em>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch justify-center gap-3 shrink-0">
            {onViewPublicProfile && (
              <button
                id="btn-guru-view-public-portfolio"
                onClick={onViewPublicProfile}
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 border border-white/20 cursor-pointer hover:scale-105 active:scale-95 text-center whitespace-nowrap"
                title="Lihat Tampilan Portofolio Digital Publik yang Dapat Dilihat Rekan Pendidik Lain"
              >
                <Share2 className="w-4 h-4 text-sky-300 shrink-0" />
                <span>Lihat Profil Publik Saya</span>
              </button>
            )}

            <button
              id="btn-guru-download-laporan-shortcut"
              onClick={() => setActiveTab('laporan')}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 border border-emerald-400/30 cursor-pointer hover:scale-105 active:scale-95 text-center whitespace-nowrap"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Unduh Laporan 32 JP</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. NOTIFIKASI BANNER ALERT (Revisi / Kelulusan) */}
      <div className="space-y-3">
        {/* Banner 1: Laporan Kegiatan Siap Unduh */}
        <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-200/70 px-2 py-0.5 rounded-md">
                  Laporan Resmi Terbit
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">Terverifikasi Sistem</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-emerald-950 mt-1">
                Selamat! Laporan Kegiatan Resmi (32 JP) Anda Telah Siap Diunduh
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Anda telah memenuhi 100% kehadiran sesi dan tugas modul ajar telah lolos telaah kurator.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('laporan')}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Lihat & Cetak Laporan PDF</span>
          </button>
        </div>

        {/* Banner 2: Catatan Revisi Kurator (Jika Ada) */}
        {hasRevisionNotice && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                    Catatan Kurator
                  </span>
                  <span className="text-[11px] text-amber-800 font-bold">Perlu Penyempurnaan</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-amber-950 mt-1">
                  Modul Ajar Anda Memerlukan Sedikit Revisi
                </h3>
                <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                  "Mohon lengkapi rubrik penilaian diagnostik non-kognitif pada lampiran modul Anda agar siap dipublikasikan ke Galeri Nasional."
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('karya')}
              className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer hover:scale-105"
            >
              <FileCheck className="w-4 h-4" />
              <span>Buka Ruang Karya & Kirim Revisi</span>
            </button>
          </div>
        )}

        {uploadSuccessAlert && (
          <div className="bg-blue-50 border border-blue-300 rounded-2xl p-4 flex items-center gap-3 text-xs sm:text-sm font-bold text-blue-900 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            <span>Karya baru berhasil diunggah! Berkas Anda saat ini berada dalam antrean kurasi penjaminan mutu.</span>
          </div>
        )}
      </div>

      {/* 3. CARD / WIDGET INFORMASI PENTING (3 Kolom Ringkasan) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* WIDGET 1: Status Pelatihan Aktif */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                Pelatihan Aktif
              </span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Berlangsung
              </span>
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-sm leading-snug">
                Workshop Nasional: Pemanfaatan AI & Modul Ajar Digital 32 JP
              </h3>
              <p className="text-xs text-slate-500 mt-1">Penyelenggara: Direktorat GTK & RuangKarya</p>
            </div>

            {/* Attendance Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Progres Kehadiran</span>
                <span className="text-blue-900 font-extrabold font-mono text-[11px]">100% (32 JP Lengkap)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full w-full"></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>H1 (8 JP)</span>
                <span>•</span>
                <span>H2 (8 JP)</span>
                <span>•</span>
                <span>H3 (16 JP)</span>
              </div>
            </div>

            {/* Indikator & Akses Cepat Pre-Test & Post-Test (Compact Grid Layout) */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
                  <span>Evaluasi Kompetensi</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Wajib 32 JP</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Pre-Test Capsule */}
                <div className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-2 flex flex-col justify-between transition-colors">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase text-slate-700">Pre-Test</span>
                    {preTestStatus === 'selesai' ? (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {preTestScore}/100
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                        Belum
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenTestModal('pre')}
                    className="mt-1.5 w-full py-1 px-1.5 rounded-lg text-[10px] font-extrabold text-blue-800 bg-white hover:bg-blue-50 border border-blue-200 flex items-center justify-center gap-1 cursor-pointer transition-all shadow-2xs"
                  >
                    <Eye className="w-3 h-3 text-blue-700" />
                    <span>{preTestStatus === 'selesai' ? 'Lihat Hasil' : 'Mulai Tes'}</span>
                  </button>
                </div>

                {/* Post-Test Capsule */}
                <div className="bg-blue-50/50 hover:bg-blue-50 border border-blue-200 rounded-xl p-2 flex flex-col justify-between transition-colors">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase text-blue-950">Post-Test</span>
                    {postTestStatus === 'selesai' ? (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {postTestScore}/100
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                        Wajib
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenTestModal('post')}
                    className="mt-1.5 w-full py-1 px-1.5 rounded-lg text-[10px] font-extrabold text-white bg-blue-900 hover:bg-blue-800 flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{postTestStatus === 'selesai' ? 'Ulangi / Cek' : 'Kerjakan Tes'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-600" />
              <span>Sesi 3: Selesai</span>
            </span>
            <button
              onClick={() => setActiveTab('pelatihan')}
              className="text-[11px] font-extrabold text-blue-800 hover:text-blue-950 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Akses Materi</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* WIDGET 2: Status Karya Saya */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                Status Karya & Kurasi
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">Total: {displayKaryaList.length} Karya</span>
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-sm leading-snug">
                Portofolio Perangkat Pembelajaran
              </h3>
              <p className="text-xs text-slate-500 mt-1">Status verifikasi kelayakan terbit di Galeri Nasional</p>
            </div>

            {/* Status breakdown badges */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2">
                <div className="text-lg font-black text-emerald-800 font-mono">{approvedKaryaCount}</div>
                <div className="text-[10px] font-bold text-emerald-700">Disetujui</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2">
                <div className="text-lg font-black text-amber-800 font-mono">{pendingKaryaCount}</div>
                <div className="text-[10px] font-bold text-amber-700">Menunggu</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2">
                <div className="text-lg font-black text-rose-800 font-mono">{revisionKaryaCount}</div>
                <div className="text-[10px] font-bold text-rose-700">Perlu Revisi</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>Nilai Rata-rata: 92 / 100</span>
            </span>
            <button
              onClick={() => setActiveTab('karya')}
              className="text-xs font-extrabold text-purple-800 hover:text-purple-950 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Kelola Karya</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* WIDGET 3: Pusat Unduhan Cepat */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Pusat Unduhan Cepat
              </span>
              <span className="text-xs font-bold text-emerald-700">Format PDF Resmi</span>
            </div>

            <div>
              <h3 className="font-black text-slate-900 text-sm leading-snug">
                Laporan & Transkrip Portofolio
              </h3>
              <p className="text-xs text-slate-500 mt-1">Dokumen resmi ber-QR Code untuk PAK / SKP PMM</p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setActiveTab('laporan')}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                    Laporan Pelatihan 32 JP (.pdf)
                  </span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700" />
              </button>

              <button
                onClick={() => setActiveTab('laporan')}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                    Rekap Transkrip Karya (.pdf)
                  </span>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">No. 800/LK-32JP/GTK/2026</span>
            <button
              onClick={() => setActiveTab('laporan')}
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Cetak Sekarang</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. NAVIGASI / MENU UTAMA GURU (4 TAB UTAMA) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70 p-2 gap-1.5 select-none">
          <button
            onClick={() => setActiveTab('pelatihan')}
            className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pelatihan'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Pelatihan Saya</span>
          </button>

          <button
            onClick={() => setActiveTab('karya')}
            className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'karya'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
            }`}
          >
            <FolderCheck className="w-4 h-4" />
            <span>2. Ruang Karya Saya ({displayKaryaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('laporan')}
            className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'laporan'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Laporan & Portofolio (32 JP)</span>
          </button>

          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pengaturan'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-950 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>4. Pengaturan Akun</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8">

          {/* TAB 1: PELATIHAN SAYA */}
          {activeTab === 'pelatihan' && (
            <div className="space-y-8">
              
              {/* Header Pelatihan */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-blue-100 text-blue-900">
                      Modul Workshop Aktif
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">Tahun Ajaran 2026/2027</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Pelatihan Pemanfaatan AI & Kurikulum Merdeka (32 JP)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Silakan ikuti jadwal sesi tatap muka daring, unduh modul paparan materi, dan lakukan presensi harian.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://zoom.us"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 hover:scale-105"
                  >
                    <Video className="w-4 h-4" />
                    <span>Ruang Zoom Webinar</span>
                  </a>
                </div>
              </div>

              {/* Sesi List Schedule */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Daftar Sesi Workshop & Tautan Presensi
                </h3>

                <div className="space-y-3.5">
                  {/* Hari 1 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-blue-50/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-sm shrink-0 border border-blue-200 shadow-2xs">
                        H1
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            Sesi 1: Perencanaan Pembelajaran & Bedah CP-TP-ATP Berbantu AI
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Presensi Terverifikasi (8 JP)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Narasumber: Dr. Ratna Juwita, M.Pd. &bull; Waktu: 08.30 - 15.30 WIB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <a
                        href="#rekaman"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Membuka rekaman video Sesi 1 di YouTube Channel RuangKarya.');
                        }}
                        className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Tonton Rekaman</span>
                      </a>
                      <a
                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span>Materi PPTX (14 MB)</span>
                      </a>
                    </div>
                  </div>

                  {/* Hari 2 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-blue-50/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-sm shrink-0 border border-blue-200 shadow-2xs">
                        H2
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            Sesi 2: Pembuatan Media Pembelajaran Interaktif & LKPD Digital
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Presensi Terverifikasi (8 JP)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Narasumber: Ir. Hendri Wijaya, S.Kom., M.T. &bull; Waktu: 08.30 - 15.30 WIB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <a
                        href="#rekaman"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Membuka rekaman video Sesi 2 di YouTube Channel RuangKarya.');
                        }}
                        className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Tonton Rekaman</span>
                      </a>
                      <a
                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span>Materi PPTX (22 MB)</span>
                      </a>
                    </div>
                  </div>

                  {/* Hari 3 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:bg-blue-50/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-sm shrink-0 border border-blue-200 shadow-2xs">
                        H3
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            Sesi 3: Praktik Asesmen Otentik & Kurasi Portofolio Mandiri
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Presensi & Tugas Lolos (16 JP)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Narasumber: Tim Kurator Utama &bull; Waktu: 08.30 - 16.00 WIB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        onClick={() => {
                          setActiveTab('karya');
                          setIsUploadFormOpen(true);
                        }}
                        className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Tugas Portofolio</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Bahan Ajar, Template Master & Panduan Resmi Diklat */}
              <div className="bg-gradient-to-br from-blue-900/5 via-slate-50 to-indigo-900/5 border border-blue-200/80 rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-900 text-cyan-300 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>REFERENSI RESMI WORKSHOP (32 JP)</span>
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {karyaList.filter(k => k.isMasterTemplate && k.visibility !== 'internal').length} Format Tersedia
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Bahan Ajar, Template Master & Karya Panduan Resmi
                    </h3>
                    <p className="text-xs text-slate-600">
                      Unduh template master resmi (.docx / .pdf / .pptx) yang diterbitkan instruktur sebagai acuan penyusunan portofolio modul ajar Anda.
                    </p>
                  </div>
                </div>

                {/* Master Templates Grid */}
                {karyaList.filter(k => k.isMasterTemplate && k.visibility !== 'internal').length === 0 ? (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-500">
                    <BookMarked className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-xs sm:text-sm text-slate-700">Belum Ada Template Master</p>
                    <p className="text-xs text-slate-400 mt-0.5">Template resmi yang dipublikasikan kurator akan muncul di bagian ini.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {karyaList
                      .filter(k => k.isMasterTemplate && k.visibility !== 'internal')
                      .map((tmpl) => (
                      <div
                        key={tmpl.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group space-y-4"
                      >
                        <div className="space-y-2.5">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                                <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>TEMPLATE RESMI</span>
                              </span>
                              {tmpl.version && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 font-mono">
                                  {tmpl.version}
                                </span>
                              )}
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              .{tmpl.formatFile} &bull; {tmpl.ukuranFile}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-blue-900 transition-colors line-clamp-2">
                            {tmpl.judul}
                          </h4>

                          {/* Mapel & Fase Tags */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {tmpl.mataPelajaran || 'Umum/Semua Mapel'}
                            </span>
                            {tmpl.fase && tmpl.fase !== 'Semua Fase' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                                {tmpl.fase}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {tmpl.deskripsi}
                          </p>

                          {/* Petunjuk Penggunaan */}
                          {tmpl.petunjukPenggunaan && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[10px] text-slate-700 space-y-0.5">
                              <span className="font-bold text-blue-900 block">Petunjuk Penggunaan:</span>
                              <p className="line-clamp-2 leading-relaxed text-slate-600">{tmpl.petunjukPenggunaan}</p>
                            </div>
                          )}

                          {/* External Link Pill (Canva / Drive) */}
                          {tmpl.externalLink && (
                            <a
                              href={tmpl.externalLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-[11px] font-bold transition-colors w-full justify-center"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span className="truncate">Buka Canva / Google Drive</span>
                            </a>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => onSelectKaryaForPreview(tmpl)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>Pratinjau</span>
                          </button>

                          <button
                            onClick={() => onDownloadKarya ? onDownloadKarya(tmpl.id) : alert(`Mengunduh file master template: ${tmpl.judul}`)}
                            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-[11px] font-extrabold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-102 active:scale-98 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-300" />
                            <span>Unduh Template</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Player Embed / Mockup Section */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm sm:text-base">Video Rekaman Sesi Pembelajaran Terakhir</h4>
                      <p className="text-xs text-slate-400">Pemanfaatan Prompting AI untuk Penyusunan Modul Ajar Diferensiasi</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    Durasi: 1j 42m
                  </span>
                </div>

                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80"
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <button 
                    onClick={() => alert('Memutar rekaman video materi workshop nasional.')}
                    className="absolute w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer"
                  >
                    <PlayCircle className="w-8 h-8" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                    <span className="font-semibold">Pemateri: Dr. Ratna Juwita, M.Pd.</span>
                    <span className="font-mono">Kualitas: 1080p HD</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RUANG KARYA SAYA */}
          {activeTab === 'karya' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Ruang Karya & Portofolio Saya
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Kelola perangkat pembelajaran yang telah diunggah, pantau status kurasi penjaminan mutu, serta catatan feedback kurator.
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadFormOpen(!isUploadFormOpen)}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isUploadFormOpen ? 'Tutup Form Unggah' : 'Unggah Karya Baru'}</span>
                </button>
              </div>

              {/* Form Unggah Karya Baru */}
              <AnimatePresence>
                {isUploadFormOpen && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleFormUploadKarya}
                    className="bg-slate-50 border border-blue-200 p-6 rounded-3xl space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-700" />
                        <span>Formulir Pengunggahan Perangkat Ajar Baru</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsUploadFormOpen(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Karya / Modul Ajar *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Modul Ajar Matematika Berdiferensiasi Bab Geometri Ruang"
                          value={judulKarya}
                          onChange={(e) => setJudulKarya(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran *</label>
                        <input
                          type="text"
                          required
                          placeholder="Matematika / IPAS / Bahasa Indonesia"
                          value={mapelKarya}
                          onChange={(e) => setMapelKarya(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang Pendidikan *</label>
                        <select
                          value={jenjangKarya}
                          onChange={(e) => setJenjangKarya(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="SD">SD (Fase A/B/C)</option>
                          <option value="SMP">SMP (Fase D)</option>
                          <option value="SMA/SMK">SMA/SMK (Fase E/F)</option>
                          <option value="Umum">Umum</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Perangkat *</label>
                        <select
                          value={kategoriKarya}
                          onChange={(e) => setKategoriKarya(e.target.value as CategoryType)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Modul Ajar / RPP">Modul Ajar / RPP</option>
                          <option value="Media Interaktif (HTML5)">Media Interaktif (HTML5)</option>
                          <option value="Video Pembelajaran">Video Pembelajaran</option>
                          <option value="Lembar Kerja (LKPD)">Lembar Kerja (LKPD)</option>
                          <option value="Bank Soal & Asesmen">Bank Soal & Asesmen</option>
                          <option value="Presentasi / PPT">Presentasi / PPT</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Format File *</label>
                        <select
                          value={formatKarya}
                          onChange={(e) => setFormatKarya(e.target.value as FileFormat)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="PDF">PDF (.pdf)</option>
                          <option value="DOCX">DOCX (.docx)</option>
                          <option value="PPTX">PPTX (.pptx)</option>
                          <option value="MP4">MP4 Video (.mp4)</option>
                          <option value="HTML5">HTML5 Interaktif</option>
                          <option value="ZIP">ZIP Arsip (.zip)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan Pembelajaran (CP / TP)</label>
                        <input
                          type="text"
                          placeholder="Tuliskan Capaian Pembelajaran atau Tujuan Pembelajaran..."
                          value={tujuanKarya}
                          onChange={(e) => setTujuanKarya(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat & Ringkasan Modul *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Jelaskan ringkasan materi, skenario pembelajaran, dan keunggulan modul ini..."
                          value={deskripsiKarya}
                          onChange={(e) => setDeskripsiKarya(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tautan Berkas (Google Drive / Cloud Storage / URL)</label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
                          value={fileUrlKarya}
                          onChange={(e) => setFileUrlKarya(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setIsUploadFormOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Kirim Karya untuk Kurasi</span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Table / List Karya Saya */}
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                  <table className="w-full text-left text-xs text-slate-600 border-collapse">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider select-none">
                      <tr>
                        <th className="py-4 px-4 min-w-[220px] border-b border-slate-800">Judul Karya & Mata Pelajaran</th>
                        <th className="py-4 px-4 min-w-[150px] border-b border-slate-800">Kategori & Format</th>
                        <th className="py-4 px-4 text-center min-w-[130px] border-b border-slate-800">Status Kurasi</th>
                        <th className="py-4 px-4 min-w-[200px] border-b border-slate-800">Catatan & Masukan Kurator</th>
                        <th className="py-4 px-4 text-center min-w-[140px] border-b border-slate-800">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium bg-white">
                      {displayKaryaList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500">
                            <FolderCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="font-bold text-sm text-slate-700">Belum Ada Karya yang Diunggah</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                              Anda belum mengunggah karya atau portofolio. Klik tombol "Unggah Karya Baru" di atas untuk menambahkan modul ajar atau perangkat pembelajaran Anda.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        displayKaryaList.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                          <td className="py-4 px-4">
                            <div className="font-extrabold text-slate-900 text-xs leading-snug group-hover:text-blue-950">
                              {item.judul}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                              <span>📚 {item.mataPelajaran} ({item.jenjang})</span>
                              <span>&bull;</span>
                              <span className="font-mono text-[10px] text-slate-400">{item.id}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                              {item.kategori}
                            </span>
                            <div className="text-[10px] font-bold text-blue-700 font-mono">
                              {item.formatFile} ({item.ukuranFile})
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            {item.status === 'Disetujui' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Disetujui
                              </span>
                            )}
                            {item.status === 'Pending' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                Dalam Kurasi
                              </span>
                            )}
                            {item.status === 'Ditolak' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                Perlu Revisi
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-xs">
                            {item.catatanVerifikasi ? (
                              <div className="bg-amber-50 text-amber-900 border border-amber-200 p-2 rounded-xl text-[11px] leading-relaxed">
                                💬 <em>"{item.catatanVerifikasi}"</em>
                              </div>
                            ) : (
                              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Sesuai standar rubrik asesmen Kurikulum Merdeka.</span>
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                id={`btn-guru-detail-${item.id}`}
                                onClick={() => onSelectKaryaForPreview(item)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-all inline-flex items-center gap-1 cursor-pointer shadow-2xs hover:scale-105"
                                title="Lihat Detail & Feedback"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Detail</span>
                              </button>

                              {onDeleteKarya && (
                                <button
                                  id={`btn-guru-delete-${item.id}`}
                                  onClick={() => setKaryaToDelete(item)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all inline-flex items-center gap-1 cursor-pointer shadow-2xs hover:scale-105"
                                  title="Hapus Karya Saya"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Hapus</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: LAPORAN & PORTOFOLIO */}
          {activeTab === 'laporan' && (
            <div className="space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-900">
                      Dokumen Transkrip Resmi
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">Standar Validasi Kemdikbud</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Laporan Kegiatan & Transkrip Portofolio (32 JP)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Dokumen digital resmi sebagai bukti keikutsertaan pelatihan, rekap kehadiran, dan pengesahan portofolio karya.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrintLaporan}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak / Simpan PDF</span>
                  </button>
                </div>
              </div>

              {/* Dokumen Preview Laporan Resmi */}
              <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-10 shadow-lg max-w-4xl mx-auto space-y-6 print:border-none print:shadow-none">
                
                {/* Kop Lembaga Resmi */}
                <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="w-7 h-7 text-blue-900" />
                    <span className="text-sm sm:text-base font-black tracking-widest uppercase text-slate-900">
                      KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black tracking-wide text-blue-950 uppercase font-serif">
                    LEMBAGA PENGEMBANGAN DAN PENJAMINAN MUTU PENDIDIKAN RUANGKARYA GURU
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Sekretariat: Gedung Graha Guru Indonesia Lt. 4, Jakarta Pusat &bull; Laman: https://ruangkaryaguru.id
                  </p>
                </div>

                {/* Judul Surat Laporan */}
                <div className="text-center space-y-1 pt-2">
                  <h4 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wider underline">
                    SURAT KETERANGAN & LAPORAN HASIL PELATIHAN
                  </h4>
                  <p className="text-xs font-mono font-bold text-slate-600">
                    Nomor: 800/LK-32JP/GTK/VIII/2026
                  </p>
                </div>

                {/* Identitas Guru Peserta */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                  <p className="leading-relaxed">
                    Dewan Pembina dan Tim Penjaminan Mutu RuangKarya Guru Indonesia menerangkan bahwa:
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 font-medium">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-bold">Nama Lengkap & Gelar</span>
                      <span className="col-span-2 font-extrabold text-slate-900">: {currentUser.nama || profileNama}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-bold">NIP / NUPTK</span>
                      <span className="col-span-2 font-mono font-bold text-slate-900">: {currentUser.nip || profileNip} / {profileNuptk}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-bold">Asal Sekolah / Instansi</span>
                      <span className="col-span-2 font-bold text-slate-900">: {currentUser.instansi || profileInstansi}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-slate-500 font-bold">Jenjang & Wilayah</span>
                      <span className="col-span-2 font-semibold text-slate-800">: {profileJenjang} &bull; {profileKota}</span>
                    </div>
                  </div>

                  <p className="leading-relaxed pt-2">
                    Telah menyelesaikan seluruh rangkaian <strong>Workshop Nasional Pemanfaatan AI & Modul Ajar Digital Berbasis Kurikulum Merdeka (Beban Belajar 32 Jam Pelajaran)</strong> dengan rincian capaian sebagai berikut:
                  </p>
                </div>

                {/* Tabel Struktur Kurikulum 32 JP */}
                <div className="overflow-hidden rounded-xl border border-slate-300">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="p-3 border-b border-r border-slate-300 text-center w-12">No</th>
                        <th className="p-3 border-b border-r border-slate-300">Materi Pelatihan / Aktivitas</th>
                        <th className="p-3 border-b border-r border-slate-300 text-center w-24">Beban (JP)</th>
                        <th className="p-3 border-b border-slate-300 text-center w-28">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-3 text-center border-r border-slate-200 font-bold">1</td>
                        <td className="p-3 border-r border-slate-200 font-semibold">Teori Perencanaan Pembelajaran & Bedah CP-TP Berbantu AI</td>
                        <td className="p-3 text-center border-r border-slate-200 font-mono font-bold">8 JP</td>
                        <td className="p-3 text-center font-bold text-emerald-800">100% Hadir</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-center border-r border-slate-200 font-bold">2</td>
                        <td className="p-3 border-r border-slate-200 font-semibold">Praktik Pembuatan Media Interaktif & LKPD Berdiferensiasi</td>
                        <td className="p-3 text-center border-r border-slate-200 font-mono font-bold">8 JP</td>
                        <td className="p-3 text-center font-bold text-emerald-800">100% Hadir</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-center border-r border-slate-200 font-bold">3</td>
                        <td className="p-3 border-r border-slate-200 font-semibold">Penyusunan & Pengunggahan Portofolio Modul Ajar Terverifikasi</td>
                        <td className="p-3 text-center border-r border-slate-200 font-mono font-bold">16 JP</td>
                        <td className="p-3 text-center font-bold text-emerald-800">Disetujui (94/100)</td>
                      </tr>
                      <tr className="bg-slate-50/70 text-slate-700">
                        <td className="p-2.5 text-center border-r border-slate-200 font-bold text-[11px]">4</td>
                        <td className="p-2.5 border-r border-slate-200 font-semibold text-[11px]">
                          Evaluasi Asesmen: Pre-Test & Post-Test Kompetensi Pedagogik Digital
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-200 font-mono font-bold text-[11px] text-slate-600">Terintegrasi</td>
                        <td className="p-2.5 text-center font-bold text-[11px] text-emerald-800">
                          Pre: {preTestScore} &bull; Post: {postTestScore !== null ? postTestScore : 90}
                        </td>
                      </tr>
                      <tr className="bg-slate-100 font-black">
                        <td colSpan={2} className="p-3 text-right border-r border-slate-300 uppercase">Total Beban Pelatihan Terverifikasi</td>
                        <td className="p-3 text-center border-r border-slate-300 text-blue-900 font-mono">32 JP</td>
                        <td className="p-3 text-center text-emerald-800">LULUS (Amat Baik)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tanda Tangan & QR Code */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-slate-100 border border-slate-300 rounded-xl p-1.5 flex items-center justify-center">
                      <QrCode className="w-full h-full text-slate-800" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">Verifikasi Sertifikat Digital</span>
                      <span className="text-[11px] text-slate-500 font-mono">ID: RKG-CERT-2026-08129</span>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">✓ Tervalidasi Kemdikbud RI</span>
                    </div>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <p className="text-slate-600">Jakarta, 20 Agustus 2026</p>
                    <p className="font-bold text-slate-800">Ketua Dewan Pembina RuangKarya,</p>
                    <div className="py-2 text-emerald-800 font-serif font-black italic tracking-widest text-sm">
                      [ DIGITAL SIGNED & STAMPED ]
                    </div>
                    <p className="font-extrabold text-slate-900 underline">Dr. H. Ahmad Dahlan, M.Pd.</p>
                    <p className="text-[11px] text-slate-500 font-mono">NIP. 196803151992031002</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: PENGATURAN AKUN */}
          {activeTab === 'pengaturan' && (
            <div className="space-y-8 max-w-3xl">
              
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Pengaturan Akun & Biodata Guru
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Perbarui informasi profil, NIP/NUPTK, unit sekolah kerja, dan amankan akun dengan kata sandi baru.
                </p>
              </div>

              {/* Form Profil Data Diri */}
              <form onSubmit={handleSaveProfile} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-800" />
                    <span>Informasi Biodata & Instansi Guru</span>
                  </h3>
                  {profileSaveSuccess && (
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Data Berhasil Disimpan!</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                    <input
                      type="text"
                      required
                      value={profileNama}
                      onChange={(e) => setProfileNama(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                    <input
                      type="text"
                      value={profileNip}
                      onChange={(e) => setProfileNip(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">NUPTK</label>
                    <input
                      type="text"
                      value={profileNuptk}
                      onChange={(e) => setProfileNuptk(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Asal Sekolah / Instansi *</label>
                    <input
                      type="text"
                      required
                      value={profileInstansi}
                      onChange={(e) => setProfileInstansi(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang Pendidikan *</label>
                    <select
                      value={profileJenjang}
                      onChange={(e) => setProfileJenjang(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="PAUD">PAUD / TK</option>
                      <option value="SD">SD / MI</option>
                      <option value="SMP">SMP / MTs</option>
                      <option value="SMA/SMK">SMA / SMK / MA</option>
                      <option value="Lainnya">Lainnya / Dosen / Widyaiswara</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kabupaten / Kota *</label>
                    <input
                      type="text"
                      required
                      value={profileKota}
                      onChange={(e) => setProfileKota(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email Aktif *</label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif *</label>
                    <input
                      type="tel"
                      required
                      value={profileWa}
                      onChange={(e) => setProfileWa(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-200">
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>

              {/* Form Ubah Sandi */}
              <form onSubmit={handleSavePassword} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-800" />
                    <span>Keamanan & Ubah Kata Sandi</span>
                  </h3>
                  {passwordSaveSuccess && (
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Sandi Baru Berhasil Disimpan!</span>
                    </span>
                  )}
                </div>

                {passwordError && (
                  <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-xs font-bold border border-rose-200">
                    {passwordError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
                        title={showOldPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        aria-label={showOldPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showOldPassword ? (
                          <Eye className="w-4 h-4 text-purple-700" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Minimal 6 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
                        title={showNewPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        aria-label={showNewPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showNewPassword ? (
                          <Eye className="w-4 h-4 text-purple-700" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ulangi Sandi Baru</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Ulangi sandi baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
                        title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        aria-label={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showConfirmPassword ? (
                          <Eye className="w-4 h-4 text-purple-700" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-200">
                  <button
                    type="submit"
                    className="bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105"
                  >
                    <Key className="w-4 h-4" />
                    <span>Perbarui Kata Sandi</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>
      </div>

      {/* 5. MODAL PENGERJAAN TES (PRE-TEST & POST-TEST INTERAKTIF) */}
      <AnimatePresence>
        {isTestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6"
            >
              {/* Header Modal */}
              <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                        {activeTestType === 'pre' ? 'Pre-Test' : 'Post-Test'}
                      </span>
                      <span className="text-xs text-slate-300 font-mono">Beban 32 JP</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                      {activeTestType === 'pre' 
                        ? 'Evaluasi Awal Kompetensi Pedagogik AI' 
                        : 'Ujian Akhir & Pengesahan Sertifikat 32 JP'}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsTestModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Modal: Jika Sudah Submit (Tampilan Nilai) */}
              {isTestSubmitted && submittedScoreResult ? (
                <div className="p-6 sm:p-8 text-center space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900">
                      Evaluasi Selesai!
                    </h4>
                    <p className="text-xs text-slate-500">
                      Hasil {activeTestType === 'pre' ? 'Pre-Test' : 'Post-Test'} Anda telah tersimpan dan tercatat di Laporan Kegiatan 32 JP.
                    </p>
                  </div>

                  {/* Score Board */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-sm mx-auto space-y-3">
                    <div className="text-4xl font-black text-blue-950 font-mono">
                      {submittedScoreResult.score} <span className="text-lg text-slate-400 font-sans">/ 100</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs font-bold">
                      <span className="text-emerald-700">✓ {submittedScoreResult.correct} Benar</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-rose-700">✗ {submittedScoreResult.total - submittedScoreResult.correct} Salah</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                      Status Kelulusan: <span className="font-extrabold text-emerald-700">KOMPETEN (LULUS)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                    <button
                      onClick={() => setIsTestModalOpen(false)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-all"
                    >
                      Kembali ke Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsTestModalOpen(false);
                        setActiveTab('laporan');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-all border border-slate-200 flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>Buka Laporan 32 JP</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Body Modal: Lembar Pengerjaan Soal */
                <div className="p-5 sm:p-6 space-y-5">
                  
                  {/* Status Bar: Nomor Soal & Waktu */}
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900">
                        Soal Nomor {currentQuestionIndex + 1}
                      </span>
                      <span className="text-slate-400">
                        dari {(activeTestType === 'pre' ? SOAL_PRE_TEST : SOAL_POST_TEST).length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg font-mono font-bold text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>28:45 Sisa Waktu</span>
                    </div>
                  </div>

                  {/* Pertanyaan */}
                  {(() => {
                    const questions = activeTestType === 'pre' ? SOAL_PRE_TEST : SOAL_POST_TEST;
                    const q = questions[currentQuestionIndex];
                    if (!q) return null;

                    return (
                      <div className="space-y-4">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
                          {q.pertanyaan}
                        </p>

                        {/* Pilihan Ganda */}
                        <div className="space-y-2">
                          {q.pilihan.map((pil) => {
                            const isSelected = userAnswers[q.id] === pil.key;
                            return (
                              <button
                                key={pil.key}
                                onClick={() => handleSelectAnswer(q.id, pil.key)}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-50/90 border-blue-500 text-blue-950 font-bold shadow-xs'
                                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                                }`}
                              >
                                <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black ${
                                  isSelected
                                    ? 'bg-blue-900 text-white'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                  {pil.key}
                                </span>
                                <span className="pt-0.5 leading-snug">{pil.teks}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Navigasi Soal (Nomor & Tombol Aksi) */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      
                      {/* Pill Navigasi Soal */}
                      <div className="flex items-center gap-1.5">
                        {(activeTestType === 'pre' ? SOAL_PRE_TEST : SOAL_POST_TEST).map((item, idx) => {
                          const isAnswered = !!userAnswers[item.id];
                          const isCurrent = currentQuestionIndex === idx;

                          return (
                            <button
                              key={item.id}
                              onClick={() => setCurrentQuestionIndex(idx)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-blue-900 text-white ring-2 ring-blue-300'
                                  : isAnswered
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Tombol Selanjutnya / Selesai */}
                      <div className="flex items-center gap-2">
                        {currentQuestionIndex > 0 && (
                          <button
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer transition-all"
                          >
                            Sebelumnya
                          </button>
                        )}

                        {currentQuestionIndex < (activeTestType === 'pre' ? SOAL_PRE_TEST : SOAL_POST_TEST).length - 1 ? (
                          <button
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className="px-4 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs cursor-pointer transition-all shadow-xs"
                          >
                            Selanjutnya &rarr;
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitTest}
                            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs cursor-pointer transition-all shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Kirim Jawaban</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Konfirmasi Hapus Karya Guru */}
      {karyaToDelete && (
        <div 
          id="modal-guru-hapus-karya"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 text-base">Hapus Karya Pembelajaran</h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">Karya ini akan dihapus dari portofolio Anda</p>
              </div>
              <button
                onClick={() => setKaryaToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-extrabold text-slate-900 text-sm leading-snug">
                {karyaToDelete.judul}
              </div>
              <div className="text-slate-500 flex items-center gap-2 flex-wrap">
                <span>Kategori: <strong className="text-slate-700">{karyaToDelete.kategori}</strong></span>
                <span>•</span>
                <span>Format: <strong className="text-blue-700 font-mono">{karyaToDelete.formatFile}</strong></span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/70 p-3 rounded-xl border border-rose-200 text-rose-950">
              Apakah Anda yakin ingin menghapus karya ini? Tindakan ini akan menghapus dokumen dari repositori dan kelengkapan tugas pelatihan Anda.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setKaryaToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (onDeleteKarya) {
                    onDeleteKarya(karyaToDelete.id);
                  }
                  setKaryaToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Karya</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
