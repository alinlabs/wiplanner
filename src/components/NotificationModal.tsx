import React, { useState, useEffect } from 'react';
import { BellRing, CheckCircle2, AlertCircle, X, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  getNotificationPermission,
  isNotificationEnabledInApp,
  setNotificationEnabledInApp,
  requestNotificationPermission,
  sendTestNotification,
  getNotificationTimes,
  setNotificationTimes
} from '../utils/notificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(getNotificationPermission());
  const [isEnabled, setIsEnabled] = useState<boolean>(isNotificationEnabledInApp());
  const [sendingTest, setSendingTest] = useState<boolean>(false);
  const [testSuccess, setTestSuccess] = useState<boolean>(false);

  // Time States (Format 24 Jam: HH:mm)
  const [morningTime, setMorningTimeState] = useState<string>('09:00');
  const [eveningTime, setEveningTimeState] = useState<string>('20:00');
  const [autoSavedNotice, setAutoSavedNotice] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPermission(getNotificationPermission());
      setIsEnabled(isNotificationEnabledInApp());
      setTestSuccess(false);

      const times = getNotificationTimes();
      setMorningTimeState(times.morningTime || '09:00');
      setEveningTimeState(times.eveningTime || '20:00');
      setAutoSavedNotice(false);
    }
  }, [isOpen]);

  const handleEnableToggle = async () => {
    if (permission !== 'granted') {
      const granted = await requestNotificationPermission();
      setPermission(getNotificationPermission());
      setIsEnabled(granted);
    } else {
      const nextState = !isEnabled;
      setIsEnabled(nextState);
      setNotificationEnabledInApp(nextState);
    }
  };

  const handleMorningTimeChange = (newTime: string) => {
    if (!newTime) return;
    setMorningTimeState(newTime);
    setNotificationTimes(newTime, eveningTime);
    setAutoSavedNotice(true);
    setTimeout(() => {
      setAutoSavedNotice(false);
    }, 2000);
  };

  const handleEveningTimeChange = (newTime: string) => {
    if (!newTime) return;
    setEveningTimeState(newTime);
    setNotificationTimes(morningTime, newTime);
    setAutoSavedNotice(true);
    setTimeout(() => {
      setAutoSavedNotice(false);
    }, 2000);
  };

  const handleTestNotification = async () => {
    setSendingTest(true);
    setTestSuccess(false);
    const success = await sendTestNotification();
    setPermission(getNotificationPermission());
    setIsEnabled(isNotificationEnabledInApp());
    setSendingTest(false);
    if (success) {
      setTestSuccess(true);
    }
  };

  const handleTimeInput = (
    rawVal: string,
    setLocalState: React.Dispatch<React.SetStateAction<string>>,
    saveCallback: (val: string) => void
  ) => {
    let clean = rawVal.replace(/[^0-9:]/g, '');
    
    // Auto insert colon if 4 digits entered e.g. "0900" -> "09:00"
    if (clean.length === 4 && !clean.includes(':')) {
      clean = `${clean.slice(0, 2)}:${clean.slice(2, 4)}`;
    }

    setLocalState(clean);

    if (/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(clean)) {
      saveCallback(clean);
    }
  };

  const handleTimeBlur = (
    val: string,
    setLocalState: React.Dispatch<React.SetStateAction<string>>,
    saveCallback: (val: string) => void,
    fallbackVal: string
  ) => {
    if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
      setLocalState(fallbackVal);
      saveCallback(fallbackVal);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal / Mobile Bottom Sheet Container */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] sm:max-h-[85vh] flex flex-col my-0 sm:my-auto"
          >
            {/* Header */}
            <div className="px-5 py-4 sm:p-6 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                    Pengingat Notifikasi Harian
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Atur Jam Notifikasi Device & Browser (Format 24 Jam)
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                title="Tutup Modal"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Permission Status Banner */}
              {permission === 'granted' ? (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3 text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-emerald-800 dark:text-emerald-300">
                      Izin Notifikasi Aktif & Disetujui
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                      Sistem siap mengirimkan pengingat otomatis ke perangkat Anda sesuai jadwal 24 Jam yang Anda pilih.
                    </p>
                  </div>
                </div>
              ) : permission === 'denied' ? (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3 text-amber-900 dark:text-amber-200">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-amber-800 dark:text-amber-300">
                      Izin Notifikasi Ditolak di Browser
                    </p>
                    <p className="text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                      Ubah izin <strong>Notifications</strong> menjadi <strong>Allow / Izinkan</strong> di pengaturan browser Anda.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-3 text-blue-900 dark:text-blue-200">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-extrabold text-blue-800 dark:text-blue-300">
                      Aktifkan Pengingat Otomatis
                    </p>
                    <p className="text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                      Izinkan notifikasi browser untuk menerima pengingat harian pada jam pilihan Anda.
                    </p>
                  </div>
                </div>
              )}

              {/* Custom Time Configuration Settings with Toggle Switch (SeekBar) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Jadwal pengingat
                  </span>

                  {/* Toggle Switch (Seekbar / Switch) to activate or deactivate notification */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {isEnabled ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <button
                      type="button"
                      onClick={handleEnableToggle}
                      role="switch"
                      aria-checked={isEnabled}
                      title={isEnabled ? 'Matikan Notifikasi' : 'Aktifkan Notifikasi'}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Time Setting 1: Morning Cek Plan */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="text-xs space-y-0.5 min-w-0 pr-2">
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        Pengingat Cek Plan
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Memeriksa target & persiapan postingan
                      </p>
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9:]*"
                      maxLength={5}
                      placeholder="00:00"
                      value={morningTime}
                      onChange={(e) => handleTimeInput(e.target.value, setMorningTimeState, (val) => handleMorningTimeChange(val))}
                      onBlur={(e) => handleTimeBlur(e.target.value, setMorningTimeState, (val) => handleMorningTimeChange(val), '09:00')}
                      className="w-20 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-extrabold text-xs text-blue-600 dark:text-blue-400 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-2xs cursor-text shrink-0"
                    />
                  </div>

                  {/* Time Setting 2: Evening Evaluasi Postingan */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="text-xs space-y-0.5 min-w-0 pr-2">
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        Pengingat Evaluasi
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Memastikan ketersediaan postingan & story
                      </p>
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9:]*"
                      maxLength={5}
                      placeholder="00:00"
                      value={eveningTime}
                      onChange={(e) => handleTimeInput(e.target.value, setEveningTimeState, (val) => handleEveningTimeChange(val))}
                      onBlur={(e) => handleTimeBlur(e.target.value, setEveningTimeState, (val) => handleEveningTimeChange(val), '20:00')}
                      className="w-20 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-extrabold text-xs text-rose-600 dark:text-rose-400 text-center focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono shadow-2xs cursor-text shrink-0"
                    />
                  </div>
                </div>
              </div>

              {/* Test Notification Button */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleTestNotification}
                  disabled={sendingTest}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm border border-blue-200/80 dark:border-blue-800/80 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{sendingTest ? 'Mengirim Notifikasi...' : 'Coba Notifikasi Sekarang (Tes)'}</span>
                </button>

                {testSuccess && (
                  <p className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                    ✓ Notifikasi tes berhasil dikirim ke perangkat Anda!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
