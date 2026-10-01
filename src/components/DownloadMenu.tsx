import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Smartphone, FileSpreadsheet, FileCode, CheckCircle2, X, Share2, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { exportToExcel, exportToJSON } from '../utils/exportUtils';
import { DailyContentPlan, DailyStoryPlan } from '../types/contentPlan';

interface DownloadMenuProps {
  plans: DailyContentPlan[];
  stories?: DailyStoryPlan[];
}

export const DownloadMenu: React.FC<DownloadMenuProps> = ({
  plans,
  stories = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPWAGuideModal, setShowPWAGuideModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Toast notification timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleInstallApp = async () => {
    setIsOpen(false);

    if (isInstalled) {
      setToastMessage('✅ Aplikasi STIE WKR sudah terinstall di perangkat Anda!');
      return;
    }

    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        setToastMessage('🎉 Aplikasi berhasil diinstall!');
      } else if (outcome === 'no-prompt') {
        setShowPWAGuideModal(true);
      }
    } else {
      // Show PWA guide modal for iOS or browsers that don't auto-prompt
      setShowPWAGuideModal(true);
    }
  };

  const handleDownloadExcelAction = () => {
    setIsOpen(false);
    exportToExcel(plans, stories);
    setToastMessage('📊 File Excel (.csv) berhasil diunduh!');
  };

  const handleDownloadJSONAction = () => {
    setIsOpen(false);
    exportToJSON(plans, stories);
    setToastMessage('📄 File JSON berhasil diunduh!');
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Three Dots Main Icon Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        title="Menu Opsi & Download"
        className="p-1.5 sm:p-2 text-slate-800 hover:text-black dark:text-slate-100 dark:hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
        aria-label="Menu Opsi & Download"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5 text-slate-800 dark:text-slate-100" />
      </button>

      {/* Toast Notification Floating Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-2xl shadow-xl border border-slate-700/50 dark:border-slate-200 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Popup Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-2 z-50 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                Menu Download
              </span>
            </div>

            <div className="space-y-1">
              {/* Option 1: Install Aplikasi PWA */}
              <button
                onClick={handleInstallApp}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Install Aplikasi
                    </span>
                    {isInstalled ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                        Terinstall
                      </span>
                    ) : isInstallable ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 animate-pulse">
                        Siap
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Simpan sebagai PWA resmi di HP / Desktop untuk akses langsung tanpa browser.
                  </p>
                </div>
              </button>

              {/* Option 2: Download Excel */}
              <button
                onClick={handleDownloadExcelAction}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block">
                    Download Excel
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Ekspor tabel rencana konten ke format .csv / .xlsx siap buka di Microsoft Excel.
                  </p>
                </div>
              </button>

              {/* Option 3: Download JSON */}
              <button
                onClick={handleDownloadJSONAction}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors block">
                    Download JSON
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Unduh data struktur mentah format JSON lengkap untuk kebutuhan integrasi.
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Installation Guidance Modal (iOS & Desktop Manual Guide) */}
      <AnimatePresence>
        {showPWAGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPWAGuideModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                    Cara Install Aplikasi
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    STIE WKR Content Planner PWA
                  </p>
                </div>
              </div>

              {isIOS ? (
                /* iOS Safari Guide */
                <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <p>
                      Ketuk tombol <strong className="text-blue-600 dark:text-blue-400 flex inline-flex items-center gap-1">Bagikan / Share <Share2 className="w-3 h-3" /></strong> di bilah navigasi Safari bawah.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <p>
                      Gulir ke bawah lalu pilih <strong className="text-blue-600 dark:text-blue-400 flex inline-flex items-center gap-1">Tambah ke Layar Utama <PlusSquare className="w-3 h-3" /></strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <p>
                      Aplikasi STIE WKR akan langsung muncul di beranda iPhone/iPad Anda seperti aplikasi native!
                    </p>
                  </div>
                </div>
              ) : (
                /* Android / Chrome / Desktop Browser Guide */
                <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <p>
                      Ketuk ikon <strong className="text-blue-600 dark:text-blue-400">titik tiga (⋮)</strong> atau tombol install di sudut kanan atas browser Anda.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <p>
                      Pilih menu <strong className="text-blue-600 dark:text-blue-400">"Install Aplikasi"</strong> atau <strong className="text-blue-600 dark:text-blue-400">"Tambahkan ke Layar Utama"</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <p>
                      Aplikasi siap digunakan secara offline kapan saja dari layar perangkat Anda.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowPWAGuideModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Mengerti & Tutup
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
