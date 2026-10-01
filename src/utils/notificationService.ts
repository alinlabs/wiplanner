/**
 * Notification Service for STIE Wikara Content Planner
 * Handles Web Notifications, Service Worker registration, and scheduled daily reminders.
 */

const STORAGE_KEY_ENABLED = 'stie_wkr_notif_enabled';
const STORAGE_KEY_LOG = 'stie_wkr_notif_last_triggered';
const STORAGE_KEY_TIME_MORNING = 'stie_wkr_notif_time_morning';
const STORAGE_KEY_TIME_EVENING = 'stie_wkr_notif_time_evening';

export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  timeStr: string;
}

type NotificationListener = (payload: PushNotificationPayload) => void;
const listeners: Set<NotificationListener> = new Set();

export function subscribeNotification(cb: NotificationListener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function cleanTitle(title: string): string {
  // Remove any leading emojis or symbols at the start of notification titles
  return title.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1F300}-\u{1F5FF}]\s*/u, '').trim();
}

function notifyInApp(title: string, body: string): void {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const payload: PushNotificationPayload = { id: String(Date.now()), title: cleanTitle(title), body, timeStr };
  listeners.forEach((cb) => cb(payload));
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export function isNotificationEnabledInApp(): boolean {
  const saved = localStorage.getItem(STORAGE_KEY_ENABLED);
  if (saved === null) {
    return true; // Default enabled
  }
  return saved === 'true';
}

export function setNotificationEnabledInApp(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
}

export function getNotificationTimes(): { morningTime: string; eveningTime: string } {
  if (typeof window === 'undefined') {
    return { morningTime: '09:00', eveningTime: '20:00' };
  }
  const morningTime = localStorage.getItem(STORAGE_KEY_TIME_MORNING) || '09:00';
  const eveningTime = localStorage.getItem(STORAGE_KEY_TIME_EVENING) || '20:00';
  return { morningTime, eveningTime };
}

export function setNotificationTimes(morningTime: string, eveningTime: string): void {
  localStorage.setItem(STORAGE_KEY_TIME_MORNING, morningTime);
  localStorage.setItem(STORAGE_KEY_TIME_EVENING, eveningTime);
}

export async function initServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return reg;
  } catch (err) {
    console.warn('Service worker registration failed:', err);
    return null;
  }
}

export async function autoPromptNotificationPermission(): Promise<void> {
  if (typeof window === 'undefined' || !isNotificationSupported()) return;

  if (Notification.permission === 'default') {
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        setNotificationEnabledInApp(true);
        await initServiceWorker();
      }
    } catch (err) {
      console.warn('Auto prompt notification permission error:', err);
    }
  } else if (Notification.permission === 'granted') {
    setNotificationEnabledInApp(true);
    await initServiceWorker();
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    setNotificationEnabledInApp(true);
    return true;
  }

  try {
    const permission = await Notification.requestPermission();
    setNotificationEnabledInApp(true);
    if (permission === 'granted') {
      await initServiceWorker();
    }
    return true;
  } catch (err) {
    console.warn('Notification permission request handled:', err);
    setNotificationEnabledInApp(true);
    return true;
  }
}

interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  renotify?: boolean;
}

/**
 * Plays a pleasant double-tone audio chime (WhatsApp/iOS style) for instant device feedback
 */
function playNotificationChimeSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First tone (E5: 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Second tone (A5: 880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.35);
  } catch (err) {
    // Audio context play may be suppressed if no user gesture has occurred yet
  }
}

export async function triggerNotification(title: string, options: ExtendedNotificationOptions = {}): Promise<boolean> {
  const bodyText = options.body || '';
  const sanitizedTitle = cleanTitle(title);

  // Play audio chime
  playNotificationChimeSound();

  // Always show WhatsApp-style in-app notification banner
  notifyInApp(sanitizedTitle, bodyText);

  // Try browser native push notification if supported & granted
  if (isNotificationSupported() && Notification.permission === 'granted') {
    const defaultOptions: ExtendedNotificationOptions = {
      icon: '/gambar/wikara_logo.webp',
      badge: '/gambar/wikara_logo.webp',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      ...options
    };

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && 'showNotification' in reg) {
          await reg.showNotification(sanitizedTitle, defaultOptions as NotificationOptions);
          return true;
        }
      }
      new Notification(sanitizedTitle, defaultOptions as NotificationOptions);
      return true;
    } catch (err) {
      console.warn('Native notification suppressed by browser/iframe policy:', err);
    }
  }

  return true;
}

export async function sendTestNotification(): Promise<boolean> {
  if (isNotificationSupported() && Notification.permission !== 'granted') {
    await requestNotificationPermission();
  }

  const { morningTime, eveningTime } = getNotificationTimes();

  return triggerNotification('Notifikasi Pengingat Konten Terhubung!', {
    body: `Notifikasi aktif! Pengingat harian diset ke jam ${morningTime} WIB (Cek Plan) & jam ${eveningTime} WIB (Memastikan Postingan).`,
    tag: 'test-notification-' + Date.now(),
    renotify: true
  });
}

/**
 * Checks time every minute and triggers scheduled reminders based on user-customized times
 */
export function checkAndTriggerScheduledNotifications(): void {
  if (!isNotificationEnabledInApp()) return;

  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const { morningTime, eveningTime } = getNotificationTimes();
  const [morningHourStr, morningMinStr] = morningTime.split(':');
  const [eveningHourStr, eveningMinStr] = eveningTime.split(':');

  const mHour = parseInt(morningHourStr, 10) || 9;
  const mMin = parseInt(morningMinStr, 10) || 0;

  const eHour = parseInt(eveningHourStr, 10) || 20;
  const eMin = parseInt(eveningMinStr, 10) || 0;

  const lastTriggeredLog = JSON.parse(localStorage.getItem(STORAGE_KEY_LOG) || '{}');

  // Morning Reminder Check
  if (currentHour === mHour && currentMinute >= mMin && !lastTriggeredLog[`${todayKey}-morning-${morningTime}`]) {
    triggerNotification(`Cek Rencana Konten Hari Ini! (${morningTime})`, {
      body: 'Selamat pagi! Jangan lupa cek rencana postingan & short story STIE Wikara hari ini agar eksekusi lancar.',
      tag: `daily-m-${todayKey}`,
      renotify: true
    });
    lastTriggeredLog[`${todayKey}-morning-${morningTime}`] = true;
    localStorage.setItem(STORAGE_KEY_LOG, JSON.stringify(lastTriggeredLog));
  }

  // Evening Reminder Check
  if (currentHour === eHour && currentMinute >= eMin && !lastTriggeredLog[`${todayKey}-evening-${eveningTime}`]) {
    triggerNotification(`Evaluasi Postingan Hari Ini (${eveningTime})`, {
      body: 'Pengingat malam: Pastikan semua rencana konten utama & short story untuk hari ini sudah sukses diposting di media sosial!',
      tag: `daily-e-${todayKey}`,
      renotify: true
    });
    lastTriggeredLog[`${todayKey}-evening-${eveningTime}`] = true;
    localStorage.setItem(STORAGE_KEY_LOG, JSON.stringify(lastTriggeredLog));
  }
}
