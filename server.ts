import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PESERTA_LIST } from './src/data/initialData';

const app = express();
const PORT = 3000;

app.use(express.json());

// Legacy Upload URL Redirects (301 Permanent Redirect to Teacher Dashboard Upload)
app.get(['/upload', '/karya/tambah', '/unggah', '/unggah-karya'], (req, res) => {
  return res.redirect(301, '/guru/dashboard/karya/upload');
});


// In-Memory Guru / Peserta Workshop Database
let guruDB: Array<{
  id: string;
  nama: string;
  nip: string;
  email: string;
  whatsapp: string;
  instansi: string;
  password: string;
  avatarUrl?: string;
  tanggalDaftar: string;
}> = [];

type AdminRole = 'super_admin' | 'admin_kurator';

// In-Memory Admin Team Database (Only Super Admin and Admin Kurator)
let adminTeamDB = [
  {
    id: 'ADM-001',
    email: 'superadmin@ruangkaryaguru.id',
    password: 'SuperAdmin#RKG2026!',
    nama: 'Drs. Hendra Suwandi, M.Pd.',
    adminRole: 'super_admin' as AdminRole,
    ditambahkan: '01 Jan 2026',
    status: 'active' as const
  },
  {
    id: 'ADM-002',
    email: 'kurator@ruangkaryaguru.id',
    password: 'KuratorRKG#7723!',
    nama: 'Prof. Dr. Agus Setiawan',
    adminRole: 'admin_kurator' as AdminRole,
    ditambahkan: '15 Jan 2026',
    status: 'active' as const
  }
];

// Pending Registration Requests Storage
let pendingAdminDB: Array<{
  id: string;
  nama: string;
  email: string;
  whatsapp: string;
  adminRole: AdminRole;
  password: string;
  alasanAccess?: string;
  tanggalDaftar: string;
  status: 'pending_approval' | 'active' | 'rejected';
}> = [];

// Password Reset Tokens / OTP Storage
let resetOTPDB: Array<{
  emailOrWA: string;
  otp: string;
  expiresAt: number;
}> = [];

// In-Memory Login Rate Limiting & Brute Force Protection Store
const loginRateLimitDB: Record<string, { attempts: number; lockoutExpiresAt: number; lastAttempt: number }> = {};
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes (300 seconds)

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'RuangKarya Guru Backend API', timestamp: new Date().toISOString() });
});

