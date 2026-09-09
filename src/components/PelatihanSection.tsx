import React, { useState } from 'react';
import { Award, Calendar, Clock, Users, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { Pelatihan } from '../types';

interface PelatihanSectionProps {
  pelatihanList: Pelatihan[];
}

export const PelatihanSection: React.FC<PelatihanSectionProps> = ({ pelatihanList }) => {
  const [selectedPelatihan, setSelectedPelatihan] = useState<Pelatihan | null>(null);
  const [registered, setRegistered] = useState<string[]>([]);
  const [namaPeserta, setNamaPeserta] = useState('');
  const [emailPeserta, setEmailPeserta] = useState('');
  const [instansiPeserta, setInstansiPeserta] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPelatihan) return;
    setRegistered([...registered, selectedPelatihan.id]);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setSelectedPelatihan(null);
      setNamaPeserta('');
      setEmailPeserta('');
      setInstansiPeserta('');
    }, 2000);
  };

  return (
    <section id="pelatihan" className="py-12 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1E3A8A] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#0EA5E9]" />
            Pengembangan Profesi Kependidikan
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] tracking-tight">
            Pelatihan Guru
          </h2>
          <p className="text-xs text-slate-500">
            Tingkatkan kompetensi pedagogik, literasi digital, dan penguasaan teknologi pembelajaran melalui pelatihan bersertifikat resmi.
          </p>
        </div>

        {/* Pelatihan Cards Grid */}
        {pelatihanList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pelatihanList.map((item) => {
              const isRegistered = registered.includes(item.id);
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <img 
                        src={item.gambar} 
                        alt={item.judul}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3 left-3 bg-[#1E3A8A] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.tipe}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                        {item.judul}
                      </h3>
                      
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.deskripsi}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                          <span>{item.tanggal}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                          <span>{item.waktu}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                          <span>{item.terdaftar} / {item.kuota} Peserta Terdaftar</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    {isRegistered ? (
                      <div className="w-full bg-emerald-50 text-emerald-800 text-xs font-bold py-2 rounded-md border border-emerald-200 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Anda Sudah Terdaftar
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedPelatihan(item)}
                        className="w-full bg-[#1E3A8A] hover:bg-[#152e72] text-white text-xs font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>Daftar Pelatihan Gratis</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-blue-50 text-[#1E3A8A] rounded-full mx-auto flex items-center justify-center border border-blue-100">
              <Award className="w-6 h-6 text-[#0EA5E9]" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Belum Ada Agenda Pelatihan Aktif</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jadwal lokakarya, webinar, dan sertifikasi kompetensi guru terbaru akan segera dipublikasikan di sini.
            </p>
          </div>
        )}

        {/* Modal Registration */}
        {selectedPelatihan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl relative border border-slate-200">
              <button
                onClick={() => setSelectedPelatihan(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              {successMessage ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Pendaftaran Berhasil!</h3>
                  <p className="text-xs text-slate-600">
                    Tautan Zoom & E-Sertifikat akan dikirimkan ke email terdaftar sebelum jadwal pelaksanaan.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0EA5E9]">Form Pendaftaran Event</span>
                    <h3 className="font-bold text-slate-900 text-base leading-tight mt-0.5">
                      {selectedPelatihan.judul}
                    </h3>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Dra. Nurhayati, M.Pd."
                        value={namaPeserta}
                        onChange={(e) => setNamaPeserta(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-md px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Aktif</label>
                      <input
                        type="email"
                        required
                        placeholder="nama@sekolah.sch.id"
                        value={emailPeserta}
                        onChange={(e) => setEmailPeserta(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-md px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Instansi / Sekolah / NIP</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: SMA Negeri 1 Bandung"
                        value={instansiPeserta}
                        onChange={(e) => setInstansiPeserta(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-md px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold py-2.5 rounded-md text-xs transition-colors shadow-sm"
                      >
                        Konfirmasi Pendaftaran
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

