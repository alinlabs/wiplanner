import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { DailyContentPlan } from '../types/contentPlan';

interface MonthlyCalendarSelectorProps {
  plans: DailyContentPlan[];
  selectedIsoDates: string[];
  onToggleDate: (isoDate: string) => void;
  onSelectDates: (dates: string[]) => void;
}

// Helper function to generate ALL consecutive ISO dates in range (inclusive)
const getAllDatesInRange = (startIso: string, endIso: string): string[] => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [startIso];

  const min = start <= end ? new Date(start) : new Date(end);
  const max = start <= end ? new Date(end) : new Date(start);

  const dates: string[] = [];
  const cur = new Date(min);

  while (cur <= max) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

export const MonthlyCalendarSelector: React.FC<MonthlyCalendarSelectorProps> = ({
  plans,
  selectedIsoDates,
  onSelectDates
}) => {
  const initialMonth = selectedIsoDates[0]?.startsWith('2026-11') ? '2026-11' : '2026-10';
  const [currentMonth, setCurrentMonth] = useState<'2026-10' | '2026-11'>(initialMonth);

  // Range Selection State
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);

  const planDateMap = new Map(plans.map(p => [p.tanggalIso, p]));
  const weekDays = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

  const getMonthDays = (yearMonth: '2026-10' | '2026-11') => {
    const isOct = yearMonth === '2026-10';
    const totalDays = isOct ? 31 : 30;
    const firstDayIndex = isOct ? 3 : 6;

    const days: Array<{
      dayNum: number | null;
      isoDate: string | null;
      colIndex: number;
      hasPlan: boolean;
      plan?: DailyContentPlan;
    }> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNum: null, isoDate: null, colIndex: i, hasPlan: false });
    }

    for (let d = 1; d <= totalDays; d++) {
      const idx = days.length % 7;
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      const iso = `${yearMonth}-${dayStr}`;
      const plan = planDateMap.get(iso);
      days.push({
        dayNum: d,
        isoDate: iso,
        colIndex: idx,
        hasPlan: !!plan,
        plan
      });
    }

    return days;
  };

  const days = getMonthDays(currentMonth);
  const monthTitle = currentMonth === '2026-10' ? 'Oktober 2026' : 'November 2026';

  const handlePrevMonth = () => setCurrentMonth('2026-10');
  const handleNextMonth = () => setCurrentMonth('2026-11');

  // Toggle Range Mode Switch
  const handleToggleRangeMode = () => {
    const nextMode = !isRangeMode;
    setIsRangeMode(nextMode);
    setRangeStart(null);
    if (!nextMode && selectedIsoDates.length > 1) {
      onSelectDates([selectedIsoDates[0]]);
    }
  };

  // Date Click Handler
  const handleDateClick = (isoDate: string) => {
    if (!isRangeMode) {
      // Single Date Mode
      onSelectDates([isoDate]);
      return;
    }

    // Range Mode
    if (!rangeStart) {
      setRangeStart(isoDate);
      onSelectDates([isoDate]);
    } else {
      const rangeDates = getAllDatesInRange(rangeStart, isoDate);
      onSelectDates(rangeDates);
      setRangeStart(null);
    }
  };

  // Range Calculations for continuous connected band
  const sortedSelected = [...selectedIsoDates].sort();
  const minSelected = sortedSelected[0];
  const maxSelected = sortedSelected[sortedSelected.length - 1];
  const hasMultipleSelected = sortedSelected.length > 1;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs transition-all duration-300">
      {/* Flush Edge-to-Edge Blue Gradient Header Banner with Hover Shimmer Effect */}
      <div className="relative overflow-hidden group/header bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white px-4 sm:px-5 py-3 flex items-center justify-between shadow-xs">
        {/* Shimmer Light Ray Overlay on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover/header:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

        <button
          onClick={handlePrevMonth}
          disabled={currentMonth === '2026-10'}
          className="relative z-10 p-1 rounded-lg text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
          title="Bulan Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <h3 className="relative z-10 text-sm sm:text-base font-extrabold text-white tracking-wide">
          {monthTitle}
        </h3>

        <button
          onClick={handleNextMonth}
          disabled={currentMonth === '2026-11'}
          className="relative z-10 p-1 rounded-lg text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
          title="Bulan Berikutnya"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Calendar Card Body */}
      <div className="p-3.5 sm:p-4 space-y-3.5">
        {/* Weekday Names Header */}
        <div className="grid grid-cols-7 gap-0 text-center">
          {weekDays.map((w, idx) => (
            <div
              key={idx}
              className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-0.5"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Clean Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-y-1.5 gap-x-0">
          {days.map((d, index) => {
            if (!d.dayNum || !d.isoDate) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-8 sm:h-9"
                />
              );
            }

            const isoDate = d.isoDate;
            const isSelected = selectedIsoDates.includes(isoDate);
            const hasPlan = d.hasPlan;
            const colIndex = d.colIndex;
            const isPendingStart = isRangeMode && rangeStart === isoDate;

            const isOverallStart = hasMultipleSelected && isSelected && isoDate === minSelected;
            const isOverallEnd = hasMultipleSelected && isSelected && isoDate === maxSelected;
            const isInBetweenRange = hasMultipleSelected && isSelected && !isOverallStart && !isOverallEnd;
            const isSingle = isSelected && !hasMultipleSelected;

            // Class generation for row-aware connected bands
            let cellStyle = '';
            if (isPendingStart) {
              cellStyle = 'bg-blue-600 text-white font-black rounded-xl shadow-xs ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 animate-pulse cursor-pointer';
            } else if (isSingle) {
              cellStyle = 'bg-blue-600 text-white font-black rounded-xl shadow-xs cursor-pointer';
            } else if (isOverallStart) {
              cellStyle = 'bg-blue-600 text-white font-black shadow-xs z-10 border-l-2 border-y-2 border-blue-600 cursor-pointer ' +
                (colIndex === 6 ? 'rounded-xl' : 'rounded-l-xl rounded-r-none');
            } else if (isOverallEnd) {
              cellStyle = 'bg-blue-600 text-white font-black shadow-xs z-10 border-r-2 border-y-2 border-blue-600 cursor-pointer ' +
                (colIndex === 0 ? 'rounded-xl' : 'rounded-r-xl rounded-l-none');
            } else if (isInBetweenRange) {
              cellStyle = 'bg-blue-100 dark:bg-blue-950/90 text-blue-900 dark:text-blue-100 font-extrabold border-y-2 border-blue-400/80 dark:border-blue-600/80 cursor-pointer ' +
                (colIndex === 0 ? 'rounded-l-xl border-l-2' : colIndex === 6 ? 'rounded-r-xl border-r-2' : 'rounded-none');
            } else if (hasPlan) {
              cellStyle = 'text-slate-900 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer';
            } else {
              cellStyle = 'text-slate-300 dark:text-slate-600 font-normal opacity-40 hover:opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-xl cursor-pointer';
            }

            return (
              <motion.button
                key={isoDate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(isoDate)}
                className={`relative h-8 sm:h-9 flex items-center justify-center transition-all duration-150 text-xs sm:text-sm ${cellStyle}`}
              >
                <span>{d.dayNum}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Seekbar Switch: Set Dari Tanggal Ke Tanggal */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Set Dari Tanggal Ke Tanggal
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={isRangeMode}
            onClick={handleToggleRangeMode}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isRangeMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
            title={isRangeMode ? 'Matikan Mode Rentang Tanggal' : 'Aktifkan Mode Rentang Tanggal'}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isRangeMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
