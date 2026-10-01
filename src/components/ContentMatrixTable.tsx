import React from 'react';
import { DailyContentPlan, DailyStoryPlan } from '../types/contentPlan';

export type MatrixItem = DailyContentPlan | DailyStoryPlan;

interface ContentMatrixTableProps {
  plans: MatrixItem[];
  onSelectPlan: (plan: MatrixItem) => void;
}

// Helper to format date into 2 lines: "Kamis," & "1 Okt 26"
const formatMatrixDate = (tanggalStr: string) => {
  const parts = tanggalStr.split(',');
  if (parts.length >= 2) {
    const dayName = parts[0].trim() + ',';
    let datePart = parts[1].trim();
    datePart = datePart
      .replace(/September/g, 'Sept')
      .replace(/Oktober/g, 'Okt')
      .replace(/November/g, 'Nov')
      .replace(/2026/g, '26');
    return { dayName, datePart };
  }
  return { dayName: tanggalStr, datePart: '' };
};

export const ContentMatrixTable: React.FC<ContentMatrixTableProps> = ({
  plans,
  onSelectPlan
}) => {
  if (plans.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Belum ada tanggal yang dipilih
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Silakan klik tanggal pada kalender di atas untuk menampilkan rencana konten.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3 px-3.5 sm:px-4 w-[16%] min-w-[95px]">Tanggal</th>
              <th className="py-3 px-3.5 sm:px-4 w-[28%] min-w-[150px]">Jenis & Pilar</th>
              <th className="py-3 px-3.5 sm:px-4">Hook Konten</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
            {plans.map((plan) => {
              const { dayName, datePart } = formatMatrixDate(plan.tanggal);
              const isStory = !('deskripsi' in plan);

              return (
                <tr
                  key={plan.id}
                  onClick={() => onSelectPlan(plan)}
                  className="hover:bg-blue-50/60 dark:hover:bg-blue-950/40 transition-colors cursor-pointer group"
                >
                  {/* Tanggal - 2 Lines Format */}
                  <td className="py-3 px-3.5 sm:px-4 font-bold whitespace-nowrap align-top">
                    <span className="block text-slate-900 dark:text-slate-100 font-extrabold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {dayName}
                    </span>
                    <span className="block text-slate-500 dark:text-slate-400 font-semibold text-[11px] sm:text-xs leading-tight mt-0.5">
                      {datePart}
                    </span>
                  </td>

                  {/* Jenis & Pilar - Teks Biasa Tanpa Badge / Icon */}
                  <td className="py-3 px-3.5 sm:px-4 align-top">
                    <span className="block text-slate-900 dark:text-slate-100 font-extrabold text-xs sm:text-sm leading-tight">
                      {isStory ? `Story • ${plan.jenis}` : plan.jenis}
                    </span>
                    <span className="block text-slate-600 dark:text-slate-400 font-medium text-[11px] sm:text-xs mt-0.5 leading-snug">
                      {plan.pillar}
                    </span>
                  </td>

                  {/* Hook Konten */}
                  <td className="py-3 px-3.5 sm:px-4 font-semibold text-slate-800 dark:text-slate-200 leading-relaxed italic align-top">
                    "{plan.hook.replace(/^["'“”]+|["'“”]+$/g, '')}"
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
