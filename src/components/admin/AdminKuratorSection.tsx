import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  FileCheck, 
  Filter, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Star, 
  Award,
  Send,
  AlertCircle,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import { Karya, VerificationStatus } from '../../types';

interface AdminKuratorSectionProps {
  karyaList: Karya[];
  onUpdateStatus: (id: string, newStatus: VerificationStatus) => void;
  onSelectKaryaForPreview: (karya: Karya) => void;
  onDeleteKarya?: (id: string) => void;
  onDeleteAllKarya?: () => void;
}

export const AdminKuratorSection: React.FC<AdminKuratorSectionProps> = ({
  karyaList,
  onUpdateStatus,
  onSelectKaryaForPreview,
  onDeleteKarya,
  onDeleteAllKarya,
}) => {
  const [activeKuratorTab, setActiveKuratorTab] = useState<'overview' | 'kurasi'>('kurasi');
  const [filterStatus, setFilterStatus] = useState<string>('Pending');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Karya for Review / Scoring Form
  const [selectedForScoring, setSelectedForScoring] = useState<Karya | null>(null);
  
  // Scoring Form State
  const [scoreKurikulum, setScoreKurikulum] = useState<number>(85);
  const [scoreAsesmen, setScoreAsesmen] = useState<number>(80);
  const [scoreVisual, setScoreVisual] = useState<number>(88);
  const [catatanFeedback, setCatatanFeedback] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Delete State
  const [karyaToDelete, setKaryaToDelete] = useState<Karya | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState<boolean>(false);

  // Stats
  const totalPending = karyaList.filter(k => k.status === 'Pending').length;
  const totalApproved = karyaList.filter(k => k.status === 'Disetujui').length;
  const totalRejected = karyaList.filter(k => k.status === 'Ditolak').length;

  // Filtered List for Kurasi
  const filteredKarya = karyaList.filter(item => {
    const matchesStatus = filterStatus === 'Semua' || item.status === filterStatus;
    const matchesSearch = 
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaGuru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nipOrInstansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenFormScoring = (karya: Karya) => {
    setSelectedForScoring(karya);
    setCatatanFeedback(karya.catatanVerifikasi || '');
    setScoreKurikulum(85);
    setScoreAsesmen(80);
    setScoreVisual(88);
  };

  const handleSaveAssessment = (newStatus: VerificationStatus) => {
    if (!selectedForScoring) return;

    onUpdateStatus(selectedForScoring.id, newStatus);
    const meanScore = Math.round((scoreKurikulum + scoreAsesmen + scoreVisual) / 3);

    setSuccessMessage(`Berhasil memperbarui status karya "${selectedForScoring.judul}" menjadi [${newStatus}] dengan rata-rata skor kurator: ${meanScore}/100.`);
    setSelectedForScoring(null);

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub Navigation Bar for Admin Kurator */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex items-center gap-2">
        <button
          onClick={() => setActiveKuratorTab('overview')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeKuratorTab === 'overview'
              ? 'bg-sky-900 text-white shadow-md shadow-sky-900/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>📊 Overview Penelaahan Karya</span>
        </button>

        <button
          onClick={() => setActiveKuratorTab('kurasi')}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeKuratorTab === 'kurasi'
              ? 'bg-sky-900 text-white shadow-md shadow-sky-900/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>🎨 Antrean Kurasi & Scoring Karya ({totalPending})</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl border border-emerald-200 font-bold text-xs sm:text-sm flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* OVERVIEW SUBTAB */}
      {activeKuratorTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Perlu Ditelaah / Pending</p>
                <p className="text-3xl font-black text-amber-950 mt-1">{totalPending} Karya</p>
                <p className="text-[11px] text-amber-700 font-medium mt-1">Siap untuk diberi scoring & feedback</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-black">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Lolos Kurasi / Disetujui</p>
                <p className="text-3xl font-black text-emerald-950 mt-1">{totalApproved} Karya</p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">Terpublikasi di Galeri Karya Guru</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-200/80 text-emerald-900 flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Perlu Revisi / Ditolak</p>
                <p className="text-3xl font-black text-rose-950 mt-1">{totalRejected} Karya</p>
                <p className="text-[11px] text-rose-700 font-medium mt-1">Dikembalikan dengan masukan kurator</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-200/80 text-rose-900 flex items-center justify-center font-black">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              <span>Pedoman Standar Kurasi Modul Ajar Kurikulum Merdeka</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-black text-slate-800">1. Kesesuaian CP & TP</h4>
                <p>Memastikan Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) terstruktur dengan indikator yang terukur.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-black text-slate-800">2. Asesmen & Media</h4>
                <p>Mencakup instrumen asesmen formatif/sumatif serta LKPD interaktif pendukung kegiatan siswa.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-black text-slate-800">3. Keterbacaan & Estetika</h4>
                <p>Layout modul rapi, bebas dari plagiarisme, dan mudah diadaptasi oleh sesama guru di daerah lain.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANTREAN KURASI SUBTAB */}
      {activeKuratorTab === 'kurasi' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Judul Karya, Nama Guru, atau Instansi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {['Pending', 'Disetujui', 'Ditolak', 'Semua'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    filterStatus === st
                      ? 'bg-sky-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}

              {karyaList.length > 0 && (
                <button
                  id="btn-kurator-hapus-semua"
                  onClick={() => setIsDeleteAllModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs hover:scale-105 active:scale-95 ml-auto md:ml-2"
                  title="Hapus Semua Karya"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Hapus Semua</span>
                </button>
              )}
            </div>
          </div>

          {/* List Table of Karya for Kurator Review */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider select-none">
                  <tr>
                    <th className="py-4 px-4 min-w-[240px] border-b border-slate-800">Informasi Karya & Guru</th>
                    <th className="py-4 px-4 min-w-[160px] border-b border-slate-800">Kategori & Format</th>
                    <th className="py-4 px-4 min-w-[140px] border-b border-slate-800">Tanggal Unggah</th>
                    <th className="py-4 px-4 text-center min-w-[130px] border-b border-slate-800">Status Kurasi</th>
                    <th className="py-4 px-4 text-center min-w-[220px] border-b border-slate-800">Aksi Penelaahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredKarya.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-14 text-center text-slate-400 bg-slate-50/50">
                        Tidak ada data karya guru yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredKarya.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="font-extrabold text-slate-900 text-xs leading-snug group-hover:text-blue-950">{item.judul}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-700">👤 {item.namaGuru}</span>
                            <span>•</span>
                            <span>🏫 {item.nipOrInstansi}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-sky-900">{item.kategori}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-700 border border-slate-200">
                            {item.formatFile} ({item.ukuranFile})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                          {item.tanggalUpload}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {item.status === 'Disetujui' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Disetujui
                            </span>
                          )}
                          {item.status === 'Pending' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Perlu Kurasi
                            </span>
                          )}
                          {item.status === 'Ditolak' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Revisi / Ditolak
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              id={`btn-kurator-preview-${item.id}`}
                              onClick={() => onSelectKaryaForPreview(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs"
                              title="Preview Karya"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>

                            <button
                              id={`btn-kurator-score-${item.id}`}
                              onClick={() => handleOpenFormScoring(item)}
                              className="px-3 py-1.5 rounded-lg bg-sky-900 hover:bg-sky-800 text-white font-extrabold text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Skor & Kurasi</span>
                            </button>

                            <button
                              id={`btn-kurator-delete-${item.id}`}
                              onClick={() => setKaryaToDelete(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold text-xs flex items-center gap-1 border border-rose-200 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs"
                              title="Hapus Karya"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Modal / Panel Scoring & Feedback Kurator */}
      {selectedForScoring && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 my-8 space-y-6">
            
            <button
              onClick={() => setSelectedForScoring(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-black">
                <Sparkles className="w-5 h-5 text-sky-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Form Scoring & Feedback Kurator Karya</h3>
                <p className="text-xs text-slate-500">Penelaahan Standar Mutu Modul Ajar Kurikulum Merdeka</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <p className="text-xs text-slate-500">Judul Karya Guru:</p>
              <p className="font-black text-sm text-slate-900">{selectedForScoring.judul}</p>
              <p className="text-xs text-slate-600 font-medium">Oleh: {selectedForScoring.namaGuru} ({selectedForScoring.nipOrInstansi})</p>
            </div>

            {/* Slider / Number Input for Scoring */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">1. Penilaian Kriteria Utama (Skor 0 - 100)</h4>
              
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Kesesuaian Capaian Pembelajaran (CP & TP):</span>
                    <span className="text-sky-900 font-extrabold">{scoreKurikulum} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={scoreKurikulum}
                    onChange={(e) => setScoreKurikulum(Number(e.target.value))}
                    className="w-full accent-sky-900 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Kelengkapan Asesmen & Instrument LKPD:</span>
                    <span className="text-sky-900 font-extrabold">{scoreAsesmen} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={scoreAsesmen}
                    onChange={(e) => setScoreAsesmen(Number(e.target.value))}
                    className="w-full accent-sky-900 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Keterbacaan, Estetika & Kreativitas Visual:</span>
                    <span className="text-sky-900 font-extrabold">{scoreVisual} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={scoreVisual}
                    onChange={(e) => setScoreVisual(Number(e.target.value))}
                    className="w-full accent-sky-900 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-700">Rata-Rata Skor Akhir:</span>
                  <span className="font-black text-sm text-sky-900 px-3 py-1 bg-sky-100 rounded-lg border border-sky-300">
                    {Math.round((scoreKurikulum + scoreAsesmen + scoreVisual) / 3)} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback / Catatan Kurator Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                2. Catatan FeedBack / Masukan Kurator Untuk Guru:
              </label>
              <textarea
                rows={4}
                placeholder="Tuliskan apresiasi, catatan perbaikan, atau rekomendasi penyempurnaan karya..."
                value={catatanFeedback}
                onChange={(e) => setCatatanFeedback(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleSaveAssessment('Ditolak')}
                className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs px-4 py-2.5 rounded-xl border border-rose-300 transition-all cursor-pointer"
              >
                ✖ Minta Revisi / Ditolak
              </button>

              <button
                type="button"
                onClick={() => handleSaveAssessment('Disetujui')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✔ Setujui & Publikasikan Karya</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Karya Kurator */}
      {karyaToDelete && (
        <div 
          id="modal-kurator-hapus-karya"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 text-base">Hapus Karya Pembelajaran</h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">Tindakan ini permanen dan tidak dapat dibatalkan</p>
              </div>
              <button
                onClick={() => setKaryaToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Judul Karya</span>
                <div className="font-extrabold text-slate-900 text-sm leading-snug mt-0.5">
                  {karyaToDelete.judul}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Guru Pengunggah</span>
                  <div className="font-bold text-slate-800 text-xs mt-0.5 truncate">{karyaToDelete.namaGuru}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Format File</span>
                  <div className="font-bold text-blue-700 font-mono text-xs mt-0.5">{karyaToDelete.formatFile}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Karya ini akan dihapus permanen dari antrean kurasi dan galeri publik.</span>
            </div>

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

      {/* Modal Konfirmasi Hapus Semua Karya Kurator */}
      {isDeleteAllModalOpen && (
        <div 
          id="modal-kurator-hapus-semua-karya"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 text-base">Hapus Semua Karya Pembelajaran?</h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">Tindakan ini permanen dan akan menghapus seluruh karya dari sistem!</p>
              </div>
              <button
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 text-xs space-y-2">
              <div className="font-extrabold text-rose-900 text-sm">
                Total Karya yang Akan Dihapus: {karyaList.length} Karya
              </div>
              <p className="text-rose-800 leading-relaxed">
                Seluruh karya pembelajaran dari para guru yang berada di daftar antrean kurasi dan repositori akan dihapus secara menyeluruh.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (onDeleteAllKarya) {
                    onDeleteAllKarya();
                  } else if (onDeleteKarya) {
                    karyaList.forEach(k => onDeleteKarya(k.id));
                  }
                  setIsDeleteAllModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Semua ({karyaList.length} Karya)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
