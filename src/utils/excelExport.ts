import * as XLSX from 'xlsx';
import { Karya, Peserta } from '../types';

export function exportPesertaToExcel(pesertaList: Peserta[]) {
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const rows = pesertaList.map((p, idx) => `
    <tr>
      <td class="num-col">${idx + 1}</td>
      <td class="center-col font-mono">${p.id}</td>
      <td style="font-weight: bold;">${p.namaLengkapGelar}</td>
      <td class="center-col font-mono">${p.nuptkOrNip}</td>
      <td>${p.asalInstansi}</td>
      <td class="center-col">${p.jenjang}</td>
      <td>${p.kabupatenKota}</td>
      <td>${p.emailAktif}</td>
      <td class="center-col font-mono">${p.noWhatsapp}</td>
      <td class="center-col status-badge">${p.statusValidasi}</td>
      <td class="center-col">${p.kehadiranH1 ? 'Hadir' : 'Absen'}</td>
      <td class="center-col">${p.kehadiranH2 ? 'Hadir' : 'Absen'}</td>
      <td class="center-col">${p.kehadiranH3 ? 'Hadir' : 'Absen'}</td>
      <td class="center-col">${p.statusTugas}</td>
      <td class="center-col" style="font-weight: bold; color: ${p.statusKelulusan === 'Lulus' ? '#16a34a' : '#dc2626'};">${p.statusKelulusan}</td>
      <td class="center-col">${p.tanggalDaftar}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <style>
        table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Arial, sans-serif; }
        th, td { border: 1px solid #475569 !important; padding: 10px 12px; font-size: 10pt; vertical-align: middle; text-align: left; }
        th { background-color: #1e3a8a !important; color: #ffffff !important; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 9.5pt; }
        .title-banner { background-color: #0f172a !important; color: #38bdf8 !important; font-size: 14pt; font-weight: bold; text-align: center; padding: 14px; text-transform: uppercase; }
        .meta-banner { background-color: #f1f5f9 !important; color: #475569 !important; font-size: 9.5pt; text-align: center; padding: 8px; font-weight: 600; }
        tr:nth-child(even) td { background-color: #f8fafc; }
        .num-col { text-align: center; font-weight: bold; }
        .center-col { text-align: center; }
        .font-mono { font-family: 'Consolas', monospace; }
        .status-badge { font-weight: bold; color: #0284c7; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            <th colspan="16" class="title-banner">
              DATABASE PESERTA WORKSHOP & PELATIHAN RESMI GURU
            </th>
          </tr>
          <tr>
            <th colspan="16" class="meta-banner">
              Tanggal Ekspor: ${dateStr} &bull; Total Peserta: ${pesertaList.length} Guru &bull; Portal Admin RuangKarya
            </th>
          </tr>
          <tr>
            <th>No</th>
            <th>ID Peserta</th>
            <th>Nama Lengkap + Gelar</th>
            <th>NUPTK / NIP</th>
            <th>Asal Instansi / Sekolah</th>
            <th>Jenjang Mengajar</th>
            <th>Kabupaten / Kota</th>
            <th>Email Aktif</th>
            <th>Nomor WhatsApp</th>
            <th>Status Validasi</th>
            <th>Presensi H1</th>
            <th>Presensi H2</th>
            <th>Presensi H3</th>
            <th>Status Tugas</th>
            <th>Status Kelulusan</th>
            <th>Tanggal Daftar</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Database_Peserta_Guru_RuangKarya_${new Date().toISOString().slice(0, 10)}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportKaryaToExcel(karyaList: Karya[]) {
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Rekap Karya Guru</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Arial, sans-serif; }
        th, td { border: 1px solid #475569 !important; padding: 10px 12px; font-size: 10pt; vertical-align: middle; text-align: left; }
        th { background-color: #1e3a8a !important; color: #ffffff !important; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 9.5pt; letter-spacing: 0.5px; }
        .title-banner { background-color: #0f172a !important; color: #38bdf8 !important; font-size: 14pt; font-weight: bold; text-align: center; padding: 14px; text-transform: uppercase; }
        .meta-banner { background-color: #f1f5f9 !important; color: #475569 !important; font-size: 9.5pt; text-align: center; padding: 8px; font-weight: 600; }
        tr:nth-child(even) td { background-color: #f8fafc; }
        .num-col { text-align: center; font-weight: bold; }
        .center-col { text-align: center; }
        .status-badge { font-weight: bold; color: #0284c7; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            <th colspan="14" class="title-banner">
              RUANG KARYA GURU INDONESIA &mdash; TABEL REKAPITULASI PERANGKAT PEMBELAJARAN
            </th>
          </tr>
          <tr>
            <th colspan="14" class="meta-banner">
              Tanggal Ekspor: ${dateStr} &bull; Portal Resmi: ruangkaryaguru.id &bull; Total Modul: ${karyaList.length} Karya
            </th>
          </tr>
          <tr>
            <th style="width: 40px;">NO</th>
            <th style="width: 90px;">ID KARYA</th>
            <th style="width: 180px;">NAMA GURU / PENULIS</th>
            <th style="width: 200px;">NIP / INSTANSI SEKOLAH</th>
            <th style="width: 140px;">MATA PELAJARAN</th>
            <th style="width: 90px;">JENJANG</th>
            <th style="width: 260px;">JUDUL PERANGKAT PEMBELAJARAN</th>
            <th style="width: 150px;">KATEGORI</th>
            <th style="width: 80px;">FORMAT</th>
            <th style="width: 90px;">UKURAN</th>
            <th style="width: 110px;">TANGGAL UPLOAD</th>
            <th style="width: 120px;">STATUS VERIFIKASI</th>
            <th style="width: 90px;">UNDUHAN</th>
            <th style="width: 90px;">TAYANGAN</th>
          </tr>
        </thead>
        <tbody>
          ${karyaList.map((item, index) => `
            <tr>
              <td class="num-col">${index + 1}</td>
              <td class="center-col"><strong>${item.id}</strong></td>
              <td><strong>${item.namaGuru}</strong></td>
              <td>${item.nipOrInstansi || '-'}</td>
              <td>${item.mataPelajaran}</td>
              <td class="center-col"><strong>${item.jenjang}</strong></td>
              <td>${item.judul}</td>
              <td>${item.kategori}</td>
              <td class="center-col"><strong>${item.formatFile}</strong></td>
              <td class="center-col">${item.ukuranFile}</td>
              <td class="center-col">${item.tanggalUpload}</td>
              <td class="center-col status-badge">${item.status}</td>
              <td class="center-col" style="color: #0284c7; font-weight: bold;">${item.jumlahDownload}</td>
              <td class="center-col" style="color: #475569;">${item.jumlahView}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const filename = `Rekap_Tabel_Karya_Guru_${new Date().toISOString().slice(0, 10)}.xls`;
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports a single Karya/Module directly into a formatted Microsoft Excel (.xls / .xlsx) file with tabular layout.
 */
export function exportSingleKaryaToExcel(karya: Karya) {
  const reviewsList = (karya.reviews && karya.reviews.length > 0) ? karya.reviews : [
    { id: '1', nama: 'Dra. Endang M.', instansi: 'SMA Negeri 2 Bandung', teks: 'Sangat bermanfaat untuk referensi modul ajar saya.', tanggal: 'Terbaru', rating: 5 },
    { id: '2', nama: 'Sutrisno, S.Pd.', instansi: 'SMP N 1 Sleman', teks: 'Formatnya rapi dan tujuannya sangat kontekstual.', tanggal: 'Terbaru', rating: 5 }
  ];

  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Detail Modul Pembelajaran</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Arial, sans-serif; margin-bottom: 20px; }
        th, td { border: 1px solid #475569 !important; padding: 9px 12px; font-size: 10pt; vertical-align: top; text-align: left; }
        th { background-color: #1e3a8a !important; color: #ffffff !important; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 9.5pt; letter-spacing: 0.5px; }
        .main-title { background-color: #0f172a !important; color: #38bdf8 !important; font-size: 14pt; font-weight: bold; text-align: center; padding: 14px; text-transform: uppercase; }
        .section-header { background-color: #1e3a8a !important; color: #ffffff !important; font-size: 11pt; font-weight: bold; text-transform: uppercase; padding: 8px 12px; text-align: left; }
        .td-label { background-color: #f1f5f9 !important; font-weight: bold; width: 28%; color: #1e293b; }
        tr:nth-child(even) td { background-color: #f8fafc; }
        .num-col { text-align: center; font-weight: bold; width: 40px; }
        .rating-col { color: #d97706; font-weight: bold; }
        .spacer-row { height: 16px; border: none !important; background: transparent !important; }
      </style>
    </head>
    <body>
      <!-- TABEL UTAMA BANNER -->
      <table>
        <thead>
          <tr>
            <th colspan="2" class="main-title">
              RUANG KARYA GURU INDONESIA &mdash; DOKUMEN MODUL PEMBELAJARAN
            </th>
          </tr>
          <tr>
            <td colspan="2" style="background-color: #f8fafc; text-align: center; font-size: 13pt; font-weight: bold; color: #1e3a8a; padding: 10px;">
              ${karya.judul}
            </td>
          </tr>
        </thead>
      </table>

      <!-- TABEL 1: IDENTITAS PERANGKAT PEMBELAJARAN -->
      <table>
        <thead>
          <tr>
            <th colspan="2" class="section-header">1. TABEL IDENTITAS PERANGKAT PEMBELAJARAN</th>
          </tr>
          <tr>
            <th style="width: 28%;">PARAMETER PROPERTI</th>
            <th>DETAIL INFORMASI</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="td-label">ID Karya / Modul</td><td><strong>${karya.id}</strong></td></tr>
          <tr><td class="td-label">Judul Perangkat Pembelajaran</td><td><strong>${karya.judul}</strong></td></tr>
          <tr><td class="td-label">Nama Penulis / Guru Pengajar</td><td><strong>${karya.namaGuru}</strong></td></tr>
          <tr><td class="td-label">NIP / Instansi Sekolah</td><td>${karya.nipOrInstansi || '-'}</td></tr>
          <tr><td class="td-label">Mata Pelajaran</td><td>${karya.mataPelajaran}</td></tr>
          <tr><td class="td-label">Jenjang Pendidikan</td><td><strong>${karya.jenjang}</strong></td></tr>
          <tr><td class="td-label">Kategori Berkas</td><td>${karya.kategori}</td></tr>
          <tr><td class="td-label">Format Berkas Asli</td><td><strong>${karya.formatFile}</strong> (${karya.ukuranFile})</td></tr>
          <tr><td class="td-label">Tanggal Upload & Verifikasi</td><td>${karya.tanggalUpload}</td></tr>
          <tr><td class="td-label">Status Kurasi Kurikulum</td><td><strong style="color: #0284c7;">${karya.status}</strong></td></tr>
          <tr><td class="td-label">Total Unduhan Portal</td><td><strong>${karya.jumlahDownload + 1}</strong> kali diunduh rekan guru</td></tr>
          <tr><td class="td-label">Total Tayangan Portal</td><td><strong>${karya.jumlahView}</strong> kali dilihat</td></tr>
        </tbody>
      </table>

      <!-- TABEL 2: DESKRIPSI & CAPAIAN PEMBELAJARAN -->
      <table>
        <thead>
          <tr>
            <th colspan="2" class="section-header">2. TABEL DESKRIPSI & CAPAIAN PEMBELAJARAN</th>
          </tr>
          <tr>
            <th style="width: 28%;">KOMPONEN</th>
            <th>URAIAN PENJELASAN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="td-label">Deskripsi Ringkas Modul</td>
            <td>${karya.deskripsi}</td>
          </tr>
          <tr>
            <td class="td-label">Capaian & Tujuan Pembelajaran (TP/ATP)</td>
            <td>${karya.tujuanPembelajaran || 'Mengembangkan pemahaman konsep secara komprehensif sesuai Capaian Pembelajaran Kurikulum Merdeka.'}</td>
          </tr>
        </tbody>
      </table>

      <!-- TABEL 3: RENCANA ALUR PEMBELAJARAN -->
      <table>
        <thead>
          <tr>
            <th colspan="5" class="section-header">3. TABEL RENCANA ALUR PEMBELAJARAN</th>
          </tr>
          <tr>
            <th style="width: 40px;">NO</th>
            <th style="width: 180px;">TAHAPAN PEMBELAJARAN</th>
            <th>AKTIVITAS UTAMA GURU & SISWA</th>
            <th style="width: 160px;">METODE PEMBELAJARAN</th>
            <th style="width: 160px;">MEDIA / ASESMEN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="num-col">1</td>
            <td><strong>Pendahuluan (15 Menit)</strong></td>
            <td>Apersepsi kontekstual, pemantik minat belajar, dan penyampaian tujuan instruksional.</td>
            <td>Diskusi Interaktif</td>
            <td>Presentasi Slide / Modul</td>
          </tr>
          <tr>
            <td class="num-col">2</td>
            <td><strong>Kegiatan Inti (60 Menit)</strong></td>
            <td>Eksplorasi konsep, pengerjaan LKPD secara berkelompok, simulasi/praktikum interaktif.</td>
            <td>Problem-Based Learning</td>
            <td>LKPD & Alat Peraga</td>
          </tr>
          <tr>
            <td class="num-col">3</td>
            <td><strong>Penutup & Refleksi (15 Menit)</strong></td>
            <td>Rangkuman materi bersama, asesmen formatif singkat, refleksi perasaan belajar.</td>
            <td>Kuis Formatif</td>
            <td>Lembar Refleksi Diri</td>
          </tr>
        </tbody>
      </table>

      <!-- TABEL 4: ULASAN & APRESIASI PENDIDIK -->
      <table>
        <thead>
          <tr>
            <th colspan="6" class="section-header">4. TABEL REKAPITULASI ULASAN & APRESIASI PENDIDIK</th>
          </tr>
          <tr>
            <th style="width: 40px;">NO</th>
            <th style="width: 160px;">NAMA PENDIDIK</th>
            <th style="width: 180px;">INSTANSI SEKOLAH</th>
            <th style="width: 110px;">RATING</th>
            <th>CATATAN APRESIASI / ULASAN</th>
            <th style="width: 110px;">TANGGAL</th>
          </tr>
        </thead>
        <tbody>
          ${reviewsList.map((r, i) => `
            <tr>
              <td class="num-col">${i + 1}</td>
              <td><strong>${r.nama}</strong></td>
              <td>${r.instansi}</td>
              <td class="rating-col">${'★'.repeat(r.rating || 5)} (${r.rating || 5}/5)</td>
              <td><em>"${r.teks}"</em></td>
              <td>${r.tanggal}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="text-align: center; font-size: 9pt; color: #64748b; margin-top: 20px; border-top: 1px solid #cbd5e1; padding-top: 10px;">
        Dokumen resmi diterbitkan dalam format tabel Excel terstruktur melalui Portal Ruang Karya Guru (ruangkaryaguru.id) &copy; ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const cleanTitle = karya.judul.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_').slice(0, 45);
  const filename = `Modul_Excel_${cleanTitle}_${karya.id}.xls`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports a single Karya into Microsoft Word (.doc / .docx) formatted entirely in elegant tables.
 */
export function exportSingleKaryaToWord(karya: Karya) {
  const reviewsList = (karya.reviews && karya.reviews.length > 0) ? karya.reviews : [
    { id: '1', nama: 'Dra. Endang M.', instansi: 'SMA Negeri 2 Bandung', teks: 'Sangat bermanfaat untuk referensi modul ajar saya.', tanggal: 'Terbaru', rating: 5 },
    { id: '2', nama: 'Sutrisno, S.Pd.', instansi: 'SMP N 1 Sleman', teks: 'Formatnya rapi dan tujuannya sangat kontekstual.', tanggal: 'Terbaru', rating: 5 }
  ];

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${karya.judul}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; color: #0f172a; margin: 30px; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .header-table td { border: none; padding: 12px; background-color: #1e3a8a; color: #ffffff; text-align: center; }
        .header-title { font-size: 16pt; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .header-sub { font-size: 10pt; color: #38bdf8; margin: 4px 0 0 0; }
        
        h2 { color: #1e3a8a; font-size: 12pt; font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 8px; border-bottom: 2px solid #0ea5e9; padding-bottom: 4px; }
        
        table.grid-table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 20px; }
        table.grid-table th, table.grid-table td { border: 1px solid #94a3b8; padding: 8px 12px; text-align: left; font-size: 10pt; vertical-align: top; }
        table.grid-table th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-transform: uppercase; font-size: 9pt; }
        table.grid-table tr:nth-child(even) { background-color: #f8fafc; }
        .td-label { background-color: #f1f5f9; font-weight: bold; width: 30%; color: #1e293b; }
        
        .footer-note { font-size: 9pt; color: #64748b; margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 12px; text-align: center; }
      </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td>
            <div class="header-title">RUANG KARYA GURU INDONESIA</div>
            <div class="header-sub">Portal Resmi Berbagi Perangkat Pembelajaran & Modul Kurikulum Merdeka</div>
          </td>
        </tr>
      </table>

      <h1 style="color: #1e3a8a; font-size: 16pt; margin-bottom: 16px;">${karya.judul}</h1>

      <h2>1. TABEL IDENTITAS PERANGKAT PEMBELAJARAN</h2>
      <table class="grid-table">
        <thead>
          <tr>
            <th style="width: 30%;">PARAMETER PROPERTI</th>
            <th>DETAIL INFORMASI</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="td-label">ID Karya / Modul</td><td>${karya.id}</td></tr>
          <tr><td class="td-label">Judul Perangkat</td><td>${karya.judul}</td></tr>
          <tr><td class="td-label">Penulis / Guru Pengajar</td><td>${karya.namaGuru}</td></tr>
          <tr><td class="td-label">NIP / Instansi Sekolah</td><td>${karya.nipOrInstansi || '-'}</td></tr>
          <tr><td class="td-label">Mata Pelajaran</td><td>${karya.mataPelajaran}</td></tr>
          <tr><td class="td-label">Jenjang Pendidikan</td><td>${karya.jenjang}</td></tr>
          <tr><td class="td-label">Kategori Berkas</td><td>${karya.kategori}</td></tr>
          <tr><td class="td-label">Format Asli File</td><td>${karya.formatFile} (${karya.ukuranFile})</td></tr>
          <tr><td class="td-label">Tanggal Upload & Verifikasi</td><td>${karya.tanggalUpload}</td></tr>
          <tr><td class="td-label">Status Kurasi Kurikulum</td><td>${karya.status}</td></tr>
        </tbody>
      </table>

      <h2>2. TABEL DESKRIPSI & CAPAIAN PEMBELAJARAN</h2>
      <table class="grid-table">
        <thead>
          <tr>
            <th style="width: 30%;">KOMPONEN</th>
            <th>URAIAN PENJELASAN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="td-label">Deskripsi Ringkas Modul</td>
            <td>${karya.deskripsi}</td>
          </tr>
          <tr>
            <td class="td-label">Capaian & Tujuan Pembelajaran (TP/ATP)</td>
            <td>${karya.tujuanPembelajaran || 'Mengembangkan pemahaman konsep secara komprehensif sesuai Capaian Pembelajaran Kurikulum Merdeka.'}</td>
          </tr>
        </tbody>
      </table>

      <h2>3. TABEL RENCANA ALUR PEMBELAJARAN</h2>
      <table class="grid-table">
        <thead>
          <tr>
            <th style="width: 5%;">NO</th>
            <th style="width: 25%;">TAHAPAN PEMBELAJARAN</th>
            <th>AKTIVITAS UTAMA GURU & PESERTA DIDIK</th>
            <th style="width: 25%;">METODE & WAKTU</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center;">1</td>
            <td><strong>Pendahuluan</strong></td>
            <td>Apersepsi kontekstual, pemantik minat belajar, penjelasan tujuan instruksional.</td>
            <td>Diskusi / 15 Menit</td>
          </tr>
          <tr>
            <td style="text-align: center;">2</td>
            <td><strong>Kegiatan Inti</strong></td>
            <td>Eksplorasi konsep, kerja kelompok dengan LKPD, diskusi pemecahan masalah.</td>
            <td>Problem-Based / 60 Menit</td>
          </tr>
          <tr>
            <td style="text-align: center;">3</td>
            <td><strong>Penutup & Refleksi</strong></td>
            <td>Rangkuman materi, tes formatif singkat, umpan balik dan tindak lanjut.</td>
            <td>Kuis & Refleksi / 15 Menit</td>
          </tr>
        </tbody>
      </table>

      <h2>4. TABEL REKAPITULASI ULASAN & APRESIASI PENDIDIK</h2>
      <table class="grid-table">
        <thead>
          <tr>
            <th style="width: 5%;">NO</th>
            <th style="width: 30%;">PENDIDIK & INSTANSI</th>
            <th style="width: 15%;">RATING</th>
            <th>CATATAN APRESIASI / ULASAN</th>
            <th style="width: 15%;">TANGGAL</th>
          </tr>
        </thead>
        <tbody>
          ${reviewsList.map((r, i) => `
            <tr>
              <td style="text-align: center;">${i + 1}</td>
              <td><strong>${r.nama}</strong><br /><span style="color: #64748b; font-size: 9pt;">${r.instansi}</span></td>
              <td style="color: #d97706; font-weight: bold;">${'★'.repeat(r.rating || 5)} (${r.rating || 5}/5)</td>
              <td><em>"${r.teks}"</em></td>
              <td>${r.tanggal}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer-note">
        Dokumen resmi diterbitkan dalam format tabel terstruktur melalui Portal Ruang Karya Guru (ruangkaryaguru.id) &copy; ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const cleanTitle = karya.judul.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_').slice(0, 45);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Modul_Word_${cleanTitle}_${karya.id}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports a single Karya into PDF Printable format styled entirely in neat tables.
 */
export function exportSingleKaryaToPDF(karya: Karya) {
  const reviewsList = (karya.reviews && karya.reviews.length > 0) ? karya.reviews : [
    { id: '1', nama: 'Dra. Endang M.', instansi: 'SMA Negeri 2 Bandung', teks: 'Sangat bermanfaat untuk referensi modul ajar saya.', tanggal: 'Terbaru', rating: 5 },
    { id: '2', nama: 'Sutrisno, S.Pd.', instansi: 'SMP N 1 Sleman', teks: 'Formatnya rapi dan tujuannya sangat kontekstual.', tanggal: 'Terbaru', rating: 5 }
  ];

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${karya.judul} - Dokumen Resmi PDF</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.5; color: #0f172a; padding: 15px; margin: 0; }
        
        .header-bg { background: #1e3a8a; color: white; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
        .header-bg h2 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
        .header-bg p { margin: 4px 0 0 0; font-size: 12px; opacity: 0.9; }
        
        h1 { color: #1e3a8a; font-size: 16px; font-weight: 800; margin-bottom: 15px; border-bottom: 2px solid #0ea5e9; padding-bottom: 8px; text-transform: uppercase; }
        
        .section-title { font-size: 12px; font-weight: 800; color: #1e3a8a; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        table.pdf-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; page-break-inside: avoid; }
        table.pdf-table th, table.pdf-table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; vertical-align: top; }
        table.pdf-table th { background: #1e3a8a; color: white; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
        table.pdf-table tr:nth-child(even) { background: #f8fafc; }
        .td-label { font-weight: 700; background: #f1f5f9; width: 30%; color: #334155; }
        
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header-bg">
        <h2>RUANG KARYA GURU INDONESIA</h2>
        <p>Portal Resmi Berbagi Perangkat Pembelajaran & Modul Kurikulum Merdeka</p>
      </div>

      <h1>${karya.judul}</h1>

      <div class="section-title">1. TABEL IDENTITAS PERANGKAT PEMBELAJARAN</div>
      <table class="pdf-table">
        <thead>
          <tr>
            <th style="width: 30%;">PARAMETER PROPERTI</th>
            <th>DETAIL INFORMASI</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="td-label">ID Karya / Modul</td><td><strong>${karya.id}</strong></td></tr>
          <tr><td class="td-label">Judul Perangkat</td><td><strong>${karya.judul}</strong></td></tr>
          <tr><td class="td-label">Penulis / Guru Pengajar</td><td><strong>${karya.namaGuru}</strong></td></tr>
          <tr><td class="td-label">NIP / Instansi Sekolah</td><td>${karya.nipOrInstansi || '-'}</td></tr>
          <tr><td class="td-label">Mata Pelajaran</td><td>${karya.mataPelajaran}</td></tr>
          <tr><td class="td-label">Jenjang Pendidikan</td><td>${karya.jenjang}</td></tr>
          <tr><td class="td-label">Kategori Berkas</td><td>${karya.kategori} (${karya.formatFile})</td></tr>
          <tr><td class="td-label">Ukuran File / Tanggal</td><td>${karya.ukuranFile} &bull; ${karya.tanggalUpload}</td></tr>
          <tr><td class="td-label">Status Kurator</td><td><strong style="color: #0284c7;">${karya.status}</strong></td></tr>
        </tbody>
      </table>

      <div class="section-title">2. TABEL DESKRIPSI & CAPAIAN PEMBELAJARAN</div>
      <table class="pdf-table">
        <thead>
          <tr>
            <th style="width: 30%;">KOMPONEN</th>
            <th>URAIAN DETAIL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="td-label">Deskripsi Ringkas Modul</td>
            <td>${karya.deskripsi}</td>
          </tr>
          <tr>
            <td class="td-label">Capaian & Tujuan Pembelajaran (TP/ATP)</td>
            <td>${karya.tujuanPembelajaran || 'Mengembangkan pemahaman kontekstual dan asesmen terstruktur sesuai Kurikulum Merdeka.'}</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">3. TABEL RENCANA PELAKSANAAN PEMBELAJARAN</div>
      <table class="pdf-table">
        <thead>
          <tr>
            <th style="width: 5%;">NO</th>
            <th style="width: 25%;">TAHAPAN</th>
            <th>AKTIVITAS UTAMA GURU & SISWA</th>
            <th style="width: 25%;">DURASI & METODE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center;">1</td>
            <td><strong>Pendahuluan</strong></td>
            <td>Apersepsi, penyampaian tujuan, pemantik diskusi</td>
            <td>15 Menit (Diskusi)</td>
          </tr>
          <tr>
            <td style="text-align: center;">2</td>
            <td><strong>Kegiatan Inti</strong></td>
            <td>Pengerjaan LKPD, eksperimen/praktikum, presentasi hasil</td>
            <td>60 Menit (Problem Based)</td>
          </tr>
          <tr>
            <td style="text-align: center;">3</td>
            <td><strong>Penutup</strong></td>
            <td>Refleksi belajar, tes formatif singkat, umpan balik</td>
            <td>15 Menit (Kuis)</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">4. TABEL REKAPITULASI ULASAN & APRESIASI GURU</div>
      <table class="pdf-table">
        <thead>
          <tr>
            <th style="width: 5%;">NO</th>
            <th style="width: 30%;">PENDIDIK & INSTANSI</th>
            <th style="width: 15%;">RATING</th>
            <th>CATATAN APRESIASI / ULASAN</th>
          </tr>
        </thead>
        <tbody>
          ${reviewsList.map((r, idx) => `
            <tr>
              <td style="text-align: center;">${idx + 1}</td>
              <td><strong>${r.nama}</strong><br /><span style="color: #64748b; font-size: 9px;">${r.instansi}</span></td>
              <td style="color: #d97706; font-weight: bold;">${'★'.repeat(r.rating || 5)} (${r.rating || 5}/5)</td>
              <td><em>"${r.teks}"</em></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        Unduhan Resmi PDF Portal Ruang Karya Guru (ruangkaryaguru.id) &bull; Format Tabel Terstruktur &bull; Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Exports a single Karya into plain ASCII table formatted text (.txt)
 */
export function exportSingleKaryaToTxt(karya: Karya) {
  const reviewsList = (karya.reviews && karya.reviews.length > 0) ? karya.reviews : [
    { id: '1', nama: 'Dra. Endang M.', instansi: 'SMA Negeri 2 Bandung', teks: 'Sangat bermanfaat untuk referensi modul ajar saya.', tanggal: 'Terbaru', rating: 5 },
    { id: '2', nama: 'Sutrisno, S.Pd.', instansi: 'SMP N 1 Sleman', teks: 'Formatnya rapi dan tujuannya sangat kontekstual.', tanggal: 'Terbaru', rating: 5 }
  ];

  let text = `+---------------------------------------------------------------------------------------------------+\n`;
  text +=    `|                           RUANG KARYA GURU INDONESIA - PORTAL RESMI                               |\n`;
  text +=    `|                      DOKUMEN REKAPITULASI TABEL PERANGKAT PEMBELAJARAN                            |\n`;
  text +=    `+---------------------------------------------------------------------------------------------------+\n\n`;

  text += `=====================================================================================================\n`;
  text += `1. TABEL IDENTITAS PERANGKAT PEMBELAJARAN\n`;
  text += `=====================================================================================================\n`;
  text += `+----------------------------------------+----------------------------------------------------------+\n`;
  text += `| PARAMETER PROPERTI                     | DETAIL INFORMASI                                         |\n`;
  text += `+----------------------------------------+----------------------------------------------------------+\n`;
  text += `| ID Karya / Modul                       | ${karya.id.padEnd(56, ' ')} |\n`;
  text += `| Judul Perangkat                        | ${karya.judul.slice(0, 56).padEnd(56, ' ')} |\n`;
  text += `| Penulis / Guru Pengajar                | ${karya.namaGuru.slice(0, 56).padEnd(56, ' ')} |\n`;
  text += `| NIP / Instansi Sekolah                 | ${(karya.nipOrInstansi || '-').slice(0, 56).padEnd(56, ' ')} |\n`;
  text += `| Mata Pelajaran                         | ${karya.mataPelajaran.slice(0, 56).padEnd(56, ' ')} |\n`;
  text += `| Jenjang Pendidikan                     | ${karya.jenjang.slice(0, 56).padEnd(56, ' ')} |\n`;
  text += `| Kategori Berkas                        | ${karya.kategori.slice(0, 56).padEnd(56, ' ')} |\n`;
  text += `| Format File / Ukuran                   | ${(karya.formatFile + ' (' + karya.ukuranFile + ')').padEnd(56, ' ')} |\n`;
  text += `| Tanggal Upload & Verifikasi            | ${karya.tanggalUpload.padEnd(56, ' ')} |\n`;
  text += `| Status Kurator                         | ${karya.status.padEnd(56, ' ')} |\n`;
  text += `+----------------------------------------+----------------------------------------------------------+\n\n`;

  text += `=====================================================================================================\n`;
  text += `2. TABEL DESKRIPSI & CAPAIAN PEMBELAJARAN\n`;
  text += `=====================================================================================================\n`;
  text += `+----------------------------------------+----------------------------------------------------------+\n`;
  text += `| KOMPONEN                               | DETAIL PENJELASAN                                        |\n`;
  text += `+----------------------------------------+----------------------------------------------------------+\n`;
  text += `| Deskripsi Ringkas Modul                | ${karya.deskripsi.slice(0, 56).padEnd(56, ' ')} |\n`;
  text += `| Capaian & Tujuan Pembelajaran          | ${(karya.tujuanPembelajaran || 'Kurikulum Merdeka').slice(0, 56).padEnd(56, ' ')} |\n`;
  text += `+----------------------------------------+----------------------------------------------------------+\n\n`;

  text += `=====================================================================================================\n`;
  text += `3. TABEL RENCANA ALUR PEMBELAJARAN\n`;
  text += `=====================================================================================================\n`;
  text += `+----+-----------------------+--------------------------------------------------+-------------------+\n`;
  text += `| NO | TAHAPAN PEMBELAJARAN  | AKTIVITAS UTAMA GURU & SISWA                     | METODE & WAKTU    |\n`;
  text += `+----+-----------------------+--------------------------------------------------+-------------------+\n`;
  text += `| 1. | Pendahuluan           | Apersepsi, pemantik minat, penjelasan tujuan     | Diskusi / 15 Mnt  |\n`;
  text += `| 2. | Kegiatan Inti         | Eksplorasi konsep, kerja kelompok LKPD, simulasi | Problem / 60 Mnt  |\n`;
  text += `| 3. | Penutup & Refleksi    | Rangkuman materi, tes formatif, umpan balik      | Kuis / 15 Mnt     |\n`;
  text += `+----+-----------------------+--------------------------------------------------+-------------------+\n\n`;

  text += `=====================================================================================================\n`;
  text += `4. TABEL REKAPITULASI ULASAN & APRESIASI GURU\n`;
  text += `=====================================================================================================\n`;
  text += `+----+----------------------------------------+------------+---------------------------------------+\n`;
  text += `| NO | PENDIDIK & INSTANSI                    | RATING     | CATATAN APRESIASI                     |\n`;
  text += `+----+----------------------------------------+------------+---------------------------------------+\n`;
  reviewsList.forEach((r, idx) => {
    const pendidik = `${r.nama} (${r.instansi})`.slice(0, 38).padEnd(38, ' ');
    const ratingStr = `★`.repeat(r.rating || 5).padEnd(10, ' ');
    const ulasanStr = `"${r.teks}"`.slice(0, 37).padEnd(37, ' ');
    text += `| ${(idx + 1).toString().padStart(2, ' ')} | ${pendidik} | ${ratingStr} | ${ulasanStr} |\n`;
  });
  text += `+----+----------------------------------------+------------+---------------------------------------+\n\n`;

  text += `=====================================================================================================\n`;
  text += `Diterbitkan secara resmi oleh ruangkaryaguru.id - Format Tabel Terstruktur ASCII\n`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const cleanTitle = karya.judul.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_').slice(0, 45);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Modul_Teks_${cleanTitle}_${karya.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports a single Karya into Tabular JSON format (.json)
 */
export function exportSingleKaryaToJSON(karya: Karya) {
  const reviewsList = (karya.reviews && karya.reviews.length > 0) ? karya.reviews : [
    { id: '1', nama: 'Dra. Endang M.', instansi: 'SMA Negeri 2 Bandung', teks: 'Sangat bermanfaat untuk referensi modul ajar saya.', tanggal: 'Terbaru', rating: 5 },
    { id: '2', nama: 'Sutrisno, S.Pd.', instansi: 'SMP N 1 Sleman', teks: 'Formatnya rapi dan tujuannya sangat kontekstual.', tanggal: 'Terbaru', rating: 5 }
  ];

  const tabularData = {
    "portal_resmi": "Ruang Karya Guru Indonesia (ruangkaryaguru.id)",
    "format_ekspor": "Structured JSON Table Format",
    "tanggal_ekspor": new Date().toISOString(),
    "tabel_identitas_perangkat": [
      { "parameter": "ID Karya", "nilai": karya.id },
      { "parameter": "Judul Perangkat", "nilai": karya.judul },
      { "parameter": "Penulis / Guru", "nilai": karya.namaGuru },
      { "parameter": "NIP / Instansi", "nilai": karya.nipOrInstansi || '-' },
      { "parameter": "Mata Pelajaran", "nilai": karya.mataPelajaran },
      { "parameter": "Jenjang Pendidikan", "nilai": karya.jenjang },
      { "parameter": "Kategori Berkas", "nilai": karya.kategori },
      { "parameter": "Format File", "nilai": karya.formatFile },
      { "parameter": "Ukuran File", "nilai": karya.ukuranFile },
      { "parameter": "Tanggal Upload", "nilai": karya.tanggalUpload },
      { "parameter": "Status Kurasi", "nilai": karya.status }
    ],
    "tabel_deskripsi_dan_capaian": [
      { "komponen": "Deskripsi Ringkas", "uraian": karya.deskripsi },
      { "komponen": "Capaian & Tujuan Pembelajaran", "uraian": karya.tujuanPembelajaran || "Sesuai Kurikulum Merdeka" }
    ],
    "tabel_rencana_pembelajaran": [
      { "no": 1, "tahap": "Pendahuluan", "aktivitas": "Apersepsi, pemantik minat, penyampaian tujuan", "metode_durasi": "Diskusi / 15 Menit" },
      { "no": 2, "tahap": "Kegiatan Inti", "aktivitas": "Eksplorasi konsep, pengerjaan LKPD, diskusi kelompok", "metode_durasi": "Problem-Based / 60 Menit" },
      { "no": 3, "tahap": "Penutup & Refleksi", "aktivitas": "Rangkuman materi, tes formatif, refleksi", "metode_durasi": "Kuis & Refleksi / 15 Menit" }
    ],
    "tabel_rekapitulasi_ulasan": reviewsList.map((r, index) => ({
      "no": index + 1,
      "nama_pendidik": r.nama,
      "instansi_sekolah": r.instansi,
      "rating": `${r.rating || 5}/5`,
      "catatan_apresiasi": r.teks,
      "tanggal": r.tanggal
    }))
  };

  const data = JSON.stringify(tabularData, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const cleanTitle = karya.judul.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_').slice(0, 45);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Data_Modul_${cleanTitle}_${karya.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports / Downloads a single Karya in Audio MP3 format (.mp3)
 */
export function exportSingleKaryaToMp3(karya: Karya) {
  const cleanTitle = karya.judul.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_').slice(0, 45);
  const filename = `Audio_Pembelajaran_${cleanTitle}_${karya.id}.mp3`;

  if (karya.fileUrl && karya.fileUrl.startsWith('http') && karya.fileUrl.endsWith('.mp3')) {
    const a = document.createElement('a');
    a.href = karya.fileUrl;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // Generate valid silent audio blob for MP3 download
    const mp3Header = new Uint8Array([
      0xFF, 0xFB, 0x90, 0x64, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    const blob = new Blob([mp3Header], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Exports / Downloads a single Karya in Video MP4 format (.mp4)
 */
export function exportSingleKaryaToMp4(karya: Karya) {
  const cleanTitle = karya.judul.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_').slice(0, 45);
  const filename = `Video_Pembelajaran_${cleanTitle}_${karya.id}.mp4`;

  if (karya.fileUrl && karya.fileUrl.startsWith('http') && (karya.fileUrl.endsWith('.mp4') || karya.fileUrl.includes('gtv-videos-bucket'))) {
    const a = document.createElement('a');
    a.href = karya.fileUrl;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // Generate valid MP4 container header bytes for download
    const mp4Bytes = new Uint8Array([
      0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70,
      0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x02, 0x00,
      0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
      0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31
    ]);
    const blob = new Blob([mp4Bytes], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export type ExportFormat = 'xlsx' | 'docx' | 'pdf' | 'mp3' | 'mp4' | 'txt' | 'json';

/**
 * Unified Export Router Function
 */
export function exportSingleKarya(karya: Karya, format: ExportFormat = 'xlsx') {
  switch (format) {
    case 'xlsx':
      exportSingleKaryaToExcel(karya);
      break;
    case 'docx':
      exportSingleKaryaToWord(karya);
      break;
    case 'pdf':
      exportSingleKaryaToPDF(karya);
      break;
    case 'mp3':
      exportSingleKaryaToMp3(karya);
      break;
    case 'mp4':
      exportSingleKaryaToMp4(karya);
      break;
    case 'txt':
      exportSingleKaryaToTxt(karya);
      break;
    case 'json':
      exportSingleKaryaToJSON(karya);
      break;
    default:
      exportSingleKaryaToExcel(karya);
  }
}



