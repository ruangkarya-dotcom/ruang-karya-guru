import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  Printer, 
  Download,
  Sparkles,
  CheckCircle2,
  File,
  Video,
  Headphones
} from 'lucide-react';
import { Karya } from '../types';
import { exportSingleKarya, ExportFormat } from '../utils/excelExport';

interface DownloadOptionsModalProps {
  karya: Karya | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDownload: (id: string, format: ExportFormat) => void;
}

export const DownloadOptionsModal: React.FC<DownloadOptionsModalProps> = ({
  karya,
  isOpen,
  onClose,
  onConfirmDownload
}) => {
  const isMp4 = karya?.formatFile === 'MP4';
  const isMp3 = karya?.formatFile === 'MP3';
  const isPdf = karya?.formatFile === 'PDF';
  const isDocx = karya?.formatFile === 'DOCX';

  const formats: {
    id: ExportFormat;
    title: string;
    ext: string;
    desc: string;
    color: string;
    bgColor: string;
    borderColor: string;
    badgeColor: string;
    icon: React.ReactNode;
    recommended?: boolean;
  }[] = [
    {
      id: 'mp4',
      title: 'Video Pembelajaran & Microlearning',
      ext: '.mp4',
      desc: 'Berkas video MP4 penjelasan visual, animasi pembelajaran, dan simulasi siap diputar.',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50 hover:bg-purple-100/80',
      borderColor: 'border-purple-200 hover:border-purple-400',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: <Video className="w-6 h-6 text-purple-600" />,
      recommended: isMp4
    },
    {
      id: 'mp3',
      title: 'Audio Podcast / Listening Audio',
      ext: '.mp3',
      desc: 'Berkas audio MP3 podcast edukasi, narasi pembelajaran, atau materi listening comprehension.',
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100/80',
      borderColor: 'border-cyan-200 hover:border-cyan-400',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      icon: <Headphones className="w-6 h-6 text-cyan-600" />,
      recommended: isMp3
    },
    {
      id: 'xlsx',
      title: 'Microsoft Excel Spreadsheet',
      ext: '.xlsx',
      desc: 'Multi-sheet lembar kerja berisi identitas modul, komponen alur pembelajaran, dan rekap ulasan.',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100/80',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <FileSpreadsheet className="w-6 h-6 text-emerald-600" />,
      recommended: !isMp4 && !isMp3 && !isPdf && !isDocx
    },
    {
      id: 'docx',
      title: 'Microsoft Word Dokumen',
      ext: '.doc / .docx',
      desc: 'Dokumen RPP / Modul Ajar terstruktur rapi dengan tabel kegiatan dan siap diedit ulang.',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50 hover:bg-blue-100/80',
      borderColor: 'border-blue-200 hover:border-blue-400',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      recommended: isDocx
    },
    {
      id: 'pdf',
      title: 'Dokumen Cetak PDF Resmi',
      ext: '.pdf',
      desc: 'Format dokumen PDF resmi siap cetak atau disimpan langsung dengan tata letak rapi.',
      color: 'text-rose-700',
      bgColor: 'bg-rose-50 hover:bg-rose-100/80',
      borderColor: 'border-rose-200 hover:border-rose-400',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: <Printer className="w-6 h-6 text-rose-600" />,
      recommended: isPdf
    },
    {
      id: 'txt',
      title: 'Format Teks Ringkas',
      ext: '.txt',
      desc: 'File teks polos tanpa format khusus, cocok untuk dibaca di perangkat apapun atau disalin cepat.',
      color: 'text-slate-700',
      bgColor: 'bg-slate-50 hover:bg-slate-100',
      borderColor: 'border-slate-200 hover:border-slate-400',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      icon: <File className="w-6 h-6 text-slate-600" />
    },
    {
      id: 'json',
      title: 'Data Mentah Structured JSON',
      ext: '.json',
      desc: 'Format data JSON untuk kebutuhan integrasi aplikasi atau pengarsipan data digital.',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 hover:bg-amber-100/80',
      borderColor: 'border-amber-200 hover:border-amber-400',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: <FileCode className="w-6 h-6 text-amber-600" />
    }
  ];

  const handleSelectFormat = (formatId: ExportFormat) => {
    if (!karya) return;
    onConfirmDownload(karya.id, formatId);
    exportSingleKarya(karya, formatId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && karya && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] transform-gpu"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-[#1E3A8A] to-slate-900 text-white p-5 flex items-center justify-between border-b border-blue-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30 shrink-0">
                  <Download className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">
                    Pilih Format Unduhan Modul
                  </h2>
                  <p className="text-xs text-blue-200">
                    Tersedia berbagai pilihan format berkas sesuai kebutuhan Anda.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Work Summary Box */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 px-6 space-y-1 shrink-0">
              <span className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider block">
                Modul yang Akan Diunduh:
              </span>
              <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                {karya.judul}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                <span>Penulis: <strong className="text-slate-800">{karya.namaGuru}</strong></span>
                <span>&bull;</span>
                <span>Mapel: <strong className="text-slate-800">{karya.mataPelajaran}</strong></span>
              </div>
            </div>

            {/* Options List */}
            <div className="p-5 space-y-3 overflow-y-auto max-h-[60vh]">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelectFormat(f.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 relative group ${f.bgColor} ${f.borderColor}`}
                >
                  <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200/80 shrink-0 group-hover:scale-105 transition-transform">
                    {f.icon}
                  </div>

                  <div className="space-y-1 flex-1 pr-14">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-extrabold text-sm ${f.color}`}>
                        {f.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${f.badgeColor}`}>
                        {f.ext}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-1 shrink-0">
                    {f.recommended && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-100" />
                        Rekomendasi
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Seluruh file bebas dari iklan dan terverifikasi aman.
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
