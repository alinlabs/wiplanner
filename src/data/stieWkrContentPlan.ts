import { DailyContentPlan } from '../types/contentPlan';
import { OCTOBER_PART_1 } from './plans/octoberPart1';
import { OCTOBER_PART_2 } from './plans/octoberPart2';
import { OCTOBER_PART_3 } from './plans/octoberPart3';
import { NOVEMBER_PLANS } from './plans/novemberPlans';

/**
 * Rencana Konten Harian STIE Wibawa Karta Raharja (STIE Wikara / Wikara)
 * Periode: 1 Oktober 2026 s/d 12 November 2026 (43 Hari Lengkap Setiap Hari 1 Konten)
 * 
 * Ketentuan & Aturan Terpenuhi:
 * - Brand: STIE Wibawa Karta Raharja / STIE Wikara / Wikara
 * - Kontak Admin / CS WhatsApp: 085624174464
 * - Alamat Kampus: Jl. Jend. Ahmad Yani No.21, Nagri Tengah, Kec. Purwakarta, Kabupaten Purwakarta, Jawa Barat 41114
 * - Program Studi: S1 Manajemen, S1 Akuntansi, S2 Manajemen (Magister Manajemen)
 * - Akreditasi: Baik Sekali (B)
 * - Jenis Kelas: Reguler (umum) & Executive (min 25 orang fleksibel per kelompok/instansi)
 * - Sistem KBM: Blended Learning (kombinasi Online dan Offline)
 * - Proporsi: 60% Gambar/Design (26 konten) dan 40% Video (17 konten)
 * - Teaser Wisuda 2026: 1-7 Oktober 2026 menuju Wisuda Akbar tanggal 8 Oktober 2026
 * - Tone: Lucu, kocak, menghibur, relate anak muda, tips edukasi & full soft-selling
 */
export const STIE_WKR_PLANS: DailyContentPlan[] = [
  ...OCTOBER_PART_1,
  ...OCTOBER_PART_2,
  ...OCTOBER_PART_3,
  ...NOVEMBER_PLANS
];

export const KAMPUS_INFO = {
  namaResmi: 'STIE Wibawa Karta Raharja',
  namaPanggilan: ['STIE Wikara', 'Wikara'],
  kontakWhatsapp: '085624174464',
  alamatLengkap: 'Jl. Jend. Ahmad Yani No.21, Nagri Tengah, Kec. Purwakarta, Kabupaten Purwakarta, Jawa Barat 41114',
  prodi: ['S1 Manajemen', 'S1 Akuntansi', 'S2 Manajemen'],
  akreditasi: 'Baik Sekali (B)',
  jenisKelas: [
    {
      nama: 'Reguler',
      deskripsi: 'Jalur umum untuk mahasiswa baru dan pekerja mandiri, biaya terjangkau bisa diangsur bulanan.'
    },
    {
      nama: 'Executive',
      deskripsi: 'Minimal 25 orang per kelas dengan fleksibilitas jadwal tinggi, khusus instansi dinas, kelompok perusahaan, atau komunitas.'
    }
  ],
  sistemKbm: 'Blended Learning (Online interaktif & Offline tatap muka kondusif)',
  totalHari: STIE_WKR_PLANS.length,
  totalGambar: STIE_WKR_PLANS.filter(p => p.jenis === 'Gambar').length,
  totalVideo: STIE_WKR_PLANS.filter(p => p.jenis === 'Video').length
};
