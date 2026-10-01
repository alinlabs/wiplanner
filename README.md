# 📘 DOKUMENTASI PROSEDUR & PANDUAN PENGEMBANGAN BERKELANJUTAN
## STIE Wikara Social Media Content Planner
> **Managed & Empowered by AlinLabs**  
> **Aplikasi Resmi Rencana Konten & Strategi Sosial Media STIE Wibawa Karta Raharja**

---

## 📋 DAFTAR ISI
1. [Ringkasan Aplikasi & Tujuan Strategis](#1-ringkasan-aplikasi--tujuan-strategis)
2. [Spesifikasi Teknologi & Arsitektur Sistem](#2-spesifikasi-teknologi--arsitektur-sistem)
3. [Struktur Direktori Proyek](#3-struktur-direktori-proyek)
4. [Panduan Fitur Utam & Prosedur Penggunaan](#4-panduan-fitur-utama--prosedur-penggunaan)
   - [4.1 Kalender Konten & Matriks Strategi](#41-kalender-konten--matriks-strategi)
   - [4.2 Salin Konten & Detail Modal](#42-salin-konten--detail-modal)
   - [4.3 Ekspor & Download Laporan (PDF, Excel, CSV, JSON)](#43-ekspor--download-laporan-pdf-excel-csv-json)
   - [4.4 View Pager Live Instagram & TikTok](#44-view-pager-live-instagram--tiktok)
   - [4.5 Sistem Notifikasi Push & Pengingat Harian](#45-sistem-notifikasi-push--pengingat-harian)
   - [4.6 Header Minimalis & Mode Terang/Gelap](#46-header-minimalis--mode-teranggelap)
5. [Prosedur Pemeliharaan & Pembaruan Data Konten (SOP)](#5-prosedur-pemeliharaan--pembaruan-data-konten-sop)
   - [5.1 Menambah / Mengubah Rencana Konten Feed](#51-menambah--mengubah-rencana-konten-feed)
   - [5.2 Menambah / Mengubah Rencana Short Story](#52-menambah--mengubah-rencana-short-story)
   - [5.3 Mengganti Aset Logo, Gambar, & Favicon](#53-mengganti-aset-logo-gambar--favicon)
6. [Panduan Deployment & Operasional Server](#6-panduan-deployment--operasional-server)
   - [6.1 Deployment ke Vercel (Serverless Function & CDN)](#61-deployment-ke-vercel-serverless-function--cdn)
   - [6.2 Deployment ke Node.js / VPS Server](#62-deployment-ke-nodejs--vps-server)
7. [Perintah Pengembangan (Development Commands)](#7-perintah-pengembangan-development-commands)

---

## 1. RINGKASAN APLIKASI & TUJUAN STRATEGIS

**STIE Wikara Social Media Content Planner** adalah platform aplikasi web progresif (PWA) yang dirancang khusus untuk tim pengelola media sosial STIE Wibawa Karta Raharja (STIE Wikara). Aplikasi ini bertujuan untuk:
- **Menjamin Konsistensi Publikasi**: Memastikan postingan harian (Feed, Reels, Carousel) dan Short Story terencana secara terstruktur.
- **Efisiensi Kerja Tim**: Menyediakan Hook, Caption, Hashtag, dan Arahan Visual yang dapat disalin dengan satu kali klik.
- **Transparansi & Evaluasi**: Menyediakan fitur ekspor ringkasan laporan ke format PDF, Excel (XLSX), CSV, dan JSON untuk pelaporan manajemen.
- **Monitoring Live Sosial Media**: Menyediakan antarmuka *live view pager* untuk memantau tampilan profil Instagram (`@stie.wikara`) dan TikTok (`@stie_wikara`).

---

## 2. SPESIFIKASI TEKNOLOGI & ARSITEKTUR SISTEM

| Komponen | Teknologi / Library | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | Pemrograman komponen deklaratif dan *type-safe*. |
| **Build Tool & Bundler** | Vite 8 + esbuild | Pengompilasian sangat cepat dan siap produksi. |
| **Styling & UI** | Tailwind CSS v4 | Sistem styling utility-first responsif. |
| **Ikonografi & Animasi** | Lucide React & Motion (Framer Motion) | Ikon monokrom bersih dan animasi transisi halus. |
| **Backend & Server** | Express 4 + Node.js / Vercel Serverless | Server API proxy untuk membypass header CORS & X-Frame-Options. |
| **Service Worker / PWA** | Web App Manifest + `sw.js` | Akses offline, instalasi PWA, dan notifikasi push perangkat. |

---

## 3. STRUKTUR DIREKTORI PROYEK

```text
├── api/
│   └── proxy.ts               # Vercel Serverless Function untuk proxy Instagram & TikTok
├── public/
│   ├── README.md              # Dokumen Prosedur & Panduan Berkelanjutan ini
│   ├── manifest.json          # Konfigurasi PWA Web App Manifest
│   ├── sw.js                  # Service Worker untuk PWA & Push Notification Click Handler
│   └── gambar/                # Aset gambar, logo STIE Wikara, favicon, & metatag
├── src/
│   ├── main.tsx               # Entry point React SPA
│   ├── App.tsx                # Komponen utama aplikasi & navigasi tab
│   ├── components/            # Komponen UI modular
│   │   ├── Header.tsx         # Header bersih (Logo, Mode Terang/Gelap, Notifikasi, Titik Tiga)
│   │   ├── DownloadMenu.tsx   # Menu popup opsi ekspor & instalasi PWA
│   │   ├── MonthlyCalendarSelector.tsx # Pemilih tanggal kalender bulanan
│   │   ├── CleanDayCard.tsx   # Kartu rencana konten Feed harian
│   │   ├── CleanStoryCard.tsx # Kartu rencana Short Story harian
│   │   ├── ContentMatrixTable.tsx # Tabel matriks rencana konten
│   │   ├── ModalDetail.tsx    # Modal detail & salin konten Feed
│   │   ├── ModalStoryDetail.tsx # Modal detail & salin Short Story
│   │   ├── ExportSummaryModal.tsx # Modal ekspor PDF, Excel, CSV, JSON
│   │   ├── NotificationModal.tsx # Modal pengaturan jam & tes notifikasi
│   │   ├── ImplementationView.tsx # Live View Pager Instagram
│   │   └── TiktokView.tsx     # Live View Pager TikTok
│   ├── data/
│   │   ├── stieWkrContentPlan.ts # Data induk rencana konten Feed harian
│   │   └── stieWkrStoryPlan.ts   # Data induk rencana Short Story harian
│   ├── types/
│   │   └── contentPlan.ts     # Definisi tipe TypeScript
│   └── utils/
│       └── notificationService.ts # Layanan notifikasi, jam 24 jam, audio chime, & SW
├── server.ts                  # Server Express untuk lingkungan Node.js / Production
├── vercel.json                # Konfigurasi rewrite, CORS, & caching Vercel
├── vite.config.ts             # Konfigurasi Vite
└── package.json               # Dependensi & skrip aplikasi
```

---

## 4. PANDUAN FITUR UTAMA & PROSEDUR PENGGUNAAN

### 4.1 Kalender Konten & Matriks Strategi
1. **Pemilihan Tanggal**: Pengguna dapat memilih tanggal tertentu dari kalender interaktif di bagian atas halaman.
2. **Multi-Select Tanggal**: Pengguna dapat menekan beberapa tanggal sekaligus untuk membandingkan rencana konten lintas hari.
3. **Tampilan Matriks**: Tekan tombol `Tampilan Matriks` di samping kalender untuk melihat seluruh rencana konten dalam bentuk tabel matriks yang ringkas.

### 4.2 Salin Konten & Detail Modal
1. Klik pada kartu konten Feed atau Short Story untuk membuka modal detail.
2. Di dalam modal detail, tersedia tombol **Salin Hook**, **Salin Caption**, dan **Salin Hashtag** secara terpisah yang akan langsung tersalin ke *clipboard* perangkat.
3. Pengguna dapat mengubah status eksekusi konten (`Planned` ➔ `In Progress` ➔ `Published`).

### 4.3 Ekspor & Download Laporan (PDF, Excel, CSV, JSON)
1. Klik tombol **Titik Tiga (`⋮`)** di header bagian paling kanan.
2. Pilih opsi **Ekspor Ringkasan Laporan**.
3. Di dalam modal ekspor, pilih format yang diinginkan:
   - **PDF Laporan**: Dokumen PDF resmi siap cetak/bagikan.
   - **Excel (XLSX) / CSV**: Berkas lembar kerja untuk diolah lebih lanjut.
   - **JSON Data**: Berkas data mentah terstruktur.
   - **Unduh Banner / Gambar**: Mengunduh banner kalender konten.

### 4.4 View Pager Live Instagram & TikTok
1. Pilih tab **Instagram** atau **TikTok** pada bilah navigasi utama.
2. Halaman profil resmi `@stie.wikara` atau `@stie_wikara` akan langsung tampil penuh secara otomatis.
3. **Deteksi Layar Otomatis**:
   - Jika diakses dari **HP / Layar Mobile**, aplikasi memuat versi Mobile resmi.
   - Jika diakses dari **Komputer / Layar Desktop**, aplikasi memuat versi Desktop resmi.

### 4.5 Sistem Notifikasi Push & Pengingat Harian
1. Klik ikon **Lonceng Notifikasi** di header.
2. Pengguna dapat mengaktifkan/mematikan sakelar (*toggle switch*) pengingat harian.
3. Atur jam pengingat format 24 jam (misal: `09:00` untuk Cek Plan Pagi dan `20:00` untuk Evaluasi Postingan Malam).
4. Tekan **Coba Notifikasi Sekarang (Tes)** untuk memastikan notifikasi perangkat, spanduk melayang, dan nada dering *audio chime* berjalan dengan baik.

### 4.6 Header Minimalis & Mode Terang/Gelap
1. **Logo STIE Wikara**: Menampilkan identitas resmi institusi.
2. **Ikon Tema (`☀️/🌙`)**: Berpindah antara Mode Terang (Default) dan Mode Gelap (*Total Dark Mode*).
3. **Ikon Notifikasi (`🔔`)**: Akses cepat ke modal pengaturan pengingat harian.
4. **Ikon Titik Tiga (`⋮`)**: Akses menu ekspor laporan dan instalasi PWA.

---

## 5. PROSEDUR PEMELIHARAAN & PEMBARUAN DATA KONTEN (SOP)

### 5.1 Menambah / Mengubah Rencana Konten Feed
Data rencana konten Feed tersimpan di file: `src/data/stieWkrContentPlan.ts`.

**Struktur Objek Data Feed:**
```typescript
{
  tanggalIso: "2026-10-01",
  hariNama: "Kamis",
  pilarKategori: "Edukasi & Informasi",
  pilarColor: "bg-blue-600",
  pilarBgLight: "bg-blue-50 text-blue-700 border-blue-200",
  pilarDark: "dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  pilihanJam: "09:00 WIB",
  formatKonten: "Carousel Feed",
  targetAudience: "Calon Mahasiswa & Orang Tua",
  judulKonten: "5 Alasan Mengapa Lulusan Manajemen Banyak Dicari Perusahaan",
  hookText: "Banyak yang belum tahu, ini rahasia kenapa jurusan Manajemen selalu jadi favorit!",
  captionText: "Sektor industri membutuhkan lulusan yang adaptif dan memiliki pemikiran strategis...",
  hashtagText: "#STIEWikara #KuliahManajemen #KampusPilihan #PMB2026",
  arahanVisual: "Slide 1: Header bold dengan latar warna biru institusi. Slide 2-4: Infografis poin utama.",
  petaPesan: "Membangun persepsi kualitas akademis STIE Wikara.",
  statusDefault: "Planned"
}
```

### 5.2 Menambah / Mengubah Rencana Short Story
Data rencana Short Story tersimpan di file: `src/data/stieWkrStoryPlan.ts`.

**Struktur Objek Data Short Story:**
```typescript
{
  tanggalIso: "2026-10-01",
  hariNama: "Kamis",
  waktuTayang: "12:00 WIB",
  topikStory: "Suasana Perkuliahan Pagi Ini",
  formatStory: "Video Short / Interactive Quiz",
  interaksiTools: "Polling: 'Kamu tim kuliah pagi atau siang?'",
  captionHashtag: "Pagi yang produktif bersama mahasiswa STIE Wikara! ✨ #CampusLife",
  arahanVisual: "Video portrait 9:16 durasi 15 detik memperlihatkan keceriaan di koridor kampus."
}
```

### 5.3 Mengganti Aset Logo, Gambar, & Favicon
Seluruh aset gambar static ditempatkan pada direktori `public/gambar/`:
- `public/gambar/wikara_logo.webp` : Logo resmi STIE Wikara.
- `public/gambar/wikara_logo.ico` : Favicon tab browser.
- `public/gambar/metatag.webp` : Gambar preview OpenGraph sosial media (WhatsApp/Facebook).

---

## 6. PANDUAN DEPLOYMENT & OPERASIONAL SERVER

### 6.1 Deployment ke Vercel (Serverless Function & CDN)
Aplikasi telah dilengkapi dengan `vercel.json` dan `/api/proxy.ts` yang siap di-deploy langsung ke platform Vercel.

**Langkah Deployment Vercel:**
1. Hubungkan repositori GitHub ke akun Vercel.
2. Vercel akan otomatis mendeteksi konfigurasi Vite (`npm run build`).
3. Endpoint `/api/proxy` akan berjalan otomatis sebagai **Vercel Serverless Function** tanpa perlu setup tambahan.

### 6.2 Deployment ke Node.js / VPS Server
Jika di-deploy ke server Linux/VPS mandiri:
1. Jalankan perintah kompilasi:
   ```bash
   npm run build
   ```
2. Jalankan server Express produksi:
   ```bash
   npm run start
   ```
3. Server Express akan berjalan di port `3000` (atau port sesuai variabel lingkungan `PORT`).

---

## 7. PERINTAH PENGEMBANGAN (DEVELOPMENT COMMANDS)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan lokal (Vite + Express middleware). |
| `npm run build` | Mengompilasi kode React SPA ke folder `dist` dan membundel `server.ts` ke `server.js`. |
| `npm run start` | Menjalankan server Node.js produksi berbasis `server.js`. |
| `npm run lint` | Memeriksa validasi tipe TypeScript (`tsc --noEmit`). |
| `npm run clean` | Membersihkan folder hasil build `dist` dan file `server.js`. |

---

> **Dipelihara dan Dikembangkan oleh AlinLabs**  
> *Konsistensi & Strategi Kreatif adalah Kunci Utama Membangun Jangkauan Digital Tanpa Batas.*
