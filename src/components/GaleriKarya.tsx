import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  FileSpreadsheet, 
  FileVideo, 
  FileAudio, 
  Code2, 
  Archive, 
  Building2, 
  CheckCircle2, 
  GraduationCap,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Karya, FileFormat, CategoryType, User } from '../types';

interface GaleriKaryaProps {
  karyaList: Karya[];
  onSelectKarya: (karya: Karya) => void;
  onDownloadKarya: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenUpload: () => void;
  currentUser?: User | null;
  onOpenLogin?: () => void;
  onViewTeacherProfile?: (karya: Karya) => void;
}

const CATEGORY_OPTIONS: (CategoryType | 'Semua')[] = [
  'Semua',
  'Media Interaktif (HTML5)',
  'Video Pembelajaran',
  'Lembar Kerja (LKPD)',
  'Bank Soal & Asesmen',
  'Presentasi / PPT',
  'E-Book & Panduan'
];

const FORMAT_OPTIONS: (FileFormat | 'Semua')[] = [
  'Semua',
  'PDF',
  'DOCX',
  'PPTX',
  'HTML5',
  'MP4',
  'MP3',
  'ZIP'
];

export const GaleriKarya: React.FC<GaleriKaryaProps> = ({
  karyaList,
  onSelectKarya,
  onDownloadKarya,
  searchQuery,
  setSearchQuery,
  onOpenUpload,
  currentUser,
  onOpenLogin,
  onViewTeacherProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'Semua'>('Semua');
  const [selectedFormat, setSelectedFormat] = useState<FileFormat | 'Semua'>('Semua');
  const [selectedJenjang, setSelectedJenjang] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'terbaru' | 'populer' | 'download'>('terbaru');

  // Filter only 'Disetujui' works for the public gallery
  const verifiedList = useMemo(() => {
    return karyaList.filter(k => k.status === 'Disetujui');
  }, [karyaList]);

  // Apply search, category, format, and sorting
  const filteredList = useMemo(() => {
    return verifiedList.filter(item => {
      // Search
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.judul.toLowerCase().includes(query) ||
        item.namaGuru.toLowerCase().includes(query) ||
        item.mataPelajaran.toLowerCase().includes(query) ||
        item.nipOrInstansi.toLowerCase().includes(query) ||
        item.deskripsi.toLowerCase().includes(query);

      // Category
      const matchesCategory = selectedCategory === 'Semua' || item.kategori === selectedCategory;

      // Format
      const matchesFormat = selectedFormat === 'Semua' || item.formatFile === selectedFormat;

      // Jenjang
      const matchesJenjang = selectedJenjang === 'Semua' || item.jenjang === selectedJenjang;

      return matchesSearch && matchesCategory && matchesFormat && matchesJenjang;
    }).sort((a, b) => {
      if (sortBy === 'populer') return b.jumlahView - a.jumlahView;
      if (sortBy === 'download') return b.jumlahDownload - a.jumlahDownload;
      return new Date(b.tanggalUpload).getTime() - new Date(a.tanggalUpload).getTime();
    });
  }, [verifiedList, searchQuery, selectedCategory, selectedFormat, selectedJenjang, sortBy]);

  const getFormatBadge = (fmt: FileFormat) => {
    switch (fmt) {
      case 'PDF':
        return { bg: 'bg-red-100 text-red-600', icon: <FileText className="w-3.5 h-3.5 text-red-600" /> };
      case 'DOCX':
        return { bg: 'bg-blue-100 text-[#1E3A8A]', icon: <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" /> };
      case 'PPTX':
        return { bg: 'bg-amber-100 text-amber-700', icon: <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" /> };
      case 'MP4':
        return { bg: 'bg-orange-100 text-orange-600', icon: <FileVideo className="w-3.5 h-3.5 text-orange-600" /> };
      case 'MP3':
        return { bg: 'bg-emerald-100 text-emerald-700', icon: <FileAudio className="w-3.5 h-3.5 text-emerald-600" /> };
      case 'HTML5':
        return { bg: 'bg-purple-100 text-purple-600', icon: <Code2 className="w-3.5 h-3.5 text-purple-600" /> };
      case 'ZIP':
        return { bg: 'bg-slate-100 text-slate-700', icon: <Archive className="w-3.5 h-3.5 text-slate-600" /> };
      default:
        return { bg: 'bg-slate-100 text-slate-700', icon: <FileText className="w-3.5 h-3.5 text-slate-600" /> };
    }
  };

  return (
    <section id="galeri" className="py-10 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[#0EA5E9] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Ruang Karya Terverifikasi
            </div>
            <h2 className="text-2xl font-extrabold text-[#1E3A8A] tracking-tight">
              Galeri Karya Terbaru
            </h2>
            <p className="text-xs text-slate-500">
              Akses dan unduh modul ajar, LKPD, media interaktif, dan perangkat pembelajaran dari guru se-Indonesia.
            </p>
          </div>

          {currentUser && (
            <button
              onClick={onOpenUpload}
              className="self-start md:self-auto bg-[#1E3A8A] hover:bg-[#152e72] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
              Unggah Karya Anda
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          
          {/* Top Search & Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari karya, nama guru, atau mata pelajaran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 transition-all"
              />
            </div>

            {/* Jenjang Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedJenjang}
                onChange={(e) => setSelectedJenjang(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
              >
                <option value="Semua">Semua Jenjang Pendidikan</option>
                <option value="SD">SD / MI</option>
                <option value="SMP">SMP / MTs</option>
                <option value="SMA/SMK">SMA / SMK / MA</option>
                <option value="Umum">Umum / Semua Tingkat</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3">
              <div className="flex items-center bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-transparent text-slate-700 font-medium focus:outline-none"
                >
                  <option value="terbaru">Urutkan: Upload Terbaru</option>
                  <option value="download">Urutkan: Unduhan Terbanyak</option>
                  <option value="populer">Urutkan: Paling Populer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Chips Horizontal */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Kategori:
            </span>
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-100 text-[#1E3A8A]'
                    : 'text-slate-500 hover:text-[#1E3A8A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Format Badges Horizontal */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Format:
            </span>
            {FORMAT_OPTIONS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                  selectedFormat === fmt
                    ? 'bg-[#0EA5E9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-medium px-1">
          <p>
            Menampilkan <strong className="text-slate-900 font-extrabold">{filteredList.length}</strong> karya terverifikasi
            {selectedCategory !== 'Semua' && <span> di kategori <strong className="text-slate-900 font-extrabold">{selectedCategory}</strong></span>}
            {selectedFormat !== 'Semua' && <span> format <strong className="text-slate-900 font-extrabold">{selectedFormat}</strong></span>}
          </p>
          {(selectedCategory !== 'Semua' || selectedFormat !== 'Semua' || selectedJenjang !== 'Semua' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedFormat('Semua');
                setSelectedJenjang('Semua');
                setSearchQuery('');
              }}
              className="text-[#0EA5E9] hover:underline font-extrabold"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Karya Grid */}
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((karya) => {
              const fmtStyle = getFormatBadge(karya.formatFile);
              return (
                <div
                  key={karya.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-out transform-gpu group"
                >
                  {/* Card Cover Header */}
                  <div className="h-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex items-center justify-center relative p-4">
                    <span className={`absolute top-3 left-3 ${fmtStyle.bg} text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-2xs`}>
                      {fmtStyle.icon}
                      {karya.formatFile}
                    </span>

                    <span className="absolute top-3 right-3 bg-white/95 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {karya.jenjang}
                    </span>

                    {/* Preview Box Icon */}
                    <div className="w-14 h-16 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col items-center justify-center p-2 group-hover:scale-105 transition-transform">
                      <div className="w-8 h-1 bg-slate-200 mb-1.5 rounded-full" />
                      <div className="w-8 h-1 bg-slate-200 mb-1.5 rounded-full" />
                      <div className="w-5 h-1 bg-[#0EA5E9] rounded-full" />
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex flex-col flex-1">
                    <h4 
                      onClick={() => onSelectKarya(karya)}
                      className="font-extrabold text-base text-slate-900 line-clamp-1 cursor-pointer group-hover:text-[#1E3A8A] transition-colors"
                    >
                      {karya.judul}
                    </h4>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p 
                        onClick={(e) => {
                          if (onViewTeacherProfile) {
                            e.stopPropagation();
                            onViewTeacherProfile(karya);
                          }
                        }}
                        className={`text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5 truncate ${
                          onViewTeacherProfile ? 'hover:text-blue-900 hover:underline cursor-pointer' : ''
                        }`}
                        title="Klik untuk melihat Portofolio Profil Guru"
                      >
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{karya.namaGuru} &bull; {karya.nipOrInstansi}</span>
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                      {karya.deskripsi}
                    </p>

                    {/* Card Footer Info */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                      <div className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                        {karya.mataPelajaran}
                      </div>
                      <div className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md truncate max-w-[130px]">
                        {karya.kategori}
                      </div>
                      <button 
                        onClick={() => onSelectKarya(karya)}
                        className="ml-auto text-[#0EA5E9] font-extrabold text-xs sm:text-sm hover:underline"
                      >
                        Detail
                      </button>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3.5 pt-2 flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                          {karya.jumlahDownload}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {karya.jumlahView}
                        </span>
                      </div>

                      <button
                        onClick={() => onDownloadKarya(karya.id)}
                        className="bg-[#1E3A8A] hover:bg-[#152e72] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 group active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform" />
                        Unduh
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Tidak Ada Karya yang Cocok</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori/format file.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedFormat('Semua');
                setSelectedJenjang('Semua');
                setSearchQuery('');
              }}
              className="bg-[#1E3A8A] text-white font-semibold text-xs px-4 py-2 rounded-md"
            >
              Tampilkan Semua Karya
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

