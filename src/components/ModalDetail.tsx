import React, { useState } from 'react';
import { Copy, Check, Video, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyContentPlan } from '../types/contentPlan';

interface ModalDetailProps {
  plan: DailyContentPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ModalDetail: React.FC<ModalDetailProps> = ({
  plan,
  isOpen,
  onClose
}) => {
  const [copiedDeskripsi, setCopiedDeskripsi] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const handleCopyDeskripsi = () => {
    if (!plan) return;
    navigator.clipboard.writeText(plan.deskripsi);
    setCopiedDeskripsi(true);
    setTimeout(() => setCopiedDeskripsi(false), 2000);
  };

  const handleCopyHashtags = () => {
    if (!plan) return;
    navigator.clipboard.writeText(plan.hashtag.join(' '));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const isVideo = plan?.jenis === 'Video';

  return (
    <AnimatePresence>
      {isOpen && plan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Soft subtle light blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/30 dark:bg-black/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal / Bottom Sheet Card */}
          <motion.div
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              damping: 32,
              stiffness: 300,
              mass: 0.8
            }}
            className="relative w-full max-h-[88vh] sm:max-h-[90vh] sm:max-w-2xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div>
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500 tracking-wide block">
                  Detail Rencana Konten
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {plan.tanggal}
                </h3>
              </div>

              <button
                onClick={onClose}
                title="Tutup Modal"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* 1. ISI HOOK */}
              <div className="bg-blue-50/70 dark:bg-slate-950 border-l-4 border-blue-600 p-4 rounded-r-2xl space-y-1.5">
                <span className="block text-[11px] sm:text-xs font-normal text-slate-500 dark:text-slate-400 tracking-wide">
                  {plan.pillar}
                </span>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white italic leading-relaxed">
                  {plan.hook.replace(/^["'“”]+|["'“”]+$/g, '')}
                </p>
              </div>

              {/* 2. JENIS BADGE */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  {isVideo ? (
                    <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  )}
                  {plan.jenis}
                </span>
              </div>

              {/* 3. TARGET KONTEN */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Target
                </span>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs font-medium">
                  {plan.targetKonten}
                </div>
              </div>

              {/* 4. TUJUAN KONTEN */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Tujuan
                </span>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs font-medium">
                  {plan.tujuanKonten}
                </div>
              </div>

              {/* 5. DETAIL (ARAHAN KONTEN BULLET POINTS) */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Detail
                </span>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs">
                  <ul className="space-y-2 list-none">
                    {plan.detail.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-base leading-none select-none">•</span>
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 6. CAPTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Caption
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyDeskripsi}
                    title={copiedDeskripsi ? 'Tersalin!' : 'Salin Caption'}
                    aria-label="Salin Caption"
                    className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors border border-blue-200/60 dark:border-blue-800 cursor-pointer"
                  >
                    {copiedDeskripsi ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans shadow-2xs">
                  {plan.deskripsi}
                </div>
              </div>

              {/* 7. HASHTAG */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Hashtag
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyHashtags}
                    title={copiedHashtags ? 'Tersalin!' : 'Salin Semua Hashtag'}
                    aria-label="Salin Semua Hashtag"
                    className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedHashtags ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {plan.hashtag.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
