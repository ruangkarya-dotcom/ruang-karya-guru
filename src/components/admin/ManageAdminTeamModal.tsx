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
  EyeOff
} from 'lucide-react';
import { AdminRole, AdminTeamMember } from '../../types';

interface ManageAdminTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
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

  const [newNama, setNewNama] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('admin_kurator');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [pendingRequests, setPendingRequests] = useState<Array<{
    id: string;
    nama: string;
    email: string;
    whatsapp: string;
    adminRole: AdminRole;
    alasanAccess?: string;
    tanggalDaftar: string;
  }>>([]);

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let randPass = 'RKG-';
    for (let i = 0; i < 6; i++) {
      randPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    randPass += '!';
    setNewPassword(randPass);
  };

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
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isOpen) {
      fetchTeamAndPendings();
    }
  }, [isOpen]);

  const handleApprovePending = async (requestId: string) => {
    try {
      const res = await fetch('/api/admin/approve-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        if (data.team) setTeamList(data.team);
        if (data.pendingRequests) setPendingRequests(data.pendingRequests);
      }
    } catch (e) {
      setSuccessMsg('Permohonan pendaftaran telah disetujui!');
    }
  };

  const handleRejectPending = async (requestId: string) => {
    try {
      const res = await fetch('/api/admin/reject-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      const data = await res.json();
      if (data.success) {
        setPendingRequests(data.pendingRequests || []);
      }
    } catch (e) {
      setPendingRequests(prev => prev.filter(p => p.id !== requestId));
    }
  };

  if (!isOpen) return null;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama || !newEmail || !newPassword) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: newNama, email: newEmail, password: newPassword, adminRole: newRole })
      });
      const data = await response.json();
      if (data.success) {
        setTeamList(data.team);
        setSuccessMsg(`Berhasil membuat akun admin ${newNama}! Role: ${newRole}`);
      } else {
        // Local add fallback
        const newMember: AdminTeamMember = {
          id: `ADM-00${teamList.length + 1}`,
          email: newEmail,
          password: newPassword,
          nama: newNama,
          adminRole: newRole,
          ditambahkan: 'Hari ini',
          status: 'Aktif'
        };
        setTeamList([...teamList, newMember]);
        setSuccessMsg(`Berhasil membuat akun admin ${newNama}`);
      }
    } catch (err) {
      const newMember: AdminTeamMember = {
        id: `ADM-00${teamList.length + 1}`,
        email: newEmail,
        password: newPassword,
        nama: newNama,
        adminRole: newRole,
        ditambahkan: 'Hari ini',
        status: 'Aktif'
      };
      setTeamList([...teamList, newMember]);
      setSuccessMsg(`Berhasil membuat akun admin ${newNama}`);
    } finally {
      setIsSubmitting(false);
      setNewNama('');
      setNewEmail('');
      setNewPassword('');
      setTimeout(() => setSuccessMsg(''), 6000);
    }
  };

  const handleDeleteMember = async (id: string, nama: string) => {
    if (!window.confirm(`Hapus hak akses tim admin untuk ${nama}?`)) return;

    try {
      await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setTeamList(prev => prev.filter(m => m.id !== id));
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 my-8 space-y-6">
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
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Kelola Akses Tim Admin Portal</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                Super Admin Panel
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengaturan Hak Akses Administrator (Super Admin, Admin Presensi, & Admin Kurator Karya)
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Pending Registration Requests for Super Admin Approval */}
        {pendingRequests.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-2xl space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-700" />
                <span>Permohonan Pendaftaran Admin Baru ({pendingRequests.length})</span>
              </h3>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-3 py-1 rounded-full border border-amber-300">
                Menunggu Persetujuan
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingRequests.map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-2xl border border-amber-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm">{req.nama}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({req.email} • WA: {req.whatsapp})</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-500">Peran Diajukan:</span>
                      {getRoleBadge(req.adminRole)}
                    </div>
                    {req.alasanAccess && (
                      <div className="text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100/80 italic">
                        "{req.alasanAccess}"
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleApprovePending(req.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                    <button
                      onClick={() => handleRejectPending(req.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Admin Form */}
        <form onSubmit={handleAddMember} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-purple-700" />
              <span>Tambah Anggota Tim Admin Baru</span>
            </h3>
            <button
              type="button"
              onClick={handleGenerateRandomPassword}
              className="text-[11px] font-extrabold text-purple-800 hover:text-purple-950 bg-purple-100 hover:bg-purple-200 border border-purple-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Generate Sandi Unik</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Admin"
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Login</label>
              <input
                type="email"
                required
                placeholder="email@ruangkaryaguru.id"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Password Akses</label>
              <input
                type="text"
                required
                placeholder="Password Login Akun"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Peran / Role Status</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminRole)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-slate-800 cursor-pointer"
              >
                <option value="admin_kurator">🎨 Admin Kurator (Kurasi Karya & Rekap Presensi)</option>
                <option value="super_admin">👑 Super Admin (Akses Penuh)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Hak Akses Admin'}</span>
            </button>
          </div>
        </form>

        {/* Existing Admin Team Table */}
        <div className="space-y-3.5">
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

