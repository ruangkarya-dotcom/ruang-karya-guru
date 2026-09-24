import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InfoHomeSection } from './components/InfoHomeSection';
import { GaleriKarya } from './components/GaleriKarya';
import { DetailKaryaModal } from './components/DetailKaryaModal';
import { PelatihanSection } from './components/PelatihanSection';
import { ArtikelSection } from './components/ArtikelSection';
import { LoginModal } from './components/LoginModal';
import { UploadModal } from './components/UploadModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginPage } from './components/AdminLoginPage';
import { GuruDashboard } from './components/GuruDashboard';
import { GuruProfilePage, TeacherProfileData } from './components/GuruProfilePage';
import { AdminProfilePage } from './components/AdminProfilePage';
import { DownloadOptionsModal } from './components/DownloadOptionsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  INITIAL_KARYA_LIST, 
  INITIAL_PELATIHAN_LIST, 
  INITIAL_ARTIKEL_LIST, 
  MONTHLY_TREND_DATA, 
  FILE_FORMAT_DISTRIBUTION,
  DEFAULT_OFFICIAL_MASTER_TEMPLATES
} from './data/initialData';
import { Karya, User, VerificationStatus, Review, AdminRole } from './types';
import { exportSingleKarya, ExportFormat } from './utils/excelExport';
import { ShieldCheck, Eye, ArrowRight, X, AlertTriangle, CheckCircle2, GraduationCap, School } from 'lucide-react';
import { initializeTabName } from './utils/tabNavigation';

