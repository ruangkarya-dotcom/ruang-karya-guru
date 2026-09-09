import React from 'react';
import { Search, Sparkles, FolderCheck, Users, Award, ArrowRight, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onLoginClick: () => void;
  onUploadClick: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalKarya: number;
  totalDownloads: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onLoginClick,
  onUploadClick,
  searchQuery,
  setSearchQuery,
  totalKarya,
  totalDownloads,
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreClick();
  };

  return (
    <div className="py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* Main Hero Card (Dark Navy Slate) */}
        <div className="lg:col-span-8 bg-[#0F172A] rounded-2xl p-5 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between text-white shadow-lg">
          <div className="relative z-10 space-y-3.5 sm:space-y-5">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0EA5E9]/20 text-[#38BDF8] text-[11px] sm:text-xs font-bold uppercase tracking-widest border border-[#0EA5E9]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Portal Edukasi Nasional</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Wadah Inspirasi &<br className="hidden sm:inline" /> Kreativitas Guru Indonesia
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
              Publikasikan karya inovatif Anda, akses ribuan modul ajar, dan tingkatkan kompetensi melalui pelatihan tersertifikasi secara gratis & aman.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-1 sm:pt-2 max-w-xl">
              <div className="relative flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1.5 shadow-xl focus-within:border-[#0EA5E9] transition-all">
                <Search className="w-4 h-4 text-slate-400 ml-2.5 sm:ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari modul, mapel, nama guru..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-slate-400 px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all shrink-0 flex items-center gap-1 active:scale-95"
                >
                  <span>Cari</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={onUploadClick}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <FolderCheck className="w-4 h-4 text-white" />
                <span>Unggah Karya</span>
              </button>
              <button
                onClick={onExploreClick}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-sky-300" />
                <span>Lihat Galeri</span>
              </button>
              <button
                onClick={onLoginClick}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4 text-sky-300" />
                <span>Login Portal</span>
              </button>
            </div>

          </div>

          {/* Decorative Gradient Orb */}
          <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-[#1E3A8A] to-transparent rounded-full opacity-40 pointer-events-none" />
        </div>

        {/* Side Stats Card (White Editorial Card) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-6">
              Statistik Terkini Portal
            </h3>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A]">{totalKarya + 120}</p>
                  <p className="text-xs text-slate-600 uppercase font-bold tracking-wide">
                    Total Karya Terverifikasi
                  </p>
                </div>
                <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center text-[#1E3A8A] shrink-0">
                  <CheckCircle2 className="w-5.5 h-5.5" />
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A]">
                    {(totalDownloads + 8400).toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-slate-600 uppercase font-bold tracking-wide">
                    Total Unduhan Materi
                  </p>
                </div>
                <div className="w-11 h-11 bg-cyan-50 rounded-full flex items-center justify-center text-[#0EA5E9] shrink-0">
                  <Download className="w-5.5 h-5.5" />
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A]">850+</p>
                  <p className="text-xs text-slate-600 uppercase font-bold tracking-wide">
                    Guru Kontributor
                  </p>
                </div>
                <div className="w-11 h-11 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                  <Users className="w-5.5 h-5.5" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

