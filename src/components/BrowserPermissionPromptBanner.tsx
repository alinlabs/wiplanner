import React, { useState, useEffect } from 'react';
import { Bell, Check, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  isNotificationSupported,
  requestNotificationPermission
} from '../utils/notificationService';

export const BrowserPermissionPromptBanner: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [granted, setGranted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && isNotificationSupported()) {
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }
  }, []);

  const handleAllow = async () => {
    const success = await requestNotificationPermission();
    if (success) {
      setGranted(true);
      setTimeout(() => {
        setShowPrompt(false);
      }, 2000);
    } else {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        className="shrink-0 w-full bg-blue-600 text-white shadow-md border-b border-blue-700/80 px-4 py-2.5 z-40 relative"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-white/20 shrink-0">
              <Bell className="w-4 h-4 text-white animate-bounce" />
            </div>
            <p className="font-semibold text-white truncate">
              {granted ? (
                <span className="flex items-center gap-1.5 text-emerald-200 font-bold">
                  <Check className="w-4 h-4" />
                  Izin notifikasi browser berhasil diaktifkan!
                </span>
              ) : (
                <span>
                  Aktifkan notifikasi browser untuk pengingat rutin jam <strong>09.00</strong> & <strong>20.00 WIB</strong>
                </span>
              )}
            </p>
          </div>

          {!granted && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAllow}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Izinkan Notifikasi
              </button>
              <button
                onClick={handleDismiss}
                title="Nanti Saja"
                className="p-1.5 rounded-lg hover:bg-blue-700 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
