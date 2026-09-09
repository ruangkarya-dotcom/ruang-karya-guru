import React from 'react';
import { ShieldCheck, Heart, Lock, ArrowRight, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import { switchToAdminPortal } from '../utils/tabNavigation';

interface FooterProps {
  onNavigateToAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdminLogin }) => {
  const handleOpenAdminPortal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const adminWindow = switchToAdminPortal('/admin/login');
    if (!adminWindow && onNavigateToAdminLogin) {
      onNavigateToAdminLogin();
    }
  };

  return (
    <footer className="bg-[#0B1120] text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Deskripsi Platform */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#0EA5E9] flex items-center justify-center text-white font-black text-sm shadow-md">
                RK
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">Ruang Karya Guru</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform resmi verifikasi, publikasi, dan apresiasi karya inovasi perangkat pembelajaran digital bagi seluruh tenaga pendidik di Indonesia.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#38BDF8] font-medium pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Sistem Terverifikasi & Terintegrasi</span>
            </div>
          </div>

          {/* Layanan Utama */}
          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs uppercase tracking-wider">Layanan Utama</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#galeri" className="hover:text-[#38BDF8] transition-colors">Galeri Modul Ajar Digital</a></li>
              <li><a href="#galeri" className="hover:text-[#38BDF8] transition-colors">Media Interaktif HTML5 & Simulasi</a></li>
              <li><a href="#galeri" className="hover:text-[#38BDF8] transition-colors">Video & Audio Podcast Edukasi</a></li>
              <li><a href="#pelatihan" className="hover:text-[#38BDF8] transition-colors">Workshop & Lokakarya Terakreditasi</a></li>
              <li><a href="#artikel" className="hover:text-[#38BDF8] transition-colors">Panduan Kurikulum Merdeka</a></li>
            </ul>
          </div>

          {/* Format Karya */}
          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs uppercase tracking-wider">Dukungan Multi-Format</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
              <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">PDF Modul</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">DOCX RPP</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">PPTX Slide</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">HTML5 Interaktif</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">MP4 Video</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">ZIP / RAR</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Semua berkas melalui pemindaian keamanan sebelum dipublikasikan.
            </p>
          </div>

          {/* Pusat Bantuan & Narahubung Resmi (Menggantikan kartu akses pengelola yang dipindah ke Header & Modal Login) */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 mb-3 text-xs uppercase tracking-wider">Bantuan & Kontak</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#38BDF8] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp Helpdesk Guru</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:admin@ruangkaryaguru.id"
                  className="flex items-center gap-2 hover:text-[#38BDF8] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>admin@ruangkaryaguru.id</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">Senin - Jumat (08.00 - 16.00 WIB)</span>
              </li>
            </ul>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Server & Kurasi Aktif</span>
              </span>
            </div>
          </div>

        </div>

        {/* Sub-Footer Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Ruang Karya Guru Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
          
          <div className="flex items-center gap-4 text-[11px]">
            <a
              id="footer-admin-portal-link"
              href="/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenAdminPortal}
              className="hover:text-amber-400 text-slate-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Portal Khusus Tim Administrator & Kurator"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Akses Admin</span>
            </a>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <span>Didedikasikan untuk pendidikan Indonesia</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

