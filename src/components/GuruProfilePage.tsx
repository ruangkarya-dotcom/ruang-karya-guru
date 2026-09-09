import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Eye, 
  Settings, 
  Plus, 
  Search, 
  Building2, 
  User as UserIcon, 
  Phone, 
  Mail, 
  ArrowLeft, 
  ShieldCheck, 
  ChevronRight, 
  Layers, 
  Star, 
  X,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  Code2,
  Archive,
  Calendar,
  Sparkles,
  School,
  IdCard,
  MessageCircle,
  FolderCheck
} from 'lucide-react';
import peterParkerAvatar from '../assets/images/peter_parker_avatar_1787247961592.jpg';
import { Karya, User, FileFormat, CategoryType } from '../types';

export interface TeacherProfileData {
  id?: string;
  nama: string;
  gelar?: string;
  nip?: string;
  nuptk?: string;
  instansi: string;
  jenjang: 'PAUD' | 'SD' | 'SMP' | 'SMA/SMK' | 'Umum' | 'Lainnya' | string;
  faseMengajar?: string;
  mataPelajaranUtama?: string;
  email?: string;
  noWhatsapp?: string;
  kabupatenKota?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface TrainingRecord {
  id: string;
  judulPelatihan: string;
  penyelenggara: string;
  narasumber: string;
  tanggalSelesai: string;
  jamPelajaran: number;
  nomorSertifikat: string;
  predikat: string;
  status: 'Lulus' | 'Terverifikasi';
  topikKeahlian: string[];
}

interface GuruProfilePageProps {
  profileData?: TeacherProfileData | null;
  currentUser?: User | null;
  karyaList: Karya[];
  onSelectKarya: (karya: Karya) => void;
  onDownloadKarya: (id: string) => void;
  onOpenUploadModal: () => void;
  onNavigateToDashboard: () => void;
  onNavigateBack: () => void;
  onUpdateCurrentUserProfile?: (updatedUser: User) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

// Mock initial verified training history for Ruang Karya Guru certificates (32 JP modules)
const DEFAULT_TRAINING_RECORDS: TrainingRecord[] = [
  {
    id: 'TR-2026-001',
    judulPelatihan: 'Lokakarya Nasional: Desain Modul Ajar Deep Learning & Diferensiasi Berbasis AI',
    penyelenggara: 'Direktorat Guru & Tenaga Kependidikan bekerjasama dengan Ruang Karya Guru',
    narasumber: 'Prof. Dr. Irwan Susanto & Tim Pengembang Kurikulum',
    tanggalSelesai: '12 Agustus 2026',
    jamPelajaran: 32,
    nomorSertifikat: 'RKG/LOK-NAT/2026/08/4291',
    predikat: 'Sangat Memuaskan (A)',
    status: 'Terverifikasi',
    topikKeahlian: ['Modul Ajar Deep Learning', 'Diferensiasi Pembelajaran', 'AI Integratif']
  },
  {
    id: 'TR-2026-002',
    judulPelatihan: 'Workshop Penyusunan Instrumen Asesmen Otentik & Rubrik Diagnostik Holistik',
    penyelenggara: 'Balai Guru Penggerak & Pusat Kurikulum Merdeka',
    narasumber: 'Dr. Hj. Nurjanah, M.Pd.',
    tanggalSelesai: '28 Juli 2026',
    jamPelajaran: 32,
    nomorSertifikat: 'RKG/WS-ASES/2026/07/1108',
    predikat: 'Sangat Memuaskan (A)',
    status: 'Terverifikasi',
    topikKeahlian: ['Asesmen Otentik', 'Rubrik Skala 1-4', 'Bank Soal HOTS']
  },
  {
    id: 'TR-2026-003',
    judulPelatihan: 'Pengembangan Media Digital Interaktif (HTML5, Canva Edu, & Animasi Pembelajaran)',
    penyelenggara: 'Laboratorium Inovasi Pembelajaran Digital Ruang Karya Guru',
    narasumber: 'Bambang Hartono, M.T. & Tim Kreatif',
    tanggalSelesai: '15 Juni 2026',
    jamPelajaran: 32,
    nomorSertifikat: 'RKG/DIGI-MED/2026/06/0754',
    predikat: 'Memuaskan (A-)',
    status: 'Terverifikasi',
    topikKeahlian: ['HTML5 Interaktif', 'Simulasi Pembelajaran', 'Desain Visual Canva']
  }
];

const CATEGORY_OPTIONS: (CategoryType | 'Semua')[] = [
  'Semua',
  'Modul Ajar / RPP',
  'Media Interaktif (HTML5)',
  'Video Pembelajaran',
  'Lembar Kerja (LKPD)',
  'Bank Soal & Asesmen',
  'Presentasi / PPT',
  'E-Book & Panduan'
];

export const GuruProfilePage: React.FC<GuruProfilePageProps> = ({
  profileData,
  currentUser,
  karyaList,
  onSelectKarya,
  onDownloadKarya,
  onOpenUploadModal,
  onNavigateToDashboard,
  onNavigateBack,
  onUpdateCurrentUserProfile,
  onShowToast
}) => {
  // Determine if active user is viewing their OWN profile
  const isOwner = useMemo(() => {
    if (!currentUser || currentUser.role !== 'guru') return false;
    if (!profileData) return true; // default to logged-in user profile if none specified
    
    // Check if ID matches or Name matches
    if (profileData.id && currentUser.id === profileData.id) return true;
    if (profileData.nama && currentUser.nama.toLowerCase().trim() === profileData.nama.toLowerCase().trim()) return true;
    if (profileData.nip && currentUser.nip && profileData.nip.replace(/\D/g, '') === currentUser.nip.replace(/\D/g, '')) return true;
    return false;
  }, [currentUser, profileData]);

  // Construct active teacher profile data with fallbacks
  const teacher: TeacherProfileData = useMemo(() => {
    if (profileData) {
      return {
        id: profileData.id || 'guru-selected',
        nama: profileData.nama || 'Dra. Sri Wahyuni, M.Pd.',
        nip: profileData.nip || '197805122002122003',
        nuptk: profileData.nuptk || '4256756658200032',
        instansi: profileData.instansi || 'SMA Negeri 1 Jakarta',
        jenjang: profileData.jenjang || 'SMA/SMK',
        faseMengajar: profileData.faseMengajar || 'Fase E & F (Kelas X - XII)',
        mataPelajaranUtama: profileData.mataPelajaranUtama || 'Matematika & Sains Integratif',
        email: profileData.email || 'sri.wahyuni@guru.sma.belajar.id',
        noWhatsapp: profileData.noWhatsapp || '081298765432',
        kabupatenKota: profileData.kabupatenKota || 'Jakarta Pusat, DKI Jakarta',
        bio: profileData.bio || 'Pendidik berdedikasi dengan fokus pada pembelajaran berdiferensiasi, integrasi teknologi pedagogi, dan pengembangan modul ajar Kurikulum Merdeka yang menyenangkan serta bermakna bagi murid.',
        avatarUrl: profileData.avatarUrl
      };
    }

    if (currentUser) {
      const isPeter = currentUser.nama?.toLowerCase().includes('peter') || currentUser.email?.toLowerCase().includes('peter');
      return {
        id: currentUser.id,
        nama: currentUser.nama || 'Dra. Sri Wahyuni, M.Pd.',
        nip: currentUser.nip || '197805122002122003',
        nuptk: currentUser.nuptk || '4256756658200032',
        instansi: currentUser.instansi || 'SMA Negeri 1 Jakarta',
        jenjang: currentUser.jenjang || 'SMA/SMK',
        faseMengajar: 'Fase E & F (Kelas X - XII)',
        mataPelajaranUtama: isPeter ? 'Fisika & Sains Robotika' : 'Matematika & Kurikulum Merdeka',
        email: currentUser.email || 'guru@sekolah.sch.id',
        noWhatsapp: currentUser.noWhatsapp || '081298765432',
        kabupatenKota: currentUser.kabupatenKota || 'Jakarta Pusat, DKI Jakarta',
        bio: isPeter 
          ? 'Guru Sains & Fisika Terapan. Antusias dalam mendidik generasi muda melalui eksperimen sains, teknologi robotika, dan pembelajaran bermakna.'
          : 'Pendidik aktif penggerak komunitas belajar, rutin membagikan modul ajar dan media pembelajaran interaktif untuk seluruh rekan guru se-Indonesia.',
        avatarUrl: currentUser.avatarUrl || (isPeter ? peterParkerAvatar : undefined)
      };
    }

    return {
      id: 'guru-default',
      nama: 'Dra. Sri Wahyuni, M.Pd.',
      nip: '197805122002122003',
      nuptk: '4256756658200032',
      instansi: 'SMA Negeri 1 Jakarta',
      jenjang: 'SMA/SMK',
      faseMengajar: 'Fase E & F (Kelas X - XII)',
      mataPelajaranUtama: 'Matematika & Perangkat Merdeka',
      email: 'sri.wahyuni@guru.sma.belajar.id',
      noWhatsapp: '081298765432',
      kabupatenKota: 'Jakarta Pusat, DKI Jakarta',
      bio: 'Pendidik berdedikasi dengan fokus pada pembelajaran berdiferensiasi, integrasi teknologi pedagogi, dan pengembangan modul ajar Kurikulum Merdeka.',
      avatarUrl: undefined
    };
  }, [profileData, currentUser]);

  // Gallery Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'Semua'>('Semua');
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  
  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<TrainingRecord | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit Profile Form State (for Owner)
  const [editNama, setEditNama] = useState(teacher.nama);
  const [editInstansi, setEditInstansi] = useState(teacher.instansi);
  const [editNip, setEditNip] = useState(teacher.nip || '');
  const [editNuptk, setEditNuptk] = useState(teacher.nuptk || '');
  const [editJenjang, setEditJenjang] = useState<'PAUD' | 'SD' | 'SMP' | 'SMA/SMK' | 'Umum' | 'Lainnya' | string>(teacher.jenjang);
  const [editFase, setEditFase] = useState(teacher.faseMengajar || 'Fase E & F');
  const [editMapel, setEditMapel] = useState(teacher.mataPelajaranUtama || 'Matematika');
  const [editBio, setEditBio] = useState(teacher.bio || '');

  // Filter Teacher's Published Works ('Disetujui')
  const teacherWorks = useMemo(() => {
    return karyaList.filter(k => {
      // Must be approved for public portfolio
      if (k.status !== 'Disetujui') return false;

      // Match by teacher name or matching teacher ID if available
      const nameMatch = k.namaGuru.toLowerCase().includes(teacher.nama.toLowerCase()) ||
                        teacher.nama.toLowerCase().includes(k.namaGuru.toLowerCase());
      const instansiMatch = teacher.instansi && k.nipOrInstansi.toLowerCase().includes(teacher.instansi.toLowerCase());
      
      return nameMatch || instansiMatch;
    });
  }, [karyaList, teacher.nama, teacher.instansi]);

  // If teacher has few specific works in mock dataset, fallback to include top works with their attribution
  const displayWorksList = useMemo(() => {
    if (teacherWorks.length > 0) return teacherWorks;
    // Fallback: take verified sample works for rich presentation
    return karyaList.filter(k => k.status === 'Disetujui').slice(0, 6);
  }, [teacherWorks, karyaList]);

  // Extract distinct subjects
  const distinctSubjects = useMemo(() => {
    const set = new Set<string>();
    displayWorksList.forEach(k => {
      if (k.mataPelajaran) set.add(k.mataPelajaran);
    });
    return Array.from(set);
  }, [displayWorksList]);

  // Filtered portfolio list based on UI controls
  const filteredPortfolio = useMemo(() => {
    return displayWorksList.filter(k => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        k.judul.toLowerCase().includes(q) || 
        k.deskripsi.toLowerCase().includes(q) ||
        k.mataPelajaran.toLowerCase().includes(q) ||
        (k.tujuanPembelajaran && k.tujuanPembelajaran.toLowerCase().includes(q));

      const matchCat = selectedCategory === 'Semua' || k.kategori === selectedCategory;
      const matchSub = selectedSubject === 'Semua' || k.mataPelajaran === selectedSubject;

      return matchSearch && matchCat && matchSub;
    });
  }, [displayWorksList, searchQuery, selectedCategory, selectedSubject]);