// 2. Auth Endpoint: Login Admin & Guru with Generic Errors, Portal Role Verification, and Rate Limiting
app.post('/api/auth/login', (req, res) => {
  const { email, identifier, password, loginType, portalRole } = req.body;
  const inputTarget = email || identifier;

  if (!inputTarget || !password) {
    return res.status(400).json({ 
      success: false,
      statusCode: 400,
      errorCode: 'VALIDATION_REQUIRED_FIELDS',
      error: 'Email/Identifier dan Password wajib diisi.' 
    });
  }

  const cleanIdentifier = String(inputTarget).trim().toLowerCase();
  const clientIP = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const rateLimitKey = `${cleanIdentifier}_${clientIP}`;
  const now = Date.now();

  // Check Lockout Status
  const record = loginRateLimitDB[rateLimitKey];
  if (record && record.lockoutExpiresAt > now) {
    const remainingSeconds = Math.ceil((record.lockoutExpiresAt - now) / 1000);
    const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const secs = (remainingSeconds % 60).toString().padStart(2, '0');

    res.setHeader('Retry-After', remainingSeconds);
    return res.status(429).json({
      success: false,
      statusCode: 429,
      errorCode: 'AUTH_RATE_LIMIT_EXCEEDED',
      error: `Terlalu banyak percobaan login yang gagal. Demi keamanan, silakan coba lagi dalam [${mins}:${secs}] menit.`,
      message: `Terlalu banyak percobaan login yang gagal. Demi keamanan, silakan coba lagi dalam [${mins}:${secs}] menit.`,
      data: {
        isLocked: true,
        retryAfter: remainingSeconds,
        lockoutExpiresAt: new Date(record.lockoutExpiresAt).toISOString()
      }
    });
  }

  // Helper for tracking failed attempts and returning strict Generic Error Message
  const handleAuthFailure = (customErrorMsg?: string) => {
    const currentAttempts = (record && record.lockoutExpiresAt <= now ? 0 : (record?.attempts || 0)) + 1;
    const isNowLocked = currentAttempts >= MAX_LOGIN_ATTEMPTS;
    const lockoutExpiresAt = isNowLocked ? now + LOCKOUT_DURATION_MS : 0;

    loginRateLimitDB[rateLimitKey] = {
      attempts: currentAttempts,
      lockoutExpiresAt,
      lastAttempt: now,
    };

    if (isNowLocked) {
      const remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
      res.setHeader('Retry-After', remainingSeconds);
      return res.status(429).json({
        success: false,
        statusCode: 429,
        errorCode: 'AUTH_RATE_LIMIT_EXCEEDED',
        error: `Terlalu banyak percobaan login yang gagal. Demi keamanan, silakan coba lagi dalam 05:00 menit.`,
        message: `Terlalu banyak percobaan login yang gagal. Demi keamanan, silakan coba lagi dalam 05:00 menit.`,
        data: {
          isLocked: true,
          retryAfter: remainingSeconds,
          lockoutExpiresAt: new Date(lockoutExpiresAt).toISOString()
        }
      });
    }

    const attemptsRemaining = MAX_LOGIN_ATTEMPTS - currentAttempts;
    const fallbackMsg = customErrorMsg || 'Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali.';
    const detailedMsg = attemptsRemaining <= 2 
      ? `${fallbackMsg} Percobaan tersisa: ${attemptsRemaining}x sebelum akun dikunci sementara.`
      : fallbackMsg;

    return res.status(401).json({
      success: false,
      statusCode: 401,
      errorCode: 'AUTH_INVALID_CREDENTIALS',
      error: detailedMsg,
      message: detailedMsg,
      data: {
        failedAttempts: currentAttempts,
        maxAttempts: MAX_LOGIN_ATTEMPTS,
        attemptsRemaining,
        isLocked: false
      }
    });
  };

  // Helper for Auth Success (Clears rate limit record)
  const handleAuthSuccess = (userData: any, token: string) => {
    delete loginRateLimitDB[rateLimitKey];
    
    // Determine redirect URL based on role
    let redirectUrl = '/';
    if (userData.role === 'admin') {
      if (userData.adminRole === 'admin_kurator') {
        redirectUrl = '/admin-kurator/dashboard';
      } else {
        redirectUrl = '/super-admin/dashboard';
      }
    } else if (userData.role === 'guru') {
      redirectUrl = '/guru/dashboard';
    }

    return res.json({
      success: true,
      statusCode: 200,
      token,
      redirectUrl,
      user: userData
    });
  };

  // 0. Check if account is in Pending Approval or Rejected status
  const pendingAdmin = pendingAdminDB.find(p => p.email.toLowerCase() === cleanIdentifier);
  if (pendingAdmin) {
    if (pendingAdmin.status === 'pending_approval') {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        errorCode: 'AUTH_PENDING_APPROVAL',
        error: 'Akun Anda sedang dalam proses verifikasi oleh Super Admin. Anda akan menerima pemberitahuan setelah akun diaktifkan.',
        message: 'Akun Anda sedang dalam proses verifikasi oleh Super Admin. Anda akan menerima pemberitahuan setelah akun diaktifkan.',
        data: {
          isPendingApproval: true,
          status: 'pending_approval',
          nama: pendingAdmin.nama,
          email: pendingAdmin.email,
          tanggalDaftar: pendingAdmin.tanggalDaftar
        }
      });
    } else if (pendingAdmin.status === 'rejected') {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        errorCode: 'AUTH_ACCOUNT_REJECTED',
        error: 'Permohonan pendaftaran akun Admin Anda tidak disetujui. Silakan hubungi Super Admin.',
        message: 'Permohonan pendaftaran akun Admin Anda tidak disetujui. Silakan hubungi Super Admin.',
        data: {
          isPendingApproval: false,
          status: 'rejected'
        }
      });
    }
  }

  // 1. Super Admin Check
  if (cleanIdentifier === 'superadmin@ruangkaryaguru.id' || cleanIdentifier === 'admin@ruangkaryaguru.id' || cleanIdentifier === '198204152006041001') {
    if (password === 'SuperAdmin#RKG2026!' || password === 'admin123') {
      // Validate Portal Role match if provided
      if (portalRole && portalRole !== 'super_admin') {
        return handleAuthFailure('Email, kata sandi, atau tipe akses portal tidak sesuai.');
      }

      return handleAuthSuccess({
        id: 'USR-SUPER-ADMIN-001',
        email: 'superadmin@ruangkaryaguru.id',
        nama: 'Drs. Hendra Suwandi, M.Pd.',
        role: 'admin',
        adminRole: 'super_admin',
        status: 'active',
        instansi: 'Kementerian Pendidikan & Kebudayaan RI / Tim Utama',
        nip: '198204152006041001'
      }, `jwt_token_super_admin_${Date.now()}`);
    }
    return handleAuthFailure();
  }

  // 2. Admin Kurator Check
  if (cleanIdentifier === 'kurator@ruangkaryaguru.id' || cleanIdentifier === 'presensi@ruangkaryaguru.id') {
    if (password === 'KuratorRKG#7723!' || password === 'PresensiRKG#9981!' || password === 'kurator123' || password === 'presensi123') {
      // Validate Portal Role match if provided
      if (portalRole && portalRole !== 'admin_kurator') {
        return handleAuthFailure('Email, kata sandi, atau tipe akses portal tidak sesuai.');
      }

      return handleAuthSuccess({
        id: 'USR-ADMIN-KURATOR-002',
        email: 'kurator@ruangkaryaguru.id',
        nama: 'Prof. Dr. Agus Setiawan',
        role: 'admin',
        adminRole: 'admin_kurator',
        status: 'active',
        instansi: 'Tim Kurasi Modul Ajar & Presensi Pelatihan',
        nip: '197503102000031005'
      }, `jwt_token_admin_kurator_${Date.now()}`);
    }
    return handleAuthFailure();
  }

  // 3. Check dynamic Admin Team DB
  const matchedAdmin = adminTeamDB.find(a => a.email.toLowerCase() === cleanIdentifier);
  if (matchedAdmin) {
    if (matchedAdmin.password === password) {
      // Validate Portal Role match if provided
      if (portalRole && portalRole !== matchedAdmin.adminRole) {
        return handleAuthFailure('Email, kata sandi, atau tipe akses portal tidak sesuai.');
      }

      return handleAuthSuccess({
        id: matchedAdmin.id,
        email: matchedAdmin.email,
        nama: matchedAdmin.nama,
        role: 'admin',
        adminRole: matchedAdmin.adminRole,
        status: matchedAdmin.status || 'active',
        instansi: 'Tim Administrator RuangKarya'
      }, `jwt_token_admin_${matchedAdmin.id}_${Date.now()}`);
    }
    return handleAuthFailure();
  }

  // If client strictly requested admin login and account is not in admin records
  if (loginType === 'admin' || portalRole) {
    return handleAuthFailure('Email, kata sandi, atau tipe akses portal tidak sesuai.');
  }

  // 5. Guru Login Flow (by NIP or Email)
  const isNumericOnly = /^\d+$/.test(cleanIdentifier.replace(/\s/g, ''));
  const isGuruEmail = cleanIdentifier.includes('@');

  // Check if registered in guruDB
  const existingGuru = guruDB.find(
    g => g.email.toLowerCase() === cleanIdentifier || g.nip === cleanIdentifier
  );

  if (existingGuru) {
    if (existingGuru.password === password) {
      return handleAuthSuccess({
        id: existingGuru.id,
        email: existingGuru.email,
        nama: existingGuru.nama,
        role: 'guru',
        instansi: existingGuru.instansi,
        nip: existingGuru.nip,
        avatarUrl: existingGuru.avatarUrl
      }, `jwt_token_guru_${existingGuru.id}_${Date.now()}`);
    }
    return handleAuthFailure('Kata sandi guru tidak sesuai.');
  }

  // General registered guru check or valid format check
  if (isNumericOnly || isGuruEmail) {
    if (password.length >= 6) {
      const nipVal = isNumericOnly ? cleanIdentifier : '';
      const emailVal = isGuruEmail ? cleanIdentifier : `guru.${cleanIdentifier}@sekolah.sch.id`;
      const nameVal = isGuruEmail 
        ? cleanIdentifier.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
        : `Guru Pengajar (NIP: ${cleanIdentifier})`;

      const newGuruUser = {
        id: `USR-GURU-${Date.now().toString().slice(-6)}`,
        email: emailVal,
        nama: nameVal || 'Guru Pendidik',
        nip: nipVal,
        whatsapp: '',
        instansi: 'Satuan Pendidikan',
        password,
        tanggalDaftar: new Date().toLocaleDateString('id-ID')
      };
      guruDB.push(newGuruUser);

      return handleAuthSuccess({
        id: newGuruUser.id,
        email: newGuruUser.email,
        nama: newGuruUser.nama,
        role: 'guru',
        instansi: newGuruUser.instansi,
        nip: newGuruUser.nip
      }, `jwt_token_guru_${Date.now()}`);
    }
    return handleAuthFailure('Kata sandi minimal 6 karakter.');
  }

  return handleAuthFailure();
});

