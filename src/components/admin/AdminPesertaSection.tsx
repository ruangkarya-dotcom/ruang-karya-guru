import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  HelpCircle, 
  CalendarCheck, 
  QrCode, 
  Smartphone, 
  Check, 
  X, 
  Edit, 
  Send,
  FileText,
  UserCheck,
  CheckSquare,
  Sparkles,
  Download,
  Trash2,
  RotateCcw,
  AlertTriangle,
  UserMinus,
  ShieldCheck
} from 'lucide-react';
import { Peserta } from '../../types';
import { exportPesertaToExcel } from '../../utils/excelExport';

interface AdminPesertaSectionProps {
  pesertaList: Peserta[];
  onUpdatePesertaStatus: (id: string, newStatus: 'Valid' | 'Belum Verifikasi' | 'Tidak Valid') => void;
  onDeletePeserta?: (id: string) => void;
  onRestorePeserta?: (id: string) => void;
  onUpdateKelulusanStatus?: (id: string, newStatus: 'Lulus' | 'Proses' | 'Tidak Lulus') => void;
  onSendWhatsappMessage?: (peserta: Peserta) => void;
}

export const AdminPesertaSection: React.FC<AdminPesertaSectionProps> = ({
  pesertaList,
  onUpdatePesertaStatus,
  onDeletePeserta,
  onRestorePeserta,
  onUpdateKelulusanStatus,
  onSendWhatsappMessage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tabel' | 'sop' | 'presensi'>('tabel');
  const [tableListMode, setTableListMode] = useState<'active' | 'rejected'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [jenjangFilter, setJenjangFilter] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [kelulusanFilter, setKelulusanFilter] = useState<string>('Semua');
  const [selectedPesertaDetail, setSelectedPesertaDetail] = useState<Peserta | null>(null);

  // Modal & Action states
  const [actionModalPeserta, setActionModalPeserta] = useState<Peserta | null>(null);
  const [actionModalStep, setActionModalStep] = useState<'choose' | 'confirm_hard_delete'>('choose');
  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(prev => prev?.message === message ? null : prev);
    }, 3800);
  };

  // Counts for active and rejected participants
  const activeCount = useMemo(() => {
    return pesertaList.filter(p => p.statusValidasi !== 'Tidak Valid').length;
  }, [pesertaList]);

  const rejectedCount = useMemo(() => {
    return pesertaList.filter(p => p.statusValidasi === 'Tidak Valid').length;
  }, [pesertaList]);

  // Filtered Peserta with automatic hide/filter for active vs rejected view
  const filteredPeserta = useMemo(() => {
    return pesertaList.filter(p => {
      // 1. Separation between Active List and Rejected List
      if (tableListMode === 'active') {
        if (p.statusValidasi === 'Tidak Valid') return false; // Instantly hidden from active view
      } else {
        if (p.statusValidasi !== 'Tidak Valid') return false; // Only show rejected in rejected view
      }

      const matchJenjang = jenjangFilter === 'Semua' || p.jenjang === jenjangFilter;
      const matchStatus = statusFilter === 'Semua' || p.statusValidasi === statusFilter;
      const matchLulus = kelulusanFilter === 'Semua' || p.statusKelulusan === kelulusanFilter;
      const query = searchTerm.toLowerCase();
      const matchSearch = 
        p.namaLengkapGelar.toLowerCase().includes(query) ||
        p.nuptkOrNip.toLowerCase().includes(query) ||
        p.asalInstansi.toLowerCase().includes(query) ||
        p.kabupatenKota.toLowerCase().includes(query) ||
        p.emailAktif.toLowerCase().includes(query) ||
        p.noWhatsapp.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query);

      return matchJenjang && matchStatus && matchLulus && matchSearch;
    });
  }, [pesertaList, tableListMode, jenjangFilter, statusFilter, kelulusanFilter, searchTerm]);

  // Action Handlers
  const handleValidate = (peserta: Peserta) => {
    onUpdatePesertaStatus(peserta.id, 'Valid');
    showToast(`Data pendaftaran ${peserta.namaLengkapGelar} berhasil diverifikasi sebagai Valid (Disetujui).`, 'success');
  };

  const handleOpenRejectModal = (peserta: Peserta, step: 'choose' | 'confirm_hard_delete' = 'choose') => {
    setActionModalPeserta(peserta);
    setActionModalStep(step);
  };

  const handleExecuteSoftReject = () => {
    if (!actionModalPeserta) return;
    const target = actionModalPeserta;
    onUpdatePesertaStatus(target.id, 'Tidak Valid');
    setActionModalPeserta(null);
    showToast(`Data pendaftaran ${target.namaLengkapGelar} ditandai Tidak Valid dan disembunyikan dari tabel aktif.`, 'info');
  };

  const handleExecuteHardDelete = () => {
    if (!actionModalPeserta) return;
    const target = actionModalPeserta;
    if (onDeletePeserta) {
      onDeletePeserta(target.id);
    }
    setActionModalPeserta(null);
    showToast(`Data pendaftaran ${target.namaLengkapGelar} berhasil dihapus permanen dari basis data.`, 'error');
  };

  const handleRestore = (peserta: Peserta) => {
    if (onRestorePeserta) {
      onRestorePeserta(peserta.id);
    } else {
      onUpdatePesertaStatus(peserta.id, 'Belum Verifikasi');
    }
    showToast(`Data pendaftaran ${peserta.namaLengkapGelar} berhasil dipulihkan ke Tabel Aktif (Pending).`, 'success');
  };

  const handleExportExcel = () => {
    // Export currently filtered list or active list
    exportPesertaToExcel(filteredPeserta.length > 0 ? filteredPeserta : pesertaList);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSubTab('tabel')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'tabel'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Database Peserta (Tabel)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sop')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'sop'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>SOP Verifikasi Data Valid vs Tidak Valid</span>
        </button>

        <button
          onClick={() => setActiveSubTab('presensi')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeSubTab === 'presensi'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Mekanisme Rekap Presensi Harian</span>
        </button>
      </div>

      {/* SUB-TAB 1: TABEL DATABASE PESERTA */}
      {activeSubTab === 'tabel' && (
        <div className="space-y-6">
          {/* Header & Export Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span>Tabel Database Data Peserta Pelatihan / Workshop</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Data terstruktur meliputi NIP/NUPTK, instansi, jenjang (PAUD/SD/SMP/SMA/SMK), domisili, email, No. WA, status verifikasi, & kelulusan.
              </p>
            </div>

            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export {tableListMode === 'active' ? 'Data Aktif' : 'Data Ditolak'} ke Excel (.xls)</span>
            </button>
          </div>

          {/* Mode Switcher Tabs: Data Aktif vs Data Ditolak */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTableListMode('active');
                  setStatusFilter('Semua');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  tableListMode === 'active'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20 ring-2 ring-blue-900/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>📋 Data Aktif (Pending & Valid)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  tableListMode === 'active' ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {activeCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setTableListMode('rejected');
                  setStatusFilter('Semua');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  tableListMode === 'rejected'
                    ? 'bg-rose-700 text-white shadow-md shadow-rose-700/20 ring-2 ring-rose-700/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>🚫 Data Ditolak / Tidak Valid</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  tableListMode === 'rejected'
                    ? 'bg-rose-900 text-rose-100'
                    : rejectedCount > 0 ? 'bg-rose-100 text-rose-700 font-extrabold' : 'bg-slate-200 text-slate-700'
                }`}>
                  {rejectedCount}
                </span>
              </button>
            </div>

            <div className="text-xs font-medium px-2">
              {tableListMode === 'active' ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Menampilkan {filteredPeserta.length} peserta aktif (Siap diverifikasi & dinilai)</span>
                </span>
              ) : (
                <span className="text-rose-700 font-semibold flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/80">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Menampilkan {filteredPeserta.length} data ditolak (Tersimpan aman, dapat dipulihkan)</span>
                </span>
              )}
            </div>
          </div>

          {/* Banner Informasi Khusus Data Ditolak */}
          {tableListMode === 'rejected' && (
            <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-rose-900 animate-in fade-in duration-200">
              <div className="p-2 bg-rose-200 text-rose-800 rounded-xl shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="font-extrabold text-rose-950 text-sm">Arsip Data Pendaftaran Ditolak / Tidak Valid</div>
                <p className="text-rose-800 leading-relaxed">
                  Data berikut memiliki status <strong>Tidak Valid (Ditolak)</strong> dan secara otomatis disembunyikan dari tabel aktif utama sehingga tidak mengganggu rekapitulasi presensi maupun penerbitan sertifikat. Anda dapat menekan tombol <strong>[ 🔄 Pulihkan ]</strong> untuk mengembalikan data ke tabel aktif atau <strong>[ 🗑️ Hapus Permanen ]</strong> untuk menghapusnya dari basis data.
                </p>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari Nama, NIP, Instansi, Kota, WA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Jenjang Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={jenjangFilter}
                onChange={(e) => setJenjangFilter(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700 font-semibold"
              >
                <option value="Semua">Semua Jenjang</option>
                <option value="PAUD">PAUD / TK</option>
                <option value="SD">SD / MI</option>
                <option value="SMP">SMP / MTs</option>
                <option value="SMA/SMK">SMA / SMK / MA</option>
                <option value="Lainnya">Lainnya / Umum</option>
              </select>
            </div>

            {/* Status Validasi Filter */}
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700 font-semibold"
              >
                {tableListMode === 'active' ? (
                  <>
                    <option value="Semua">Semua Status Aktif</option>
                    <option value="Valid">Valid (Disetujui)</option>
                    <option value="Belum Verifikasi">Belum Verifikasi (Pending)</option>
                  </>
                ) : (
                  <>
                    <option value="Semua">Semua Status Ditolak</option>
                    <option value="Tidak Valid">Tidak Valid (Ditolak)</option>
                  </>
                )}
              </select>
            </div>

            {/* Status Kelulusan Filter */}
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={kelulusanFilter}
                onChange={(e) => setKelulusanFilter(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-700 font-semibold"
              >
                <option value="Semua">Semua Status Kelulusan</option>
                <option value="Lulus">Lulus (Memenuhi Syarat)</option>
                <option value="Proses">Dalam Proses</option>
                <option value="Tidak Lulus">Tidak Lulus</option>
              </select>
            </div>
          </div>

          {/* Table Database Peserta */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-900 text-white uppercase font-bold text-[11px] tracking-wider select-none">
                  <tr>
                    <th className="py-4 px-3.5 text-center w-12 border-b border-slate-800">No</th>
                    <th className="py-4 px-4 min-w-[200px] border-b border-slate-800">Nama Lengkap & Gelar</th>
                    <th className="py-4 px-4 min-w-[160px] border-b border-slate-800">NUPTK / NIP</th>
                    <th className="py-4 px-4 min-w-[200px] border-b border-slate-800">Instansi & Jenjang</th>
                    <th className="py-4 px-4 min-w-[140px] border-b border-slate-800">Kabupaten/Kota</th>
                    <th className="py-4 px-4 min-w-[190px] border-b border-slate-800">Kontak (Email & WA)</th>
                    <th className="py-4 px-4 text-center min-w-[130px] border-b border-slate-800">Status Validasi</th>
                    <th className="py-4 px-4 text-center min-w-[110px] border-b border-slate-800">Kehadiran</th>
                    <th className="py-4 px-4 text-center min-w-[120px] border-b border-slate-800">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPeserta.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-14 text-center text-slate-400 bg-slate-50/50">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <span className="text-xs font-semibold">Tidak ada data peserta yang cocok dengan kriteria pencarian/filter.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPeserta.map((peserta, idx) => (
                      <tr key={peserta.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="py-3.5 px-3.5 text-center text-slate-400 font-bold text-xs">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 text-xs leading-snug group-hover:text-blue-950">{peserta.namaLengkapGelar}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 inline-flex items-center gap-1">
                            <span>ID:</span>
                            <span className="text-slate-600 font-bold">{peserta.id}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] font-bold tracking-tight border border-slate-200/80 shadow-2xs">
                            {peserta.nuptkOrNip || '-'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800 text-xs leading-snug">{peserta.asalInstansi}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200/70">
                            Jenjang {peserta.jenjang}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium text-xs">
                          {peserta.kabupatenKota}
                        </td>
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="text-slate-800 font-medium text-[11px] truncate max-w-[180px]">{peserta.emailAktif}</div>
                          <div className="text-emerald-800 font-mono font-extrabold text-xs inline-flex items-center gap-1">
                            <span className="text-[10px] text-emerald-600">WA:</span>
                            <span>{peserta.noWhatsapp}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {peserta.statusValidasi === 'Valid' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Valid
                            </span>
                          )}
                          {peserta.statusValidasi === 'Belum Verifikasi' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Pending
                            </span>
                          )}
                          {peserta.statusValidasi === 'Tidak Valid' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Tidak Valid
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center justify-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60">
                            <span className={`w-5 h-5 rounded text-[10px] font-black flex items-center justify-center transition-colors ${peserta.kehadiranH1 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200/80 text-slate-400'}`} title="Presensi Hari 1">
                              H1
                            </span>
                            <span className={`w-5 h-5 rounded text-[10px] font-black flex items-center justify-center transition-colors ${peserta.kehadiranH2 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200/80 text-slate-400'}`} title="Presensi Hari 2">
                              H2
                            </span>
                            <span className={`w-5 h-5 rounded text-[10px] font-black flex items-center justify-center transition-colors ${peserta.kehadiranH3 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200/80 text-slate-400'}`} title="Presensi Hari 3">
                              H3
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {tableListMode === 'active' ? (
                              <>
                                <button
                                  onClick={() => handleValidate(peserta)}
                                  title="Tandai Valid (Disetujui)"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenRejectModal(peserta, 'choose')}
                                  title="Tolak / Hapus Data Peserta"
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleRestore(peserta)}
                                  title="Pulihkan ke Tabel Aktif (Pending)"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenRejectModal(peserta, 'confirm_hard_delete')}
                                  title="Hapus Permanen dari Basis Data"
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedPesertaDetail(peserta)}
                              title="Lihat Detail Peserta"
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <span>Menampilkan <strong>{filteredPeserta.length}</strong> dari total <strong>{tableListMode === 'active' ? activeCount : rejectedCount}</strong> data peserta {tableListMode === 'active' ? 'aktif' : 'ditolak'}</span>
              <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">Format Rekap: Sesuai Kolom Excel/Google Sheets</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SOP PETUNJUK TEKNIS VERIFIKASI PESERTA */}
      {activeSubTab === 'sop' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-200">
                PANDUAN OPERASIONAL ADMIN (SOP)
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Petunjuk Teknis Verifikasi & Penyaringan Data Peserta Valid vs Tidak Valid
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Prosedur standar bagi tim admin verifikator dalam memastikan keabsahan data peserta sebelum dikonfirmasi dan diterbitkan sertifikat.
              </p>
            </div>

            {/* Matrix Comparison: Valid vs Tidak Valid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Peserta Valid */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm border-b border-emerald-200 pb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Kriteria Peserta VALID (Disetujui)</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-950">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">1.</span>
                    <span><strong>NUPTK / NIP Valid:</strong> Memiliki NUPTK (16 digit) atau NIP (18 digit) berformat angka yang sesuai, atau Guru Honor terdaftar di Dapodik/EMIS.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">2.</span>
                    <span><strong>Email Aktif Resmi:</strong> Menggunakan domain <code>@guru.*.belajar.id</code>, <code>@*.sch.id</code>, atau Gmail aktif yang dapat menerima pesan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">3.</span>
                    <span><strong>Nomor WhatsApp Terhubung:</strong> Nomor ponsel aktif dengan WhatsApp (format diawali <code>08</code> atau <code>628</code>) tanpa karakter khusus acak.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">4.</span>
                    <span><strong>Instansi Terdaftar:</strong> Nama sekolah/lembaga berada pada domisili Kabupaten/Kota yang terdaftar resmi di Kemendikbudristek / Kemenag.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">5.</span>
                    <span><strong>Kesesuaian Jenjang:</strong> Jenjang mengajar (PAUD/SD/SMP/SMA/SMK) dipilih dengan jelas.</span>
                  </li>
                </ul>
              </div>

              {/* Peserta Tidak Valid */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm border-b border-rose-200 pb-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Indikator Peserta TIDAK VALID (Ditolak)</span>
                </div>
                <ul className="space-y-2 text-xs text-rose-950">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">1.</span>
                    <span><strong>Data Acak / Spam Bot:</strong> NIP/NUPTK diisi karakter acak (misal: <code>00000000</code>, <code>123456</code>, <code>asdfg</code>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">2.</span>
                    <span><strong>No. WA Tidak Aktif / Format Salah:</strong> Nomor kurang dari 10 digit, nomor fiktif (misal: <code>0800000000</code>), atau tidak terhubung ke WA.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">3.</span>
                    <span><strong>Email Bounce / Palsu:</strong> Format email tidak valid (misal tanpa <code>@</code>) atau terdeteksi email sementara (temp-mail).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-rose-600">4.</span>
                    <span><strong>Instansi Fiktif / Luar Target:</strong> Nama instansi diisi kata-kata bercandaan atau bukan unsur pendidik/tenaga kependidikan.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Langkah Operasional Verifikasi Admin */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>Alur 4 Langkah Operasional Verifikasi Admin:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                    01
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Ekstraksi & Formating</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Unduh data pendaftaran dari Google Form/Website ke format MS Excel. Jalankan fitur Trim & Cleanup Spasi.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                    02
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Sanitasi No. WhatsApp</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ubah awalan <code>08...</code> menjadi kode internasional <code>628...</code> secara otomatis untuk integrasi WA Gateway.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                    03
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Validasi NUPTK/NIP</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Gunakan filter duplikasi. Pastikan 1 NIP/NUPTK hanya terdaftar 1 kali untuk kegiatan yang sama.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                    04
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Penetapan Status</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ubah status menjadi <strong>Valid</strong> untuk dikirimkan broadcast grup WA, atau <strong>Tidak Valid</strong> jika terdeteksi spam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REKOMENDASI MEKANISME REKAP PRESENSI HARIAN */}
      {activeSubTab === 'presensi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="px-3 py-1 bg-cyan-100 text-cyan-900 text-xs font-bold rounded-full border border-cyan-200">
                MEKANISME REKAP PRESENSI PRESISI
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Rekomendasi Mekanisme Rekap Presensi Harian (Pelatihan Online & Offline)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Strategi pencatatan kehadiran yang efisien, mencegah manipulasi presensi, dan mempermudah rekapitulasi syarat kelulusan 80%.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Online Mechanism */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm border-b border-slate-800 pb-3">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <span>A. Mekanisme Presensi Pelatihan ONLINE (Zoom / Meet)</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white">Dynamic Form + Keyword Harian:</strong> Link form presensi hanya dibuka selama 30 menit di tengah sesi Zoom. Peserta memasukkan "Kata Kunci Rahasia" yang diucapkan Narasumber.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white">QR Code Dinamis di Screen Zoom:</strong> Menampilkan Kode QR pada slide presentasi yang mengarah ke form presensi unik dengan timestamp otomatis.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white">Auto VLOOKUP Database:</strong> Sistem otomatis mencocokkan NIP/Email inputan peserta dengan Database Valid. Data yang tidak ada di database pendaftaran ditandai merah.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-white">Export Log Zoom Participant:</strong> Mengunduh laporan durasi hadir langsung dari Zoom Cloud Recording untuk verifikasi silang (minimal 60 menit di ruang Zoom).
                    </div>
                  </li>
                </ul>
              </div>

              {/* Offline Mechanism */}
              <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-extrabold text-sm border-b border-slate-800 pb-3">
                  <QrCode className="w-5 h-5 text-blue-400" />
                  <span>B. Mekanisme Presensi Pelatihan OFFLINE (Tatap Muka)</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white">Scan QR Code ID Card Peserta:</strong> Panitia memindai Kode QR pada kokarde / name tag peserta menggunakan aplikasi HP Panitia saat registrasi meja masuk.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white">Tanda Tangan Digital pada Tablet:</strong> Peserta membubuhkan paraf/tanda tangan digital pada layar tablet presensi panitia untuk validasi otentik.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white">Realtime Sync Dashboard:</strong> Data kedatangan langsung tersinkronisasi ke Dashboard Admin secara otomatis tanpa perlu rekap manual kertas.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-white">Rekapitulasi Syarat Kelulusan (&gt;80%):</strong> Sistem menghitung total kehadiran harian. Peserta dengan kehadiran &gt;= 80% otomatis memenuhi syarat penerbitan sertifikat.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Peserta */}
      {selectedPesertaDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Detail Data Peserta Guru</h3>
              <button
                onClick={() => setSelectedPesertaDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Nama & Gelar</span>
                <div className="font-extrabold text-slate-900 text-sm mt-0.5">{selectedPesertaDetail.namaLengkapGelar}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">NUPTK / NIP</span>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedPesertaDetail.nuptkOrNip || '-'}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Jenjang Mengajar</span>
                  <div className="font-bold text-blue-800 mt-0.5">{selectedPesertaDetail.jenjang}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Asal Instansi & Kab/Kota</span>
                <div className="font-bold text-slate-800 mt-0.5">{selectedPesertaDetail.asalInstansi} ({selectedPesertaDetail.kabupatenKota})</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Email Aktif</span>
                  <div className="font-medium text-slate-800 mt-0.5 truncate">{selectedPesertaDetail.emailAktif}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">No. WhatsApp</span>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5">{selectedPesertaDetail.noWhatsapp}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Status Kelulusan</span>
                  <div className="font-extrabold text-emerald-700 mt-0.5">{selectedPesertaDetail.statusKelulusan}</div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                  Nilai Tugas: {selectedPesertaDetail.nilaiTugas || 0}/100
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPesertaDetail(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI TINDAKAN STATUS TIDAK VALID / HAPUS PESERTA */}
      {actionModalPeserta && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            {actionModalStep === 'choose' ? (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Konfirmasi Penanganan Data</h3>
                      <p className="text-xs text-slate-500">Pilih metode penanganan pendaftaran tidak valid</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActionModalPeserta(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Target Peserta Info Box */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Identitas Pendaftar:</div>
                  <div className="font-extrabold text-slate-900 text-sm">{actionModalPeserta.namaLengkapGelar}</div>
                  <div className="text-slate-600">
                    {actionModalPeserta.asalInstansi} • {actionModalPeserta.jenjang} • {actionModalPeserta.kabupatenKota}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    NIP/NUPTK: {actionModalPeserta.nuptkOrNip || '-'} | WA: {actionModalPeserta.noWhatsapp}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* OPSI A: SOFT DELETE (RECOMMENDED) */}
                  <button
                    onClick={handleExecuteSoftReject}
                    className="w-full text-left p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 transition-all group cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-extrabold text-amber-950 text-xs sm:text-sm flex items-center gap-2">
                        <UserMinus className="w-4 h-4 text-amber-700" />
                        <span>Opsi A: Tandai Tidak Valid & Sembunyikan (Rekomendasi)</span>
                      </div>
                      <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        Aman
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed pl-6">
                      Ubah status menjadi <strong>Tidak Valid</strong> dan langsung <strong>sembunyikan dari tabel aktif</strong> tanpa reload. Data tetap diarsipkan di tab <em>"Data Ditolak"</em> dan dapat dipulihkan sewaktu-waktu.
                    </p>
                  </button>

                  {/* OPSI B: HARD DELETE */}
                  <button
                    onClick={() => setActionModalStep('confirm_hard_delete')}
                    className="w-full text-left p-4 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50 transition-all group cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-rose-800 text-xs sm:text-sm flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-rose-600" />
                        <span>Opsi B: Hapus Permanen dari Basis Data</span>
                      </div>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                        Permanen
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                      Hapus seluruh rekam jejak peserta ini dari sistem. Tindakan ini permanen dan tidak dapat dibatalkan.
                    </p>
                  </button>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActionModalPeserta(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Konfirmasi Hapus Permanen</h3>
                    <p className="text-xs text-rose-700 font-semibold mt-0.5">Tindakan ini tidak dapat dibatalkan!</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200 text-rose-950">
                  Apakah Anda yakin ingin menghapus data pendaftaran <strong>{actionModalPeserta.namaLengkapGelar}</strong> ({actionModalPeserta.asalInstansi}) secara permanen dari sistem? Seluruh histori kehadiran dan penugasan akan dimusnahkan.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => {
                      if (tableListMode === 'active') {
                        setActionModalStep('choose');
                      } else {
                        setActionModalPeserta(null);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Batal / Kembali
                  </button>
                  <button
                    onClick={handleExecuteHardDelete}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Permanen</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 text-xs ${
            toastNotification.type === 'success'
              ? 'bg-emerald-950 text-white border-emerald-800'
              : toastNotification.type === 'error'
              ? 'bg-rose-950 text-white border-rose-800'
              : 'bg-slate-900 text-white border-slate-800'
          }`}>
            <div className="shrink-0 mt-0.5">
              {toastNotification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : toastNotification.type === 'error' ? (
                <Trash2 className="w-4 h-4 text-rose-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="flex-1 font-medium leading-relaxed">
              {toastNotification.message}
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
