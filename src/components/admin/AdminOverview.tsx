import React from 'react';
import { 
  Users, 
  FileCheck2, 
  Award, 
  Send, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp, 
  PieChart as PieIcon,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Karya, Peserta, ChartDataMonthly, ChartDataFormat } from '../../types';

interface AdminOverviewProps {
  pesertaList: Peserta[];
  karyaList: Karya[];
  monthlyData: ChartDataMonthly[];
  formatDistributionData: ChartDataFormat[];
  onNavigateTab: (tab: 'peserta' | 'komunikasi' | 'sertifikat' | 'overview') => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  pesertaList,
  karyaList,
  monthlyData,
  formatDistributionData,
  onNavigateTab,
}) => {
  const totalPeserta = pesertaList.length;
  const pesertaValid = pesertaList.filter(p => p.statusValidasi === 'Valid').length;
  const pesertaBelumVerifikasi = pesertaList.filter(p => p.statusValidasi === 'Belum Verifikasi').length;
  const totalLulus = pesertaList.filter(p => p.statusKelulusan === 'Lulus').length;
  const totalKarya = karyaList.length;

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div 
          onClick={() => onNavigateTab('peserta')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Peserta Guru</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{totalPeserta}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18% m/m
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{pesertaValid} Verified Valid</span>
            <span className="text-amber-600 font-semibold">{pesertaBelumVerifikasi} Pending</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('peserta')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Verifikasi</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600">{pesertaValid}</span>
            <span className="text-xs font-semibold text-slate-500">dari {totalPeserta} Terdaftar</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${totalPeserta ? Math.round((pesertaValid / totalPeserta) * 100) : 0}%` }}
            />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('sertifikat')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Kelengkapan Laporan</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{totalLulus}</span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              {totalPeserta ? Math.round((totalLulus / totalPeserta) * 100) : 0}% Lulus
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Siap Terbit Laporan Kegiatan (32 JP)
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('sertifikat')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Karya & Modul Masuk</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{totalKarya}</span>
            <span className="text-xs font-semibold text-emerald-600">Terverifikasi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Modul Ajar, LKPD, Video, Media HTML5
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => onNavigateTab('peserta')}
          className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">1. Manajemen Data Peserta</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tabel database lengkap (NIP/NUPTK, instansi, jenjang), SOP petunjuk teknis verifikasi data valid vs tidak valid, dan rekap presensi harian.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-300 group-hover:translate-x-1 transition-transform">
            <span>Kelola Peserta & SOP Presensi</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('komunikasi')}
          className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">2. Komunikasi & Broadcast</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Template pesan WA/Email broadcast (Konfirmasi, H-1, H-2 jam, link Zoom, tugas), log pengiriman, dan checklist workflow otomatis Google Form & WA.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-300 group-hover:translate-x-1 transition-transform">
            <span>Kelola Template & Broadcast</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('sertifikat')}
          className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-purple-300">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">3. Tugas & Laporan Kegiatan</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Penilaian karya tugas guru, kelayakan laporan peserta, serta penerbitan Laporan Kegiatan Peserta (Transkrip 32 JP & Portfolio) lengkap dengan TTD digital.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
            <span>Penilaian & Laporan Kegiatan</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Upload & Pendaftaran */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Tren Pertumbuhan Pendaftaran & Karya Masuk</span>
              </h3>
              <p className="text-xs text-slate-500">Statistik rekapitulasi bulanan periode berjalan 2026</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-100">
              Update Realtime
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDisetujui" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="totalUpload" name="Total Pengajuan" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                <Area type="monotone" dataKey="disetujui" name="Terverifikasi" stroke="#10B981" fillOpacity={1} fill="url(#colorDisetujui)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribusi Format File */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-600" />
              <span>Distribusi Format Berkas</span>
            </h3>
            <p className="text-xs text-slate-500">Komposisi media ajar yang diunggah guru</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {formatDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#FFF', fontSize: '12px' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
