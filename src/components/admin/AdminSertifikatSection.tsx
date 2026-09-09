import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Printer, 
  Download, 
  Eye, 
  Sparkles, 
  Search, 
  FileCheck, 
  X,
  FileSpreadsheet,
  Send,
  FileText,
  Settings,
  Check,
  AlertCircle,
  Building2,
  Share2,
  ShieldCheck,
  CheckSquare,
  Clock,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Karya, Peserta } from '../../types';

interface AdminSertifikatSectionProps {
  pesertaList: Peserta[];
  karyaList: Karya[];
  onSelectKaryaForPreview?: (karya: Karya) => void;
  onDeleteKarya?: (id: string) => void;
  onDeleteAllKarya?: () => void;
  onDeleteBatchKarya?: (ids: string[]) => void;
  openBatchModalTrigger?: boolean;
}

export const AdminSertifikatSection: React.FC<AdminSertifikatSectionProps> = ({
  pesertaList,
  karyaList,
  onSelectKaryaForPreview,
  onDeleteKarya,
  onDeleteAllKarya,
  onDeleteBatchKarya,
}) => {
  const [activeTab, setActiveTab] = useState<'penilaian' | 'kelayakan' | 'template'>('kelayakan');
  const [selectedPesertaReport, setSelectedPesertaReport] = useState<Peserta | null>(
    pesertaList.find(p => p.statusKelulusan === 'Lulus') || pesertaList[0] || null
  );
  
  // Template Settings State
  const [reportDocNumber, setReportDocNumber] = useState('800/LK-32JP/GTK/2026');
  const [reportDate, setReportDate] = useState('20 Agustus 2026');
  const [penanggungJawabNama, setPenanggungJawabNama] = useState('Dr. H. Ahmad Dahlan, M.Pd.');
  const [penanggungJawabJabatan, setPenanggungJawabJabatan] = useState('Ketua Dewan Pembina RuangKarya');
  const [enableDigitalSign, setEnableDigitalSign] = useState(true);
  const [enableStamp, setEnableStamp] = useState(true);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'lulus' | 'proses'>('semua');

  // Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  
  // Send Action Toast Notification
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Deletion State for Karya & Search Filter
  const [karyaToDelete, setKaryaToDelete] = useState<Karya | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [selectedKaryaIds, setSelectedKaryaIds] = useState<string[]>([]);
  const [isDeleteBatchModalOpen, setIsDeleteBatchModalOpen] = useState(false);
  const [searchKaryaQuery, setSearchKaryaQuery] = useState('');

  // Batch Generation State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Filtered Peserta Data
  const filteredPeserta = pesertaList.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch = (
      p.namaLengkapGelar.toLowerCase().includes(q) ||
      p.nuptkOrNip.toLowerCase().includes(q) ||
      p.asalInstansi.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
    if (statusFilter === 'lulus') return matchSearch && p.statusKelulusan === 'Lulus';
    if (statusFilter === 'proses') return matchSearch && p.statusKelulusan !== 'Lulus';
    return matchSearch;
  });

  // Filtered Karya Data for Penilaian Tab
  const filteredKaryaList = karyaList.filter(k => {
    if (!searchKaryaQuery.trim()) return true;
    const q = searchKaryaQuery.toLowerCase();
    return (
      k.judul.toLowerCase().includes(q) ||
      k.namaGuru.toLowerCase().includes(q) ||
      k.nipOrInstansi.toLowerCase().includes(q) ||
      k.kategori.toLowerCase().includes(q) ||
      k.id.toLowerCase().includes(q)
    );
  });

  const passedPeserta = pesertaList.filter(p => p.statusKelulusan === 'Lulus');

  // Toggle selection helpers
  const handleToggleSelectAllKarya = () => {
    if (filteredKaryaList.length === 0) return;
    if (selectedKaryaIds.length === filteredKaryaList.length) {
      setSelectedKaryaIds([]);
    } else {
      setSelectedKaryaIds(filteredKaryaList.map(k => k.id));
    }
  };

  const handleToggleSelectKarya = (id: string) => {
    setSelectedKaryaIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Helper to get participant's submitted karya
  const getPesertaKarya = (peserta: Peserta) => {
    return karyaList.find(k => 
      k.namaGuru.toLowerCase().includes(peserta.namaLengkapGelar.split(' ')[0].toLowerCase()) ||
      k.nipOrInstansi.includes(peserta.nuptkOrNip)
    ) || karyaList[0];
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleSendToParticipant = (peserta: Peserta, channel: 'WA' | 'Email') => {
    setNotificationMsg(`Berhasil mengirim tautan Laporan Kegiatan ke ${peserta.namaLengkapGelar} via ${channel}!`);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const handleSaveTemplateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccessMsg(true);
    setTimeout(() => {
      setSavedSuccessMsg(false);
    }, 3500);
  };

  const handleStartBatchGenerate = () => {
    setIsBatchGenerating(true);
    setBatchProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setBatchProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsBatchGenerating(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{notificationMsg}</span>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('kelayakan')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'kelayakan'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Kelayakan & Generator Laporan Kegiatan (32 JP)</span>
        </button>

        <button
          onClick={() => setActiveTab('penilaian')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'penilaian'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Penilaian Karya & Tugas Mandiri Guru</span>
        </button>

        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'template'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>3. Pengaturan Template Laporan (TTD & Stempel)</span>
        </button>
      </div>

      {/* TAB 1: KELAYAKAN & GENERATOR LAPORAN KEGIATAN PESERTA */}
      {activeTab === 'kelayakan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Daftar Kelayakan Laporan Kegiatan Peserta (Transkrip 32 JP)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Menerbitkan Laporan Kegiatan Peserta berisi Rincian Transkrip Jam Pelajaran (32 JP), Rekap Presensi, dan Portfolio Karya Modul Ajar.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsBatchModalOpen(true)}
                  className="bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-purple-300" />
                  <span>📄 Batch Generate Laporan ({passedPeserta.length} Peserta)</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama, NIP/NUPTK, atau instansi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <button
                  onClick={() => setStatusFilter('semua')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    statusFilter === 'semua' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Semua ({pesertaList.length})
                </button>
                <button
                  onClick={() => setStatusFilter('lulus')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    statusFilter === 'lulus' ? 'bg-emerald-700 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Siap Terbit ({passedPeserta.length})
                </button>
                <button
                  onClick={() => setStatusFilter('proses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    statusFilter === 'proses' ? 'bg-amber-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Belum Lengkap ({pesertaList.length - passedPeserta.length})
                </button>
              </div>
            </div>

            {/* Tabel Kelayakan Laporan Peserta */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider select-none">
                  <tr>
                    <th className="py-4 px-4 min-w-[220px] border-b border-slate-800">Nama Guru & Instansi</th>
                    <th className="py-4 px-4 min-w-[160px] border-b border-slate-800">NIP / NUPTK</th>
                    <th className="py-4 px-4 text-center min-w-[140px] border-b border-slate-800">Total JP Hadir</th>
                    <th className="py-4 px-4 min-w-[220px] border-b border-slate-800">Karya Terunggah</th>
                    <th className="py-4 px-4 text-center min-w-[130px] border-b border-slate-800">Status Laporan</th>
                    <th className="py-4 px-4 text-center min-w-[190px] border-b border-slate-800">Aksi Laporan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPeserta.map((peserta) => {
                    const isSiapTerbit = peserta.statusKelulusan === 'Lulus';
                    const karya = getPesertaKarya(peserta);
                    const jpHadir = isSiapTerbit ? '32 JP (100% Hadir)' : '24 JP (75% Hadir)';

                    return (
                      <tr key={peserta.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 text-xs leading-snug group-hover:text-blue-950">{peserta.namaLengkapGelar}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{peserta.asalInstansi} &bull; {peserta.kabupatenKota}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] font-bold tracking-tight border border-slate-200/80 shadow-2xs">
                            {peserta.nuptkOrNip}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-extrabold ${
                            isSiapTerbit ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {jpHadir}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 line-clamp-1">{karya?.judul || 'Modul Ajar Pembelajaran AI'}</div>
                          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Terverifikasi (Format PDF)</div>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-2xs ${
                            isSiapTerbit 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-50 text-amber-800 border border-amber-300'
                          }`}>
                            {isSiapTerbit ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Siap Terbit</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Belum Lengkap</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedPesertaReport(peserta);
                                setIsPreviewModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-all inline-flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                              title="Preview Laporan"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedPesertaReport(peserta);
                                handlePrintReport();
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-all inline-flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                              title="Cetak Laporan PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak</span>
                            </button>

                            <button
                              onClick={() => handleSendToParticipant(peserta, 'WA')}
                              className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 transition-all inline-flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                              title="Kirim ke WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Kirim WA</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENILAIAN KARYA GURU */}
      {activeTab === 'penilaian' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Penilaian Tugas Karya Pembelajaran Guru</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Daftar pengajuan modul ajar, LKPD, & media interaktif yang diunggah peserta untuk kelengkapan Laporan Kegiatan.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="text-xs font-bold text-slate-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200 flex items-center gap-2">
                <span>Total Karya Masuk: <strong>{karyaList.length} Karya</strong></span>
                {searchKaryaQuery && (
                  <span className="text-blue-600 font-bold">({filteredKaryaList.length} ditemukan)</span>
                )}
              </div>

              {karyaList.length > 0 && (
                <button
                  id="btn-hapus-semua-karya"
                  onClick={() => setIsDeleteAllModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold text-xs border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                  title="Hapus Semua Karya Pembelajaran"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Hapus Semua</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Batch Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul, nama guru, instansi, atau ID karya..."
                value={searchKaryaQuery}
                onChange={(e) => setSearchKaryaQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-2xs transition-all"
              />
              {searchKaryaQuery && (
                <button
                  onClick={() => setSearchKaryaQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {selectedKaryaIds.length > 0 && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-xl text-xs shrink-0 animate-in fade-in duration-150">
                <span className="font-extrabold text-rose-900">{selectedKaryaIds.length} karya dipilih</span>
                <button
                  id="btn-hapus-terpilih-karya"
                  onClick={() => setIsDeleteBatchModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1 shadow-2xs cursor-pointer text-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Terpilih ({selectedKaryaIds.length})</span>
                </button>
                <button
                  onClick={() => setSelectedKaryaIds([])}
                  className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider select-none">
                <tr>
                  <th className="py-4 px-3 w-10 text-center border-b border-slate-800">
                    <input
                      type="checkbox"
                      checked={filteredKaryaList.length > 0 && selectedKaryaIds.length === filteredKaryaList.length}
                      onChange={handleToggleSelectAllKarya}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-400 cursor-pointer accent-blue-600"
                      title="Pilih Semua Karya"
                    />
                  </th>
                  <th className="py-4 px-4 min-w-[220px] border-b border-slate-800">Judul Karya / Modul Ajar</th>
                  <th className="py-4 px-4 min-w-[200px] border-b border-slate-800">Nama Guru & Instansi</th>
                  <th className="py-4 px-4 min-w-[160px] border-b border-slate-800">Kategori & Format</th>
                  <th className="py-4 px-4 text-center min-w-[130px] border-b border-slate-800">Status Verifikasi</th>
                  <th className="py-4 px-4 text-center min-w-[90px] border-b border-slate-800">Unduhan</th>
                  <th className="py-4 px-4 text-center min-w-[170px] border-b border-slate-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredKaryaList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-slate-400 bg-slate-50/50">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileCheck className="w-9 h-9 text-slate-300" />
                        <p className="font-bold text-xs sm:text-sm text-slate-700">
                          {searchKaryaQuery ? 'Tidak ada karya yang cocok dengan pencarian Anda.' : 'Belum ada karya pembelajaran yang diunggah.'}
                        </p>
                        {searchKaryaQuery && (
                          <button
                            onClick={() => setSearchKaryaQuery('')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                          >
                            Reset filter pencarian
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredKaryaList.map((karya) => (
                    <tr 
                      key={karya.id} 
                      className={`hover:bg-blue-50/40 transition-colors group ${selectedKaryaIds.includes(karya.id) ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedKaryaIds.includes(karya.id)}
                          onChange={() => handleToggleSelectKarya(karya.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer accent-blue-600"
                          title="Pilih karya ini"
                        />
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-950">{karya.judul}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 inline-flex items-center gap-1">
                          <span>ID:</span>
                          <span className="font-bold text-slate-600">{karya.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{karya.namaGuru}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{karya.nipOrInstansi}</div>
                      </td>
                      <td className="py-3.5 px-4 space-y-1 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                          {karya.kategori}
                        </span>
                        <div className="text-[10px] font-bold text-blue-700 font-mono">{karya.formatFile} ({karya.ukuranFile})</div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-2xs ${
                          karya.status === 'Disetujui' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                            : karya.status === 'Pending' 
                            ? 'bg-amber-50 text-amber-800 border border-amber-300' 
                            : 'bg-rose-50 text-rose-800 border border-rose-300'
                        }`}>
                          {karya.status === 'Disetujui' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {karya.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {karya.status === 'Ditolak' && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                          <span>{karya.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 font-mono text-[11px]">
                          {karya.jumlahDownload}x
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <button
                            id={`btn-detail-karya-${karya.id}`}
                            onClick={() => onSelectKaryaForPreview && onSelectKaryaForPreview(karya)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-all inline-flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                            title="Lihat Detail Karya"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Detail</span>
                          </button>
                          <button
                            id={`btn-hapus-karya-${karya.id}`}
                            onClick={() => setKaryaToDelete(karya)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 font-bold text-xs border border-rose-200 transition-all inline-flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
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
      )}

      {/* TAB 3: FITUR PENGATURAN TEMPLATE LAPORAN */}
      {activeTab === 'template' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Pengaturan Format Template Laporan Kegiatan Peserta</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Atur identitas dokumen resmi, nama penanggung jawab, serta keabsahan Tanda Tangan Digital & Stempel Lembaga.
            </p>
          </div>

          {savedSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Konfigurasi Template Laporan Kegiatan berhasil disimpan & diperbarui!</span>
            </div>
          )}

          <form onSubmit={handleSaveTemplateSettings} className="space-y-5">
            {/* Bagian 1: Identitas Dokumen & Penanggung Jawab (2x2 Grid) */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                <span>Identitas Dokumen & Penanggung Jawab</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Nomor Surat / Dokumen Laporan</label>
                  <input
                    type="text"
                    value={reportDocNumber}
                    onChange={(e) => setReportDocNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Tanggal Penerbitan Laporan</label>
                  <input
                    type="text"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Nama Penanggung Jawab / Ketua</label>
                  <input
                    type="text"
                    value={penanggungJawabNama}
                    onChange={(e) => setPenanggungJawabNama(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Jabatan Penanggung Jawab</label>
                  <input
                    type="text"
                    value={penanggungJawabJabatan}
                    onChange={(e) => setPenanggungJawabJabatan(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 2: Otorisasi & Elemen Legalisasi */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                <span>Otorisasi & Elemen Legalisasi</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer select-none">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800">Tanda Tangan Digital Resmi</div>
                    <div className="text-[10px] text-slate-500">Sertim TTD QR Code & Hash Enkripsi PDF</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableDigitalSign}
                    onChange={(e) => setEnableDigitalSign(e.target.checked)}
                    className="w-4 h-4 accent-blue-900 rounded cursor-pointer shrink-0 ml-3"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer select-none">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800">Stempel Basah Digital Lembaga</div>
                    <div className="text-[10px] text-slate-500">Watermark logo & stempel terverifikasi</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableStamp}
                    onChange={(e) => setEnableStamp(e.target.checked)}
                    className="w-4 h-4 accent-blue-900 rounded cursor-pointer shrink-0 ml-3"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan Template</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL PREVIEW LAPORAN KEGIATAN PESERTA */}
      {isPreviewModalOpen && selectedPesertaReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-200 my-8">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Draf Pratinjau Laporan Kegiatan Peserta</h3>
                <p className="text-xs text-slate-500">Transkrip Jam Pelajaran (32 JP) & Portfolio Karya Pembelajaran</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak PDF</span>
                </button>
              </div>
            </div>

            {/* Document Content Box */}
            <div className="border-2 border-slate-200 p-6 rounded-xl space-y-6 font-serif bg-slate-50/50">
              {/* Kop Surat */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1 font-sans">
                <div className="text-[11px] font-bold tracking-widest text-blue-900 uppercase">
                  PORTAL RESMI RUANG KARYA GURU INDONESIA
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase">
                  LAPORAN KEGIATAN PELATIHANS DAN WORKSHOP
                </h2>
                <div className="text-xs font-semibold text-slate-600">
                  Nomor Dokumen: <span className="font-mono font-bold text-slate-900">{reportDocNumber}/{selectedPesertaReport.id}</span>
                </div>
              </div>

              {/* Data Peserta */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">Nama Lengkap Guru:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedPesertaReport.namaLengkapGelar}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">NIP / NUPTK:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedPesertaReport.nuptkOrNip}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Asal Instansi Sekolah:</span>
                  <span className="font-bold text-slate-900">{selectedPesertaReport.asalInstansi}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Kabupaten / Kota:</span>
                  <span className="font-bold text-slate-900">{selectedPesertaReport.kabupatenKota}</span>
                </div>
              </div>

              {/* Transkrip Jam Pelajaran */}
              <div className="space-y-2 font-sans">
                <h4 className="font-extrabold text-xs uppercase text-slate-800 tracking-wider">
                  I. Transkrip Struktur Jam Pelajaran (Total: 32 JP)
                </h4>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Materi Pelatihan & Workshop</th>
                      <th className="p-2 text-center w-20">Alokasi JP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 border-r border-slate-200">1. Konsep & Implementasi Modul Ajar Berbasis Generative AI</td>
                      <td className="p-2 text-center font-bold">10 JP</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200">2. Penyusunan LKPD Interaktif & Asesmen Pembelajaran Merdeka</td>
                      <td className="p-2 text-center font-bold">10 JP</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200">3. Media Ajar Digital HTML5 & Video Interaktif Pembelajaran</td>
                      <td className="p-2 text-center font-bold">8 JP</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200">4. Praktik Tugas Mandiri & Penyusunan Portfolio Karya Guru</td>
                      <td className="p-2 text-center font-bold">4 JP</td>
                    </tr>
                    <tr className="bg-blue-50 font-black text-blue-900 border-t border-slate-300">
                      <td className="p-2 border-r border-slate-300">Total Akumulasi Jam Pelajaran (JP)</td>
                      <td className="p-2 text-center">32 JP</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Portfolio Karya */}
              <div className="space-y-2 font-sans">
                <h4 className="font-extrabold text-xs uppercase text-slate-800 tracking-wider">
                  II. Rekapitulasi Karya Pembelajaran Terverifikasi
                </h4>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{getPesertaKarya(selectedPesertaReport)?.judul || 'Modul Ajar Pembelajaran Interaktif AI'}</div>
                  <div className="text-slate-500">Status Karya: <strong className="text-emerald-700">LULUS VERIFIKASI RESMI</strong></div>
                </div>
              </div>

              {/* Tanda Tangan */}
              <div className="pt-4 flex items-center justify-between text-xs font-sans">
                <div>
                  <div className="text-slate-500 text-[10px]">Status Keabsahan:</div>
                  <div className="font-bold text-emerald-700">TERVERIFIKASI SISTEM</div>
                  {enableStamp && (
                    <div className="mt-1 text-[10px] text-slate-400 italic">(Stempel Lembaga Resmi Aktif)</div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-slate-500 text-[10px]">Diterbitkan pada: {reportDate}</div>
                  <div className="font-bold text-slate-900">{penanggungJawabJabatan}</div>
                  <div className="font-extrabold text-slate-900 mt-6 underline">{penanggungJawabNama}</div>
                  {enableDigitalSign && (
                    <div className="text-[9px] text-slate-400 italic">(Tanda Tangan Digital Terenkripsi)</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BATCH GENERATE LAPORAN KEGIATAN */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                <span>Batch Generate Laporan Kegiatan ({passedPeserta.length} Peserta)</span>
              </h3>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Fungsi ini akan menyusun Laporan Kegiatan Peserta (Transkrip 32 JP & Portfolio) sekaligus untuk <strong>{passedPeserta.length} peserta</strong> yang telah memenuhi kualifikasi kelulusan.
            </p>

            {isBatchGenerating ? (
              <div className="space-y-3 py-4 text-center">
                <div className="text-xs font-bold text-purple-900">Mengkompilasi Berkas Laporan PDF... ({batchProgress}%)</div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${batchProgress}%` }}
                  />
                </div>
              </div>
            ) : batchProgress === 100 ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-xs text-emerald-900">
                  {passedPeserta.length} File Laporan Kegiatan Berhasil Diterbitkan!
                </div>
                <p className="text-[11px] text-emerald-700">Berkas siap diunduh dalam bentuk arsip ZIP atau dicetak sekaligus.</p>
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                Batal
              </button>

              {batchProgress === 100 ? (
                <button
                  onClick={() => {
                    handlePrintReport();
                    setIsBatchModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Arsip Laporan (.zip)</span>
                </button>
              ) : (
                <button
                  onClick={handleStartBatchGenerate}
                  disabled={isBatchGenerating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-900 hover:bg-purple-800 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isBatchGenerating ? 'Proses Generating...' : 'Mulai Batch Generate'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Karya */}
      {karyaToDelete && (
        <div 
          id="modal-konfirmasi-hapus-karya"
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
                id="btn-close-modal-hapus-karya"
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
                  <span className="text-[10px] font-bold uppercase text-slate-400">Format & Ukuran</span>
                  <div className="font-bold text-blue-700 font-mono text-xs mt-0.5">{karyaToDelete.formatFile} ({karyaToDelete.ukuranFile})</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-1">
                ID Dokumen: <span className="text-slate-600 font-bold">{karyaToDelete.id}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Karya ini akan dihapus dari daftar repositori publik dan lembar verifikasi tugas pelatihan.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                id="btn-batal-hapus-karya"
                onClick={() => setKaryaToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                id="btn-konfirmasi-hapus-karya"
                onClick={() => {
                  if (onDeleteKarya) {
                    onDeleteKarya(karyaToDelete.id);
                  }
                  setNotificationMsg(`Karya "${karyaToDelete.judul}" berhasil dihapus.`);
                  setKaryaToDelete(null);
                  setTimeout(() => setNotificationMsg(null), 4000);
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

      {/* Modal Konfirmasi Hapus Semua Karya */}
      {isDeleteAllModalOpen && (
        <div 
          id="modal-konfirmasi-hapus-semua-karya"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 text-base">Hapus Semua Karya Pembelajaran?</h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">Tindakan ini permanen dan akan mengosongkan seluruh karya!</p>
              </div>
              <button
                id="btn-close-modal-hapus-semua"
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
                Seluruh dokumen modul ajar, LKPD, media interaktif, beserta catatan verifikasi tugas pelatihan dari seluruh peserta akan dihapus secara permanen dari repositori sistem.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800">Dampak Penghapusan Semua Karya:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                <li>Galeri repositori karya pembelajaran akan dikosongkan.</li>
                <li>Daftar penilaian tugas karya pembelajaran peserta akan bersih.</li>
                <li>Peserta atau admin tetap dapat mengunggah kembali karya baru kapan saja.</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                id="btn-batal-hapus-semua"
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                id="btn-konfirmasi-hapus-semua"
                onClick={() => {
                  const total = karyaList.length;
                  if (onDeleteAllKarya) {
                    onDeleteAllKarya();
                  } else if (onDeleteKarya) {
                    karyaList.forEach(k => onDeleteKarya(k.id));
                  }
                  setSelectedKaryaIds([]);
                  setIsDeleteAllModalOpen(false);
                  setNotificationMsg(`Seluruh karya (${total} karya) berhasil dihapus.`);
                  setTimeout(() => setNotificationMsg(null), 4000);
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

      {/* Modal Konfirmasi Hapus Karya Terpilih (Batch) */}
      {isDeleteBatchModalOpen && (
        <div 
          id="modal-konfirmasi-hapus-batch-karya"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 text-base">Hapus Karya Terpilih</h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
              </div>
              <button
                id="btn-close-modal-hapus-batch"
                onClick={() => setIsDeleteBatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-700">
                Apakah Anda yakin ingin menghapus <strong>{selectedKaryaIds.length} karya</strong> yang dipilih dari repositori?
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                id="btn-batal-hapus-batch"
                onClick={() => setIsDeleteBatchModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                id="btn-konfirmasi-hapus-batch"
                onClick={() => {
                  const count = selectedKaryaIds.length;
                  if (onDeleteBatchKarya) {
                    onDeleteBatchKarya(selectedKaryaIds);
                  } else if (onDeleteKarya) {
                    selectedKaryaIds.forEach(id => onDeleteKarya(id));
                  }
                  setSelectedKaryaIds([]);
                  setIsDeleteBatchModalOpen(false);
                  setNotificationMsg(`${count} karya terpilih berhasil dihapus.`);
                  setTimeout(() => setNotificationMsg(null), 4000);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus {selectedKaryaIds.length} Karya</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
