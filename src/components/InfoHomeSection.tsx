import React, { useState } from 'react';
import { 
  Building2, 
  BookOpen, 
  Award, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  UserCheck,
  FolderCheck,
  Download,
  Eye,
  CheckCircle2,
  Star,
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Layers,
  FileCheck2,
  GraduationCap,
  Laptop,
  Check,
  HelpCircle,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { User, Karya } from '../types';
import logoImage from '../assets/images/ruang_karya_guru_new_logo_1786451613174.jpg';

interface InfoHomeSectionProps {
  onNavigateTab: (tab: 'home' | 'galeri' | 'pelatihan' | 'artikel' | 'admin' | 'guru' | 'profil-guru') => void;
  onOpenLogin: () => void;
  totalKarya: number;
  totalDownloads: number;
  currentUser?: User | null;
  karyaList?: Karya[];
  onSelectKarya?: (karya: Karya) => void;
  onOpenUpload?: () => void;
  onDownloadKarya?: (id: string) => void;
  onViewTeacherProfile?: (karya?: Karya) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const InfoHomeSection: React.FC<InfoHomeSectionProps> = ({
  onNavigateTab,
  onOpenLogin,
  totalKarya,
  totalDownloads,
  currentUser,
  karyaList = [],
  onSelectKarya,
  onOpenUpload,
  onDownloadKarya,
  onViewTeacherProfile,
  searchQuery = '',
  setSearchQuery,
}) => {
  // Filter curated/approved works for public showcase (4-8 items)
  const approvedKarya = karyaList
    .filter(k => k.status === 'Disetujui')
    .slice(0, 8);

  const formatColorBadge = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'DOCX':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PPTX':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'HTML5':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MP4':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-16 pb-16 bg-[#F8FAFC]">
      
      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Official Info, Global Search & Live Key Metrics)          */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden shadow-xl">
        
        {/* Subtle Background Glow Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          
          {/* Main Hero Header & Intro */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0EA5E9]/15 text-[#38BDF8] text-xs font-bold uppercase tracking-wider border border-[#0EA5E9]/30 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Portal Integrasi & Kurasi Karya Guru Nusantara</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
              Wadah Kolaborasi, Publikasi & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#38BDF8] to-cyan-300 bg-clip-text text-transparent">
                Perangkat Ajar Kurikulum Merdeka
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Pusat informasi resmi pelatihan bersertifikat 32 JP, showcase modul ajar Kurikulum Merdeka terverifikasi, dan portofolio digital pendidik Indonesia.
            </p>
          </div>

          {/* 3 Live Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-2">
            
            {/* Metric 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl flex items-center gap-4 shadow-lg backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {totalKarya > 0 ? `${totalKarya}` : '0'}
                </p>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                  Karya Terkurasi
                </p>
                <p className="text-[11px] text-slate-400">
                  {totalKarya > 0 ? 'Modul & perangkat ajar aktif' : 'Belum ada karya aktif'}
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl flex items-center gap-4 shadow-lg backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-cyan-300 tracking-tight">
                  {totalDownloads > 0 ? `${totalDownloads.toLocaleString('id-ID')}` : '0'}
                </p>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                  Total Unduhan
                </p>
                <p className="text-[11px] text-slate-400">
                  {totalDownloads > 0 ? 'Perangkat telah dipelajari' : 'Belum ada unduhan'}
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl flex items-center gap-4 shadow-lg backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">32 JP</p>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                  Standar Pelatihan
                </p>
                <p className="text-[11px] text-slate-400">Transkrip kompetensi resmi</p>
              </div>
            </div>

          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="btn-hero-explore-cta"
              onClick={() => {
                onNavigateTab('galeri');
                if (typeof window !== 'undefined') window.history.pushState(null, '', '/galeri-karya');
              }}
              className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <FolderCheck className="w-4.5 h-4.5 text-white" />
              <span>Jelajah Seluruh Katalog Karya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. SECTION GALERI KARYA & PERANGKAT AJAR UNGGULAN (Curated 4-8 Grid)        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1E3A8A] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              <FolderCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{approvedKarya.length > 0 ? 'Galeri Karya Terkurasi' : 'Repositori Karya Pembelajaran'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {approvedKarya.length > 0 ? 'Perangkat Ajar & Modul Unggulan Guru' : 'Katalog Karya Pembelajaran Guru'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {approvedKarya.length > 0
                ? 'Koleksi modul ajar, LKPD, media interaktif, dan asesmen pilihan yang telah diverifikasi sesuai capaian pembelajaran Kurikulum Merdeka.'
                : 'Data karya pembelajaran telah dibersihkan melalui sistem manajemen admin. Repositori saat ini siap menampung modul ajar dan inovasi perangkat ajar baru dari Bapak/Ibu Guru.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {approvedKarya.length === 0 && (
              <button
                id="btn-upload-top-section"
                onClick={() => {
                  if (onOpenUpload) onOpenUpload();
                }}
                className="text-xs sm:text-sm font-bold bg-[#1E3A8A] hover:bg-[#152e72] text-white flex items-center gap-1.5 shrink-0 group cursor-pointer transition-all px-4 py-2 rounded-xl shadow-xs hover:scale-102"
              >
                <GraduationCap className="w-4 h-4 text-cyan-300" />
                <span>Unggah Karya Baru</span>
              </button>
            )}
            <button
              id="btn-view-all-gallery-top"
              onClick={() => {
                onNavigateTab('galeri');
                if (typeof window !== 'undefined') window.history.pushState(null, '', '/galeri-karya');
              }}
              className="text-xs sm:text-sm font-bold text-[#1E3A8A] hover:text-[#0EA5E9] flex items-center gap-1.5 shrink-0 group cursor-pointer transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs"
            >
              <span>{approvedKarya.length > 0 ? 'Lihat Semua Karya di Galeri' : 'Buka Galeri (0 Karya)'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Curated Grid Cards or Empty State */}
        {approvedKarya.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {approvedKarya.map((karya) => (
              <div 
                key={karya.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top / Header Content */}
                <div className="p-5 space-y-3.5">
                  
                  {/* Badges Bar: Format & Jenjang / Mapel */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black border uppercase tracking-wider ${formatColorBadge(karya.formatFile)}`}>
                      {karya.formatFile}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                      {karya.jenjang} &bull; {karya.mataPelajaran}
                    </span>
                  </div>

                  {/* Judul Karya */}
                  <h3 
                    onClick={() => onSelectKarya && onSelectKarya(karya)}
                    className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#1E3A8A] transition-colors line-clamp-2 cursor-pointer leading-snug"
                    title={karya.judul}
                  >
                    {karya.judul}
                  </h3>

                  {/* Deskripsi Singkat */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {karya.deskripsi}
                  </p>

                  {/* Identitas Guru Penyusun */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E3A8A] font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                      {karya.namaGuru.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p 
                        onClick={() => onViewTeacherProfile && onViewTeacherProfile(karya)}
                        className="text-xs font-bold text-slate-800 truncate hover:text-[#1E3A8A] cursor-pointer"
                        title={karya.namaGuru}
                      >
                        {karya.namaGuru}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate" title={karya.nipOrInstansi}>
                        {karya.nipOrInstansi}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Card Footer: Metrics & Actions (Preview + Download 100% accessible) */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-cyan-600" />
                      <strong className="text-slate-700">{karya.jumlahDownload}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong className="text-slate-700">5.0</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-preview-karya-${karya.id}`}
                      onClick={() => onSelectKarya && onSelectKarya(karya)}
                      title="Pratinjau Karya"
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Pratinjau</span>
                    </button>
                    <button
                      id={`btn-download-karya-${karya.id}`}
                      onClick={() => onDownloadKarya && onDownloadKarya(karya.id)}
                      title="Unduh Berkas Perangkat Ajar"
                      className="bg-[#1E3A8A] hover:bg-[#152e72] text-white font-bold text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs hover:scale-102"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-b from-white to-slate-50/60 rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center space-y-6 shadow-xs max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-[#1E3A8A] rounded-2xl mx-auto flex items-center justify-center border border-blue-100 shadow-2xs">
              <FolderCheck className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Karya Telah Dikosongkan dari Panel Admin</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                Repositori Karya Siap Menerima Unggahan Baru
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                Karya-karya pembelajaran sebelumnya telah dibersihkan oleh Administrator. Pendidik kini dapat mengunggah Modul Ajar, Lembar Kerja (LKPD), Media Interaktif, maupun Soal Asesmen terbaru.
              </p>
            </div>

            {/* Quick Informational Flow Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-1 text-left">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center space-y-1 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#1E3A8A] text-xs font-bold inline-flex items-center justify-center">1</span>
                <p className="text-xs font-bold text-slate-800">Unggah Karya</p>
                <p className="text-[11px] text-slate-500">Guru mengirim modul ajar / LKPD</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center space-y-1 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-[#0284c7] text-xs font-bold inline-flex items-center justify-center">2</span>
                <p className="text-xs font-bold text-slate-800">Kurasi Tim</p>
                <p className="text-[11px] text-slate-500">Diverifikasi kesesuaian CP kurikulum</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center space-y-1 shadow-2xs">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold inline-flex items-center justify-center">3</span>
                <p className="text-xs font-bold text-slate-800">Terbit di Galeri</p>
                <p className="text-[11px] text-slate-500">Tampil otomatis di etalase beranda</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                id="btn-upload-empty-home"
                onClick={() => {
                  if (onOpenUpload) onOpenUpload();
                }}
                className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#152e72] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-900/15 transition-all cursor-pointer hover:scale-102"
              >
                <GraduationCap className="w-4 h-4 text-cyan-300" />
                <span>Unggah Karya Baru</span>
              </button>
              <button
                id="btn-gallery-empty-home"
                onClick={() => {
                  onNavigateTab('galeri');
                  if (typeof window !== 'undefined') window.history.pushState(null, '', '/galeri-karya');
                }}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-slate-300 transition-all cursor-pointer"
              >
                <FolderCheck className="w-4 h-4 text-slate-500" />
                <span>Buka Halaman Galeri</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA for Gallery */}
        {approvedKarya.length > 0 && (
          <div className="text-center pt-2">
            <button
              id="btn-view-all-gallery-bottom"
              onClick={() => {
                onNavigateTab('galeri');
                if (typeof window !== 'undefined') window.history.pushState(null, '', '/galeri-karya');
              }}
              className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#152e72] text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-2xl transition-all shadow-md shadow-blue-900/20 cursor-pointer hover:scale-105 active:scale-95"
            >
              <FolderCheck className="w-4 h-4 text-cyan-300" />
              <span>Lihat Semua Karya di Galeri →</span>
            </button>
          </div>
        )}

      </section>


      {/* ========================================================================= */}
      {/* 4. SECTION INFORMASI AGENDA PELATIHAN & WORKSHOP 32 JP                      */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden space-y-8 border border-blue-800">
          
          {/* Top Label & Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-400/30">
                <Award className="w-4 h-4 text-cyan-300" />
                <span>Program Workshop Terverifikasi Resmi 32 JP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Workshop Nasional: Penyusunan Modul Ajar & Media Interaktif Kurikulum Merdeka
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
                Tingkatkan kompetensi pedagogik digital Anda melalui bimbingan narasumber pakar kurikulum dengan fasilitas sertifikat resmi dan laporan 32 JP.
              </p>
            </div>

            <div className="shrink-0">
              <button
                id="btn-training-register-cta"
                onClick={() => onNavigateTab('pelatihan')}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-400/20 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <Award className="w-4.5 h-4.5 text-slate-950" />
                <span>Informasi & Pendaftaran Pelatihan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            
            {/* Left: Schedule & Instructor */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3">
                <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                  Jadwal & Fasilitas Resmi
                </h4>
                <div className="space-y-2.5 text-xs text-blue-100">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Tanggal:</strong> 24 - 27 Agustus 2026 (4 Hari Sesi Intensif)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Waktu:</strong> 13.30 - 16.00 WIB (Online via Zoom & LMS)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Platform:</strong> Zoom Interaktif & LMS RuangKarya</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300 font-bold">Dilengkapi Sertifikat 32 JP & Format Laporan Resmi</span>
                  </div>
                </div>
              </div>

              {/* Instructor Profile Card */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-black flex items-center justify-center text-lg shrink-0 shadow-md">
                  BS
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-300">
                    Instruktur Utama / Narasumber
                  </span>
                  <p className="text-sm font-extrabold text-white">
                    Dr. H. Bambang Sudirman, M.Pd.
                  </p>
                  <p className="text-xs text-blue-200">
                    Widyaprada Ahli Madya & Tim Pengembang Kurikulum Merdeka
                  </p>
                </div>
              </div>
            </div>

            {/* Right: 4 Silabus Materi 32 JP */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/15 space-y-4">
              <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Silabus Materi Pelatihan 32 JP</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-cyan-400 font-black text-xs block">Sesi 1 &bull; 8 JP</span>
                  <h5 className="font-bold text-white">Pemetaan CP & ATP</h5>
                  <p className="text-blue-200 text-[11px] leading-relaxed">
                    Bedah Capaian Pembelajaran dan penyusunan Alur Tujuan Pembelajaran kontekstual.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-cyan-400 font-black text-xs block">Sesi 2 &bull; 8 JP</span>
                  <h5 className="font-bold text-white">Diferensiasi Pembelajaran</h5>
                  <p className="text-blue-200 text-[11px] leading-relaxed">
                    Strategi diferensiasi konten, proses, dan produk dalam perangkat ajar.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-cyan-400 font-black text-xs block">Sesi 3 &bull; 8 JP</span>
                  <h5 className="font-bold text-white">Media Pembelajaran Interaktif</h5>
                  <p className="text-blue-200 text-[11px] leading-relaxed">
                    Pemanfaatan HTML5, Canva Edukasi, dan simulasi lab virtual interaktif.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-cyan-400 font-black text-xs block">Sesi 4 &bull; 8 JP</span>
                  <h5 className="font-bold text-white">Asesmen & Portofolio Akhir</h5>
                  <p className="text-blue-200 text-[11px] leading-relaxed">
                    Penyusunan instrumen asesmen formatif otentik dan penelaahan karya akhir.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. SECTION EDUKASI ALUR KERJA SISTEM (3-Step How It Works Workflow)        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1E3A8A] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>Alur Praktis Pendidik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bagaimana RuangKarya Guru Bekerja?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Tiga langkah sederhana bagi guru untuk berkolaborasi, mempublikasikan karya, dan mendapatkan rekognisi resmi nasional.
          </p>
        </div>

        {/* 3 Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4 relative group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E3A8A] font-black text-lg flex items-center justify-center border border-blue-200">
              1
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                1. Registrasi Akun Mandiri
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pendidik melakukan pendaftaran dengan NIP atau NUPTK untuk langsung mengaktifkan akun portofolio digital dan akses dashboard guru.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#1E3A8A]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akses Gratis & Otomatis Terverifikasi</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4 relative group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#0EA5E9] font-black text-lg flex items-center justify-center border border-cyan-200">
              2
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                2. Ikuti Pelatihan & Susun Karya
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ikuti workshop daring, gunakan template master standar Kurikulum Merdeka, dan susun modul ajar atau media interaktif terbaik Anda.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#0EA5E9]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Disediakan Master Template DOCX/PPTX</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4 relative group hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-black text-lg flex items-center justify-center border border-amber-200">
              3
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                3. Kurasi & Publikasi Portofolio
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Karya ditelaah oleh tim kurator, diterbitkan secara nasional, dan otomatis menghasilkan dokumen laporan pengembangan diri 32 JP.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sertifikat & Portofolio Digital Siap Unduh</span>
            </div>
          </div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* 6. PUSAT BANTUAN & INFORMASI LAYANAN ADMIN                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center md:justify-start gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Butuh Bantuan Seputar Pelatihan atau Kurasi Berkas?</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Tim layanan administrasi dan kurator RuangKarya siap membantu verifikasi berkas karya dan penerbitan sertifikat 32 JP Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="mailto:admin@ruangkaryaguru.id"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>admin@ruangkaryaguru.id</span>
            </a>
            <a
              href="https://wa.me/6281298765432"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Helpdesk</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
