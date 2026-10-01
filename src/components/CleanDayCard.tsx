import React from 'react';
import { Video, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { DailyContentPlan } from '../types/contentPlan';

interface CleanDayCardProps {
  plan: DailyContentPlan;
  onClick?: () => void;
}

export const CleanDayCard: React.FC<CleanDayCardProps> = ({ plan, onClick }) => {
  const isVideo = plan.jenis === 'Video';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="hover-shimmer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer transition-all duration-300 space-y-4 group relative"
    >
      {/* BARIS ATAS: TIPE POSTINGAN (KIRI) */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide block">
          Konten Utama
        </span>
      </div>

      {/* ISI HOOK DENGAN PILLAR KECIL TIPIS DI PALING ATAS */}
      <div className="bg-blue-50/60 dark:bg-slate-950/80 border-l-4 border-blue-600 p-4 rounded-r-2xl space-y-1.5">
        <span className="block text-[11px] sm:text-xs font-normal text-slate-500 dark:text-slate-400 tracking-wide">
          {plan.pillar}
        </span>
        <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white italic leading-relaxed">
          {plan.hook.replace(/^["'“”]+|["'“”]+$/g, '')}
        </p>
      </div>

      {/* BARIS BAWAH: BADGE JENIS (KIRI) & LIHAT DETAIL SEJAJAR (KANAN) */}
      <div className="flex items-center justify-between pt-0.5">
        {/* Badge Jenis: Putih outline abu tipis, icon biru */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
          {isVideo ? (
            <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          )}
          {plan.jenis}
        </span>

        {/* Tombol Lihat Detail Sejajar di Paling Kanan */}
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
          <span>Lihat Detail</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.div>
  );
};
