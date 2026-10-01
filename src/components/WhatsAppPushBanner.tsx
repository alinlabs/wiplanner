import React from 'react';
import { Bell, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  timeStr: string;
}

interface WhatsAppPushBannerProps {
  notification: PushNotificationPayload | null;
  onClose: () => void;
}

export const WhatsAppPushBanner: React.FC<WhatsAppPushBannerProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md bg-slate-900/95 dark:bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md"
      >
        <div className="flex items-start gap-3">
          {/* App Logo / WhatsApp Style Badge */}
          <div className="relative shrink-0 mt-0.5">
            <img
              src="/gambar/wikara_logo.webp"
              alt="Logo Wikara"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-slate-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full text-white">
              <Bell className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-400 tracking-wide uppercase">
                STIE Wikara Content Reminder
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {notification.timeStr}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
              {notification.title}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {notification.body}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            title="Tutup Notifikasi"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
