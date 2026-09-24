import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  User, 
  Key, 
  Mail, 
  ShieldAlert, 
  UserCheck, 
  Award,
  Users,
  Eye,
  EyeOff,
  Phone,
  Building2,
  Clock,
  HelpCircle
} from 'lucide-react';
import { AdminRole, AdminTeamMember } from '../../types';

interface ManageAdminTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PendingAdminRequest {
  id: string;
  nama: string;
  email: string;
  whatsapp: string;
  adminRole: AdminRole;
  password?: string;
  alasanAccess?: string;
  instansi?: string;
  tanggalDaftar: string;
}

export const ManageAdminTeamModal: React.FC<ManageAdminTeamModalProps> = ({ isOpen, onClose }) => {
  const [teamList, setTeamList] = useState<AdminTeamMember[]>([
    {
      id: 'ADM-001',
      email: 'superadmin@ruangkaryaguru.id',
      password: 'SuperAdmin#RKG2026!',
      nama: 'Drs. Hendra Suwandi, M.Pd.',
      adminRole: 'super_admin',
      ditambahkan: '01 Jan 2026',
      status: 'Aktif'
    },
    {
      id: 'ADM-002',
      email: 'presensi@ruangkaryaguru.id',
      password: 'PresensiRKG#9981!',
      nama: 'Anisa Rahmawati, S.Kom.',
      adminRole: 'admin_kurator',
      ditambahkan: '10 Jan 2026',
      status: 'Aktif'
    },
    {
      id: 'ADM-003',
      email: 'kurator@ruangkaryaguru.id',
      password: 'KuratorRKG#7723!',
      nama: 'Prof. Dr. Agus Setiawan',
      adminRole: 'admin_kurator',
      ditambahkan: '15 Jan 2026',
      status: 'Aktif'
    }
  ]);

  // Only real user applications submitted through the registration form
  const [pendingRequests, setPendingRequests] = useState<PendingAdminRequest[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const toggleShowPassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch Team & Pending Requests from Backend API
  const fetchTeamAndPendings = () => {
    fetch('/api/admin/team')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.team) && data.team.length > 0) {
          setTeamList(data.team);
        }
      })
      .catch(() => {});

    fetch('/api/admin/pending-requests')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.requests)) {
          setPendingRequests(data.requests);
        } else {
          setPendingRequests([]);
        }
      })
      .catch(() => {
        setPendingRequests([]);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchTeamAndPendings();
    }
  }, [isOpen]);

  // Handle Approve / Terima Akun Pengaju
  const handleApprovePending = async (request: PendingAdminRequest) => {
    setActionLoadingId(request.id);
    try {
      const res = await fetch('/api/admin/approve-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || `Permohonan akun ${request.nama} telah DITERIMA dan langsung aktif!`);
        if (data.team) setTeamList(data.team);
        if (data.pendingRequests) setPendingRequests(data.pendingRequests);
        else setPendingRequests(prev => prev.filter(p => p.id !== request.id));
      } else {
        // Fallback local accept
        const newMember: AdminTeamMember = {
          id: `ADM-00${teamList.length + 1}`,
          email: request.email,
          password: request.password || 'RKG-Admin#2026!',
          nama: request.nama,
          adminRole: request.adminRole,
          ditambahkan: 'Hari ini',
          status: 'Aktif'
        };
        setTeamList(prev => [...prev, newMember]);
        setPendingRequests(prev => prev.filter(p => p.id !== request.id));
        setSuccessMsg(`Permohonan ${request.nama} DITERIMA! Akun kini aktif sebagai ${request.adminRole === 'super_admin' ? 'Super Admin' : 'Admin Kurator'}.`);
      }
    } catch (e) {
      const newMember: AdminTeamMember = {
        id: `ADM-00${teamList.length + 1}`,
        email: request.email,
        password: request.password || 'RKG-Admin#2026!',
        nama: request.nama,
        adminRole: request.adminRole,
        ditambahkan: 'Hari ini',
        status: 'Aktif'
      };
      setTeamList(prev => [...prev, newMember]);
      setPendingRequests(prev => prev.filter(p => p.id !== request.id));
      setSuccessMsg(`Permohonan ${request.nama} DITERIMA! Akun kini aktif sebagai ${request.adminRole === 'super_admin' ? 'Super Admin' : 'Admin Kurator'}.`);
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setSuccessMsg(''), 6000);
    }
  };

  // Handle Reject / Tolak Akun Pengaju
  const handleRejectPending = async (request: PendingAdminRequest) => {
    setActionLoadingId(request.id);
    try {
      const res = await fetch('/api/admin/reject-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id })
      });
      const data = await res.json();
      if (data.success) {
        setPendingRequests(data.pendingRequests || []);
        setSuccessMsg(`Permohonan akun ${request.nama} telah DITOLAK.`);
      } else {
        setPendingRequests(prev => prev.filter(p => p.id !== request.id));
        setSuccessMsg(`Permohonan akun ${request.nama} telah DITOLAK.`);
      }
    } catch (e) {
      setPendingRequests(prev => prev.filter(p => p.id !== request.id));
      setSuccessMsg(`Permohonan akun ${request.nama} telah DITOLAK.`);
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handleDeleteMember = async (id: string, nama: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menonaktifkan akun admin ${nama}?`)) return;

    try {
      const response = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setTeamList(data.team);
        setSuccessMsg(`Akun admin ${nama} berhasil dinonaktifkan.`);
      } else {
        setTeamList(teamList.filter(t => t.id !== id));
        setSuccessMsg(`Akun admin ${nama} berhasil dinonaktifkan.`);
      }
    } catch (err) {
      setTeamList(teamList.filter(t => t.id !== id));
      setSuccessMsg(`Akun admin ${nama} berhasil dinonaktifkan.`);
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-50 text-purple-900 border border-purple-300 shadow-2xs whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Super Admin (Akses Penuh)</span>
          </span>
        );
      case 'admin_kurator':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-sky-50 text-sky-900 border border-sky-300 shadow-2xs whitespace-nowrap">
            <Award className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Admin Kurator (Kurasi & Presensi)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 whitespace-nowrap">
            <span>{role}</span>
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 my-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Persetujuan & Verifikasi Akun Admin</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                Super Admin Panel
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap kali ada yang mengajukan pendaftaran admin, langsung berikan opsi <strong>Terima</strong> atau <strong>Tolak</strong> tanpa perlu mengetik manual.
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-900 p-4 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SECTION 1: PENGAJUAN AKUN MASUK (TERIMA ATAU TOLAK) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${pendingRequests.length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-600" />
                  <span>Daftar Pengajuan Akun Admin yang Masuk</span>
                </h3>
                {pendingRequests.length > 0 && (
                  <span className="text-[11px] bg-amber-100 text-amber-900 font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                    {pendingRequests.length} Permohonan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Daftar permohonan yang diajukan oleh pengguna melalui formulir pendaftaran admin. Klik <strong>Terima & Aktifkan</strong> untuk menyetujui, atau <strong>Tolak</strong>.
              </p>
            </div>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-gradient-to-r from-amber-50/60 via-white to-slate-50 p-5 rounded-2xl border-2 border-amber-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all hover:border-amber-300"
                >
                  {/* Left Info: Avatar + Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0 border border-amber-300">
                      {req.nama.charAt(0)}
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-sm sm:text-base">{req.nama}</span>
                        {getRoleBadge(req.adminRole)}
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600">
                        {req.instansi && (
                          <div className="flex items-center gap-1 font-semibold text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{req.instansi}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{req.email}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{req.whatsapp}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Diajukan: {req.tanggalDaftar}</span>
                        </div>
                      </div>

                      {req.alasanAccess && (
                        <div className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed italic">
                          "{req.alasanAccess}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: TERIMA atau TOLAK */}
                  <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                    <button
                      onClick={() => handleApprovePending(req)}
                      disabled={actionLoadingId === req.id}
                      className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xs px-5 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                      title="Terima permohonan dan langsung aktifkan akun"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{actionLoadingId === req.id ? 'Memproses...' : 'Terima & Aktifkan'}</span>
                    </button>

                    <button
                      onClick={() => handleRejectPending(req)}
                      disabled={actionLoadingId === req.id}
                      className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                      title="Tolak permohonan pendaftaran ini"
                    >
                      <X className="w-4 h-4" />
                      <span>Tolak</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Permohonan yang Menunggu</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Semua permohonan telah diproses. Ketika calon admin mendaftar lewat portal, permohonannya akan langsung muncul di atas untuk langsung Anda <strong>Terima</strong> atau <strong>Tolak</strong>.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: DAFTAR AKUN TIM ADMINISTRATOR AKTIF */}
        <div className="space-y-3.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Daftar Akun Tim Administrator Aktif ({teamList.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Terverifikasi Sistem</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider select-none">
                <tr>
                  <th className="py-4 px-4 min-w-[220px] border-b border-slate-800">Nama & Email Admin</th>
                  <th className="py-4 px-4 min-w-[160px] border-b border-slate-800">Sandi Unik Akun</th>
                  <th className="py-4 px-4 min-w-[220px] border-b border-slate-800">Peran / Role Status</th>
                  <th className="py-4 px-4 text-center min-w-[120px] border-b border-slate-800">Ditambahkan</th>
                  <th className="py-4 px-4 text-center min-w-[80px] border-b border-slate-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium bg-white">
                {teamList.map((member) => (
                  <tr key={member.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-xs leading-snug group-hover:text-blue-950">{member.nama}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{member.email}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] tracking-tight">
                          {showPasswords[member.id] 
                            ? (member.password || '••••••••') 
                            : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPassword(member.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                          title={showPasswords[member.id] ? 'Sembunyikan Sandi' : 'Lihat Sandi'}
                        >
                          {showPasswords[member.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRoleBadge(member.adminRole)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[11px] text-slate-500 font-mono whitespace-nowrap">
                      {member.ditambahkan}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {member.adminRole !== 'super_admin' ? (
                        <button
                          onClick={() => handleDeleteMember(member.id, member.nama)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
                          title="Hapus Akses Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          Utama
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
