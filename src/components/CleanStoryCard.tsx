import React from 'react';
import { Video, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { DailyStoryPlan } from '../types/contentPlan';

interface CleanStoryCardProps {
  story: DailyStoryPlan;
  onClick?: () => void;
}

export const CleanStoryCard: React.FC<CleanStoryCardProps> = ({ story, onClick }) => {
  const isVideo = story.jenis === 'Video';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="hover-shimmer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/80 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-rose-500/10 cursor-pointer transition-all duration-300 space-y-4 group relative"
    >
      {/* BARIS ATAS: TIPE POSTINGAN (KIRI) */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 tracking-wide block">
          Short Story
        </span>
      </div>

      {/* ISI HOOK STORY DENGAN PILLAR KECIL TIPIS DI PALING ATAS */}
      <div className="bg-rose-50/70 dark:bg-rose-950/20 border-l-4 border-rose-500 p-4 rounded-r-2xl space-y-1.5">
        <span className="block text-[11px] sm:text-xs font-normal text-slate-500 dark:text-slate-400 tracking-wide">
          {story.pillar}
        </span>
        <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white italic leading-relaxed">
          {story.hook.replace(/^["'“”]+|["'“”]+$/g, '')}
        </p>
      </div>

      {/* BARIS BAWAH: BADGE JENIS (KIRI) & LIHAT DETAIL SEJAJAR (KANAN) */}
      <div className="flex items-center justify-between pt-0.5">
        {/* Badge Jenis: Putih outline abu tipis, icon merah */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
          {isVideo ? (
            <Video className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          )}
          {story.jenis}
        </span>

        {/* Tombol Lihat Detail Sejajar di Paling Kanan */}
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 opacity-80 group-hover:opacity-100 transition-opacity">
          <span>Lihat Detail</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.div>
  );
};