  // Summary Metrics calculations
  const totalDownloads = useMemo(() => {
    return displayWorksList.reduce((acc, curr) => acc + (curr.jumlahDownload || 0), 0);
  }, [displayWorksList]);

  const totalViews = useMemo(() => {
    return displayWorksList.reduce((acc, curr) => acc + (curr.jumlahView || 0), 0);
  }, [displayWorksList]);

  const totalJP = useMemo(() => {
    return DEFAULT_TRAINING_RECORDS.reduce((acc, curr) => acc + curr.jamPelajaran, 0);
  }, []);

  const handleCopyProfileLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    if (onShowToast) {
      onShowToast('Tautan Disalin!', 'Link portofolio profil guru berhasil disalin ke clipboard.', 'success');
    }
  };

  const handleShareWA = () => {
    const text = `Lihat Portofolio Digital Pendidik & Kumpulan Modul Ajar Merdeka dari ${teacher.nama} (${teacher.instansi}) di Ruang Karya Guru:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && onUpdateCurrentUserProfile) {
      const updated: User = {
        ...currentUser,
        nama: editNama,
        instansi: editInstansi,
        nip: editNip,
        nuptk: editNuptk,
        jenjang: editJenjang
      };
      onUpdateCurrentUserProfile(updated);
    }
    setIsEditProfileModalOpen(false);
    if (onShowToast) {
      onShowToast('Profil Berhasil Diperbarui', 'Informasi portofolio guru Anda telah disimpan.', 'success');
    }
  };

  const getFormatBadge = (fmt: FileFormat) => {
    switch (fmt) {
      case 'PDF':
        return { bg: 'bg-rose-100 text-rose-700 border-rose-200', icon: <FileText className="w-3.5 h-3.5 text-rose-600" /> };
      case 'DOCX':
        return { bg: 'bg-blue-100 text-[#1E3A8A] border-blue-200', icon: <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" /> };
      case 'PPTX':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: <FileSpreadsheet className="w-3.5 h-3.5 text-amber-700" /> };
      case 'MP4':
        return { bg: 'bg-purple-100 text-purple-700 border-purple-200', icon: <FileVideo className="w-3.5 h-3.5 text-purple-600" /> };
      case 'MP3':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <FileAudio className="w-3.5 h-3.5 text-emerald-700" /> };
      case 'HTML5':
        return { bg: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: <Code2 className="w-3.5 h-3.5 text-cyan-700" /> };
      case 'ZIP':
        return { bg: 'bg-slate-100 text-slate-800 border-slate-200', icon: <Archive className="w-3.5 h-3.5 text-slate-700" /> };
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: <FileText className="w-3.5 h-3.5 text-slate-600" /> };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* 1. TOP ACCESS BAR: QUICK DASHBOARD ACCESS (FOR TEACHER OWNER) */}
      {isOwner ? (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white px-4 py-2.5 text-xs shadow-sm sticky top-16 z-30 border-b border-blue-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="font-semibold text-slate-200">
                Anda sedang melihat <strong>Pratinjau Portofolio Publik</strong> milik Anda sendiri.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-owner-edit-profile-top"
                onClick={() => setIsEditProfileModalOpen(true)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
              >
                <Settings className="w-3.5 h-3.5 text-sky-300" />
                <span>Edit Profil</span>
              </button>
              <button
                id="btn-owner-back-to-dashboard"
                onClick={onNavigateToDashboard}
                className="px-3.5 py-1 bg-[#0EA5E9] hover:bg-[#0284c7] text-white rounded-lg font-extrabold text-[11px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Masuk ke Dashboard Utama</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onNavigateBack}
              className="text-slate-600 hover:text-blue-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer py-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Galeri Karya</span>
            </button>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Portofolio Pendidik Terverifikasi Nasional</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION: HEADER & IDENTITAS PROFIL GURU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden relative">
          
          {/* Top Banner Accent with RuangKarya Pattern */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-[#1E3A8A] via-indigo-900 to-[#0EA5E9] relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* Top Right Certified Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pendidik Bersertifikat 32 JP</span>
              </span>
            </div>
          </div>

          {/* Profile Card Body */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            
            {/* Avatar & Action Button Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              
              {/* Avatar Box */}
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white p-1.5 shadow-xl border-2 border-white ring-4 ring-blue-50">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-900 to-sky-600 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-inner select-none overflow-hidden">
                      {teacher.avatarUrl ? (
                        <img 
                          src={teacher.avatarUrl} 
                          alt={teacher.nama} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span>{teacher.nama.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  {/* Verified Checkmark on Avatar */}
                  <div 
                    title="Pendidik Terverifikasi Dapodik & Ruang Karya Guru"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-900 border-2 border-white text-cyan-300 flex items-center justify-center shadow-md"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>

                <div className="hidden sm:block pb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[#0EA5E9] text-xs font-black uppercase tracking-wider">
                    <School className="w-3.5 h-3.5" />
                    <span>{teacher.jenjang} &bull; {teacher.faseMengajar || 'Fase Merdeka'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
                
                {/* 1. Tombol Bagikan Profil (Untuk Pengunjung & Guru) */}
                <button
                  id="btn-share-profile"
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-slate-200 shadow-2xs"
                  title="Bagikan Portofolio Guru"
                >
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span>Bagikan Profil</span>
                </button>

                {/* 2. Tombol Khusus Pemilik Akun */}
                {isOwner && (
                  <button
                    id="btn-edit-profile"
                    onClick={() => setIsEditProfileModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-950 font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 border border-blue-200 shadow-2xs"
                  >
                    <Settings className="w-4 h-4 text-blue-900" />
                    <span>Edit Profil</span>
                  </button>
                )}
              </div>

            </div>

            {/* Nama & Instansi Meta */}
            <div className="space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {teacher.nama}
                  </h1>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-2.5 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Educator
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs sm:text-sm text-slate-600 font-semibold mt-1.5">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Building2 className="w-4 h-4 text-blue-900" />
                    {teacher.instansi}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <School className="w-4 h-4 text-slate-400" />
                    {teacher.kabupatenKota || 'Indonesia'}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">&bull;</span>
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <IdCard className="w-4 h-4 text-slate-400" />
                    NIP. {teacher.nip || '-'}
                  </span>
                </div>
              </div>

              {/* Bio Statement */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 max-w-4xl">
                {teacher.bio}
              </p>

              {/* Badges / Mapel Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 bg-blue-50 text-blue-950 text-xs font-bold rounded-lg border border-blue-200/70 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                  Mata Pelajaran: {teacher.mataPelajaranUtama || 'Matematika'}
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-950 text-xs font-bold rounded-lg border border-indigo-200/70 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-900" />
                  {teacher.faseMengajar || 'Fase E & F'}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-950 text-xs font-bold rounded-lg border border-emerald-200/70 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  Pendidik Penggerak Digital
                </span>
              </div>
            </div>

            {/* SUMMARY STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
              
              {/* Card 1: Total Karya Diterbitkan */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-white border border-blue-100 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-cyan-300 flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Karya Diterbitkan</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">{displayWorksList.length}</span>
                    <span className="text-xs font-extrabold text-blue-900">Modul / RPP</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Total JP Pelatihan Selesai */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pelatihan Selesai</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">{totalJP} JP</span>
                    <span className="text-xs font-extrabold text-emerald-700">({DEFAULT_TRAINING_RECORDS.length} Pelatihan 32 JP)</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Total Unduhan & Apresiasi */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-100 flex items-center gap-4 shadow-2xs hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Apresiasi & Unduhan</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">{totalDownloads.toLocaleString('id-ID')}</span>
                    <span className="text-xs font-extrabold text-[#0EA5E9]">x Diunduh Guru</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION: FEED & GALERI KARYA PUBLIK (PORTFOLIO SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Section Title & Filtering Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                <FolderCheck className="w-4 h-4" />
                <span>Portofolio Pembelajaran Terverifikasi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Karya & Modul Ajar Kurikulum Merdeka
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">
                Koleksi modul ajar, lembar kerja, media interaktif, dan asesmen yang telah dikurasi dan dapat diunduh bebas.
              </p>
            </div>

            {isOwner && (
              <button
                onClick={onOpenUploadModal}
                className="self-start md:self-auto bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-cyan-300" />
                <span>Tambah Karya ke Portofolio</span>
              </button>
            )}
          </div>

          {/* Controls: Search Bar & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 border-t border-slate-100">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul modul, topik, atau capaian pembelajaran..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Kategori */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'Semua' ? '📂 Semua Kategori' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Mata Pelajaran */}
            <div className="md:col-span-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="Semua">📚 Semua Mata Pelajaran</option>
                {distinctSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              Menampilkan <strong className="text-slate-900">{filteredPortfolio.length}</strong> karya terverifikasi
            </span>
            {(searchQuery || selectedCategory !== 'Semua' || selectedSubject !== 'Semua') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                  setSelectedSubject('Semua');
                }}
                className="text-[#0EA5E9] hover:underline font-bold cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* PORTFOLIO GRID */}
          {filteredPortfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredPortfolio.map((karya) => {
                const fmt = getFormatBadge(karya.formatFile);
                return (
                  <div
                    key={karya.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col group"
                  >
                    {/* Cover Preview Area */}
                    <div className="h-32 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50/50 p-4 relative flex items-center justify-center border-b border-slate-100">
                      
                      {/* Format Badge Top Left */}
                      <span className={`absolute top-3 left-3 ${fmt.bg} text-[11px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs border`}>
                        {fmt.icon}
                        <span>{karya.formatFile}</span>
                      </span>

                      {/* Jenjang Badge Top Right */}
                      <span className="absolute top-3 right-3 bg-white/95 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                        {karya.jenjang}
                      </span>

                      {/* Mock Cover Preview Document */}
                      <div className="w-14 h-16 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col items-center justify-center p-2 group-hover:scale-105 transition-transform">
                        <div className="w-8 h-1 bg-slate-200 mb-1.5 rounded-full" />
                        <div className="w-8 h-1 bg-slate-200 mb-1.5 rounded-full" />
                        <div className="w-5 h-1 bg-[#0EA5E9] rounded-full" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1 space-y-2.5">
                      
                      {/* Subject & Category Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-900 rounded-md border border-blue-100">
                          {karya.mataPelajaran}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md truncate max-w-[140px]">
                          {karya.kategori}
                        </span>
                      </div>

                      {/* Work Title */}
                      <h3 
                        onClick={() => onSelectKarya(karya)}
                        className="font-extrabold text-base text-slate-900 line-clamp-2 leading-snug cursor-pointer group-hover:text-blue-900 transition-colors"
                      >
                        {karya.judul}
                      </h3>

                      {/* Work Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal flex-1">
                        {karya.deskripsi}
                      </p>

                      {/* Card Action Row */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-1" title="Jumlah Unduhan">
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            {karya.jumlahDownload}
                          </span>
                          <span className="flex items-center gap-1" title="Jumlah Dilihat">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {karya.jumlahView}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectKarya(karya)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Lihat Detail
                          </button>
                          <button
                            onClick={() => onDownloadKarya(karya.id)}
                            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-extrabold rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-300" />
                            <span>Unduh</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Tidak ada karya yang sesuai dengan kriteria</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau reset filter kategori di atas.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                  setSelectedSubject('Semua');
                }}
                className="px-4 py-2 bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Tampilkan Semua Karya
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. SECTION: RIWAYAT PELATIHAN & REKAPITULASI 32 JP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header Rekapitulasi */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Pengembangan Keprofesian Berkelanjutan (PKB)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Riwayat Pelatihan & Sertifikasi 32 JP
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">
                Rekam jejak lokakarya, workshop, dan pelatihan resmi yang telah diselesaikan oleh pendidik dengan nomor sertifikat terverifikasi.
              </p>
            </div>

            {/* Badge Total Capaian JP */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 self-start md:self-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Akumulasi Jam Pelatihan</span>
                <span className="text-base font-black text-emerald-950">{totalJP} JP Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* List of Training Records */}
          <div className="space-y-4 pt-2">
            {DEFAULT_TRAINING_RECORDS.map((training) => (
              <div
                key={training.id}
                className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Lulus & Terverifikasi {training.jamPelajaran} JP
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 text-[11px] font-bold rounded-md">
                      Predikat: {training.predikat}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {training.tanggalSelesai}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {training.judulPelatihan}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    Penyelenggara: <strong className="text-slate-800">{training.penyelenggara}</strong> &bull; Narasumber: <span className="text-slate-700">{training.narasumber}</span>
                  </p>

                  {/* Topik Keahlian */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {training.topikKeahlian.map((topik, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                        #{topik}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificate Action Button */}
                <div className="md:border-l md:border-slate-200 md:pl-6 shrink-0 flex flex-col justify-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">
                    No. {training.nomorSertifikat}
                  </span>
                  <button
                    onClick={() => setSelectedCertificate(training)}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <Award className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Lihat Rekap Sertifikat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= MODALS ================= */}

      {/* 1. MODAL BAGIKAN PROFIL (SHARE MODAL) */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                  <Share2 className="w-5 h-5 text-blue-900" />
                  <span>Bagikan Portofolio Guru</span>
                </div>
                <button 
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto text-xl font-black shadow-xs">
                  {teacher.nama.charAt(0)}
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">{teacher.nama}</h4>
                <p className="text-xs text-slate-600">{teacher.instansi}</p>
              </div>

              {/* Action 1: Copy Link Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tautan Langsung Portofolio</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.href : 'https://ruangkaryaguru.id/guru/profil'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 select-all"
                  />
                  <button
                    onClick={handleCopyProfileLink}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-colors flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Action 2: Share via WhatsApp */}
              <button
                onClick={handleShareWA}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Bagikan ke WhatsApp Rekan / Komunitas KKG/MGMP</span>
              </button>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Tautan ini dapat diakses oleh publik, kepala sekolah, kurator, dan rekan pendidik di seluruh Indonesia.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MODAL EDIT PROFIL GURU (KHUSUS PEMILIK) */}
      <AnimatePresence>
        {isEditProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 my-8"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                  <Settings className="w-5 h-5 text-blue-900" />
                  <span>Edit Informasi Portofolio Guru</span>
                </div>
                <button 
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={editNama}
                    onChange={(e) => setEditNama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Instansi / Asal Sekolah</label>
                    <input
                      type="text"
                      required
                      value={editInstansi}
                      onChange={(e) => setEditInstansi(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang Mengajar</label>
                    <select
                      value={editJenjang}
                      onChange={(e) => setEditJenjang(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    >
                      <option value="PAUD">PAUD</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA/SMK">SMA/SMK</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Opsional)</label>
                    <input
                      type="text"
                      value={editNip}
                      onChange={(e) => setEditNip(e.target.value)}
                      placeholder="19780512..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran Utama</label>
                    <input
                      type="text"
                      value={editMapel}
                      onChange={(e) => setEditMapel(e.target.value)}
                      placeholder="Contoh: Matematika"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio Singkat / Filosofi Mengajar</label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tuliskan gambaran singkat tentang kepakaran atau komitmen mengajar Anda..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1E3A8A] hover:bg-[#152e72] text-white font-extrabold text-xs rounded-xl shadow-xs"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MODAL PREVIEW REKAP SERTIFIKAT 32 JP */}
      <AnimatePresence>
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
                  <Award className="w-5 h-5" />
                  <span>Rekapitulasi Sertifikat 32 JP</span>
                </div>
                <button 
                  onClick={() => setSelectedCertificate(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Status Validasi</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sah & Terverifikasi
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {selectedCertificate.judulPelatihan}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedCertificate.penyelenggara}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nama Pendidik:</span>
                    <strong className="text-slate-900 font-bold">{teacher.nama}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Durasi:</span>
                    <strong className="text-slate-900 font-bold">{selectedCertificate.jamPelajaran} Jam Pelajaran (JP)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tanggal Terbit:</span>
                    <span className="text-slate-800 font-semibold">{selectedCertificate.tanggalSelesai}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Predikat:</span>
                    <span className="text-emerald-700 font-extrabold">{selectedCertificate.predikat}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] text-slate-500 block">Nomor Registrasi Sertifikat Nasional:</span>
                  <span className="font-mono text-xs font-black text-blue-900">{selectedCertificate.nomorSertifikat}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs cursor-pointer"
                >
                  Tutup Informasi Sertifikat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
