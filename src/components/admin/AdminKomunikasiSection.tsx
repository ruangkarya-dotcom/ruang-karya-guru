import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Link as LinkIcon, 
  Zap, 
  Workflow, 
  ShieldCheck, 
  Key, 
  ExternalLink,
  Smartphone,
  Eye,
  RefreshCw,
  Plus,
  ArrowRight,
  FileEdit,
  Filter,
  Database
} from 'lucide-react';
import { BroadcastTemplate, BroadcastLog, Peserta } from '../../types';

interface AdminKomunikasiSectionProps {
  templates: BroadcastTemplate[];
  logs: BroadcastLog[];
  pesertaList: Peserta[];
  onSaveTemplate?: (updated: BroadcastTemplate) => void;
  onSendBroadcastTest?: (templateId: string, sampleData: Record<string, string>) => void;
}

export const AdminKomunikasiSection: React.FC<AdminKomunikasiSectionProps> = ({
  templates,
  logs,
  pesertaList,
  onSaveTemplate,
  onSendBroadcastTest,
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'logs' | 'checklist'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<BroadcastTemplate>(templates[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<BroadcastTemplate | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [broadcastLogList, setBroadcastLogList] = useState<BroadcastLog[]>(logs);

  // Dynamic Variable Replacement State for Interactive Live Preview
  const [testVariables, setTestVariables] = useState<Record<string, string>>({
    'Nama Peserta': 'Dra. Hj. Siti Aminah, M.Pd.',
    'Judul Workshop': 'Pengembangan Modul Ajar Berbasis AI & Kurikulum Merdeka',
    'ID Peserta': 'PST-2026-001',
    'NUPTK/NIP': '197508122003122001',
    'Asal Instansi': 'SD Negeri 1 Sleman',
    'Kabupaten/Kota': 'Kabupaten Sleman',
    'Tanggal': 'Sabtu, 15 Agustus 2026',
    'Waktu': '08.30 - 11.30 WIB',
    'Link Zoom': 'https://zoom.us/j/8899112233',
    'Meeting ID': '889 911 2233',
    'Passcode': 'GURUHEBAT2026',
    'Link Presensi': 'https://ruangkaryaguru.id/presensi/ws-ai-2026',
    'Link Upload Tugas': 'https://ruangkaryaguru.id/upload-tugas',
    'Link Template': 'https://ruangkaryaguru.id/template-modul-2026',
    'Deadline Tugas': 'Rabu, 19 Agustus 2026 pukul 23.59 WIB',
    'Link Grup WA': 'https://chat.whatsapp.com/GURU_BERKARYA_2026',
    'Link Telegram': 'https://t.me/RuangKaryaGuruOfficial',
    'Contact Person': 'Admin RuangKarya (0812-3456-7890)',
  });

  // Calculate live preview text
  const getRenderedMessage = (bodyText: string) => {
    let rendered = bodyText;
    Object.entries(testVariables).forEach(([key, val]) => {
      rendered = rendered.split(`[${key}]`).join(String(val));
    });
    return rendered;
  };

  const handleCopyText = (text: string, id: string) => {
    const rendered = getRenderedMessage(text);
    navigator.clipboard.writeText(rendered);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSimulateSend = () => {
    const newLog: BroadcastLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      waktu: new Date().toLocaleString('id-ID'),
      penerima: `Test Broadcast (${pesertaList.length} Peserta Valid)`,
      tipePesan: selectedTemplate.judul,
      saluran: selectedTemplate.saluran === 'Keduanya' ? 'WhatsApp' : selectedTemplate.saluran,
      status: 'Terkirim',
      keterangan: `Berhasil dikirim ke ${pesertaList.filter(p => p.statusValidasi === 'Valid').length} guru terverifikasi`
    };

    setBroadcastLogList([newLog, ...broadcastLogList]);
    setIsTestModalOpen(false);
    alert(`✅ Simulasi Broadcast "${selectedTemplate.judul}" Berhasil Dikirim!`);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Switcher */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('template')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'template'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>1. Template Pesan (WA & Email Broadcast)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>2. Log Pengiriman Broadcast</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'checklist'
              ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>3. Checklist Workflow Otomatis & Integrasi Akun</span>
        </button>
      </div>

      {/* TAB 1: TEMPLATE PESAN BROADCAST */}
      {activeTab === 'template' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List of Templates */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                <span>Pilih Template Komunikasi</span>
                <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                  {templates.length} Template
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Gaya bahasa ramah, profesional, menyemangati guru dengan placeholder otomatis.
              </p>

              <div className="space-y-2.5 pt-2">
                {templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      selectedTemplate.id === tmpl.id
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {tmpl.saluran}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{tmpl.id}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">{tmpl.judul}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {tmpl.pesanBody}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Variable Parameter Inspector */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Simulasi Variabel Placeholder [Nama], [Link], Dll.</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Ubah nilai contoh di bawah untuk melihat hasil rendering live pesan secara instan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs max-h-60 overflow-y-auto pr-1">
                {Object.entries(testVariables).map(([key, value]) => (
                  <div key={key} className="space-y-0.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">[{key}]</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setTestVariables({ ...testVariables, [key]: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 text-slate-800 font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Rendered Message Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    PRATINJAU BROADCAST LIVE
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    {selectedTemplate.judul}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(selectedTemplate.pesanBody, selectedTemplate.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    {copiedId === selectedTemplate.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Salin Pesan</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsTestModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Uji Kirim Broadcast</span>
                  </button>
                </div>
              </div>

              {selectedTemplate.subjekEmail && (
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Subjek Email:</span>
                  <span className="font-extrabold text-cyan-300 mt-0.5 block">
                    {getRenderedMessage(selectedTemplate.subjekEmail)}
                  </span>
                </div>
              )}

              {/* Message Box Styled like WhatsApp / Email */}
              <div className="bg-[#0b141a] p-5 rounded-2xl border border-emerald-900/40 text-xs text-slate-100 font-sans leading-relaxed whitespace-pre-wrap shadow-inner font-normal">
                {getRenderedMessage(selectedTemplate.pesanBody)}
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Saluran: <strong className="text-white">{selectedTemplate.saluran}</strong></span>
                <span>Target Receiver: <strong className="text-emerald-400">{pesertaList.filter(p => p.statusValidasi === 'Valid').length} Peserta Valid</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOG PENGIRIMAN BROADCAST */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <span>Riwayat & Log Pengiriman Broadcast</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Catatan riwayat status pesan WhatsApp dan Email yang telah diproses ke peserta.
              </p>
            </div>

            <button
              onClick={() => setIsTestModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Broadcast Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[11px] tracking-wider select-none">
                <tr>
                  <th className="py-4 px-4 min-w-[150px] border-b border-slate-800">Waktu Pengiriman</th>
                  <th className="py-4 px-4 min-w-[200px] border-b border-slate-800">Tipe Pesan</th>
                  <th className="py-4 px-4 min-w-[220px] border-b border-slate-800">Target Penerima</th>
                  <th className="py-4 px-4 text-center min-w-[110px] border-b border-slate-800">Saluran</th>
                  <th className="py-4 px-4 text-center min-w-[130px] border-b border-slate-800">Status</th>
                  <th className="py-4 px-4 min-w-[200px] border-b border-slate-800">Keterangan Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {broadcastLogList.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">{log.waktu}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 group-hover:text-blue-950">{log.tipePesan}</td>
                    <td className="py-3.5 px-4 text-slate-800">{log.penerima}</td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${log.saluran === 'WhatsApp' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                        {log.saluran}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{log.keterangan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CHECKLIST WORKFLOW OTOMATIS & INTEGRASI AKUN */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          {/* Section 1: Workflow Otomatis Google Form -> WA/Email */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs font-bold rounded-full border border-indigo-200">
                ALUR KERJA OTOMATISASI (WORKFLOW)
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Draf Aturan Alur Kerja Pengiriman Email & WhatsApp Otomatis
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Alur pengiriman langsung saat peserta mengisi Google Form pendaftaran atau portal website.
              </p>
            </div>

            {/* Pipeline Steps Grid with Visual Connectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {/* STEP 1 */}
              <div className="relative group">
                <div className="h-full bg-gradient-to-b from-white to-blue-50/30 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[11px] shadow-sm shadow-blue-500/20 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse"></span>
                        STEP 1
                      </span>
                    </div>

                    <h4 className="text-[15px] font-semibold text-slate-900 flex items-center gap-1.5">
                      <FileEdit className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Trigger: Form Submit</span>
                    </h4>

                    <p className="text-[13px] text-slate-500 leading-[1.4]">
                      Peserta mengisi formulir pendaftaran di Google Form / Website. Google Apps Script / Webhook aktif secara real-time.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100/80 flex items-center gap-1.5 text-[11px] font-medium text-blue-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Event listener terpasang</span>
                  </div>
                </div>

                {/* Visual Connector for Desktop (Between Step 1 & Step 2) */}
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center text-blue-600 pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* STEP 2 */}
              <div className="relative group">
                <div className="h-full bg-gradient-to-b from-white to-sky-50/30 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-600 text-white font-extrabold text-[11px] shadow-sm shadow-sky-500/20 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-200 animate-pulse"></span>
                        STEP 2
                      </span>
                    </div>

                    <h4 className="text-[15px] font-semibold text-slate-900 flex items-center gap-1.5">
                      <Filter className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>Sanitasi & Format Data</span>
                    </h4>

                    <p className="text-[13px] text-slate-500 leading-[1.4]">
                      Sistem otomatis mengubah nomor WA menjadi format baku <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-[11px]">628...</code> dan memvalidasi sintaks email.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100/80 flex items-center gap-1.5 text-[11px] font-medium text-sky-700">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span>Validasi regex & parsing</span>
                  </div>
                </div>

                {/* Visual Connector for Desktop (Between Step 2 & Step 3) */}
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center text-sky-600 pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* STEP 3 */}
              <div className="relative group">
                <div className="h-full bg-gradient-to-b from-white to-indigo-50/30 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] shadow-sm shadow-indigo-500/20 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-pulse"></span>
                        STEP 3
                      </span>
                    </div>

                    <h4 className="text-[15px] font-semibold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>API Call Gateway</span>
                    </h4>

                    <p className="text-[13px] text-slate-500 leading-[1.4]">
                      Mengirim muatan JSON ke API WA Gateway (Fonnte/Wablas) & Gmail API SMTP secara paralel dalam durasi &lt; 5 detik.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100/80 flex items-center gap-1.5 text-[11px] font-medium text-indigo-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span>Dispatched payload asynchronous</span>
                  </div>
                </div>

                {/* Visual Connector for Desktop (Between Step 3 & Step 4) */}
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-2xs items-center justify-center text-indigo-600 pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* STEP 4 */}
              <div className="relative group">
                <div className="h-full bg-gradient-to-b from-white to-emerald-50/30 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] shadow-sm shadow-emerald-500/20 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
                        STEP 4
                      </span>
                    </div>

                    <h4 className="text-[15px] font-semibold text-slate-900 flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Auto Database Sync</span>
                    </h4>

                    <p className="text-[13px] text-slate-500 leading-[1.4]">
                      Mengupdate status konfirmasi menjadi <code className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1 py-0.5 rounded text-[11px] font-bold">TERKIRIM</code> pada database Google Sheets utama.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100/80 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Database audit log updated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Ketentuan Integrasi Akun Pendukung */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full border border-emerald-200">
                INTEGRASI AKUN PENDUKUNG RESMI
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Ketentuan & Panduan Integrasi Akun Pendukung
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Konektivitas dengan Google Workspace, Akun belajar.id, dan Platform SIMPKB Kemendikbudristek.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Google Workspace */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>1. Google Workspace</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Gunakan Service Account OAuth2 untuk pengiriman email terenkripsi.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Batas kuota pengiriman 2.000 email/hari untuk akun Google Workspace Education.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Folder pengumpulan tugas otomatis terhubung dengan Google Drive Organisasi.</span>
                  </li>
                </ul>
              </div>

              {/* Akun belajar.id */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>2. Akun belajar.id</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Mendukung Single Sign-On (SSO) Google login khusus domain <code>@guru.*.belajar.id</code>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Akses otomatis ke modul pelatihan Canva for Education dan Google Classroom.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Validasi prioritas bagi guru pengguna aktif Platform Merdeka Mengajar (PMM).</span>
                  </li>
                </ul>
              </div>

              {/* SIMPKB Integration */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Key className="w-5 h-5 text-purple-600" />
                  <span>3. Integrasi SIMPKB</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pencocokan Nomor SIMPKB / NUPTK peserta untuk konfirmasi jam kelulusan (32 JP).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Format ekspor sertifikat disesuaikan dengan skema nomor registrasi diklat Ditjen GTK.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Sinkronisasi data lulusan untuk pemenuhan SKP (Sasaran Kinerja Pegawai) Guru.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Test Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Konfirmasi Pengiriman Broadcast</h3>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-blue-900 space-y-1">
                <div className="font-bold">Akan Mengirim Pesan:</div>
                <div className="text-xs font-black">{selectedTemplate.judul}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Target Penerima:</span>
                <div className="font-bold text-slate-900">
                  {pesertaList.filter(p => p.statusValidasi === 'Valid').length} Peserta Berstatus Valid
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Saluran:</span>
                <div className="font-bold text-slate-900">{selectedTemplate.saluran}</div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleSimulateSend}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mulai Broadcast Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
