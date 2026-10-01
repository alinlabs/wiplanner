import React, { useState } from 'react';
import { Copy, Check, Video, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyStoryPlan } from '../types/contentPlan';

interface ModalStoryDetailProps {
  story: DailyStoryPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ModalStoryDetail: React.FC<ModalStoryDetailProps> = ({
  story,
  isOpen,
  onClose
}) => {
  const [copiedDetail, setCopiedDetail] = useState(false);

  const handleCopyDetail = () => {
    if (!story) return;
    const textToCopy = `[STORY ${story.jenis.toUpperCase()} - ${story.tanggal}]\nHOOK: ${story.hook}\nPILLAR: ${story.pillar}\n\nARAHAN DETAIL:\n${story.detail.map((d) => `• ${d}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedDetail(true);
    setTimeout(() => setCopiedDetail(false), 2000);
  };

  const isVideo = story?.jenis === 'Video';

  return (
    <AnimatePresence>
      {isOpen && story && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
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
                  Detail Rencana Story
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {story.tanggal}
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
              {/* 1. ISI HOOK STORY */}
              <div className="bg-rose-50/70 dark:bg-rose-950/20 border-l-4 border-rose-500 p-4 rounded-r-2xl space-y-1.5">
                <span className="block text-[11px] sm:text-xs font-normal text-slate-500 dark:text-slate-400 tracking-wide">
                  {story.pillar}
                </span>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white italic leading-relaxed">
                  {story.hook.replace(/^["'“”]+|["'“”]+$/g, '')}
                </p>
              </div>

              {/* 2. JENIS BADGE */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  {isVideo ? (
                    <Video className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  )}
                  {story.jenis}
                </span>
              </div>

              {/* 3. DETAIL (ARAHAN TEKNIS STORY: STIKER, REPOST UGC, JAM TAYANG) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Detail
                  </span>
                  <button
                    onClick={handleCopyDetail}
                    title={copiedDetail ? 'Tersalin!' : 'Salin Detail'}
                    className="p-1.5 rounded-lg text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors border border-rose-200/70 dark:border-rose-800/60 cursor-pointer flex items-center justify-center"
                  >
                    {copiedDetail ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs">
                  <ul className="space-y-2.5 list-none">
                    {story.detail.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold text-base leading-none select-none">•</span>
                        <span className="leading-relaxed font-normal">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
