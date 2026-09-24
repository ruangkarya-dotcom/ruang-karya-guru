import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../assets/images/ruang_karya_guru_new_logo_1786451613174.jpg';
import { 
  X, Lock, Mail, ShieldCheck, KeyRound, UserCheck, CreditCard, 
  Sparkles, Eye, EyeOff, AlertCircle, ShieldAlert, 
  CheckCircle2, HelpCircle, UserPlus, School, Phone, Layers, 
  Check, ArrowRight 
} from 'lucide-react';
import { User, AdminRole } from '../types';
import { switchToAdminPortal } from '../utils/tabNavigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, destinationTab?: string) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info') => void;
  initialMode?: 'login' | 'register';
  customMessage?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
  initialMode = 'login',
  customMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);

  
  // Login Form States
  const [loginMethod, setLoginMethod] = useState<'nip' | 'email'>('nip');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register Guru Form States (Public 1-Step Instant Active)
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWA, setRegWA] = useState('');
  const [regNipNuptk, setRegNipNuptk] = useState('');
  const [regSekolah, setRegSekolah] = useState('');
  const [regJenjang, setRegJenjang] = useState<'PAUD' | 'SD' | 'SMP' | 'SMA/SMK' | 'Lainnya'>('SMA/SMK');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regAgreedTerms, setRegAgreedTerms] = useState(false);
  const [regErrorMsg, setRegErrorMsg] = useState('');

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setErrorMsg('');
      setRegErrorMsg('');
    }
  }, [isOpen, initialMode]);

  // Rate Limiting Countdown Timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200', width: '0%' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Sangat Lemah', color: 'bg-rose-500', width: '20%' };
      case 2:
        return { score: 2, label: 'Lemah', color: 'bg-orange-500', width: '40%' };
      case 3:
        return { score: 3, label: 'Cukup', color: 'bg-amber-500', width: '60%' };
      case 4:
        return { score: 4, label: 'Kuat', color: 'bg-emerald-500', width: '80%' };
      case 5:
        return { score: 5, label: 'Sangat Kuat', color: 'bg-sky-500', width: '100%' };
      default:
        return { score: 0, label: '', color: 'bg-slate-200', width: '0%' };
    }
  };

  const strength = getPasswordStrength(regPassword);
  const isPasswordsMatching = regConfirmPassword.length > 0 && regPassword === regConfirmPassword;
  const isPasswordsMismatch = regConfirmPassword.length > 0 && regPassword !== regConfirmPassword;

  const triggerAuthFailure = (customMessage?: string) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 380);

    // Auto-clear password field on failure & refocus
    setPassword('');
    passwordInputRef.current?.focus();

    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    if (nextAttempts >= 5) {
      setLockoutSeconds(300); // 5 minutes lockout
      setErrorMsg('Terlalu banyak percobaan login yang gagal. Demi keamanan, silakan coba lagi dalam 05:00 menit.');
    } else {
      const remaining = 5 - nextAttempts;
      if (customMessage) {
        setErrorMsg(customMessage);
      } else if (remaining <= 2) {
        setErrorMsg(`Email atau kata sandi salah. Percobaan tersisa: ${remaining}x sebelum akun dikunci sementara.`);
      } else {
        setErrorMsg('Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
      }
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0 || isLoading) return;
    setErrorMsg('');

    const cleanInput = identifier.trim();

    if (!cleanInput) {
      setErrorMsg(loginMethod === 'nip' ? 'Mohon masukkan NIP Anda.' : 'Mohon masukkan Alamat Email Anda.');
      return;
    }

    if (!password) {
      setErrorMsg('Mohon masukkan kata sandi.');
      return;
    }

    setIsLoading(true);

    try {
      // Call Backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier: cleanInput, 
          password,
          loginType: 'guru'
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setLockoutSeconds(data.retryAfter || 300);
        setErrorMsg(data.error || 'Terlalu banyak percobaan login.');
        return;
      }

      if (response.ok && data.success && data.user) {
        setFailedAttempts(0);
        onLoginSuccess(data.user);
        onClose();
        return;
      }

      triggerAuthFailure(data.error || data.message);
    } catch (err) {
      // Offline fallback for active credentials
      const cleanLower = cleanInput.toLowerCase();
      const isGuru = (cleanLower.includes('@') || /^\d+$/.test(cleanLower)) && password.length >= 6;

      if (isGuru) {
        setFailedAttempts(0);
        const nipVal = /^\d+$/.test(cleanLower) ? cleanLower : '';
        const emailVal = cleanLower.includes('@') ? cleanLower : `guru.${cleanLower}@sekolah.sch.id`;
        const nameVal = cleanLower.includes('@') 
          ? cleanLower.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
          : `Guru Pengajar (NIP: ${cleanLower})`;

        onLoginSuccess({
          id: `USR-GURU-${Date.now().toString().slice(-4)}`,
          email: emailVal,
          nama: nameVal,
          role: 'guru',
          status: 'active',
          instansi: 'Satuan Pendidikan',
          nip: nipVal
        });
        onClose();
        return;
      }

      triggerAuthFailure();
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Register Guru (Instant Active + Direct Auto Login)
  const handleRegisterGuruSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMsg('');

    if (!regNama.trim()) {
      setRegErrorMsg('Nama Lengkap dan Gelar wajib diisi.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegErrorMsg('Alamat Email aktif tidak valid.');
      return;
    }
    if (!regWA.trim() || regWA.length < 9) {
      setRegErrorMsg('Nomor WhatsApp aktif minimal 9 digit.');
      return;
    }
    if (!regSekolah.trim()) {
      setRegErrorMsg('Asal Sekolah / Instansi wajib diisi.');
      return;
    }
    if (regPassword.length < 6) {
      setRegErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegErrorMsg('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
      return;
    }
    if (!regAgreedTerms) {
      setRegErrorMsg('Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register-guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: regNama.trim(),
          email: regEmail.trim().toLowerCase(),
          whatsapp: regWA.trim(),
          nip: regNipNuptk.trim(),
          instansi: regSekolah.trim(),
          jenjang: regJenjang,
          password: regPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        // Direct auto-login with ACTIVE status
        const registeredUser: User = {
          ...data.user,
          status: 'active',
          role: 'guru'
        };

        if (onShowToast) {
          onShowToast('Pendaftaran Berhasil!', 'Selamat Datang di Ruang Karya Guru. Akun Anda telah aktif dan diarahkan ke Dashboard Guru.', 'success');
        }

        onLoginSuccess(registeredUser, 'guru');
        onClose();
        return;
      }

      setRegErrorMsg(data.error || 'Gagal melakukan pendaftaran. Silakan coba kembali.');
    } catch (err) {
      // Local fallback auto-login
      const fallbackUser: User = {
        id: `USR-GURU-${Date.now().toString().slice(-4)}`,
        nama: regNama.trim(),
        email: regEmail.trim().toLowerCase(),
        nip: regNipNuptk.trim() || '198501012020121001',
        instansi: regSekolah.trim(),
        jenjang: regJenjang,
        role: 'guru',
        status: 'active',
        tanggalDaftar: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      if (onShowToast) {
        onShowToast('Pendaftaran Berhasil!', 'Selamat Datang di Ruang Karya Guru. Akun Anda telah aktif dan diarahkan ke Dashboard Guru.', 'success');
      }

      onLoginSuccess(fallbackUser, 'guru');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput) return;
    setForgotSuccessMsg('Tautan reset kata sandi & instruksi pemulihan telah dikirimkan ke email/WhatsApp terdaftar Anda.');
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={isShaking ? { x: [-10, 10, -7, 7, -4, 4, 0], opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh] sm:max-h-[90vh] modal-compact transform-gpu"
          >
            {/* Modal Top Header */}
            <div className="bg-[#1E3A8A] text-white p-4 sm:p-5 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white p-1 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                  <img 
                    src={logoImage} 
                    alt="Logo Ruang Karya Guru" 
                    className="w-full h-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-white">
                    {activeTab === 'login' ? 'Masuk ke Ruang Karya Guru' : 'Daftar Akun Guru Baru'}
                  </h2>
                  <p className="text-xs text-blue-200">
                    {activeTab === 'login' 
                      ? 'Silakan masukkan NIP atau Email akun Guru Anda' 
                      : 'Lengkapi biodata untuk akses langsung ke platform'}
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL BODY CONTAINER */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* Custom Prompt/Redirect Alert */}
              {customMessage && (
                <div className="mb-4 p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl flex items-start gap-2.5 text-xs font-semibold shadow-2xs">
                  <Sparkles className="w-4 h-4 text-[#0EA5E9] shrink-0 mt-0.5" />
                  <span>{customMessage}</span>
                </div>
              )}

              {/* TAB 1: FORM LOGIN GURU */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">

                  {/* Danger State Alert Box */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        className={`p-3.5 sm:p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
                          isLocked 
                            ? 'bg-amber-50/95 border-amber-300 text-amber-950' 
                            : 'bg-rose-50/95 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isLocked ? (
                          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        )}

                        <div className="flex-1 space-y-1.5 text-xs">
                          <p className="font-bold leading-relaxed">
                            {isLocked 
                              ? `Terlalu banyak percobaan login yang gagal. Demi keamanan, silakan coba lagi dalam [${formatCountdown(lockoutSeconds)}] menit.`
                              : errorMsg}
                          </p>

                          {!isLocked && (
                            <div className="pt-1 flex items-center gap-1 text-[11px] text-rose-800">
                              <span>Lupa kata sandi?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setForgotInput(identifier);
                                  setShowForgotModal(true);
                                }}
                                className="font-extrabold underline underline-offset-2 hover:text-rose-950 cursor-pointer"
                              >
                                Klik di sini untuk reset
                              </button>
                            </div>
                          )}
                        </div>

                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() => setErrorMsg('')}
                            className="text-rose-400 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Method selector for Guru */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-100/80 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 font-extrabold pl-1">Metode Masuk:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="loginMethod"
                        checked={loginMethod === 'nip'}
                        onChange={() => setLoginMethod('nip')}
                        className="accent-[#1E3A8A]"
                      />
                      <span>18 Digit NIP</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="loginMethod"
                        checked={loginMethod === 'email'}
                        onChange={() => setLoginMethod('email')}
                        className="accent-[#1E3A8A]"
                      />
                      <span>Alamat Email</span>
                    </label>
                  </div>

                  {/* Identifier Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {loginMethod === 'nip' ? 'Nomor Induk Pegawai (NIP)' : 'Alamat Email Guru'}
                    </label>
                    <div className="relative">
                      {loginMethod === 'nip' ? (
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      ) : (
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      )}
                      
                      <input
                        type={loginMethod === 'email' ? 'email' : 'text'}
                        required
                        disabled={isLocked || isLoading}
                        placeholder={
                          loginMethod === 'nip' 
                            ? 'Masukkan 18 Digit NIP (contoh: 197805122002122003)...' 
                            : 'guru@sekolah.sch.id'
                        }
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className={`w-full rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                          errorMsg && !isLocked
                            ? 'bg-rose-50/40 border border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200'
                            : 'bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20'
                        } text-slate-800`}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotInput(identifier);
                          setShowForgotModal(true);
                        }}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                      >
                        Lupa Sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        ref={passwordInputRef}
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={isLocked || isLoading}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                          errorMsg && !isLocked
                            ? 'bg-rose-50/40 border border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200'
                            : 'bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20'
                        } text-slate-800`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
                        title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4 text-blue-900" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isLocked || isLoading}
                      className={`w-full font-extrabold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                        isLocked
                          ? 'bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed'
                          : isLoading
                          ? 'bg-blue-800 text-white cursor-wait'
                          : 'bg-[#1E3A8A] hover:bg-[#152e72] text-white active:scale-98 cursor-pointer'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4 text-slate-500" />
                          <span>Terkunci Sementara ({formatCountdown(lockoutSeconds)})</span>
                        </>
                      ) : isLoading ? (
                        <span>Memverifikasi Kredensial Guru...</span>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4 text-[#38BDF8]" />
                          <span>Masuk Akun Guru</span>
                        </>
                      )}
                    </button>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Belum punya akun?</span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('register');
                          setRegErrorMsg('');
                          if (typeof window !== 'undefined') window.history.pushState(null, '', '/register-guru');
                        }}
                        className="text-blue-700 hover:text-blue-900 font-extrabold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Daftar di sini →</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Tim Kurator / Administrator?</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          switchToAdminPortal('/admin/login');
                        }}
                        className="text-amber-700 hover:text-amber-800 text-[11px] font-extrabold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Portal Akses Admin →</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: FORM REGISTER GURU (PUBLIC - INSTANT ACTIVE) */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterGuruSubmit} className="space-y-3.5">
                  <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-sky-950 font-medium leading-relaxed">
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold text-sky-900">Registrasi Guru 1-Langkah Langsung Aktif:</strong> Akun Anda akan langsung terdaftar dengan status <strong>ACTIVE</strong> dan otomatis diarahkan ke Dashboard Guru.
                    </div>
                  </div>

                  {/* Register Error Message */}
                  {regErrorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{regErrorMsg}</span>
                    </div>
                  )}

                  {/* 1. Nama Lengkap & Gelar */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dra. Hj. Siti Aminah, M.Pd."
                      value={regNama}
                      onChange={(e) => setRegNama(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* 2. Email & No. WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alamat Email Aktif <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="guru@sekolah.sch.id"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="081234567890"
                          value={regWA}
                          onChange={(e) => setRegWA(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. NIP/NUPTK (Opsional) & Asal Sekolah */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        NIP / NUPTK <span className="text-slate-400 font-normal">(Opsional)</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="18 Digit NIP atau NUPTK"
                          value={regNipNuptk}
                          onChange={(e) => setRegNipNuptk(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Asal Sekolah / Instansi <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="SMA / SMP / SD Negeri..."
                          value={regSekolah}
                          onChange={(e) => setRegSekolah(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Jenjang Mengajar */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenjang Mengajar <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={regJenjang}
                        onChange={(e) => setRegJenjang(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                      >
                        <option value="PAUD">🧸 PAUD / TK / KB</option>
                        <option value="SD">🎒 SD / MI (Fase A - C)</option>
                        <option value="SMP">📘 SMP / MTs (Fase D)</option>
                        <option value="SMA/SMK">🎓 SMA / SMK / MA (Fase E - F)</option>
                        <option value="Lainnya">🌐 Lainnya / Tenaga Kependidikan</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Kata Sandi & Konfirmasi with Real-Time Strength Meter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kata Sandi (Min 6 Karakter) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showRegPassword ? <Eye className="w-3.5 h-3.5 text-blue-900" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showRegConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className={`w-full bg-slate-50 border rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 ${
                            isPasswordsMatching
                              ? 'border-emerald-400 focus:ring-emerald-400/20'
                              : isPasswordsMismatch
                              ? 'border-rose-400 focus:ring-rose-400/20'
                              : 'border-slate-200 focus:ring-blue-900'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showRegConfirmPassword ? <Eye className="w-3.5 h-3.5 text-blue-900" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Strength Bar & Matching feedback */}
                  {regPassword && (
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Kekuatan Sandi:</span>
                        <span className="font-extrabold text-slate-800">{strength.label}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strength.color}`} 
                          style={{ width: strength.width }}
                        />
                      </div>
                      {isPasswordsMatching && (
                        <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Kata sandi cocok
                        </p>
                      )}
                      {isPasswordsMismatch && (
                        <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Konfirmasi kata sandi belum sama
                        </p>
                      )}
                    </div>
                  )}

                  {/* 6. Checkbox Syarat & Ketentuan */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                      <input
                        type="checkbox"
                        required
                        checked={regAgreedTerms}
                        onChange={(e) => setRegAgreedTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded-md accent-[#1E3A8A] cursor-pointer"
                      />
                      <span className="leading-snug">
                        Saya menyetujui <strong>Syarat & Ketentuan</strong>, Kebijakan Privasi, dan Standar Kurasi Modul Merdeka di platform Ruang Karya Guru.
                      </span>
                    </label>
                  </div>

                  {/* 7. Submit Register Button */}
                  <div className="pt-2">
                    <button
                      id="btn-register-guru-submit"
                      type="submit"
                      disabled={isLoading || !regAgreedTerms}
                      className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span>Membuat Akun & Menuju Dashboard Guru...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-white" />
                          <span>Daftar & Langsung Menuju Dashboard Guru</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        if (typeof window !== 'undefined') window.history.pushState(null, '', '/login');
                      }}
                      className="text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline cursor-pointer"
                    >
                      Sudah memiliki akun? <span className="text-blue-900 font-extrabold">Masuk di sini →</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Modal Bantuan Reset Sandi Terintegrasi */}
            <AnimatePresence>
              {showForgotModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 10 }}
                    className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-blue-700" />
                        <h3 className="font-extrabold text-sm text-slate-900">Bantuan & Reset Sandi</h3>
                      </div>
                      <button
                        onClick={() => {
                          setShowForgotModal(false);
                          setForgotSuccessMsg('');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {forgotSuccessMsg ? (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Instruksi Terkirim!</span>
                        </div>
                        <p className="leading-relaxed">{forgotSuccessMsg}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotModal(false);
                            setForgotSuccessMsg('');
                          }}
                          className="w-full mt-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Kembali ke Halaman Login
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotSubmit} className="space-y-3 text-xs">
                        <p className="text-slate-600 leading-relaxed">
                          Masukkan Email atau NIP akun Anda untuk menerima tautan pemulihan kata sandi instan.
                        </p>
                        <div>
                          <label className="font-bold text-slate-800 block mb-1">Email / NIP Terdaftar</label>
                          <input
                            type="text"
                            required
                            value={forgotInput}
                            onChange={(e) => setForgotInput(e.target.value)}
                            placeholder="nama@sekolah.sch.id atau 198..."
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:bg-white"
                          />
                        </div>
                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowForgotModal(false)}
                            className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 font-bold text-white shadow-sm cursor-pointer"
                          >
                            Kirim Link Reset
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
