/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MonthlyCalendarSelector } from './components/MonthlyCalendarSelector';
import { CleanDayCard } from './components/CleanDayCard';
import { CleanStoryCard } from './components/CleanStoryCard';
import { ExportSummaryModal } from './components/ExportSummaryModal';
import { ModalDetail } from './components/ModalDetail';
import { ModalStoryDetail } from './components/ModalStoryDetail';
import { NotificationModal } from './components/NotificationModal';
import { BrowserPermissionPromptBanner } from './components/BrowserPermissionPromptBanner';
import { WhatsAppPushBanner, PushNotificationPayload } from './components/WhatsAppPushBanner';
import { PromoModal } from './components/PromoModal';
import { BannerCarousel } from './components/BannerCarousel';
import { ContentMatrixTable, MatrixItem } from './components/ContentMatrixTable';
import { ImplementationView } from './components/ImplementationView';
import { TiktokView } from './components/TiktokView';
import { STIE_WKR_PLANS } from './data/stieWkrContentPlan';
import { STIE_WKR_STORIES } from './data/stieWkrStoryPlan';
import { DailyContentPlan, DailyStoryPlan } from './types/contentPlan';
import { initServiceWorker, checkAndTriggerScheduledNotifications, subscribeNotification, autoPromptNotificationPermission } from './utils/notificationService';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'plan' | 'instagram' | 'tiktok'>('plan');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('stie_wkr_theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return false; // Default: mode terang (putih + aksen biru)
  });

  const getInitialDate = () => {
    // Ambil tanggal hari ini berdasarkan jam perangkat pengguna (Local Time)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const localTodayIso = `${year}-${month}-${day}`;

    // 1. Jika tanggal hari ini ada di kalender, pilih otomatis tanggal tersebut!
    const planForToday = STIE_WKR_PLANS.find(p => p.tanggalIso === localTodayIso);
    if (planForToday) return planForToday.tanggalIso;

    // 2. Default ke tanggal 1 Oktober 2026
    const oct1Plan = STIE_WKR_PLANS.find(p => p.tanggalIso === '2026-10-01');
    if (oct1Plan) return oct1Plan.tanggalIso;

    return STIE_WKR_PLANS[0].tanggalIso;
  };

  const [selectedIsoDates, setSelectedIsoDates] = useState<string[]>(() => [
    getInitialDate()
  ]);
  const [isMatrixView, setIsMatrixView] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [activePushBanner, setActivePushBanner] = useState<PushNotificationPayload | null>(null);
  const [detailModalPlan, setDetailModalPlan] = useState<DailyContentPlan | null>(null);
  const [detailStoryPlan, setDetailStoryPlan] = useState<DailyStoryPlan | null>(null);
  const [promoModalOpen, setPromoModalOpen] = useState(true);

  // Initialize Service Worker, Notification listener, and Background Scheduled Notification Checks
  useEffect(() => {
    initServiceWorker();
    autoPromptNotificationPermission();
    checkAndTriggerScheduledNotifications();

    const handleFirstUserGesture = () => {
      autoPromptNotificationPermission();
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
    };

    window.addEventListener('click', handleFirstUserGesture, { once: true });
    window.addEventListener('touchstart', handleFirstUserGesture, { once: true });

    const unsubscribe = subscribeNotification((payload) => {
      setActivePushBanner(payload);
    });

    const intervalId = setInterval(() => {
      checkAndTriggerScheduledNotifications();
    }, 30000); // Check every 30 seconds

    return () => {
      unsubscribe();
      clearInterval(intervalId);
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
    };
  }, []);

  // Sync dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('stie_wkr_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('stie_wkr_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleToggleDate = (isoDate: string) => {
    setSelectedIsoDates(prev => {
      if (prev.includes(isoDate)) {
        return prev.filter(d => d !== isoDate);
      } else {
        return [...prev, isoDate];
      }
    });
  };

  // Filter & sort feed plans chronologically
  const selectedFeedPlans = useMemo(() => {
    return STIE_WKR_PLANS
      .filter(p => selectedIsoDates.includes(p.tanggalIso))
      .sort((a, b) => a.tanggalIso.localeCompare(b.tanggalIso));
  }, [selectedIsoDates]);

  // Filter & sort story plans chronologically
  const selectedStoryPlans = useMemo(() => {
    return STIE_WKR_STORIES
      .filter(s => selectedIsoDates.includes(s.tanggalIso))
      .sort((a, b) => a.tanggalIso.localeCompare(b.tanggalIso));
  }, [selectedIsoDates]);

  // Combined plans chronologically by date
  const displayedItems: MatrixItem[] = useMemo(() => {
    const sortedDates = [...selectedIsoDates].sort();
    const result: MatrixItem[] = [];
    sortedDates.forEach((dateIso) => {
      const feeds = selectedFeedPlans.filter(p => p.tanggalIso === dateIso);
      const stories = selectedStoryPlans.filter(s => s.tanggalIso === dateIso);
      result.push(...feeds, ...stories);
    });
    return result;
  }, [selectedFeedPlans, selectedStoryPlans, selectedIsoDates]);

  // Group displayed items by date for Card View
  const groupedItemsByDate = useMemo(() => {
    const sortedDates = [...selectedIsoDates].sort();
    return sortedDates.map((dateIso) => {
      const feeds = selectedFeedPlans.filter(p => p.tanggalIso === dateIso);
      const stories = selectedStoryPlans.filter(s => s.tanggalIso === dateIso);
      const items = [...feeds, ...stories];
      const dateLabel = items[0]?.tanggal || dateIso;
      return {
        dateIso,
        dateLabel,
        items
      };
    }).filter(group => group.items.length > 0);
  }, [selectedFeedPlans, selectedStoryPlans, selectedIsoDates]);

  const handleSelectMatrixItem = (item: MatrixItem) => {
    if ('deskripsi' in item) {
      setDetailModalPlan(item as DailyContentPlan);
    } else {
      setDetailStoryPlan(item as DailyStoryPlan);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 relative">
      {/* 0. Banner Prompt Izin Notifikasi Browser */}
      <BrowserPermissionPromptBanner />

      {/* 1. Header Terpisah di Paling Atas */}
      <Header
        onOpenExport={() => setExportModalOpen(true)}
        onOpenNotification={() => setNotificationModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        totalDays={STIE_WKR_PLANS.length}
        plans={STIE_WKR_PLANS}
        stories={STIE_WKR_STORIES}
      />

      {/* 2. ViewPager Tabs (Konten Plan | Instagram | TikTok) */}
      <div className="shrink-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 text-center">
            {/* Tab 1: Konten Plan */}
            <button
              onClick={() => setActiveTab('plan')}
              className={`relative py-3 text-xs sm:text-sm font-extrabold tracking-tight transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                activeTab === 'plan'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Konten Plan</span>
              {activeTab === 'plan' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>

            {/* Tab 2: Instagram */}
            <button
              onClick={() => setActiveTab('instagram')}
              className={`relative py-3 text-xs sm:text-sm font-extrabold tracking-tight transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                activeTab === 'instagram'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Instagram</span>
              {activeTab === 'instagram' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>

            {/* Tab 3: TikTok */}
            <button
              onClick={() => setActiveTab('tiktok')}
              className={`relative py-3 text-xs sm:text-sm font-extrabold tracking-tight transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                activeTab === 'tiktok'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>TikTok</span>
              {activeTab === 'tiktok' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Layout Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto relative w-full scroll-smooth">
        {/* Subtle radial ambient background glow */}
        {activeTab === 'plan' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.16),rgba(0,0,0,0))] pointer-events-none z-0" />
        )}

        {/* Main Content */}
        {activeTab === 'plan' ? (
          <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
            <motion.div
              key="tab-plan"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header Banner Slider */}
              <BannerCarousel />

              {/* Monthly Calendar Component */}
              <MonthlyCalendarSelector
                plans={STIE_WKR_PLANS}
                selectedIsoDates={selectedIsoDates}
                onToggleDate={handleToggleDate}
                onSelectDates={setSelectedIsoDates}
              />

              {/* Header Label for Content Cards & Mode Matrix Text Button */}
              <div className="flex items-center justify-between px-1 pt-1">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Daftar Rencana Konten
                </h2>

                {/* Right-aligned Text Link: Mode Matrix / Mode Kartu */}
                <button
                  onClick={() => setIsMatrixView(!isMatrixView)}
                  className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  title={isMatrixView ? 'Tampilkan Mode Kartu' : 'Tampilkan Mode Tabel Matrix'}
                >
                  {isMatrixView ? 'Mode Kartu' : 'Mode Matrix'}
                </button>
              </div>

              {/* Content Section (Cards or Matrix Table View) */}
              {isMatrixView ? (
                <ContentMatrixTable
                  plans={displayedItems}
                  onSelectPlan={handleSelectMatrixItem}
                />
              ) : (
                <div className="space-y-6">
                  {groupedItemsByDate.map((group) => (
                    <div key={group.dateIso} className="space-y-3">
                      {/* Date Section Header / Divider Outside Cards */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="inline-flex items-center px-4 py-1.5 bg-blue-600 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-xs">
                          <span>{group.dateLabel}</span>
                        </div>
                        <div className="flex-1 h-px bg-slate-200/80 dark:bg-slate-800" />
                      </div>

                      {/* Cards under this date */}
                      <div className="space-y-3">
                        <AnimatePresence>
                          {group.items.map((item) => {
                            const isStory = !('deskripsi' in item);

                            return (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                {isStory ? (
                                  <CleanStoryCard
                                    story={item as DailyStoryPlan}
                                    onClick={() => setDetailStoryPlan(item as DailyStoryPlan)}
                                  />
                                ) : (
                                  <CleanDayCard
                                    plan={item as DailyContentPlan}
                                    onClick={() => setDetailModalPlan(item as DailyContentPlan)}
                                  />
                                )}
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}

                  {groupedItemsByDate.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-2"
                    >
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Belum ada konten untuk tanggal yang dipilih
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Silakan klik tanggal pada kalender di atas untuk menampilkan rencana konten & story.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </main>
        ) : activeTab === 'instagram' ? (
          <motion.div
            key="tab-instagram"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full"
          >
            <ImplementationView />
          </motion.div>
        ) : (
          <motion.div
            key="tab-tiktok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full"
          >
            <TiktokView />
          </motion.div>
        )}

        {/* Clean Minimalist Footer (Only shown on Content Plan) */}
        {activeTab === 'plan' && (
          <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-black py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1.5 transition-colors relative z-10">
            <p className="font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
              “Konsistensi & strategi kreatif adalah kunci utama membangun jangkauan digital tanpa batas.”
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
              Managed & Empowered by AlinLabs
            </p>
          </footer>
        )}
      </div>

      {/* Export Modal */}
      {exportModalOpen && (
        <ExportSummaryModal
          plans={STIE_WKR_PLANS}
          stories={STIE_WKR_STORIES}
          onClose={() => setExportModalOpen(false)}
        />
      )}

      {/* Feed Detail Modal */}
      <ModalDetail
        plan={detailModalPlan}
        isOpen={!!detailModalPlan}
        onClose={() => setDetailModalPlan(null)}
      />

      {/* Story Detail Modal */}
      <ModalStoryDetail
        story={detailStoryPlan}
        isOpen={!!detailStoryPlan}
        onClose={() => setDetailStoryPlan(null)}
      />

      {/* WhatsApp-style Push Notification Banner */}
      <WhatsAppPushBanner
        notification={activePushBanner}
        onClose={() => setActivePushBanner(null)}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />

      {/* Promo Info Modal on Initial Load */}
      <PromoModal
        isOpen={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
      />
    </div>
  );
}
