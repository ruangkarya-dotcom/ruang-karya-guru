import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '../assets/images/ruang_karya_guru_new_logo_1786451613174.jpg';
import { 
  GraduationCap, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  FileText, 
  FolderCheck,
  Menu,
  X,
  UserCheck,
  Sparkles,
  Eye,
  ArrowLeft,
  LayoutDashboard,
  Bell,
  AlertTriangle,
  Lock,
  Users,
  Globe,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { User, AdminRole } from '../types';
import { switchToPublicPortal, switchToAdminPortal } from '../utils/tabNavigation';

interface HeaderProps {
  activeTab: 'home' | 'galeri' | 'pelatihan' | 'artikel' | 'admin' | 'guru' | 'login-admin' | 'profil-guru' | 'profil-admin';
  setActiveTab: (tab: 'home' | 'galeri' | 'pelatihan' | 'artikel' | 'admin' | 'guru' | 'login-admin' | 'profil-guru' | 'profil-admin') => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
  onOpenUpload?: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSwitchRole?: (role: AdminRole) => void;
  isAdminPreviewMode: boolean;
  onToggleAdminPreview: () => void;
  onShowAdminRestrictedNotice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onOpenUpload,
  onLogout,
  onSwitchRole,
  isAdminPreviewMode,
  onToggleAdminPreview,
  onShowAdminRestrictedNotice,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isGuru = Boolean(currentUser && (currentUser.role === 'guru' || currentUser.role !== 'admin'));
  const isAdminLoginTab = activeTab === 'login-admin' || (activeTab === 'admin' && !isAdmin);

  const handleNavClick = (tab: 'home' | 'galeri' | 'pelatihan' | 'artikel' | 'admin' | 'guru' | 'profil-guru' | 'profil-admin' | 'login-admin') => {
    if (isAdmin) {
      if (tab === 'admin') {
        if (isAdminPreviewMode) onToggleAdminPreview();
        setActiveTab('admin');
      } else if (tab === 'profil-admin') {
        setActiveTab('profil-admin');
      } else {
        if (!isAdminPreviewMode) onToggleAdminPreview();
        setActiveTab(tab);
      }
      setMobileMenuOpen(false);
      return;
    }
    if (isGuru && (tab === 'home' || tab === 'galeri')) {
      setActiveTab('guru');
      setMobileMenuOpen(false);
      return;
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    if (isAdminLoginTab) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('focus-admin-login'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      onOpenLogin();
      if (typeof window !== 'undefined') window.history.pushState(null, '', '/login');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 ${isAdminLoginTab ? 'bg-[#0B1120] border-b border-slate-800/80 text-white' : 'bg-white border-b border-slate-200 text-slate-800'} shadow-sm transition-colors`}>
      {/* 1. REGULAR TOP BANNER (Accent bar on top as shown in brand design) */}
      <div className={`h-1.5 w-full ${isAdminLoginTab ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-amber-500' : 'bg-[#1E3A8A]'}`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-2.5 min-h-[4.25rem]">
          
          {/* ZONA KIRI: LOGO & BRAND */}
          <div 
            onClick={() => {
              if (isAdmin && !isAdminPreviewMode) {
                setActiveTab('admin');
              } else if (isGuru) {
                setActiveTab('guru');
              } else if (isAdminLoginTab) {
                setActiveTab('login-admin');
              } else {
                handleNavClick('galeri');
              }
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border ${isAdminLoginTab ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'} shadow-2xs group-hover:scale-105 transition-transform shrink-0 p-1 flex items-center justify-center`}>
              <img 
                src={logoImage} 
                alt="Logo Ruang Karya" 
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`font-extrabold text-lg sm:text-xl tracking-tight ${isAdminLoginTab ? 'text-white' : 'text-[#1E3A8A]'}`}>
                  Ruang<span className="text-[#0EA5E9]">Karya</span>
                </span>
                <span className={`${isAdminLoginTab ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-sky-50 text-[#0EA5E9] border-sky-200'} text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider shrink-0`}>
                  {isAdminLoginTab ? 'PORTAL ADMIN' : (isAdmin ? 'ADMIN PANEL' : (isGuru ? 'GURU' : 'RESMI'))}
                </span>
              </div>
              <span className={`text-[10px] sm:text-[11px] ${isAdminLoginTab ? 'text-slate-400' : 'text-slate-500'} font-medium leading-none mt-1`}>
                {isAdminLoginTab || isAdmin ? 'Tata Kelola & Kurasi Nasional' : 'Portal Integrasi & Kurasi Karya Guru'}
              </span>
            </div>
          </div>

          {/* ZONA TENGAH: DUAL TAB SWITCHER (ADMIN) ATAU MENU NAVIGASI (Pengunjung/Guru) */}
          {isAdminLoginTab ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-2 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Portal Otentikasi Administrator Sistem</span>
              </div>
            </div>
          ) : isAdmin ? (
            /* NAVIGASI UTAMA PORTAL ADMIN: Portofolio Admin & Ke Tab Guru */
            <div className="hidden md:flex items-center gap-2.5">
              {/* TOMBOL PORTOFOLIO ADMIN */}
              <button
                id="btn-admin-ke-portofolio"
                onClick={() => setActiveTab('profil-admin')}
                title="Buka Portofolio Digital Tim Administrator & Kurator Nasional"
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'profil-admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Portofolio Admin</span>
              </button>

              {/* TOMBOL KE TAB GURU */}
              <button
                id="btn-admin-ke-tab-guru"
                onClick={() => switchToPublicPortal('/', false)}
                title="Pindah fokus ke Tab Guru (Ruang Karya Guru) di browser tanpa menutup Tab Admin"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] border border-blue-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span className="text-base leading-none">🏫</span>
                <span>Tab Guru</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600 opacity-80" />
              </button>
            </div>
          ) : (
            /* Public Desktop Navigation */
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {!isGuru && (
                <button
                  onClick={() => handleNavClick('home')}
                  className={`px-3.5 py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 rounded-md cursor-pointer ${
                    activeTab === 'home' 
                      ? 'text-[#1E3A8A] bg-blue-50/80 border-b-2 border-[#1E3A8A]' 
                      : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Beranda
                </button>
              )}

              {!isGuru && (
                <button
                  onClick={() => handleNavClick('galeri')}
                  className={`px-3.5 py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 rounded-md cursor-pointer ${
                    activeTab === 'galeri' 
                      ? 'text-[#1E3A8A] bg-blue-50/80 border-b-2 border-[#1E3A8A]' 
                      : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50'
                  }`}
                >
                  <FolderCheck className="w-4 h-4" />
                  Jelajah Karya
                </button>
              )}

              <button
                onClick={() => handleNavClick('pelatihan')}
                className={`px-3.5 py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 rounded-md cursor-pointer ${
                  activeTab === 'pelatihan' 
                    ? 'text-[#1E3A8A] bg-blue-50/80 border-b-2 border-[#1E3A8A]' 
                    : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4" />
                Agenda Pelatihan
              </button>

              <button
                onClick={() => handleNavClick('artikel')}
                className={`px-3.5 py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 rounded-md cursor-pointer ${
                  activeTab === 'artikel' 
                    ? 'text-[#1E3A8A] bg-blue-50/80 border-b-2 border-[#1E3A8A]' 
                    : 'text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                Tentang Kami
              </button>

              {/* Dashboard Guru Nav (When logged in as Guru) */}
              {isGuru && (
                <div className="flex items-center gap-1.5 ml-1">
                  <button
                    onClick={() => setActiveTab('guru')}
                    className={`px-3.5 py-2 text-sm font-extrabold transition-colors flex items-center gap-1.5 rounded-xl shadow-2xs cursor-pointer ${
                      activeTab === 'guru' 
                        ? 'text-white bg-blue-900 shadow-sm' 
                        : 'text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Dashboard Guru</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profil-guru')}
                    className={`px-3 py-2 text-sm font-bold transition-colors flex items-center gap-1.5 rounded-xl cursor-pointer ${
                      activeTab === 'profil-guru' 
                        ? 'text-blue-900 bg-blue-100 font-extrabold border border-blue-300' 
                        : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
                    }`}
                    title="Lihat Tampilan Portofolio Digital Guru"
                  >
                    <UserIcon className="w-4 h-4 text-blue-800" />
                    <span>Portofolio</span>
                  </button>
                </div>
              )}
            </nav>
          )}

          {/* ZONA KANAN: USER PROFILE & ACTIONS */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => {
                    if (isAdmin) {
                      if (isAdminPreviewMode) onToggleAdminPreview();
                      setActiveTab('admin');
                    } else {
                      setActiveTab('guru');
                    }
                  }}
                  className="flex items-center gap-2.5 text-left cursor-pointer group px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 text-[#1E3A8A] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.nama} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.nama.charAt(0)
                    )}
                  </div>
                  <div className="text-xs leading-tight">
                    <p className="font-bold text-slate-800 group-hover:text-[#1E3A8A] transition-colors max-w-[160px] truncate">
                      {currentUser.nama}
                    </p>
                    <span className="text-[10px] text-[#0EA5E9] uppercase tracking-wider font-extrabold block mt-0.5">
                      {isAdmin ? `ADMIN (${(currentUser.adminRole || 'SUPER_ADMIN').toUpperCase()})` : 'GURU PEMBELAJAR'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Keluar / Logout"
                  className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isAdminLoginTab ? (
              /* TAB KHUSUS ADMIN: Tombol di header dihapus sesuai permintaan user */
              null
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-header-admin-portal"
                  onClick={(e) => {
                    e.preventDefault();
                    const adminWindow = switchToAdminPortal('/admin/login');
                    if (!adminWindow) {
                      setActiveTab('login-admin');
                      if (typeof window !== 'undefined') window.history.pushState(null, '', '/admin/login');
                    }
                  }}
                  title="Akses Portal Khusus Tim Pengelola & Administrator Sistem"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1E3A8A] bg-slate-50 hover:bg-blue-50/80 px-3 py-2 rounded-xl border border-slate-200 hover:border-blue-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Portal Admin</span>
                </button>
                <button
                  id="btn-header-public-login"
                  onClick={handleLoginClick}
                  className="text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-100 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  id="btn-header-public-register"
                  onClick={() => {
                    if (onOpenRegister) {
                      onOpenRegister();
                    } else {
                      onOpenLogin();
                    }
                    if (typeof window !== 'undefined') window.history.pushState(null, '', '/register-guru');
                  }}
                  className="bg-[#1E3A8A] hover:bg-[#152e72] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-900/15 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  <GraduationCap className="w-4 h-4 text-cyan-300" />
                  <span>Daftar Akun Guru</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button (Hidden during admin login to keep header clean without buttons) */}
          {!isAdminLoginTab && (
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 hover:text-[#1E3A8A] p-2 rounded-xl hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 overflow-hidden transform-gpu"
          >
            <nav className="flex flex-col space-y-1">
              
              {isAdminLoginTab ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="text-xs font-black text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>Portal Otentikasi Administrator</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Gunakan kredensial resmi tim pengelola untuk mengakses dashboard.
                  </p>
                </div>
              ) : isAdmin ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-extrabold text-xs">Portal Administrator</span>
                    </div>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {currentUser.adminRole === 'admin_kurator' ? 'Kurator' : 'Super Admin'}
                    </span>
                  </div>
                  
                  {/* TOMBOL NAVIGASI ADMIN MOBILE */}
                  <button
                    id="btn-mobile-admin-ke-portofolio"
                    onClick={() => {
                      setActiveTab('profil-admin');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between shadow-xs cursor-pointer font-extrabold text-xs transition-all ${
                      activeTab === 'profil-admin'
                        ? 'bg-amber-500 text-slate-950 border-amber-600'
                        : 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Portofolio Digital Administrator</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-80" />
                  </button>

                  <button
                    id="btn-mobile-admin-ke-tab-guru"
                    onClick={() => {
                      switchToPublicPortal('/', false);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full p-3.5 rounded-2xl border border-blue-200 bg-blue-50/90 text-[#1E3A8A] font-extrabold text-xs flex items-center justify-between shadow-xs cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏫</span>
                      <span>Tab Guru</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </div>
              ) : (
                <>
                  {!isGuru && (
                    <button
                      onClick={() => handleNavClick('home')}
                      className={`px-3 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-2 ${
                        activeTab === 'home' ? 'bg-blue-50 text-[#1E3A8A] font-bold' : 'text-slate-700'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-cyan-600" />
                      <span>Beranda</span>
                    </button>
                  )}
                  {!isGuru && (
                    <button
                      onClick={() => handleNavClick('galeri')}
                      className={`px-3 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-2 ${
                        activeTab === 'galeri' ? 'bg-blue-50 text-[#1E3A8A] font-bold' : 'text-slate-700'
                      }`}
                    >
                      <FolderCheck className="w-4 h-4 text-blue-600" />
                      <span>Jelajah Karya</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleNavClick('pelatihan')}
                    className={`px-3 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-2 ${
                      activeTab === 'pelatihan' ? 'bg-blue-50 text-[#1E3A8A] font-bold' : 'text-slate-700'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Agenda Pelatihan</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('artikel')}
                    className={`px-3 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-2 ${
                      activeTab === 'artikel' ? 'bg-blue-50 text-[#1E3A8A] font-bold' : 'text-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>Tentang Kami</span>
                  </button>
                  {isGuru && (
                    <>
                      <button
                        onClick={() => {
                          setActiveTab('guru');
                          setMobileMenuOpen(false);
                        }}
                        className="px-3 py-2.5 rounded-xl text-left text-sm font-bold bg-blue-900 text-white flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Dashboard Guru (Saya)</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('profil-guru');
                          setMobileMenuOpen(false);
                        }}
                        className="px-3 py-2.5 rounded-xl text-left text-sm font-bold bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-blue-800" />
                        <span>Portofolio Profil Guru</span>
                      </button>
                    </>
                  )}
                </>
              )}

            </nav>

            <div className="pt-3 border-t border-slate-200 flex flex-col space-y-2">
              {currentUser ? (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1E3A8A] font-bold flex items-center justify-center text-sm overflow-hidden shrink-0">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.nama} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.nama.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{currentUser.nama}</p>
                      <p className="text-xs text-[#0EA5E9] uppercase font-extrabold">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-600 hover:text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : isAdminLoginTab ? (
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-[#1E3A8A] hover:bg-[#152e72] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Masuk Dashboard Admin</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleLoginClick}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-600" />
                      <span>Masuk</span>
                    </button>
                    <button
                      onClick={() => {
                        if (onOpenRegister) {
                          onOpenRegister();
                        } else {
                          onOpenLogin();
                        }
                        setMobileMenuOpen(false);
                        if (typeof window !== 'undefined') window.history.pushState(null, '', '/register-guru');
                      }}
                      className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/20"
                    >
                      <GraduationCap className="w-4 h-4 text-cyan-300" />
                      <span>Daftar Akun</span>
                    </button>
                  </div>
                  
                  <button
                    id="btn-mobile-admin-portal"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      const adminWin = switchToAdminPortal('/admin/login');
                      if (!adminWin) {
                        setActiveTab('login-admin');
                      }
                    }}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-50 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Portal Akses Pengelola / Admin</span>
                    </div>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-extrabold">Khusus Tim</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

