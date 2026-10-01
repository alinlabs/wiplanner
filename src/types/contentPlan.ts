export type SocialPlatform = 'semua' | 'tiktok' | 'instagram' | 'linkedin' | 'facebook' | 'twitter';

export type ContentJenis = 'Gambar' | 'Video';

export interface DailyContentPlan {
  id: string;
  tanggal: string; // e.g. "Rabu, 30 September 2026"
  tanggalIso: string; // "2026-09-30"
  hariKe: number; // 1 to 43
  pillar: string; // e.g. "Relatable / Pain Point"
  jenis: ContentJenis; // "Gambar" atau "Video"
  hook: string; // Kalimat pembuka 0-3 detik untuk memikat penonton
  targetKonten: string; // Target audiens spesifik konten
  tujuanKonten: string; // Tujuan / Goal pemasaran konten
  detail: string[]; // Arahan detail isi konten berupa array bullet point
  deskripsi: string; // Naskah / Caption lengkap yang diposting
  hashtag: string[]; // Tagar resmi yang siap dicopy
}

export interface DailyStoryPlan {
  id: string;
  tanggal: string; // e.g. "Kamis, 1 Oktober 2026"
  tanggalIso: string; // "2026-10-01"
  hariKe: number; // 1 to 43
  jenis: ContentJenis; // "Gambar" atau "Video"
  pillar: string; // e.g. "Interaktif / Polling Story"
  hook: string; // Hook stiker / teks pembuka story
  detail: string[]; // Arahan teknis visual story, stiker interaktif, repost UGC, waktu posting
}

