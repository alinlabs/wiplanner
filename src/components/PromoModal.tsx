import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container - Auto-adjusts width & height to image aspect ratio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 320,
            }}
            className="relative inline-block max-w-[88vw] sm:max-w-md max-h-[85vh] rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 cursor-pointer"
            onClick={onClose}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Tutup promo"
              className="absolute top-2.5 right-2.5 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Promo Image */}
            <img
              src="/gambar/promo_modal.webp"
              alt="Promo Info STIE WKR"
              className="w-full h-auto max-h-[85vh] object-contain block rounded-2xl sm:rounded-3xl"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

