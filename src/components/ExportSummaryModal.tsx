import React, { useState } from 'react';
import { X, Download, Copy, Check, Printer, FileSpreadsheet } from 'lucide-react';
import { DailyContentPlan, DailyStoryPlan } from '../types/contentPlan';
import { exportToExcel, exportToJSON } from '../utils/exportUtils';

interface ExportSummaryModalProps {
  plans: DailyContentPlan[];
  stories?: DailyStoryPlan[];
  onClose: () => void;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  plans,
  stories = [],
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const generatePlainTextSummary = () => {
    let summary = `CONTENT PLAN HARIAN STIE WIBAWA KARTA RAHARJA (STIE WIKARA PURWAKARTA)\n`;
    summary += `Periode: 1 Oktober 2026 s/d 12 November 2026\n`;
    summary += `Struktur: Konten Gambar Harian + Video Selang-Seling (Feed) + 2 Story / Hari (Gambar & Video)\n`;
    summary += `Lokasi: STIE Wikara Purwakarta | Kontak WA: 085624174464\n`;
    summary += `Akreditasi: Baik Sekali (B) | KBM: Blended Learning (Online & Offline)\n`;
    summary += `Prodi: S1 Manajemen, S1 Akuntansi, S2 Manajemen (Kelas Reguler & Executive min 25 orang)\n`;
    summary += `========================================================\n\n`;

    summary += `### BAGIAN 1: RENCANA KONTEN UTAMA (FEED)\n\n`;
    plans.forEach((p) => {
      summary += `TANGGAL: ${p.tanggal} (Hari 0${p.hariKe})\n`;
      summary += `PILLAR: ${p.pillar}\n`;
      summary += `JENIS: ${p.jenis}\n`;
      summary += `HOOK: ${p.hook}\n`;
      summary += `DETAIL:\n`;
      p.detail.forEach((item) => {
        summary += `   • ${item}\n`;
      });
      summary += `DESKRIPSI:\n${p.deskripsi}\n\n`;
      summary += `HASHTAG:\n${p.hashtag.join(' ')}\n`;
      summary += `--------------------------------------------------------\n\n`;
    });

    if (stories.length > 0) {
      summary += `\n========================================================\n`;
      summary += `### BAGIAN 2: RENCANA STORY HARIAN (IG & TIKTOK - 2 STORY / HARI)\n`;
      summary += `Format Story: Hook, Jenis, Pillar, Detail (Tanpa Caption / Hashtag)\n`;
      summary += `========================================================\n\n`;

      stories.forEach((s) => {
        summary += `TANGGAL: ${s.tanggal} (Hari 0${s.hariKe})\n`;
        summary += `JENIS: ${s.jenis} (Story)\n`;
        summary += `PILLAR: ${s.pillar}\n`;
        summary += `HOOK: ${s.hook}\n`;
        summary += `ARAHAN DETAIL STORY:\n`;
        s.detail.forEach((item) => {
          summary += `   • ${item}\n`;
        });
        summary += `--------------------------------------------------------\n\n`;
      });
    }

    return summary;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generatePlainTextSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const exportData = {
      kampus: 'STIE Wibawa Karta Raharja (STIE Wikara Purwakarta)',
      periode: '1 Oktober 2026 s/d 12 November 2026',
      totalFeedPlans: plans.length,
      totalStoryPlans: stories.length,
      feedPlans: plans,
      storyPlans: stories
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Content_Plan_Feed_Story_STIE_Wikara_2026.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 my-8 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Export Content Plan & Story STIE WKR
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lengkap Feed Konten ({plans.length}) + Story Harian ({stories.length})
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-4">
          <button
            onClick={handleCopySummary}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Naskah'}</span>
          </button>

          <button
            onClick={() => exportToExcel(plans, stories)}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Unduh Excel</span>
          </button>

          <button
            onClick={() => exportToJSON(plans, stories)}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Unduh JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Cetak PDF</span>
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-800 dark:text-slate-300 max-h-80 overflow-y-auto whitespace-pre-line leading-relaxed">
          {generatePlainTextSummary()}
        </div>
      </div>
    </div>
  );
};
