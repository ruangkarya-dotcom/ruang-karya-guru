import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Award, 
  BookOpen, 
  FileText, 
  Users, 
  GraduationCap, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Eye, 
  Settings, 
  Plus, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  ArrowLeft, 
  Sparkles, 
  FolderCheck, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Printer, 
  X, 
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  Code2,
  Archive,
  Star,
  IdCard,
  Briefcase,
  SlidersHorizontal,
  BookmarkCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Karya, User, AdminRole, AdminProfileData, CategoryType, FileFormat } from '../types';
import { DEFAULT_OFFICIAL_MASTER_TEMPLATES } from '../data/initialData';

export interface AdminFacilitationRecord {
  id: string;
  judulPelatihan: string;
  peran: 'Instruktur Utama' | 'Fasilitator Nasional' | 'Lead Kurator' | 'Asesor Mutu';
  penyelenggara: string;
  tanggalPelaksanaan: string;
  jamPelajaran: number;
  jumlahPeserta: number;
  skPenugasan: string;
  status: 'Selesai' | 'Aktif';
  topikMateri: string[];
}

export interface AdminCertificationRecord {
  id: string;
  namaSertifikat: string;
  penerbit: string;
  nomorSertifikat: string;
  tahun: string;
  masaBerlaku: string;
  kategori: 'Asesor Kurikulum' | 'Pelatih Ahli' | 'Kurator Digital' | 'Instruktur IT';
  deskripsi: string;
}

