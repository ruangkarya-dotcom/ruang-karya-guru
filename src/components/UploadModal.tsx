import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  CheckCircle2, 
  Sparkles,
  Info,
  FolderPlus,
  Globe,
  Lock,
  Link2,
  Bookmark,
  Layers,
  Tag
} from 'lucide-react';
import { Karya, FileFormat, CategoryType, User } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (karya: Karya) => void;
  currentUser: User | null;
  mode?: 'master_template' | 'karya_guru';
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  currentUser,
  mode,
}) => {
  const isAdminMode = mode === 'master_template' || currentUser?.role === 'admin';

  // Form States
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [petunjukPenggunaan, setPetunjukPenggunaan] = useState('');
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState('');
  
  // 1. Metadata & Kategori Spesifik
  const [mataPelajaran, setMataPelajaran] = useState(isAdminMode ? 'Umum/Semua Mapel' : 'Matematika');
  const [fase, setFase] = useState('Semua Fase');
  const [jenjang, setJenjang] = useState<'SD' | 'SMP' | 'SMA/SMK' | 'Umum'>('SMA/SMK');
  const [kategori, setKategori] = useState<CategoryType>('Modul Ajar / RPP');
  const [trainingTopic, setTrainingTopic] = useState('Modul Ajar AI & Kurikulum Merdeka');

  // 2. Link Eksternal & Aset Digital
  const [externalLink, setExternalLink] = useState('');

  // 3. Kontrol Versi & Pengaitan Kegiatan
  const [version, setVersion] = useState('v1.0');
  const [batchProgram, setBatchProgram] = useState('Workshop AI Batch 3 - 2026');

  // Instruktur & Visibilitas
  const [namaGuru, setNamaGuru] = useState(
    isAdminMode 
      ? (currentUser?.nama ? `${currentUser.nama} (Tim Instruktur & Pusdiklat)` : 'Tim Instruktur Pusdiklat') 
      : (currentUser?.nama || '')
  );
  const [nipOrInstansi, setNipOrInstansi] = useState(
    isAdminMode
      ? (currentUser?.instansi || 'Pusat Kurikulum & Pelatihan Guru Kemendikbudristek')
      : (currentUser?.nip ? `NIP. ${currentUser.nip} / ${currentUser.instansi}` : (currentUser?.instansi || ''))
  );
  const [visibility, setVisibility] = useState<'public' | 'internal'>('public');

  // File states
  const [formatFile, setFormatFile] = useState<FileFormat>(isAdminMode ? 'DOCX' : 'PDF');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.8 MB');
  const [fileDragActive, setFileDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Auto-detect size
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeInMB} MB`);

      // Auto-detect format extension
      const ext = file.name.split('.').pop()?.toUpperCase();
      if (ext === 'PDF') setFormatFile('PDF');
      else if (ext === 'DOC' || ext === 'DOCX') setFormatFile('DOCX');
      else if (ext === 'PPT' || ext === 'PPTX') setFormatFile('PPTX');
      else if (ext === 'MP4' || ext === 'MOV' || ext === 'AVI') setFormatFile('MP4');
      else if (ext === 'MP3' || ext === 'WAV') setFormatFile('MP3');
      else if (ext === 'HTML' || ext === 'HTM' || ext === 'ZIP') {
        if (ext === 'ZIP') setFormatFile('ZIP');
        else setFormatFile('HTML5');
      } else if (ext === 'XLS' || ext === 'XLSX') {
        setFormatFile('DOCX');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !deskripsi || !namaGuru) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const initialStatus = isAdminMode ? 'Disetujui' : 'Pending';

      const newKarya: Karya = {
        id: isAdminMode ? `TMPL-MASTER-${Date.now().toString().slice(-4)}` : `KRG-2026-${Math.floor(100 + Math.random() * 900)}`,
        judul,
        deskripsi,
        tujuanPembelajaran: tujuanPembelajaran || (isAdminMode ? 'Sebagai template acuan resmi peserta workshop dalam menyusun karya portofolio.' : ''),
        namaGuru,
        nipOrInstansi: nipOrInstansi || (isAdminMode ? 'Tim Instruktur Nasional' : 'Instansi Terdaftar'),
        mataPelajaran,
        jenjang,
        kategori,
        formatFile,
        ukuranFile: fileSize || '3.2 MB',
        tanggalUpload: new Date().toISOString().slice(0, 10),
        status: initialStatus,
        jumlahDownload: isAdminMode ? 12 : 0,
        jumlahView: isAdminMode ? 45 : 1,
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isMasterTemplate: isAdminMode,
        visibility: visibility,
        petunjukPenggunaan: petunjukPenggunaan || (isAdminMode ? 'Gunakan template ini sebagai format baku acuan portofolio Anda.' : undefined),
        trainingTopic: trainingTopic,
        fase: fase,
        externalLink: externalLink.trim() || undefined,
        version: version.trim() || 'v1.0',
        batchProgram: batchProgram,
      };

      onUploadSuccess(newKarya);
      setIsSubmitting(false);
      onClose();

      // Reset fields
      setJudul('');
      setDeskripsi('');
      setPetunjukPenggunaan('');
      setFileName('');
      setExternalLink('');
    }, 600);
  };

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
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl relative border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] modal-compact transform-gpu"
          >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${isAdminMode ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'bg-blue-600 text-white'} flex items-center justify-center font-bold shrink-0`}>
              {isAdminMode ? <FolderPlus className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-sm sm:text-base leading-tight">
                  {isAdminMode ? 'Unggah Template Master / Karya Panduan Resmi' : 'Form Unggah Karya & Perangkat Ajar Guru'}
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                {isAdminMode 
                  ? 'Unggah dokumen referensi, format baku modul ajar, dan panduan LKPD resmi untuk diunduh guru peserta.'
                  : 'Dukungan Berbagai Format File Pembelajaran Digital (PDF, DOCX, PPTX, HTML5, Video)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          <div className="bg-blue-50/90 border border-blue-200/90 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-[11px] sm:text-xs text-blue-950">
                {isAdminMode ? 'Publikasi Master Template Workshop (32 JP):' : 'Ketentuan Verifikasi Karya:'}
              </p>
              <p className="text-[10px] sm:text-[11px] text-blue-800 leading-normal mt-0.5">
                {isAdminMode 
                  ? 'Template resmi ini akan langsung diterbitkan dan disinkronkan ke Dashboard Guru pada sub-seksi "Bahan Ajar & Template Resmi".'
                  : 'Karya yang diunggah akan ditinjau terlebih dahulu oleh tim verifikator/admin sebelum tampil di galeri publik.'}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            
            {/* Judul Template / Karya */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                {isAdminMode ? 'Judul Template / Karya Panduan Resmi *' : 'Judul Karya / Perangkat Ajar *'}
              </label>
              <input
                type="text"
                required
                placeholder={isAdminMode ? 'Contoh: Template Master Modul Ajar AI Kurikulum Merdeka (Fase E & F)' : 'Contoh: Modul Ajar Fisika Interaktif: Simulasi Gelombang HTML5'}
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-2xs"
              />
            </div>

            {/* Topik Pelatihan & Jenjang Sasaran */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  {isAdminMode ? 'Kategori / Topik Pelatihan *' : 'Kategori Perangkat *'}
                </label>
                <select
                  value={isAdminMode ? trainingTopic : kategori}
                  onChange={(e) => {
                    if (isAdminMode) {
                      setTrainingTopic(e.target.value);
                      if (e.target.value.includes('LKPD')) setKategori('Lembar Kerja (LKPD)');
                      else if (e.target.value.includes('Media')) setKategori('Presentasi / PPT');
                      else setKategori('Modul Ajar / RPP');
                    } else {
                      setKategori(e.target.value as CategoryType);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 shadow-2xs cursor-pointer"
                >
                  {isAdminMode ? (
                    <>
                      <option value="Modul Ajar AI & Kurikulum Merdeka">Modul Ajar AI & Kurikulum Merdeka</option>
                      <option value="RPP Berdiferensiasi & P5">RPP Berdiferensiasi & P5</option>
                      <option value="Media Pembelajaran Interaktif (HTML5/Canva)">Media Pembelajaran Interaktif (HTML5/Canva)</option>
                      <option value="Format LKPD & Asesmen Diagnostik">Format LKPD & Asesmen Diagnostik</option>
                      <option value="Panduan Teknis Pelatihan (32 JP)">Panduan Teknis Pelatihan (32 JP)</option>
                      <option value="Bank Soal & Asesmen Otentik">Bank Soal & Asesmen Otentik</option>
                    </>
                  ) : (
                    <>
                      <option value="Modul Ajar / RPP">Modul Ajar / RPP</option>
                      <option value="Media Interaktif (HTML5)">Media Interaktif (HTML5)</option>
                      <option value="Video Pembelajaran">Video Pembelajaran</option>
                      <option value="Lembar Kerja (LKPD)">Lembar Kerja (LKPD)</option>
                      <option value="Bank Soal & Asesmen">Bank Soal & Asesmen</option>
                      <option value="Presentasi / PPT">Presentasi / PPT</option>
                      <option value="E-Book & Panduan">E-Book & Panduan</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Jenjang Sasaran *</label>
                <select
                  value={jenjang}
                  onChange={(e) => setJenjang(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-blue-600 text-slate-800 shadow-2xs cursor-pointer"
                >
                  <option value="SD">SD / MI</option>
                  <option value="SMP">SMP / MTs</option>
                  <option value="SMA/SMK">SMA / SMK / MA</option>
                  <option value="Umum">Umum / Semua Jenjang</option>
                </select>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 1. METADATA & KATEGORI SPESIFIK (Mapel & Fase Merdeka)  */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mata Pelajaran / Mapel *</span>
                </label>
                <select
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 text-slate-800 shadow-2xs cursor-pointer"
                >
                  <option value="Umum/Semua Mapel">Umum/Semua Mapel</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Matematika">Matematika</option>
                  <option value="IPA">IPA (Ilmu Pengetahuan Alam)</option>
                  <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                  <option value="Seni & Budaya">Seni & Budaya</option>
                  <option value="PJOK">PJOK</option>
                  <option value="Informatika">Informatika</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Fase / Kelas (Kurikulum Merdeka) *</span>
                </label>
                <select
                  value={fase}
                  onChange={(e) => setFase(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 text-slate-800 shadow-2xs cursor-pointer"
                >
                  <option value="Semua Fase">Semua Fase</option>
                  <option value="PAUD/TK">PAUD / Fondasi</option>
                  <option value="Fase A (Kelas 1-2)">Fase A (Kelas 1-2 SD)</option>
                  <option value="Fase B (Kelas 3-4)">Fase B (Kelas 3-4 SD)</option>
                  <option value="Fase C (Kelas 5-6)">Fase C (Kelas 5-6 SD)</option>
                  <option value="Fase D (Kelas 7-9)">Fase D (Kelas 7-9 SMP)</option>
                  <option value="Fase E (Kelas 10)">Fase E (Kelas 10 SMA/SMK)</option>
                  <option value="Fase F (Kelas 11-12)">Fase F (Kelas 11-12 SMA/SMK)</option>
                </select>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 3. KONTROL VERSI & PENGAITAN KEGIATAN BATCH              */}
            {/* ======================================================== */}
            {isAdminMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nomor / Versi Dokumen *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: v1.0, Rev-2026"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Pilih Batch / Program Pelatihan *
                  </label>
                  <select
                    value={batchProgram}
                    onChange={(e) => setBatchProgram(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 text-slate-800 shadow-2xs cursor-pointer"
                  >
                    <option value="Workshop AI Batch 3 - 2026">Workshop AI Batch 3 - 2026</option>
                    <option value="Pelatihan Modul Ajar Batch 1">Pelatihan Modul Ajar Batch 1</option>
                    <option value="Diklat Asesmen & Media Digital Batch 2">Diklat Asesmen & Media Digital Batch 2</option>
                    <option value="Umum / Semua Batch">Umum / Semua Batch Pelatihan</option>
                  </select>
                </div>
              </div>
            )}

            {/* Nama Instruktur & Instansi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  {isAdminMode ? 'Nama Penyusun / Instruktur *' : 'Nama Penyusun / Guru *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap beserta Gelar"
                  value={namaGuru}
                  onChange={(e) => setNamaGuru(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  {isAdminMode ? 'Lembaga / Penyelenggara *' : 'NIP / Instansi / Sekolah *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Instansi / Balai Pelatihan"
                  value={nipOrInstansi}
                  onChange={(e) => setNipOrInstansi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-2xs"
                />
              </div>
            </div>

            {/* Deskripsi Karya */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                {isAdminMode ? 'Deskripsi Ringkas Dokumen Template *' : 'Deskripsi Ringkas Karya *'}
              </label>
              <textarea
                required
                rows={2}
                placeholder={isAdminMode ? 'Jelaskan tujuan format template, standar kompetensi yang dicakup, dan kesesuaian Kurikulum Merdeka...' : 'Penjelasan ringkas isi modul, metode pembelajaran, dan cara penggunaan...'}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-2xs"
              />
            </div>

            {/* Petunjuk Penggunaan Khusus (Master Template Mode) */}
            {isAdminMode && (
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Petunjuk Penggunaan Bagi Guru Peserta (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Gunakan template dokumen .docx ini sebagai format dasar. Bagian berlatar kuning wajib disesuaikan dengan topik dan mata pelajaran masing-masing."
                  value={petunjukPenggunaan}
                  onChange={(e) => setPetunjukPenggunaan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-600 font-semibold text-slate-800 shadow-2xs"
                />
              </div>
            )}

            {/* ======================================================== */}
            {/* 2. FITUR LINK EKSTERNAL / ASET DIGITAL (Canva / Drive)   */}
            {/* ======================================================== */}
            <div className="bg-sky-50/70 border border-sky-200/90 rounded-2xl p-3.5 space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Tautan Canva / Google Drive (Opsional)</span>
              </label>
              <input
                type="url"
                placeholder="https://canva.com/design/... atau https://drive.google.com/..."
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="w-full bg-white border border-sky-300/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-sky-600 font-mono text-slate-800 shadow-2xs"
              />
              <p className="text-[10px] text-slate-600 leading-normal">
                Isi URL ini jika template berbentuk link Canva yang dapat diedit langsung oleh guru atau berkas Google Drive untuk file berukuran &gt; 20 MB.
              </p>
            </div>

            {/* Format File Selector & Upload Area */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-800">
                  {isAdminMode ? 'Pilih Format Berkas Master *' : 'Pilih Format File *'}
                </label>
                <span className="text-[10px] text-slate-500 font-bold">Maksimal 20 MB</span>
              </div>

              {/* Format pills */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {(['DOCX', 'PDF', 'PPTX', 'ZIP', 'HTML5', 'MP4', 'MP3'] as FileFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormatFile(fmt)}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all text-center cursor-pointer ${
                      formatFile === fmt
                        ? 'bg-blue-900 text-cyan-300 border-blue-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Drag and Drop Zone */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setFileDragActive(true); }}
                onDragLeave={() => setFileDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setFileDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    setFileName(file.name);
                    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all relative ${
                  fileDragActive ? 'border-cyan-600 bg-cyan-50' : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  onChange={handleSimulatedFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-2 pointer-events-none">
                  <div className="w-10 h-10 bg-white rounded-xl mx-auto flex items-center justify-center text-blue-900 border border-slate-200 shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  
                  {fileName ? (
                    <div>
                      <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {fileName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">Ukuran: {fileSize} &bull; Format: {formatFile}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Klik atau Tarik Berkas Template ke Sini
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Mendukung DOCX, PDF, PPTX, XLSX, ZIP/RAR (Maks. 20 MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Target Visibilitas (Khusus Admin) */}
            {isAdminMode && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="text-xs font-extrabold text-slate-800">Opsi Visibilitas & Target Akses:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${visibility === 'public' ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                      className="mt-0.5 accent-blue-900"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tampilkan di Dashboard Guru</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">Peserta dapat langsung melihat & mengunduh di tab Pelatihan Saya.</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${visibility === 'internal' ? 'bg-purple-50/80 border-purple-300 text-purple-950 font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
                    <input
                      type="radio"
                      name="visibility"
                      value="internal"
                      checked={visibility === 'internal'}
                      onChange={() => setVisibility('internal')}
                      className="mt-0.5 accent-purple-900"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-purple-600" />
                        <span>Khusus Internal Admin</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">Arsip draf kurasi, belum dipublikasikan ke peserta.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Form Submit Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-blue-900 hover:bg-blue-800 shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98"
            >
              {isAdminMode ? <FolderPlus className="w-4 h-4 text-cyan-400" /> : <Upload className="w-4 h-4 text-cyan-400" />}
              {isSubmitting 
                ? 'Memproses & Menerbitkan...' 
                : (isAdminMode ? 'Terbitkan Template Panduan' : 'Kirim Karya untuk Verifikasi')}
            </button>
          </div>

        </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