export default function App() {
  // Navigation State (supports 'home' | 'galeri' | 'pelatihan' | 'artikel' | 'admin' | 'guru' | 'login-admin' | 'profil-guru' | 'profil-admin')
  const [activeTab, setActiveTab] = useState<'home' | 'galeri' | 'pelatihan' | 'artikel' | 'admin' | 'guru' | 'login-admin' | 'profil-guru' | 'profil-admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/login-admin' || path === '/admin/login' || path === '/admin-login') {
        return 'login-admin';
      }
      if (path === '/admin-kurator/dashboard' || path === '/super-admin/dashboard' || path === '/admin') {
        return 'admin';
      }
      if (path === '/profil-admin' || path === '/admin/profil' || path === '/admin-profil') {
        return 'profil-admin';
      }
    }
    return 'home';
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacherProfile, setSelectedTeacherProfile] = useState<TeacherProfileData | null>(null);

  // Admin Preview Mode State (Allows Admin to preview public site)
  const [isAdminPreviewMode, setIsAdminPreviewMode] = useState<boolean>(false);
  const [showAdminRestrictedNotice, setShowAdminRestrictedNotice] = useState<boolean>(false);

  // LocalStorage-backed State for Karya List (includes official master templates + user uploaded works)
  const [karyaList, setKaryaList] = useState<Karya[]>(() => {
    try {
      const saved = localStorage.getItem('rkg_karya_list');
      let currentItems: Karya[] = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If legacy 11 items or 4975 downloads are detected, reset to empty
          if (parsed.length === 11 && parsed.reduce((sum: number, item: Karya) => sum + (item.jumlahDownload || 0), 0) === 4975) {
            currentItems = [];
          } else {
            currentItems = parsed;
          }
        }
      }

      // Always ensure official master templates are present
      const combined = [...currentItems];
      for (const def of DEFAULT_OFFICIAL_MASTER_TEMPLATES) {
        if (!combined.some(item => item.id === def.id || item.judul.toLowerCase() === def.judul.toLowerCase())) {
          combined.push(def);
        }
      }
      return combined;
    } catch (e) {
      console.error(e);
      return DEFAULT_OFFICIAL_MASTER_TEMPLATES;
    }
  });

  // LocalStorage-backed Auth User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('rkg_current_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Modal Controls
  const [selectedKaryaForDetail, setSelectedKaryaForDetail] = useState<Karya | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialMode, setLoginModalInitialMode] = useState<'login' | 'register'>('login');
  const [loginModalCustomMessage, setLoginModalCustomMessage] = useState<string | undefined>(undefined);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [guruDashboardSubTab, setGuruDashboardSubTab] = useState<'pelatihan' | 'karya' | 'laporan' | 'pengaturan'>('pelatihan');
  const [guruAutoOpenUpload, setGuruAutoOpenUpload] = useState<boolean>(false);
  const [karyaForDownloadModal, setKaryaForDownloadModal] = useState<Karya | null>(null);
  const [toastNotification, setToastNotification] = useState<{ title: string; message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    setToastNotification({ title, message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 5000);
  };

  const handleOpenLogin = () => {
    if (activeTab === 'login-admin') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('focus-admin-login'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setLoginModalInitialMode('login');
    setLoginModalCustomMessage(undefined);
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setLoginModalInitialMode('register');
    setLoginModalCustomMessage(undefined);
    setIsLoginModalOpen(true);
  };

  // Check initial URL pathname for routes (/register-guru, /login, /galeri-karya, /admin/login, /admin-kurator/dashboard, /super-admin/dashboard, legacy upload routes)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const isAdminRoute = path.includes('admin') || currentUser?.role === 'admin';
      initializeTabName(isAdminRoute);

      const isLegacyUploadPath = path === '/upload' || path === '/karya/tambah' || path === '/unggah' || path === '/unggah-karya' || path.startsWith('/guru/dashboard/karya/upload');

      if (path === '/admin/login' || path === '/login-admin' || path === '/admin-login') {
        setActiveTab('login-admin');
      } else if (path === '/admin-kurator/dashboard' || path === '/admin-kurator') {
        if (currentUser?.role === 'admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('login-admin');
        }
      } else if (path === '/super-admin/dashboard' || path === '/super-admin') {
        if (currentUser?.role === 'admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('login-admin');
        }
      } else if (path === '/register-guru' || path === '/daftar-guru' || path === '/daftar') {
        if (!currentUser) {
          setLoginModalInitialMode('register');
          setIsLoginModalOpen(true);
        }
      } else if (path === '/login' || path === '/masuk') {
        if (!currentUser) {
          setLoginModalInitialMode('login');
          setIsLoginModalOpen(true);
        }
      } else if (path === '/galeri-karya' || path === '/galeri') {
        setActiveTab('galeri');
      } else if (path === '/pelatihan') {
        setActiveTab('pelatihan');
      } else if (path === '/artikel' || path === '/tentang-kami') {
        setActiveTab('artikel');
      } else if (isLegacyUploadPath) {
        if (!currentUser) {
          // Unauthenticated visitor trying to access upload URL -> Show login with custom message & redirect to clean path
          setLoginModalCustomMessage('Silakan login terlebih dahulu untuk mengunggah karya.');
          setLoginModalInitialMode('login');
          setIsLoginModalOpen(true);
          window.history.replaceState(null, '', '/');
          setActiveTab('galeri');
        } else if (currentUser.role === 'guru') {
          // Logged in teacher -> Open Teacher Dashboard upload tab
          setActiveTab('guru');
          setGuruDashboardSubTab('karya');
          setGuruAutoOpenUpload(true);
          window.history.replaceState(null, '', '/guru/dashboard/karya/upload');
          showToast('Ruang Karya Guru', 'Selamat datang di Ruang Pengunggahan Karya Guru.', 'info');
        } else if (currentUser.role === 'admin') {
          setActiveTab('admin');
          window.history.replaceState(null, '', currentUser.adminRole === 'admin_kurator' ? '/admin-kurator/dashboard' : '/super-admin/dashboard');
        }
      }
    }
  }, [currentUser]);

  // Sync URL Path with activeTab & Role
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeTab === 'login-admin') {
        window.history.replaceState(null, '', '/admin/login');
      } else if (activeTab === 'admin' && currentUser?.role === 'admin') {
        if (currentUser.adminRole === 'admin_kurator') {
          window.history.replaceState(null, '', '/admin-kurator/dashboard');
        } else {
          window.history.replaceState(null, '', '/super-admin/dashboard');
        }
      } else if (activeTab === 'guru' && guruAutoOpenUpload) {
        window.history.replaceState(null, '', '/guru/dashboard/karya/upload');
      } else if ((window.location.pathname === '/login-admin' || window.location.pathname === '/admin/login') && (activeTab as string) !== 'login-admin') {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [activeTab, currentUser, guruAutoOpenUpload]);


  // Enforce Admin Workflow Isolation:
  // If user is Admin and NOT in preview mode, keep them on 'admin' tab
  useEffect(() => {
    if (currentUser?.role === 'admin' && !isAdminPreviewMode && activeTab !== 'admin') {
      setActiveTab('admin');
    }
  }, [currentUser, isAdminPreviewMode, activeTab]);

  // Enforce Guru Workflow Isolation:
  // Halaman Beranda & Jelajah Karya dihapus khusus untuk akun guru, jika aktif arahkan ke dashboard guru
  useEffect(() => {
    const isGuruAccount = Boolean(currentUser && currentUser.role !== 'admin');
    if (isGuruAccount && (activeTab === 'home' || activeTab === 'galeri')) {
      setActiveTab('guru');
    }
  }, [currentUser, activeTab]);

  // Purge legacy 11 mock items if detected in state
  useEffect(() => {
    if (karyaList.length === 11 && karyaList.reduce((sum, item) => sum + (item.jumlahDownload || 0), 0) === 4975) {
      setKaryaList([]);
      try {
        localStorage.setItem('rkg_karya_list', JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
    }
  }, [karyaList]);

  // Sync Karya List to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('rkg_karya_list', JSON.stringify(karyaList));
    } catch (e) {
      console.error(e);
    }
  }, [karyaList]);

  // Sync Current User to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('rkg_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('rkg_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user: User, destinationTab?: 'home' | 'galeri' | 'pelatihan' | 'artikel' | 'admin' | 'guru' | 'login-admin' | 'profil-guru') => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    if (destinationTab) {
      setActiveTab(destinationTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (user.role === 'admin') {
      setIsAdminPreviewMode(false);
      setActiveTab('admin');
    } else if (user.role === 'guru') {
      setActiveTab('guru');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminPreviewMode(false);
    if (activeTab === 'admin' || activeTab === 'guru' || activeTab === 'login-admin') {
      setActiveTab('home');
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleSwitchRole = (newAdminRole: AdminRole) => {
    if (!currentUser) return;

    let name = 'Drs. Hendra Suwandi, M.Pd.';
    let email = 'superadmin@ruangkaryaguru.id';
    let instansi = 'Kementerian Pendidikan & Kebudayaan RI / Tim Utama';

    if (newAdminRole === 'admin_kurator') {
      name = 'Prof. Dr. Agus Setiawan';
      email = 'kurator@ruangkaryaguru.id';
      instansi = 'Tim Kurasi Modul Ajar & Presensi Pelatihan';
    }

    const updatedUser: User = {
      ...currentUser,
      role: 'admin',
      adminRole: newAdminRole,
      nama: name,
      email,
      instansi,
    };

    setCurrentUser(updatedUser);
    setIsAdminPreviewMode(false);
    if (activeTab !== 'admin') {
      setActiveTab('admin');
    }
  };

  const handleToggleAdminPreview = () => {
    if (isAdminPreviewMode) {
      // Exit preview mode back to admin
      setIsAdminPreviewMode(false);
      setActiveTab('admin');
    } else {
      // Enter preview mode on home
      setIsAdminPreviewMode(true);
      setActiveTab('home');
    }
  };

  // Upload trigger with authentication check requirement
  const handleOpenUpload = () => {
    if (!currentUser) {
      setLoginModalCustomMessage('Silakan login terlebih dahulu untuk mengunggah karya.');
      setIsLoginModalOpen(true);
      return;
    }
    setIsUploadModalOpen(true);
  };


  // Karya Handlers
  const handleUploadSuccess = (newKarya: Karya) => {
    setKaryaList([newKarya, ...karyaList]);
    if (newKarya.isMasterTemplate) {
      showToast(
        'Publikasi Berhasil',
        'Template Karya Panduan berhasil diterbitkan dan kini dapat diakses oleh seluruh peserta.',
        'success'
      );
    } else if (newKarya.status === 'Pending') {
      showToast(
        'Unggah Karya Berhasil',
        'Karya Anda berhasil diunggah dan sedang dalam antrean verifikasi tim kurator.',
        'info'
      );
    } else {
      showToast(
        'Unggah Berhasil',
        'Karya berhasil diunggah dan langsung dipublikasikan ke repositori!',
        'success'
      );
    }
  };

  const handleDownloadKarya = (id: string, directFormat?: ExportFormat) => {
    const target = karyaList.find(k => k.id === id) || DEFAULT_OFFICIAL_MASTER_TEMPLATES.find(k => k.id === id);
    if (!target) return;

    if (directFormat) {
      setKaryaList(prev => prev.map(item => item.id === id ? { ...item, jumlahDownload: item.jumlahDownload + 1 } : item));
      exportSingleKarya(target, directFormat);
    } else {
      setKaryaForDownloadModal(target);
    }
  };

  const handleConfirmDownloadFormat = (id: string, format: ExportFormat) => {
    const targetKarya = karyaList.find(k => k.id === id) || DEFAULT_OFFICIAL_MASTER_TEMPLATES.find(k => k.id === id);
    setKaryaList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, jumlahDownload: item.jumlahDownload + 1 };
      }
      return item;
    }));
    if (targetKarya) {
      exportSingleKarya(targetKarya, format);
      showToast('Unduhan Berhasil', `File "${targetKarya.judul}" berhasil diunduh dalam format ${format}.`, 'success');
    }
  };

  const handleUpdateStatus = (id: string, newStatus: VerificationStatus) => {
    setKaryaList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleDeleteKarya = (id: string) => {
    setKaryaList(prev => prev.filter(item => item.id !== id));
    if (selectedKaryaForDetail?.id === id) {
      setSelectedKaryaForDetail(null);
    }
    showToast(
      'Karya Berhasil Dihapus',
      'Data karya pembelajaran telah berhasil dihapus dari repositori.',
      'info'
    );
  };

  const handleDeleteAllKarya = () => {
    const total = karyaList.length;
    setKaryaList([]);
    if (selectedKaryaForDetail) {
      setSelectedKaryaForDetail(null);
    }
    showToast(
      'Semua Karya Berhasil Dihapus',
      `Seluruh data karya pembelajaran (${total} karya) telah dibersihkan dari repositori.`,
      'info'
    );
  };

  const handleDeleteBatchKarya = (ids: string[]) => {
    setKaryaList(prev => prev.filter(item => !ids.includes(item.id)));
    if (selectedKaryaForDetail && ids.includes(selectedKaryaForDetail.id)) {
      setSelectedKaryaForDetail(null);
    }
    showToast(
      'Karya Terpilih Berhasil Dihapus',
      `Sebanyak ${ids.length} karya pembelajaran telah berhasil dihapus.`,
      'info'
    );
  };

  const handleSelectKaryaForDetail = (karya: Karya) => {
    // Increment view count
    setKaryaList(prev => prev.map(item => {
      if (item.id === karya.id) {
        return { ...item, jumlahView: item.jumlahView + 1 };
      }
      return item;
    }));
    setSelectedKaryaForDetail(karya);
  };

  const handleAddReview = (karyaId: string, review: Review) => {
    setKaryaList(prev => prev.map(item => {
      if (item.id === karyaId) {
        const existingReviews = item.reviews || [];
        return { ...item, reviews: [review, ...existingReviews] };
      }
      return item;
    }));
    if (selectedKaryaForDetail && selectedKaryaForDetail.id === karyaId) {
      setSelectedKaryaForDetail(prev => prev ? {
        ...prev,
        reviews: [review, ...(prev.reviews || [])]
      } : null);
    }
  };

  const handleOpenTeacherProfile = (target?: TeacherProfileData | Karya) => {
    if (!target) {
      setSelectedTeacherProfile(null);
    } else if ('judul' in target) {
      setSelectedTeacherProfile({
        nama: target.namaGuru,
        instansi: target.nipOrInstansi,
        jenjang: target.jenjang,
        faseMengajar: target.fase,
        mataPelajaranUtama: target.mataPelajaran,
      });
    } else {
      setSelectedTeacherProfile(target);
    }
    setSelectedKaryaForDetail(null);
    setActiveTab('profil-guru');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalVerifiedKarya = karyaList.filter(k => k.status === 'Disetujui').length;
  const totalDownloadsSum = karyaList.reduce((a, b) => a + b.jumlahDownload, 0);
  const isAdminLoginView = activeTab === 'login-admin' || (activeTab === 'admin' && currentUser?.role !== 'admin');

  return (
    <div className={`min-h-screen flex flex-col ${isAdminLoginView ? 'bg-[#0B1120] text-slate-100' : 'bg-[#F8FAFC] text-[#0F172A]'} font-sans selection:bg-[#0EA5E9] selection:text-white transition-colors`}>
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (currentUser?.role === 'admin') {
            if (tab === 'admin') {
              setIsAdminPreviewMode(false);
            } else {
              setIsAdminPreviewMode(true);
            }
          }
          setActiveTab(tab);
        }}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onOpenUpload={handleOpenUpload}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSwitchRole={handleSwitchRole}
        isAdminPreviewMode={isAdminPreviewMode}
        onToggleAdminPreview={handleToggleAdminPreview}
        onShowAdminRestrictedNotice={() => setShowAdminRestrictedNotice(true)}
      />

      {/* Main Views Container */}
      <main className="flex-1 overflow-x-hidden relative">
        <ErrorBoundary onReset={() => setActiveTab('home')}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="transform-gpu"
            >
            {/* VIEW 1: HOME / BERANDA (Dihapus khusus akun guru) */}
            {activeTab === 'home' && (!currentUser || currentUser.role === 'admin') && (
              <InfoHomeSection
                onNavigateTab={(tab) => {
                  if (currentUser?.role === 'admin' && !isAdminPreviewMode && tab !== 'admin') {
                    setShowAdminRestrictedNotice(true);
                    return;
                  }
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                totalKarya={totalVerifiedKarya}
                totalDownloads={totalDownloadsSum}
                currentUser={currentUser}
                karyaList={karyaList}
                onSelectKarya={handleSelectKaryaForDetail}
                onOpenUpload={handleOpenUpload}
                onDownloadKarya={handleDownloadKarya}
                onViewTeacherProfile={handleOpenTeacherProfile}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {/* VIEW 2: GALERI KARYA GURU */}
            {activeTab === 'galeri' && (
              <GaleriKarya
                karyaList={karyaList}
                onSelectKarya={handleSelectKaryaForDetail}
                onDownloadKarya={handleDownloadKarya}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onOpenUpload={handleOpenUpload}
                currentUser={currentUser}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                onViewTeacherProfile={handleOpenTeacherProfile}
              />
            )}

            {/* VIEW 3: PELATIHAN GURU */}
            {activeTab === 'pelatihan' && (
              <PelatihanSection pelatihanList={INITIAL_PELATIHAN_LIST} />
            )}

            {/* VIEW 4: ARTIKEL & EDUKASI */}
            {activeTab === 'artikel' && (
              <ArtikelSection artikelList={INITIAL_ARTIKEL_LIST} />
            )}

            {/* VIEW 5: GURU DASHBOARD (Dedicated Guru Workspace) */}
            {activeTab === 'guru' && (
              currentUser ? (
                <GuruDashboard
                  currentUser={currentUser}
                  karyaList={karyaList}
                  initialSubTab={guruDashboardSubTab}
                  autoOpenUpload={guruAutoOpenUpload}
                  onUploadKarya={handleUploadSuccess}
                  onUpdateUser={handleUpdateUser}
                  onSelectKaryaForPreview={handleSelectKaryaForDetail}
                  onDeleteKarya={handleDeleteKarya}
                  onDownloadKarya={handleDownloadKarya}
                  onViewPublicProfile={() => handleOpenTeacherProfile()}
                  onOpenUploadModal={handleOpenUpload}
                />
              ) : (
                <div className="max-w-xl mx-auto my-16 px-4">
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#1E3A8A] flex items-center justify-center mx-auto shadow-sm">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Portal Dashboard Guru
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                        Silakan masuk dengan akun Pendidik / Guru Anda untuk mengelola modul ajar, memeriksa sertifikat 32 JP, dan mengakses portofolio digital.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => handleOpenLogin()}
                        className="w-full sm:w-auto px-6 py-3 bg-[#1E3A8A] hover:bg-blue-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Masuk ke Akun Guru</span>
                      </button>
                      <button
                        onClick={() => handleOpenRegister()}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                      >
                        Daftar Akun Guru
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* VIEW 6: BERANDA PROFIL GURU (PUBLIC / OWNER DIGITAL PORTFOLIO) */}
            {activeTab === 'profil-guru' && (
              <GuruProfilePage
                profileData={selectedTeacherProfile || {
                  nama: 'Dra. Sri Wahyuni, M.Pd.',
                  gelar: 'M.Pd.',
                  instansi: 'SMA Negeri 1 Jakarta',
                  jenjang: 'SMA/SMK',
                  faseMengajar: 'Fase F (Kelas 11-12)',
                  mataPelajaranUtama: 'Matematika Tingkat Lanjut',
                  nip: '197805122002122003',
                  email: 'sri.wahyuni@sman1jkt.sch.id',
                  noWhatsapp: '081298765432',
                  kabupatenKota: 'Kota Jakarta Pusat, DKI Jakarta'
                }}
                currentUser={currentUser}
                karyaList={karyaList}
                onSelectKarya={handleSelectKaryaForDetail}
                onDownloadKarya={handleDownloadKarya}
                onOpenUploadModal={handleOpenUpload}
                onNavigateToDashboard={() => {
                  setActiveTab('guru');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateBack={() => {
                  setActiveTab('galeri');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onUpdateCurrentUserProfile={handleUpdateUser}
                onShowToast={showToast}
              />
            )}

            {/* VIEW 7: LOGIN ADMIN PAGE (/login-admin) */}
            {activeTab === 'login-admin' && (
              <AdminLoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => setActiveTab('home')}
              />
            )}

            {/* VIEW 8: ADMIN DASHBOARD */}
            {activeTab === 'admin' && (
              currentUser?.role === 'admin' ? (
                <AdminDashboard
                  karyaList={karyaList}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteKarya={handleDeleteKarya}
                  onDeleteAllKarya={handleDeleteAllKarya}
                  onDeleteBatchKarya={handleDeleteBatchKarya}
                  onSelectKaryaForPreview={handleSelectKaryaForDetail}
                  monthlyData={MONTHLY_TREND_DATA}
                  formatDistributionData={FILE_FORMAT_DISTRIBUTION}
                  onOpenUploadModal={handleOpenUpload}
                  currentUser={currentUser}
                  onSwitchRole={handleSwitchRole}
                  onNavigateToAdminProfile={() => {
                    setActiveTab('profil-admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <AdminLoginPage
                  onLoginSuccess={handleLoginSuccess}
                  onNavigateHome={() => setActiveTab('home')}
                />
              )
            )}

            {/* VIEW 9: PORTOFOLIO ADMINISTRATOR / KURATOR */}
            {activeTab === 'profil-admin' && (
              <AdminProfilePage
                currentUser={currentUser}
                karyaList={karyaList}
                onSelectKarya={handleSelectKaryaForDetail}
                onDownloadKarya={handleDownloadKarya}
                onOpenUploadModal={handleOpenUpload}
                onNavigateToDashboard={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateBack={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onShowToast={showToast}
                onUpdateCurrentUserProfile={handleUpdateUser}
              />
            )}
          </motion.div>
        </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* Footer only on Home / Beranda (Dihapus khusus akun guru) */}
      {activeTab === 'home' && (!currentUser || currentUser.role === 'admin') && (
        <Footer
          onNavigateToAdminLogin={() => {
            setActiveTab('login-admin');
            if (typeof window !== 'undefined') {
              window.history.pushState(null, '', '/admin/login');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* MODALS */}
      <DetailKaryaModal
        karya={selectedKaryaForDetail}
        onClose={() => setSelectedKaryaForDetail(null)}
        onDownload={handleDownloadKarya}
        currentUser={currentUser}
        onAddReview={handleAddReview}
        onViewTeacherProfile={handleOpenTeacherProfile}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        initialMode={loginModalInitialMode}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginModalCustomMessage(undefined);
          if (typeof window !== 'undefined') {
            const p = window.location.pathname.toLowerCase();
            if (p === '/login' || p === '/register-guru' || p === '/daftar-guru' || p === '/masuk') {
              const cleanPath = activeTab === 'galeri' ? '/galeri-karya' : (activeTab === 'home' ? '/' : `/${activeTab}`);
              window.history.replaceState(null, '', cleanPath);
            }
          }
        }}
        onLoginSuccess={(user, destinationTab) => {
          setLoginModalCustomMessage(undefined);
          handleLoginSuccess(user, destinationTab as any);
        }}
        onShowToast={showToast}
        customMessage={loginModalCustomMessage}
      />


      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        currentUser={currentUser}
      />

      <DownloadOptionsModal
        karya={karyaForDownloadModal}
        isOpen={!!karyaForDownloadModal}
        onClose={() => setKaryaForDownloadModal(null)}
        onConfirmDownload={handleConfirmDownloadFormat}
      />

      {/* SYSTEM TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-5 right-5 z-[9999] max-w-md w-full p-4 rounded-2xl bg-white shadow-2xl border border-slate-200 flex items-start gap-3.5"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${toastNotification.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs font-black text-slate-900">{toastNotification.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{toastNotification.message}</p>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN RESTRICTED NOTICE MODAL */}
      <AnimatePresence>
        {showAdminRestrictedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs border border-amber-300">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Moda Operasional Admin Aktif
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Anda sedang dalam <strong>Moda Admin</strong>. Halaman publik disesuaikan untuk mengoptimalkan ruang kerja dan tata kelola Anda.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setShowAdminRestrictedNotice(false);
                    setIsAdminPreviewMode(true);
                    setActiveTab('home');
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>Buka Mode Pratinjau Pengunjung</span>
                </button>

                <button
                  onClick={() => {
                    setShowAdminRestrictedNotice(false);
                    setActiveTab('admin');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Tetap di Dashboard Admin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