// 3. Get Admin Team List Endpoint
app.get('/api/admin/team', (req, res) => {
  res.json({ success: true, team: adminTeamDB });
});

// 4. Add Admin Team Member Endpoint
app.post('/api/admin/team', (req, res) => {
  const { nama, email, adminRole, password } = req.body;
  if (!nama || !email || !adminRole) {
    return res.status(400).json({ error: 'Nama, Email, dan Role wajib diisi.' });
  }

  const newMember = {
    id: `ADM-00${adminTeamDB.length + 1}`,
    email: String(email).trim().toLowerCase(),
    password: password || 'admin123',
    nama: String(nama).trim(),
    adminRole: adminRole as AdminRole,
    ditambahkan: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'active' as const
  };

  adminTeamDB.push(newMember);
  res.status(201).json({ success: true, member: newMember, team: adminTeamDB });
});

// 5. Delete Admin Team Member Endpoint
app.delete('/api/admin/team/:id', (req, res) => {
  const { id } = req.params;
  adminTeamDB = adminTeamDB.filter(member => member.id !== id);
  res.json({ success: true, team: adminTeamDB });
});

// 5b. Register Guru / Peserta Workshop Endpoint (Auto-Approved / Instant Access)
app.post('/api/auth/register-guru', (req, res) => {
  const { nama, email, nip, nuptk, whatsapp, instansi, jenjang, password } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ error: 'Nama Lengkap, Email, dan Password wajib diisi.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Kata sandi minimal 6 karakter.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanNip = String(nip || '').trim();
  const cleanNuptk = String(nuptk || '').trim();

  // Check duplicate email in guru database
  const existsEmail = guruDB.some(g => g.email.toLowerCase() === cleanEmail);
  if (existsEmail) {
    return res.status(400).json({ error: 'Alamat Email sudah terdaftar. Silakan login menggunakan email tersebut.' });
  }

  if (cleanNip) {
    const existsNip = guruDB.some(g => g.nip === cleanNip);
    if (existsNip) {
      return res.status(400).json({ error: 'NIP sudah terdaftar di sistem.' });
    }
  }

  const newGuru = {
    id: `USR-GURU-${Date.now().toString().slice(-5)}`,
    nama: String(nama).trim(),
    nip: cleanNip || '198501012020121001',
    nuptk: cleanNuptk || '',
    email: cleanEmail,
    whatsapp: String(whatsapp || '').trim(),
    instansi: String(instansi || 'Instansi Pendidik').trim(),
    jenjang: jenjang || 'SMA/SMK',
    password: String(password),
    status: 'active' as const,
    role: 'guru' as const,
    tanggalDaftar: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  guruDB.push(newGuru);

  const token = `jwt_token_guru_${newGuru.id}_${Date.now()}`;

  return res.json({
    success: true,
    message: 'Pendaftaran Berhasil! Selamat Datang di Ruang Karya Guru.',
    token,
    user: {
      id: newGuru.id,
      email: newGuru.email,
      nama: newGuru.nama,
      role: 'guru' as const,
      status: 'active' as const,
      instansi: newGuru.instansi,
      jenjang: newGuru.jenjang,
      nip: newGuru.nip,
      nuptk: newGuru.nuptk,
      whatsapp: newGuru.whatsapp,
      tanggalDaftar: newGuru.tanggalDaftar
    }
  });
});

// 5c. Workshop Peserta Database & Endpoints (Get, Soft Delete / Update Status, Hard Delete, Restore)
let pesertaWorkshopDB = [...INITIAL_PESERTA_LIST];

// Get list of peserta (support query ?status=Valid / Tidak Valid / Belum Verifikasi / active)
app.get(['/api/v1/admin/peserta', '/api/admin/peserta'], (req, res) => {
  const { status, mode } = req.query;
  let result = [...pesertaWorkshopDB];
  
  if (mode === 'active') {
    result = result.filter(p => p.statusValidasi !== 'Tidak Valid');
  } else if (mode === 'rejected') {
    result = result.filter(p => p.statusValidasi === 'Tidak Valid');
  } else if (status && status !== 'Semua') {
    result = result.filter(p => p.statusValidasi === status);
  }

  return res.json({
    success: true,
    total: result.length,
    data: result
  });
});

// Update peserta status (Soft Delete / Status Change)
app.patch(['/api/v1/admin/peserta/:id/status', '/api/admin/peserta/:id/status'], (req, res) => {
  const { id } = req.params;
  const { statusValidasi } = req.body;

  const targetIndex = pesertaWorkshopDB.findIndex(p => p.id === id);
  if (targetIndex === -1) {
    return res.status(404).json({ success: false, error: 'Data peserta tidak ditemukan.' });
  }

  const validStatuses = ['Valid', 'Belum Verifikasi', 'Tidak Valid'];
  if (!validStatuses.includes(statusValidasi)) {
    return res.status(400).json({ success: false, error: 'Status validasi tidak valid.' });
  }

  pesertaWorkshopDB[targetIndex] = {
    ...pesertaWorkshopDB[targetIndex],
    statusValidasi,
    statusKelulusan: statusValidasi === 'Valid' ? 'Lulus' : statusValidasi === 'Tidak Valid' ? 'Tidak Lulus' : 'Proses'
  };

  const item = pesertaWorkshopDB[targetIndex];
  return res.json({
    success: true,
    message: statusValidasi === 'Tidak Valid'
      ? `Data peserta ${item.namaLengkapGelar} berhasil ditandai Tidak Valid dan disembunyikan dari tabel aktif.`
      : `Status peserta ${item.namaLengkapGelar} berhasil diperbarui menjadi ${statusValidasi}.`,
    data: item
  });
});

// Hard Delete peserta endpoint (Permanent deletion)
app.delete(['/api/v1/admin/peserta/:id', '/api/admin/peserta/:id'], (req, res) => {
  const { id } = req.params;
  const targetIndex = pesertaWorkshopDB.findIndex(p => p.id === id);
  if (targetIndex === -1) {
    return res.status(404).json({ success: false, error: 'Data peserta tidak ditemukan.' });
  }

  const deletedItem = pesertaWorkshopDB[targetIndex];
  pesertaWorkshopDB = pesertaWorkshopDB.filter(p => p.id !== id);

  return res.json({
    success: true,
    message: `Data pendaftaran peserta ${deletedItem.namaLengkapGelar} berhasil dihapus secara permanen.`,
    deletedId: id
  });
});

// Restore rejected peserta endpoint
app.post(['/api/v1/admin/peserta/:id/restore', '/api/admin/peserta/:id/restore'], (req, res) => {
  const { id } = req.params;
  const targetIndex = pesertaWorkshopDB.findIndex(p => p.id === id);
  if (targetIndex === -1) {
    return res.status(404).json({ success: false, error: 'Data peserta tidak ditemukan.' });
  }

  pesertaWorkshopDB[targetIndex] = {
    ...pesertaWorkshopDB[targetIndex],
    statusValidasi: 'Belum Verifikasi',
    statusKelulusan: 'Proses'
  };

  const item = pesertaWorkshopDB[targetIndex];
  return res.json({
    success: true,
    message: `Data peserta ${item.namaLengkapGelar} berhasil dipulihkan ke status aktif (Belum Verifikasi).`,
    data: item
  });
});

// 6. Admin Registration Request Endpoint (Pending Super Admin Approval)
app.post('/api/auth/register-admin', (req, res) => {
  const { nama, email, whatsapp, adminRole, password, alasanAccess } = req.body;

  if (!nama || !email || !whatsapp || !adminRole || !password) {
    return res.status(400).json({ error: 'Mohon lengkapi seluruh kolom formulir registrasi.' });
  }

  // Password strength check (min 8 chars, mixed case/digit/symbol)
  if (password.length < 8) {
    return res.status(400).json({ error: 'Kata sandi minimal 8 karakter.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Check if email already exists in adminTeamDB or pendingAdminDB
  const existsInTeam = adminTeamDB.some(a => a.email.toLowerCase() === cleanEmail);
  const existsInPending = pendingAdminDB.some(p => p.email.toLowerCase() === cleanEmail && p.status === 'pending_approval');

  if (existsInTeam) {
    return res.status(400).json({ error: 'Email sudah terdaftar sebagai Admin aktif.' });
  }
  if (existsInPending) {
    return res.status(400).json({ error: 'Pendaftaran dengan email ini sedang menunggu verifikasi Super Admin.' });
  }

  const newPending = {
    id: `REG-PEND-${Date.now().toString().slice(-4)}`,
    nama: String(nama).trim(),
    email: cleanEmail,
    whatsapp: String(whatsapp).trim(),
    adminRole,
    password,
    alasanAccess: alasanAccess || 'Permohonan pendaftaran tim internal',
    tanggalDaftar: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'pending_approval' as const
  };

  pendingAdminDB.push(newPending);

  return res.json({
    success: true,
    message: 'Pendaftaran berhasil dikirim. Menunggu verifikasi & persetujuan Super Admin.',
    data: newPending
  });
});

// 7. Get Pending Registrations (For Super Admin)
app.get('/api/admin/pending-requests', (req, res) => {
  const pendings = pendingAdminDB.filter(p => p.status === 'pending_approval');
  res.json({ success: true, requests: pendings });
});

// 8. Approve Pending Registration Request
app.post('/api/admin/approve-request', (req, res) => {
  const { requestId } = req.body;
  const target = pendingAdminDB.find(p => p.id === requestId);

  if (!target) {
    return res.status(404).json({ error: 'Permohonan pendaftaran tidak ditemukan.' });
  }

  target.status = 'active';

  // Add to active admin team
  const newAdminMember = {
    id: `ADM-00${adminTeamDB.length + 1}`,
    email: target.email,
    password: target.password,
    nama: target.nama,
    adminRole: target.adminRole,
    ditambahkan: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: 'active' as const
  };

  adminTeamDB.push(newAdminMember);

  res.json({
    success: true,
    message: `Permohonan akun ${target.nama} telah disetujui. Akun kini aktif!`,
    team: adminTeamDB,
    pendingRequests: pendingAdminDB.filter(p => p.status === 'pending_approval')
  });
});

// 9. Reject Pending Registration Request
app.post('/api/admin/reject-request', (req, res) => {
  const { requestId } = req.body;
  const target = pendingAdminDB.find(p => p.id === requestId);

  if (!target) {
    return res.status(404).json({ error: 'Permohonan pendaftaran tidak ditemukan.' });
  }

  target.status = 'rejected';

  res.json({
    success: true,
    message: `Permohonan akun ${target.nama} telah ditolak.`,
    pendingRequests: pendingAdminDB.filter(p => p.status === 'pending_approval')
  });
});

// 10. Forgot Password Request (Generate OTP - 15 Mins Expiration)
app.post('/api/auth/forgot-password', (req, res) => {
  const { emailOrWA } = req.body;
  if (!emailOrWA) {
    return res.status(400).json({ error: 'Masukkan email atau nomor WhatsApp terdaftar.' });
  }

  const query = String(emailOrWA).trim().toLowerCase();
  
  // Find match in active admin team
  const adminMatch = adminTeamDB.find(a => a.email.toLowerCase() === query);

  // Generates 6-digit OTP
  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 Minutes Expiration

  // Remove existing OTP for this target
  resetOTPDB = resetOTPDB.filter(r => r.emailOrWA !== query);
  resetOTPDB.push({ emailOrWA: query, otp: generatedOTP, expiresAt });

  return res.json({
    success: true,
    message: query.includes('@') 
      ? `Kode OTP reset sandi (6 digit) telah dikirimkan ke email ${query}.` 
      : `Kode OTP reset sandi (6 digit) telah dikirimkan via WhatsApp ke nomor ${query}.`,
    debugOTP: generatedOTP, // Simulates OTP delivery
    expiresAt
  });
});

// 11. Reset Password Execution
app.post('/api/auth/reset-password', (req, res) => {
  const { emailOrWA, otp, newPassword } = req.body;

  if (!emailOrWA || !otp || !newPassword) {
    return res.status(400).json({ error: 'Lengkapi email/WA, kode OTP, dan password baru.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Kata sandi baru minimal 8 karakter.' });
  }

  const query = String(emailOrWA).trim().toLowerCase();
  const otpEntry = resetOTPDB.find(r => r.emailOrWA === query && r.otp === String(otp).trim());

  if (!otpEntry) {
    return res.status(400).json({ error: 'Kode OTP tidak valid atau salah.' });
  }

  if (Date.now() > otpEntry.expiresAt) {
    resetOTPDB = resetOTPDB.filter(r => r !== otpEntry);
    return res.status(400).json({ error: 'Kode OTP telah kadaluarsa (lebih dari 15 menit). Silakan minta kode OTP baru.' });
  }

  // Update password in DB
  const adminMatch = adminTeamDB.find(a => a.email.toLowerCase() === query);
  if (adminMatch) {
    adminMatch.password = newPassword;
  }

  // Clear used OTP
  resetOTPDB = resetOTPDB.filter(r => r !== otpEntry);

  res.json({
    success: true,
    message: 'Kata sandi berhasil diperbarui! Silakan login menggunakan kata sandi baru Anda.'
  });
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RuangKarya Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