interface AdminProfilePageProps {
  currentUser?: User | null;
  karyaList: Karya[];
  onSelectKarya: (karya: Karya) => void;
  onDownloadKarya?: (id: string) => void;
  onOpenUploadModal?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateBack?: () => void;
  onUpdateCurrentUserProfile?: (updatedUser: User) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

const DEFAULT_ADMIN_FACILITATIONS: AdminFacilitationRecord[] = [
  {
    id: 'FAC-2026-01',
    judulPelatihan: 'Bimbingan Teknis Nasional: Desain Modul Ajar Deep Learning & Asesmen Diferensiasi',
    peran: 'Instruktur Utama',
    penyelenggara: 'Direktorat Jenderal Guru & Tenaga Kependidikan bekerjasama dengan RuangKarya Guru',
    tanggalPelaksanaan: '10 - 13 Agustus 2026',
    jamPelajaran: 32,
    jumlahPeserta: 840,
    skPenugasan: 'SK-DIRJEN/GTK/RKG/2026/08-114',
    status: 'Selesai',
    topikMateri: ['Modul Ajar Deep Learning', 'Asesmen Diagnostik & Formatif', 'Diferensiasi Konten & Proses']
  },
  {
    id: 'FAC-2026-02',
    judulPelatihan: 'Workshop Kurasi Mutu & Standardisasi Portofolio Digital Guru se-Indonesia',
    peran: 'Lead Kurator',
    penyelenggara: 'Pusat Kurikulum & Pembelajaran Mandiri Merdeka Belajar',
    tanggalPelaksanaan: '20 - 23 Juli 2026',
    jamPelajaran: 32,
    jumlahPeserta: 1250,
    skPenugasan: 'SK-PUSKUR/KURASI-RKG/2026/07-089',
    status: 'Selesai',
    topikMateri: ['Rubrik Validasi 4 Dimensi Mutu', 'Kurasi LKPD Interaktif', 'Etika & Lisensi Open Educational Resources']
  },
  {
    id: 'FAC-2026-03',
    judulPelatihan: 'Pelatihan Instruktur Pembelajaran Berbasis AI & Media Digital Edukatif',
    peran: 'Fasilitator Nasional',
    penyelenggara: 'Balai Guru Penggerak (BGP) & Konsorsium Pendidik Digital',
    tanggalPelaksanaan: '05 - 08 Juni 2026',
    jamPelajaran: 32,
    jumlahPeserta: 620,
    skPenugasan: 'SK-BGP/INOTEK/2026/06-042',
    status: 'Selesai',
    topikMateri: ['Prompt Engineering untuk Guru', 'Media Presentasi HTML5/Canva', 'Integrasi Google Workspace']
  }
];

const DEFAULT_ADMIN_CERTIFICATIONS: AdminCertificationRecord[] = [
  {
    id: 'CERT-001',
    namaSertifikat: 'Sertifikat Asesor Nasional Perangkat Ajar & Kurikulum Merdeka',
    penerbit: 'Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP)',
    nomorSertifikat: 'BSKAP/ASESOR-KM/2025/IX/00421',
    tahun: '2025',
    masaBerlaku: '2025 - 2030 (Aktif)',
    kategori: 'Asesor Kurikulum',
    deskripsi: 'Kompetensi terakreditasi dalam telaah kesesuaian Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), dan rubrik asesmen otentik jenjang Dikdasmen.'
  },
  {
    id: 'CERT-002',
    namaSertifikat: 'Lisensi Master Trainer & Pelatih Ahli Program Sekolah Penggerak',
    penerbit: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI',
    nomorSertifikat: 'KEMDIKBUD/PSP-MT/2024/XI/1892',
    tahun: '2024',
    masaBerlaku: '2024 - 2029 (Aktif)',
    kategori: 'Pelatih Ahli',
    deskripsi: 'Wewenang membimbing fasilitator daerah, kepala sekolah, dan guru penggerak dalam transformasi iklim pembelajaran yang berpusat pada murid.'
  },
  {
    id: 'CERT-003',
    namaSertifikat: 'Certified Digital Learning Curator & AI Education Specialist',
    penerbit: 'International Association of Digital Educators (IADE)',
    nomorSertifikat: 'IADE/GLOBAL-CURATOR/2025/0887',
    tahun: '2025',
    masaBerlaku: 'Seumur Hidup',
    kategori: 'Kurator Digital',
    deskripsi: 'Spesialisasi audit integritas perangkat ajar digital, standardisasi metadata edukasi, dan kurasi media pembelajaran multimedia.'
  }
];

export const AdminProfilePage: React.FC<AdminProfilePageProps> = ({
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
  const isAdmin = currentUser?.role === 'admin';
  const adminRole: AdminRole = currentUser?.adminRole || 'super_admin';

  // Load Admin Profile state from LocalStorage or Current User
  const [adminProfile, setAdminProfile] = useState<AdminProfileData>(() => {
    try {
      const saved = localStorage.getItem('rkg_admin_profile_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    return {
      nama: currentUser?.nama || 'Dr. H. Ahmad Dahlan, M.Pd.',
      gelar: 'M.Pd.',
      nip: currentUser?.nip || '19750814 199903 1 002',
      idAdmin: 'ADM-RKG-NAT-001',
      instansi: currentUser?.instansi || 'Pusat Kurasi & Penjamin Mutu RuangKarya Guru Indonesia',
      jabatan: adminRole === 'super_admin' ? 'Super Admin & Lead Kurator Mutu Nasional' : 'Admin Kurator & Verifikator Perangkat Ajar',
      adminRole: adminRole,
      email: currentUser?.email || 'admin.kurasi@ruangkaryaguru.id',
      noWhatsapp: currentUser?.noWhatsapp || '081122334455',
      lokasi: currentUser?.kabupatenKota || 'DKI Jakarta (Pusat Layanan Nasional)',
      bio: 'Pendidik & Kurator Nasional berdedikasi dalam standardisasi perangkat ajar Kurikulum Merdeka, penelaahan modul ajar Deep Learning, fasilitasi pelatihan bersertifikat 32 JP, serta pembinaan portofolio digital guru Indonesia.',
      spesialisasi: [
        'Desain Modul Deep Learning',
        'Asesmen Otentik HOTS',
        'Kurasi LKPD Interaktif',
        'Akreditasi Pelatihan 32 JP',
        'Standardisasi Kurikulum Merdeka'
      ],
      skPenugasan: 'SK-PUSKUR-RKG/2026/01-TIM-KURASI-PUSAT',
      nomorRegistrasiKurator: 'KUR-NAT-2026-0089'
    };
  });

  // Keep admin profile synced with currentUser
  useEffect(() => {
    if (currentUser) {
      setAdminProfile(prev => {
        if (currentUser.nama && prev.nama !== currentUser.nama) {
          return {
            ...prev,
            nama: currentUser.nama,
            nip: currentUser.nip || prev.nip,
            instansi: currentUser.instansi || prev.instansi,
            email: currentUser.email || prev.email,
            adminRole: currentUser.adminRole || prev.adminRole,
            jabatan: currentUser.adminRole === 'super_admin'
              ? 'Super Admin & Lead Kurator Mutu Nasional'
              : 'Admin Kurator & Verifikator Perangkat Ajar',
          };
        }
        return prev;
      });
    }
  }, [currentUser]);

  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'pelatihan' | 'sertifikasi' | 'sop'>('templates');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('all');

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Edit form buffer
  const [editFormData, setEditFormData] = useState<AdminProfileData>(adminProfile);

  // Filtered Templates / Admin Master Works
  const adminTemplatesList = useMemo(() => {
    // Combine official master templates + custom templates uploaded by admin (stored in karyaList)
    const customTemplates = karyaList.filter(k => k.isMasterTemplate);
    const combined: Karya[] = [...customTemplates];
    for (const def of DEFAULT_OFFICIAL_MASTER_TEMPLATES) {
      if (!combined.some(c => c.id === def.id || c.judul.toLowerCase() === def.judul.toLowerCase())) {
        combined.push(def);
      }
    }

    let list = combined;
    
    if (templateSearchQuery.trim()) {
      const q = templateSearchQuery.toLowerCase();
      list = list.filter(k => 
        k.judul.toLowerCase().includes(q) ||
        k.deskripsi.toLowerCase().includes(q) ||
        k.mataPelajaran.toLowerCase().includes(q)
      );
    }

    if (selectedCategoryFilter !== 'all') {
      list = list.filter(k => k.kategori === selectedCategoryFilter);
    }

    if (selectedFormatFilter !== 'all') {
      list = list.filter(k => k.formatFile === selectedFormatFilter);
    }

    return list;
  }, [karyaList, templateSearchQuery, selectedCategoryFilter, selectedFormatFilter]);

  // Statistics calculation
  const totalApprovedWorks = karyaList.filter(k => k.status === 'Disetujui').length;
  const totalDownloads = karyaList.reduce((acc, curr) => acc + (curr.jumlahDownload || 0), 0);
  const totalFacilitatedJP = DEFAULT_ADMIN_FACILITATIONS.reduce((acc, curr) => acc + curr.jamPelajaran, 0);
  const totalFosteredTeachers = DEFAULT_ADMIN_FACILITATIONS.reduce((acc, curr) => acc + curr.jumlahPeserta, 0);

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminProfile(editFormData);
    try {
      localStorage.setItem('rkg_admin_profile_data', JSON.stringify(editFormData));
    } catch (err) {
      console.error(err);
    }

    if (currentUser && onUpdateCurrentUserProfile) {
      onUpdateCurrentUserProfile({
        ...currentUser,
        nama: editFormData.nama,
        nip: editFormData.nip,
        instansi: editFormData.instansi,
        email: editFormData.email || currentUser.email,
        noWhatsapp: editFormData.noWhatsapp,
        kabupatenKota: editFormData.lokasi
      });
    }

    setIsEditProfileOpen(false);
    if (onShowToast) {
      onShowToast('Profil Berhasil Diperbarui', 'Informasi portofolio admin & kurator telah disimpan secara permanen.', 'success');
    }
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    if (onShowToast) {
      onShowToast('Tautan Disalin!', 'Link portofolio resmi administrator telah disalin ke clipboard.', 'success');
    }
  };

  const handleShareToWhatsApp = () => {
    const text = `Lihat Portofolio Resmi Tim Administrator & Kurator Nasional RuangKarya Guru:
Nama: ${adminProfile.nama}
Jabatan: ${adminProfile.jabatan}
Instansi: ${adminProfile.instansi}
Tautan: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrintPortfolio = () => {
    window.print();
  };

  const getFormatBadge = (format: FileFormat) => {
    switch (format) {
      case 'PDF':
        return <span className="bg-red-100 text-red-700 border border-red-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>;
      case 'DOCX':
        return <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"><FileSpreadsheet className="w-3 h-3" /> DOCX</span>;
      case 'PPTX':
        return <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"><Layers className="w-3 h-3" /> PPTX</span>;
      case 'HTML5':
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"><Code2 className="w-3 h-3" /> HTML5</span>;
      case 'MP4':
        return <span className="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"><FileVideo className="w-3 h-3" /> MP4</span>;
      case 'MP3':
        return <span className="bg-pink-100 text-pink-700 border border-pink-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"><FileAudio className="w-3 h-3" /> MP3</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"><Archive className="w-3 h-3" /> {format}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      
      {/* 1. TOP STATUS BAR / NAVIGATION */}
      <div className="bg-slate-900 text-white border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPortfolio}
              title="Cetak atau Simpan sebagai PDF"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer hover:scale-105"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Cetak Portofolio</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-900/80 hover:bg-sky-800 text-sky-200 text-xs font-bold transition-all border border-sky-700/50 cursor-pointer hover:scale-105"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-300" />
              <span>Bagikan</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditFormData(adminProfile);
                  setIsEditProfileOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-sm cursor-pointer hover:scale-105"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Profil</span>
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* 2. HERO CARD PROFIL EKSEKUTIF ADMINISTRATOR */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Background subtle elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Sisi Kiri: Foto Avatar + Identitas */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              
              {/* Avatar Box */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 p-1 shadow-xl border-2 border-amber-400/60 flex items-center justify-center text-white text-3xl font-black overflow-hidden">
                  {adminProfile.avatarUrl ? (
                    <img src={adminProfile.avatarUrl} alt={adminProfile.nama} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <ShieldCheck className="w-12 h-12 text-amber-300 mb-1" />
                      <span className="text-[10px] tracking-wider uppercase font-extrabold text-blue-200">ADMIN</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-1.5 rounded-xl shadow-md border-2 border-slate-900" title="Verifikator & Kurator Mutu Terverifikasi">
                  <Award className="w-4 h-4 text-slate-950 font-black" />
                </div>
              </div>

              {/* Identity Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{adminProfile.jabatan}</span>
                  </span>
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    SK: {adminProfile.skPenugasan || 'Pusat Kurasi Nasional'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-sans">
                  {adminProfile.nama}
                  {adminProfile.gelar && !adminProfile.nama.toLowerCase().includes(adminProfile.gelar.toLowerCase()) && (
                    <span className="text-amber-400"> ({adminProfile.gelar})</span>
                  )}
                </h1>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{adminProfile.instansi}</span>
                  </div>
                  {adminProfile.nip && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <IdCard className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>NIP: {adminProfile.nip}</span>
                    </div>
                  )}
                </div>

                {/* Tags Spesialisasi */}
                {adminProfile.spesialisasi && adminProfile.spesialisasi.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {adminProfile.spesialisasi.map((tag, idx) => (
                      <span key={idx} className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg">
                        • {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Sisi Kanan: Action Callouts */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <button
                onClick={onNavigateToDashboard}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
              >
                <FolderCheck className="w-4 h-4 text-amber-400" />
                <span>Buka Meja Kurasi Karya</span>
              </button>
            </div>

          </div>

          {/* Bio Quote */}
          {adminProfile.bio && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300/90 leading-relaxed italic bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50">
              "{adminProfile.bio}"
            </div>
          )}

          {/* Kontak & Lokasi Footer Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              {adminProfile.email && (
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{adminProfile.email}</span>
                </div>
              )}
              {adminProfile.noWhatsapp && (
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{adminProfile.noWhatsapp} (Hotline Kurasi)</span>
                </div>
              )}
              {adminProfile.lokasi && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>📍 {adminProfile.lokasi}</span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-amber-300/90 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Terdaftar & Terverifikasi di Sistem RuangKarya Guru</span>
            </div>
          </div>

        </div>

        {/* 3. METRICS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template Master</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-sans">
              {adminTemplatesList.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dokumen master resmi aktif
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Karya Dikurasi</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-sans">
              {totalApprovedWorks}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Modul ajar lulus verifikasi
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendidik Terbina</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-sans">
              {totalFosteredTeachers.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Peserta lokakarya & workshop
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Jam Pelatihan</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-sans">
              {totalFacilitatedJP} JP
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Standar 32 JP per paket bimtek
            </p>
          </div>

        </div>

        {/* 4. MAIN CONTENT TABS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Tab Selection Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveSubTab('templates')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'templates'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Master Template & Modul Resmi ({adminTemplatesList.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('pelatihan')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'pelatihan'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Jejak Fasilitasi & Bimtek 32 JP ({DEFAULT_ADMIN_FACILITATIONS.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('sertifikasi')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'sertifikasi'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Lisensi Asesor & Sertifikasi ({DEFAULT_ADMIN_CERTIFICATIONS.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('sop')}
                className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'sop'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Standar Penjaminan Mutu Kurasi</span>
              </button>
            </div>

          </div>

          {/* TAB 1: MASTER TEMPLATE & MODUL RESMI */}
          {activeSubTab === 'templates' && (
            <div className="space-y-6">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari template master, modul ajar, panduan asesmen..."
                    value={templateSearchQuery}
                    onChange={(e) => setTemplateSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                  {templateSearchQuery && (
                    <button 
                      onClick={() => setTemplateSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="Modul Ajar / RPP">Modul Ajar / RPP</option>
                    <option value="Lembar Kerja (LKPD)">Lembar Kerja (LKPD)</option>
                    <option value="Bank Soal & Asesmen">Bank Soal & Asesmen</option>
                    <option value="Presentasi / PPT">Presentasi / PPT</option>
                    <option value="E-Book & Panduan">E-Book & Panduan</option>
                    <option value="Media Interaktif (HTML5)">Media Interaktif</option>
                  </select>

                  <select
                    value={selectedFormatFilter}
                    onChange={(e) => setSelectedFormatFilter(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Semua Format</option>
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="PPTX">PPTX</option>
                    <option value="HTML5">HTML5</option>
                  </select>

                  {isAdmin && (
                    <button
                      onClick={onOpenUploadModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Template</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Template Master Cards Grid */}
              {adminTemplatesList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {adminTemplatesList.map((karya) => (
                    <div 
                      key={karya.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all p-5 flex flex-col justify-between group relative"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {getFormatBadge(karya.formatFile)}
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {karya.jenjang}
                            </span>
                          </div>
                          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>Template Resmi</span>
                          </span>
                        </div>

                        <div>
                          <h3 
                            onClick={() => onSelectKarya(karya)}
                            className="font-black text-slate-900 text-base leading-snug group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-2"
                          >
                            {karya.judul}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                            {karya.deskripsi}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Penerbit:</span>
                            <span className="font-semibold text-slate-700">{karya.namaGuru}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Kategori:</span>
                            <span className="font-semibold text-slate-700">{karya.kategori}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Total Unduhan:</span>
                            <span className="font-bold text-blue-600">{karya.jumlahDownload}x diunduh</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onSelectKarya(karya)}
                          className="text-xs font-bold text-slate-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>

                        <button
                          onClick={() => onDownloadKarya(karya.id)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-105"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Template</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-base">Belum Ada Template Panduan yang Diterbitkan</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                    Administrator dapat mengunggah master template modul ajar, panduan asesmen, dan LKPD acuan melalui tombol <strong>Upload Template</strong> di atas.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: JEJAK FASILITASI & BIMTEK 32 JP */}
          {activeSubTab === 'pelatihan' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Rekam Jejak Kepelatihan Resmi Berstandar 32 JP</p>
                  <p className="text-blue-800/80 mt-0.5">
                    Seluruh program bimbingan teknis dan lokakarya nasional yang difasilitasi telah diverifikasi kelayakan transkrip kompetensi dan diakui dalam pemenuhan SKP PMM.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {DEFAULT_ADMIN_FACILITATIONS.map((fac) => (
                  <div key={fac.id} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-blue-300 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-2.5 py-0.5 rounded-md">
                            {fac.peran}
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            {fac.status}
                          </span>
                          <span className="text-xs text-slate-400">
                            {fac.tanggalPelaksanaan}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 text-base sm:text-lg mt-1.5">
                          {fac.judulPelatihan}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block bg-amber-50 text-amber-900 border border-amber-300 text-xs font-black px-3 py-1 rounded-xl">
                          {fac.jamPelajaran} JP
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Penyelenggara:</span>
                        <span className="font-semibold text-slate-800">{fac.penyelenggara}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Jumlah Pendidik Terbina:</span>
                        <span className="font-bold text-emerald-700">{fac.jumlahPeserta.toLocaleString('id-ID')} Peserta Guru</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Nomor SK Penugasan:</span>
                        <span className="font-mono text-slate-700">{fac.skPenugasan}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Materi & Kompetensi yang Dibina:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {fac.topikMateri.map((topik, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200">
                            ✓ {topik}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LISENSI ASESOR & SERTIFIKASI */}
          {activeSubTab === 'sertifikasi' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {DEFAULT_ADMIN_CERTIFICATIONS.map((cert) => (
                  <div key={cert.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-md">
                          {cert.kategori}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {cert.masaBerlaku}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-base leading-snug">
                          {cert.namaSertifikat}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Diterbitkan oleh: <strong>{cert.penerbit}</strong>
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {cert.deskripsi}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono">{cert.nomorSertifikat}</span>
                      <span className="font-bold text-slate-600">Tahun {cert.tahun}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STANDAR PENJAMINAN MUTU KURASI */}
          {activeSubTab === 'sop' && (
            <div className="space-y-6">
              
              <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-lg">4 Pilar Standar Kurasi Mutu RuangKarya Guru</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Setiap karya modul ajar, lembar kerja siswa, dan media pembelajaran yang diunggah peserta melewati penilaian berjenjang oleh tim kurator dengan standar acuan Kemendikbudristek:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-slate-900 text-sm">Kesesuaian Capaian & Tujuan Pembelajaran (CP/TP)</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Memastikan modul ajar memuat alur tujuan pembelajaran yang terstruktur runtut, selaras dengan karakteristik fase (Fase A hingga Fase F), dan bermuatan Profil Pelajar Pancasila.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-slate-900 text-sm">Diferensiasi Konten, Proses & Produk</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Memverifikasi tersedianya variasi lembar aktivitas yang mengakomodasi keragaman kesiapan belajar (*readiness*), minat, dan profil gaya belajar murid.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-slate-900 text-sm">Instrumen Asesmen Otentik & Rubrik Berjenjang</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Menilai kelengkapan instrumen diagnostik awal, formatif harian, serta rubrik penilaian sumatif berjenjang skala 1-4 yang terukur dan objektif.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center">4</span>
                    <h4 className="font-bold text-slate-900 text-sm">Keterbacaan, Tata Bahasa & Etika Hak Cipta</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pemeriksaan bebas plagiarisme, pencantuman sumber referensi pustaka yang sahih, serta tata letak visual yang ergonomis dan siap cetak.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: EDIT PROFIL ADMINISTRATOR */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Edit Profil Portofolio Administrator</h3>
                    <p className="text-xs text-slate-500">Perbarui informasi identitas publik & kredensial kurator</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 text-xs sm:text-sm">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.nama}
                      onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gelar Akademik</label>
                    <input
                      type="text"
                      placeholder="Contoh: M.Pd. / Dr."
                      value={editFormData.gelar || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, gelar: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Role Kurator *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.jabatan}
                      onChange={(e) => setEditFormData({ ...editFormData, jabatan: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">NIP / ID Administrator</label>
                    <input
                      type="text"
                      value={editFormData.nip || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, nip: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instansi / Lembaga *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.instansi}
                    onChange={(e) => setEditFormData({ ...editFormData, instansi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp Hotline</label>
                    <input
                      type="text"
                      value={editFormData.noWhatsapp || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, noWhatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah / Lokasi Kerja</label>
                  <input
                    type="text"
                    value={editFormData.lokasi || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, lokasi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio & Pernyataan Visi Kurasi</label>
                  <textarea
                    rows={3}
                    value={editFormData.bio || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-md cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: BAGIKAN PORTOFOLIO ADMINISTRATOR */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-sky-600" />
                  <h3 className="font-black text-slate-900 text-base">Bagikan Portofolio Administrator</h3>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-black text-sm shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900 text-xs truncate">{adminProfile.nama}</p>
                    <p className="text-[11px] text-slate-500 truncate">{adminProfile.jabatan}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tautan Langsung Portofolio</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={typeof window !== 'undefined' ? window.location.href : ''}
                      className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none truncate font-mono"
                    />
                    <button
                      onClick={handleCopyShareLink}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleShareToWhatsApp}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Bagikan ke WhatsApp Rekan & Pendidik</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
