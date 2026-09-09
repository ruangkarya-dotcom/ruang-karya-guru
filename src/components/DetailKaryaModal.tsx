import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Eye, 
  User as UserIcon, 
  Building2, 
  BookOpen, 
  Calendar, 
  FileText, 
  FileSpreadsheet, 
  FileVideo, 
  FileAudio, 
  Code2, 
  Archive, 
  CheckCircle2, 
  ExternalLink,
  Share2,
  Sparkles,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { Karya, FileFormat, Review, User } from '../types';

interface DetailKaryaModalProps {
  karya: Karya | null;
  onClose: () => void;
  onDownload: (id: string) => void;
  currentUser?: User | null;
  onAddReview?: (karyaId: string, review: Review) => void;
  onViewTeacherProfile?: (karya: Karya) => void;
}

export const DetailKaryaModal: React.FC<DetailKaryaModalProps> = ({
  karya,
  onClose,
  onDownload,
  currentUser,
  onAddReview,
  onViewTeacherProfile,
}) => {
  const [likes, setLikes] = React.useState(24);
  const [hasLiked, setHasLiked] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');
  const [rating, setRating] = React.useState<number>(5);

  if (!karya) return null;

  const displayReviews = karya.reviews && karya.reviews.length > 0 ? karya.reviews : [
    { id: 'def-1', nama: 'Dra. Endang M.', instansi: 'SMA Negeri 2 Bandung', teks: 'Sangat bermanfaat untuk referensi modul ajar saya minggu depan. Terima kasih!', tanggal: 'Kemarin', rating: 5 },
    { id: 'def-2', nama: 'Sutrisno, S.Pd.', instansi: 'SMP N 1 Sleman', teks: 'Formatnya rapi dan tujuannya sangat kontekstual dengan Kurikulum Merdeka.', tanggal: '3 hari lalu', rating: 5 }
  ];

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newReview: Review = {
      id: `REV-${Date.now()}`,
      nama: currentUser ? currentUser.nama : 'Guru Pengunjung',
      instansi: currentUser?.instansi || 'Tenaga Pendidik',
      teks: commentText.trim(),
      tanggal: 'Hari ini',
      rating: rating,
    };

    if (onAddReview) {
      onAddReview(karya.id, newReview);
    }
    setCommentText('');
  };

  const getFormatBadge = (fmt: FileFormat) => {
    switch (fmt) {
      case 'PDF':
        return { bg: 'bg-rose-500/10 text-rose-600 border-rose-200', icon: <FileText className="w-4 h-4 text-rose-600" /> };
      case 'DOCX':
        return { bg: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: <FileText className="w-4 h-4 text-blue-600" /> };
      case 'PPTX':
        return { bg: 'bg-amber-500/10 text-amber-600 border-amber-200', icon: <FileSpreadsheet className="w-4 h-4 text-amber-600" /> };
      case 'MP4':
        return { bg: 'bg-violet-500/10 text-violet-600 border-violet-200', icon: <FileVideo className="w-4 h-4 text-violet-600" /> };
      case 'MP3':
        return { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: <FileAudio className="w-4 h-4 text-emerald-600" /> };
      case 'HTML5':
        return { bg: 'bg-cyan-500/10 text-cyan-700 border-cyan-200', icon: <Code2 className="w-4 h-4 text-cyan-600" /> };
      case 'ZIP':
        return { bg: 'bg-slate-500/10 text-slate-700 border-slate-200', icon: <Archive className="w-4 h-4 text-slate-600" /> };
      default:
        return { bg: 'bg-slate-500/10 text-slate-600 border-slate-200', icon: <FileText className="w-4 h-4 text-slate-600" /> };
    }
  };

  const formatStyle = getFormatBadge(karya.formatFile);

  return (
    <AnimatePresence>
      {karya && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] sm:max-h-[90vh] flex flex-col modal-compact transform-gpu"
          >
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border bg-white/10 text-cyan-300 border-cyan-500/30`}>
                {formatStyle.icon}
                {karya.formatFile}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {karya.kategori}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Terverifikasi
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-snug pt-1">
              {karya.judul}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Guru & Instansi Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-900 text-cyan-300 flex items-center justify-center font-bold text-base shrink-0 border border-blue-700">
                {karya.namaGuru.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Penulis / Guru</p>
                <p className="text-base font-extrabold text-slate-900">{karya.namaGuru}</p>
                <p className="text-xs sm:text-sm text-slate-700 mt-0.5 flex items-center gap-1.5 font-medium">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{karya.nipOrInstansi}</span>
                </p>
                {onViewTeacherProfile && (
                  <button
                    onClick={() => {
                      onViewTeacherProfile(karya);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-xs rounded-lg border border-blue-200 transition-all cursor-pointer hover:scale-102"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-blue-800" />
                    <span>Lihat Portofolio Lengkap Guru &rarr;</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Mata Pelajaran:</span>
                <span className="font-bold text-slate-900">{karya.mataPelajaran}</span>
              </div>
              {karya.fase && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Fase / Kelas:</span>
                  <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded text-xs">{karya.fase}</span>
                </div>
              )}
              {karya.version && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Versi Dokumen:</span>
                  <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-xs font-mono">{karya.version}</span>
                </div>
              )}
              {karya.batchProgram && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Program / Batch:</span>
                  <span className="font-bold text-slate-800 text-xs">{karya.batchProgram}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Jenjang:</span>
                <span className="font-bold text-slate-900">{karya.jenjang}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Tanggal Rilis:</span>
                <span className="font-bold text-slate-900">{karya.tanggalUpload}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Deskripsi Karya & Perangkat Pembelajaran
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white p-4.5 rounded-xl border border-slate-200 font-normal">
              {karya.deskripsi}
            </p>
          </div>

          {/* Learning Objectives */}
          {karya.tujuanPembelajaran && (
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Capaian / Tujuan Pembelajaran
              </h3>
              <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-4.5 text-xs sm:text-sm text-cyan-950 font-medium leading-relaxed">
                {karya.tujuanPembelajaran}
              </div>
            </div>
          )}

          {/* Simulated File Preview Window */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-200">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 text-[11px] flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Preview Media: {karya.judul}.{karya.formatFile.toLowerCase()}
              </span>
              <span className="text-slate-400 text-[10px]">Tinjauan Dokumen Digital</span>
            </div>
            
            <div className="p-6 text-center space-y-4">
              {karya.formatFile === 'PDF' && (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl border border-rose-500/30">
                    PDF
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Pratinjau dokumen PDF terverifikasi. Klik tombol di bawah untuk mengunduh modul secara lengkap beserta lampirannya.
                  </p>
                </div>
              )}

              {karya.formatFile === 'HTML5' && (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl border border-cyan-500/30">
                    HTML5
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Simulasi Web Interaktif HTML5. Kompatibel dengan semua browser komputer & smartphone.
                  </p>
                </div>
              )}

              {karya.formatFile === 'MP4' && (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-violet-500/20 text-violet-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl border border-violet-500/30">
                    MP4
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Berkas Video Pembelajaran Microlearning (Kualitas HD 1080p).
                  </p>
                </div>
              )}

              {(karya.formatFile === 'DOCX' || karya.formatFile === 'PPTX' || karya.formatFile === 'ZIP' || karya.formatFile === 'MP3') && (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl border border-blue-500/30">
                    {karya.formatFile}
                  </div>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Berkas Perangkat Pembelajaran Siap Pakai ({karya.ukuranFile}).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Discussion & Comments */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Ulasan & Diskusi Antar Guru ({displayReviews.length})
              </h3>
              <button
                onClick={handleLike}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  hasLiked 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Apresiasi ({likes})</span>
              </button>
            </div>

            <form onSubmit={handleAddComment} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 font-medium">Beri Penilaian:</span>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-base leading-none transition-transform ${star <= rating ? 'opacity-100 scale-110' : 'opacity-30'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tulis ulasan atau tanggapan untuk guru penyusun..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:bg-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0"
                >
                  Kirim Ulasan
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {displayReviews.map((r, idx) => (
                <div key={r.id || idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{r.nama} <span className="font-normal text-slate-500">({r.instansi})</span></span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">{'★'.repeat(r.rating || 5)}</span>
                      <span className="text-[10px] text-slate-400">{r.tanggal}</span>
                    </div>
                  </div>
                  <p className="text-slate-600">{r.teks}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer with Download CTA */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-cyan-600" />
              <strong>{karya.jumlahDownload}</strong> kali diunduh
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <strong>{karya.jumlahView}</strong> tayangan
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {karya.externalLink && (
              <a
                href={karya.externalLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-sky-800 bg-sky-50 border border-sky-300 hover:bg-sky-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                <span>Buka Link Canva / Drive</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              Tutup
            </button>
            
            <button
              onClick={() => onDownload(karya.id)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-900 via-[#1E3A8A] to-cyan-700 hover:from-blue-800 hover:to-cyan-600 shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
              <span>Unduh Berkas</span>
            </button>
          </div>
        </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
