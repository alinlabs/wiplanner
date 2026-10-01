import React from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { DownloadMenu } from './DownloadMenu';
import { DailyContentPlan, DailyStoryPlan } from '../types/contentPlan';

interface HeaderProps {
  onOpenExport: () => void;
  onOpenNotification: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  totalDays: number;
  plans: DailyContentPlan[];
  stories?: DailyStoryPlan[];
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onOpenNotification,
  isDarkMode,
  onToggleTheme,
  plans,
  stories = []
}) => {
  return (
    <header className="shrink-0 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Responsive Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <img
              src="/gambar/wikara_logo.webp"
              alt="Logo STIE Wikara"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain shrink-0 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-2xs"
              onError={(e) => {
                // If logo fails to load or file is unpopulated, keep clean placeholder fallback
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />

            <div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                <span className="hidden sm:inline">STIE Wibawa Karta Raharja</span>
                <span className="inline sm:hidden">STIE Wikara</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
                Content Planner By AlinLabs
              </p>
            </div>
          </div>

          {/* Right Controls: Theme Toggle, Notification & Download Menu (Titik Tiga) */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Theme Toggle Button (Paling Kiri) */}
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? 'Mode Terang (Putih)' : 'Mode Gelap (Total Gelap)'}
              className="p-1.5 sm:p-2 text-slate-800 hover:text-black dark:text-slate-100 dark:hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-slate-800 dark:text-slate-100" />
              ) : (
                <Moon className="w-5 h-5 text-slate-800 dark:text-slate-100" />
              )}
            </button>

            {/* Notification Bell Button (Samping Kiri Titik Tiga) */}
            <button
              onClick={onOpenNotification}
              title="Pengingat Notifikasi Harian"
              className="p-1.5 sm:p-2 text-slate-800 hover:text-black dark:text-slate-100 dark:hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Pengingat Notifikasi Harian"
            >
              <Bell className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            </button>

            {/* Download Popup Menu (Titik Tiga - Paling Kanan) */}
            <DownloadMenu
              plans={plans}
              stories={stories}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

