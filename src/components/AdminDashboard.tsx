import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileSpreadsheet, 
  Plus, 
  Sparkles, 
  FileText,
  UserCheck,
  Award,
  Users,
  Settings,
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
  Karya, 
  VerificationStatus, 
  ChartDataMonthly, 
  ChartDataFormat, 
  Peserta, 
  BroadcastTemplate, 
  BroadcastLog,
  User,
  AdminRole
} from '../types';
import { 
  INITIAL_PESERTA_LIST, 
  INITIAL_BROADCAST_TEMPLATES, 
  INITIAL_BROADCAST_LOGS 
} from '../data/initialData';
import { exportKaryaToExcel, exportPesertaToExcel } from '../utils/excelExport';
import { switchToPublicPortal } from '../utils/tabNavigation';

import { AdminOverview } from './admin/AdminOverview';
import { AdminPesertaSection } from './admin/AdminPesertaSection';
import { AdminKomunikasiSection } from './admin/AdminKomunikasiSection';
import { AdminSertifikatSection } from './admin/AdminSertifikatSection';
import { AdminKuratorSection } from './admin/AdminKuratorSection';
import { ManageAdminTeamModal } from './admin/ManageAdminTeamModal';

interface AdminDashboardProps {
  karyaList: Karya[];
  onUpdateStatus: (id: string, newStatus: VerificationStatus) => void;
  onDeleteKarya: (id: string) => void;
  onDeleteAllKarya?: () => void;
  onDeleteBatchKarya?: (ids: string[]) => void;
  onSelectKaryaForPreview: (karya: Karya) => void;
  monthlyData: ChartDataMonthly[];
  formatDistributionData: ChartDataFormat[];
  onOpenUploadModal: () => void;
  currentUser?: User | null;
  onSwitchRole?: (newAdminRole: AdminRole) => void;
  onNavigateToAdminProfile?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  karyaList,
  onUpdateStatus,
  onDeleteKarya,
  onDeleteAllKarya,
  onDeleteBatchKarya,
  onSelectKaryaForPreview,
  monthlyData,
  formatDistributionData,
  onOpenUploadModal,
  currentUser,
  onSwitchRole,
  onNavigateToAdminProfile,
}) => {
  // Determine current active role (default to super_admin if admin without specific adminRole)
  const currentRole: AdminRole = currentUser?.adminRole || 'super_admin';

  // Navigation State for Super Admin & Admin Presensi
  const [activeMainTab, setActiveMainTab] = useState<string>('overview');

  // Modal State for Super Admin
  const [isManageTeamOpen, setIsManageTeamOpen] = useState<boolean>(false);

  // Shared Data State
  const [pesertaList, setPesertaList] = useState<Peserta[]>(INITIAL_PESERTA_LIST);
  const [templates, setTemplates] = useState<BroadcastTemplate[]>(INITIAL_BROADCAST_TEMPLATES);
  const [broadcastLogs, setBroadcastLogs] = useState<BroadcastLog[]>(INITIAL_BROADCAST_LOGS);

  // Handlers for Participant Status Updates
  const handleUpdatePesertaStatus = async (id: string, newStatus: 'Valid' | 'Belum Verifikasi' | 'Tidak Valid') => {
    try {
      await fetch(`/api/v1/admin/peserta/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusValidasi: newStatus })
      });
    } catch (e) {
      console.warn('API status update error:', e);
    }

    setPesertaList(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          statusValidasi: newStatus,
          statusKelulusan: newStatus === 'Valid' ? 'Lulus' : newStatus === 'Tidak Valid' ? 'Tidak Lulus' : 'Proses'
        };
      }
      return p;
    }));
  };

  const handleDeletePeserta = async (id: string) => {
    try {
      await fetch(`/api/v1/admin/peserta/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete error:', e);
    }
    setPesertaList(prev => prev.filter(p => p.id !== id));
  };

  const handleRestorePeserta = async (id: string) => {
    try {
      await fetch(`/api/v1/admin/peserta/${id}/restore`, { method: 'POST' });
    } catch (e) {
      console.warn('API restore error:', e);
    }
    setPesertaList(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          statusValidasi: 'Belum Verifikasi',
          statusKelulusan: 'Proses'
        };
      }
      return p;
    }));
  };

  const handleUpdateKelulusanStatus = (id: string, newStatus: 'Lulus' | 'Proses' | 'Tidak Lulus') => {
    setPesertaList(prev => prev.map(p => p.id === id ? { ...p, statusKelulusan: newStatus } : p));
  };

  const handleExportAll = () => {
    if (activeMainTab === 'peserta') {
      exportPesertaToExcel(pesertaList);
    } else {
      exportKaryaToExcel(karyaList);
    }
  };

  return (
    <div className="py-8 bg-slate-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* CASE B: ROLE - ADMIN KURATOR (CONSOLIDATED: KURASI KARYA + REKAP PRESENSI) */}
        {/* ========================================================================= */}
        {currentRole === 'admin_kurator' && (
          <div className="space-y-6">
            
            {/* Header Bar Admin Kurator Terpadu */}
            <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-sky-800/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-extrabold shadow-2xs">
                    <Award className="w-4 h-4 text-sky-300 shrink-0" />
                    <span>Hak Akses: Admin Kurator (Kurasi Karya, Peserta & Rekap Presensi)</span>
                  </div>

                  {onNavigateToAdminProfile && (
                    <button
                      onClick={onNavigateToAdminProfile}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>Lihat Portofolio Admin</span>
                    </button>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
                  Dashboard Kurasi Karya, Peserta & Rekap Kehadiran
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Pusat terpadu penelaahan mutu modul ajar/LKPD, scoring masukan karya guru, verifikasi data pendaftar pelatihan, log presensi harian (H1/H2/H3), serta broadcast pengingat Zoom.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                <button
                  onClick={onOpenUploadModal}
                  title="Unggah dokumen referensi atau template resmi untuk diunduh peserta workshop."
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all border border-sky-400/30 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-600/20 hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Template Panduan</span>
                </button>

                <button
                  onClick={() => exportPesertaToExcel(pesertaList)}
                  title="Unduh seluruh rekapitulasi data pendaftar dan presensi kehadiran ke format Excel."
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 border border-emerald-400/30 cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Rekap Presensi (.xls)</span>
                </button>
              </div>
            </div>

            {/* Menu Navigasi Lengkap Admin Kurator (5 Tab Terintegrasi) */}
            <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch gap-2">
              <button
                onClick={() => setActiveMainTab('kurator')}
                className={`flex-1 px-3.5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeMainTab === 'kurator' || activeMainTab === 'overview'
                    ? 'bg-sky-900 text-white shadow-md shadow-sky-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 shrink-0" />
                <span>🎨 Kurasi & Penelaahan Karya</span>
              </button>

              <button
                onClick={() => setActiveMainTab('peserta')}
                className={`flex-1 px-3.5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeMainTab === 'peserta'
                    ? 'bg-sky-900 text-white shadow-md shadow-sky-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>👥 Data Peserta & Rekap Presensi</span>
              </button>

              <button
                onClick={() => setActiveMainTab('komunikasi')}
                className={`flex-1 px-3.5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeMainTab === 'komunikasi'
                    ? 'bg-sky-900 text-white shadow-md shadow-sky-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>📢 Broadcast WA & Zoom Link</span>
              </button>

              <button
                onClick={() => setActiveMainTab('ringkasan')}
                className={`flex-1 px-3.5 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeMainTab === 'ringkasan'
                    ? 'bg-sky-900 text-white shadow-md shadow-sky-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>📊 Ringkasan Statistik</span>
              </button>
            </div>

            {/* View 1: Kurasi Karya */}
            {(activeMainTab === 'kurator' || activeMainTab === 'overview') && (
              <AdminKuratorSection
                karyaList={karyaList}
                onUpdateStatus={onUpdateStatus}
                onSelectKaryaForPreview={onSelectKaryaForPreview}
                onDeleteKarya={onDeleteKarya}
                onDeleteAllKarya={onDeleteAllKarya}
              />
            )}

            {/* View 2: Manajemen Peserta & Kehadiran Presensi */}
            {activeMainTab === 'peserta' && (
              <AdminPesertaSection
                pesertaList={pesertaList}
                onUpdatePesertaStatus={handleUpdatePesertaStatus}
                onDeletePeserta={handleDeletePeserta}
                onRestorePeserta={handleRestorePeserta}
                onUpdateKelulusanStatus={handleUpdateKelulusanStatus}
              />
            )}

            {/* View 3: Komunikasi & Broadcast */}
            {activeMainTab === 'komunikasi' && (
              <AdminKomunikasiSection
                templates={templates}
                logs={broadcastLogs}
                pesertaList={pesertaList}
              />
            )}

            {/* View 4: Ringkasan & Statistik */}
            {activeMainTab === 'ringkasan' && (
              <AdminOverview
                pesertaList={pesertaList}
                karyaList={karyaList}
                monthlyData={monthlyData}
                formatDistributionData={formatDistributionData}
                onNavigateTab={(tab) => {
                  if (tab === 'peserta') setActiveMainTab('peserta');
                  else if (tab === 'komunikasi') setActiveMainTab('komunikasi');
                  else setActiveMainTab('kurator');
                }}
              />
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* CASE C: ROLE - SUPER ADMIN (FULL ACCESS)  */}
        {/* ========================================== */}
        {currentRole === 'super_admin' && (
          <div className="space-y-6">
            
            {/* Admin Main Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Sisi Kiri: Info & Identitas */}
              <div className="space-y-3 flex-1">
                {/* Baris Paling Atas: 3 Badge Sejajar */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-bold backdrop-blur-xs shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Hak Akses: Super Admin</span>
                  </div>

                  <button
                    onClick={() => setIsManageTeamOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/30 text-purple-200 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                    <span>Kelola Akses Tim Admin</span>
                  </button>

                  {onNavigateToAdminProfile && (
                    <button
                      onClick={onNavigateToAdminProfile}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/30 text-sky-200 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                    >
                      <Award className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                      <span>Portofolio Administrator</span>
                    </button>
                  )}
                </div>

                {/* Baris Kedua: Judul Banner */}
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-white">
                  Portal Integrasi & Tata Kelola Admin
                </h1>

                {/* Baris Ketiga: Sub-teks Deskripsi */}
                <p className="text-sm text-slate-300/80 max-w-2xl leading-relaxed">
                  Pusat kelola data peserta pelatihan, SOP verifikasi & presensi, template komunikasi broadcast WA/Email, dan generator Laporan Kegiatan Peserta (Transkrip JP & Portfolio Karya).
                </p>
              </div>

              {/* Sisi Kanan: Grouping Tombol Aksi */}
              <div className="flex flex-col gap-2.5 w-full lg:w-auto lg:min-w-[340px] shrink-0">
                {/* Tombol Utama (Primary CTA) */}
                <button
                  onClick={onOpenUploadModal}
                  title="Unggah dokumen referensi atau template resmi untuk diunduh peserta workshop."
                  className="w-full h-11 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 rounded-xl transition-all border border-sky-400/30 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-sky-600/20 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>+ Upload Template / Karya Panduan</span>
                </button>

                {/* Tombol Sekunder / Aksi Ekspor (Grouped Horizontally) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setActiveMainTab('sertifikat')}
                    className="h-11 bg-purple-900/80 hover:bg-purple-800 text-white font-bold text-xs px-3 rounded-xl shadow-md shadow-purple-900/20 transition-all flex items-center justify-center gap-2 border border-purple-400/30 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <FileText className="w-4 h-4 text-purple-200 shrink-0" />
                    <span>Generate Laporan PDF</span>
                  </button>

                  <button
                    onClick={handleExportAll}
                    className="h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 border border-emerald-400/30 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-100 shrink-0" />
                    <span>Export Excel (.xls)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Main Section Tabs Navigation Bar */}
            <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch gap-2">
              <button
                onClick={() => setActiveMainTab('overview')}
                className={`flex-1 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeMainTab === 'overview'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>📊 Ringkasan / Overview</span>
              </button>

              <button
                onClick={() => setActiveMainTab('peserta')}
                className={`flex-1 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeMainTab === 'peserta'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>👥 Manajemen Peserta</span>
              </button>

              <button
                onClick={() => setActiveMainTab('komunikasi')}
                className={`flex-1 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeMainTab === 'komunikasi'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>📢 Pusat Komunikasi & Broadcast</span>
              </button>

              <button
                onClick={() => setActiveMainTab('sertifikat')}
                className={`flex-1 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeMainTab === 'sertifikat'
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>📜 Manajemen Tugas & Laporan Kegiatan</span>
              </button>
            </div>

            {/* TAB 1: RINGKASAN / OVERVIEW */}
            {activeMainTab === 'overview' && (
              <AdminOverview
                pesertaList={pesertaList}
                karyaList={karyaList}
                monthlyData={monthlyData}
                formatDistributionData={formatDistributionData}
                onNavigateTab={(tab) => setActiveMainTab(tab)}
              />
            )}

            {/* TAB 2: MANAJEMEN PESERTA (Tabel, SOP Verifikasi, Rekap Presensi) */}
            {activeMainTab === 'peserta' && (
              <AdminPesertaSection
                pesertaList={pesertaList}
                onUpdatePesertaStatus={handleUpdatePesertaStatus}
                onDeletePeserta={handleDeletePeserta}
                onRestorePeserta={handleRestorePeserta}
                onUpdateKelulusanStatus={handleUpdateKelulusanStatus}
              />
            )}

            {/* TAB 3: PUSAT KOMUNIKASI & BROADCAST (Templates, Logs, Workflow Checklist) */}
            {activeMainTab === 'komunikasi' && (
              <AdminKomunikasiSection
                templates={templates}
                logs={broadcastLogs}
                pesertaList={pesertaList}
              />
            )}

            {/* TAB 4: MANAJEMEN TUGAS & SERTIFIKAT (Penilaian Karya & Generator Sertifikat) */}
            {activeMainTab === 'sertifikat' && (
              <AdminSertifikatSection
                pesertaList={pesertaList}
                karyaList={karyaList}
                onSelectKaryaForPreview={onSelectKaryaForPreview}
                onDeleteKarya={onDeleteKarya}
                onDeleteAllKarya={onDeleteAllKarya}
                onDeleteBatchKarya={onDeleteBatchKarya}
              />
            )}

            {/* Super Admin Team Access Modal */}
            <ManageAdminTeamModal
              isOpen={isManageTeamOpen}
              onClose={() => setIsManageTeamOpen(false)}
            />

          </div>
        )}

      </div>
    </div>
  );
};
