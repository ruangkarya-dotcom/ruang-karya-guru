import React, { useState } from 'react';
import { FileText, Clock, User, ArrowRight, X, BookOpen } from 'lucide-react';
import { Artikel } from '../types';

interface ArtikelSectionProps {
  artikelList: Artikel[];
}

export const ArtikelSection: React.FC<ArtikelSectionProps> = ({ artikelList }) => {
  const [selectedArtikel, setSelectedArtikel] = useState<Artikel | null>(null);

  return (
    <section id="artikel" className="py-12 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Wawasan & Literasi Pedagogi
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-tight">
              Artikel Edukasi
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Panduan praktis implementasi Kurikulum Merdeka, pemanfaatan teknologi kelas, dan metodologi asesmen terkini.
          </p>
        </div>

        {/* Articles Grid */}
        {artikelList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artikelList.map((item) => (
              <article 
                key={item.id}
                onClick={() => setSelectedArtikel(item)}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img 
                      src={item.gambar} 
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#1E3A8A] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {item.kategori}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-[#0EA5E9]" />
                        {item.penulis}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.waktuBaca}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-[#1E3A8A] transition-colors">
                      {item.judul}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {item.ringkasan}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center text-xs font-bold text-[#0EA5E9] group-hover:text-[#1E3A8A] transition-colors">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>

              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-[#1E3A8A] rounded-full mx-auto flex items-center justify-center border border-blue-100">
              <BookOpen className="w-6 h-6 text-[#0EA5E9]" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Belum Ada Artikel atau Publikasi Edukasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kajian praktik baik, panduan Kurikulum Merdeka, dan artikel pedagogik kependidikan akan segera diterbitkan di sini.
            </p>
          </div>
        )}

        {/* Modal Article Reader */}
        {selectedArtikel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl max-w-2xl w-full my-8 shadow-xl relative border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
              
              {/* Header */}
              <div className="bg-[#1E3A8A] text-white p-5 flex items-start justify-between border-b border-blue-900 shrink-0">
                <div className="space-y-1 pr-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    {selectedArtikel.kategori} • {selectedArtikel.waktuBaca}
                  </span>
                  <h3 className="font-bold text-lg leading-snug">
                    {selectedArtikel.judul}
                  </h3>
                  <p className="text-xs text-blue-200">
                    Oleh {selectedArtikel.penulis} • {selectedArtikel.tanggal}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedArtikel(null)}
                  className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-sm leading-relaxed">
                <img 
                  src={selectedArtikel.gambar} 
                  alt={selectedArtikel.judul} 
                  className="w-full h-56 object-cover rounded-lg border border-slate-200 mb-4"
                />

                <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-sans">
                  {selectedArtikel.konten}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#F8FAFC] p-4 border-t border-slate-200 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedArtikel(null)}
                  className="bg-[#1E3A8A] text-white px-5 py-2 rounded-md text-xs font-semibold"
                >
                  Tutup Artikel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

