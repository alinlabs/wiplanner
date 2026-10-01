import { DailyStoryPlan } from '../types/contentPlan';
import { OCTOBER_STORIES_1 } from './stories/octoberStories1';
import { OCTOBER_STORIES_2 } from './stories/octoberStories2';
import { OCTOBER_STORIES_3 } from './stories/octoberStories3';
import { NOVEMBER_STORIES } from './stories/novemberStories';

/**
 * Rencana Story Harian STIE Wikara Purwakarta (Instagram & TikTok Stories)
 * Periode: 1 Oktober 2026 s/d 12 November 2026 (43 Hari Lengkap x 2 Story = 86 Story)
 * 
 * Karakteristik Story:
 * - 2 Story di setiap tanggal: 1 Gambar & 1 Video
 * - Format: Hook, Jenis, Pillar, Detail (Tanpa Caption & Tanpa Hashtag)
 * - Tujuan: Mendukung konten utama feed harian dengan angle interaktif (Stiker Poll, Q&A, Repost UGC/tren, BTS)
 */
export const STIE_WKR_STORIES: DailyStoryPlan[] = [
  ...OCTOBER_STORIES_1,
  ...OCTOBER_STORIES_2,
  ...OCTOBER_STORIES_3,
  ...NOVEMBER_STORIES
];

export const TOTAL_STORIES = STIE_WKR_STORIES.length;
export const TOTAL_STORY_GAMBAR = STIE_WKR_STORIES.filter(s => s.jenis === 'Gambar').length;
export const TOTAL_STORY_VIDEO = STIE_WKR_STORIES.filter(s => s.jenis === 'Video').length;
