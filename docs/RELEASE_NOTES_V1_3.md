# Catatan Rilis — My Cat V1.3: Web Preview & PWA Validation

Tanggal Rilis: 19 Oktober 2026  
Status Rilis: **STABIL — SIAP PRATINJAU WEB (WEB PREVIEW GATE PASSED)**  
Target Platform: Web Modern (PWA), Android (Chrome / Samsung Internet), Desktop (Chrome / Edge / Safari / Firefox)

---

## Ringkasan Rilis V1.3

Rilis **My Cat V1.3** memfokuskan pada pematangan produksi (*production hardening*), validasi PWA luar jaringan (*offline capability*), kesiapan deployment hosting statis Hostinger, dan optimasi tata letak responsif pada perangkat Android layar sempit (360px).

---

## Pembaruan Utama (*Key Features & Improvements*)

### 1. Kesiapan Deployment Hostinger & SPA Routing (`.htaccess`)
- Penambahan file produksi `public/.htaccess` yang otomatis disalin ke `dist/.htaccess` saat build produksi.
- Dilengkapi aturan *mod_rewrite* Apache/LiteSpeed untuk fallback Single Page Application (SPA), pemaksaan HTTPS otomatis, kompresi Gzip/Deflate, serta pengaturan header *Cache-Control* presisi (`no-cache` untuk file manifest/SW dan caching 1 tahun untuk aset ber-hash).

### 2. Optimasi Navigasi Mobile 360px
- Bilah navigasi bawah (*Bottom Navigation Bar*) kini mendukung pelabelan responsif (`shortLabel`): pada layar smartphone di bawah 400px (seperti Samsung Galaxy A03/A04/A05 layar 360px), tab ditampilkan ringkas ("Kucing" dan "Setelan") agar muat tanpa terpotong (*zero truncation/ellipsis*).
- Pada layar yang lebih lebar (>= 400px, tablet, dan desktop), label otomatis melebar menjadi "Kucing Saya" dan "Pengaturan".

### 3. Penyelarasan Versi Aplikasi & Badge Header
- Penyelarasan badge visual di bilah atas aplikasi (*Header*) menjadi `V1.3 PWA`.
- Penyelarasan string informasi aplikasi di menu Pengaturan dan modul terjemahan bahasa `i18n.ts` menjadi `1.3.0 (Web Preview & PWA)`.

### 4. Pematangan Pengujian Otomatis & Keamanan Basis Data
- Terverifikasi 20 pengujian unit dan integrasi lulus 100% via `node --test` (menggunakan `fake-indexeddb` untuk pengujian transaksi riil di Node.js).
- Terverifikasi alur kerja CI Continuous Integration di GitHub Actions (`.github/workflows/ci.yml`) berstatus hijau (*success*) pada run resmi #39218372396.

---

## Komparasi Versi

| Komponen | V1.2.0 | V1.2.1 | V1.3.0 (Versi Ini) |
| :--- | :--- | :--- | :--- |
| **PWA Badge** | `V1 PWA` | `V1 PWA` | `V1.3 PWA` |
| **Audit CI GitHub** | Belum ada CI workflow | CI ditambahkan | CI lulus 100% (`npm ci` + lockfile) |
| **Navigasi Layar 360px** | Terpotong elipsis | Terpotong elipsis | **Responsif Penuh (Zero Truncation)** |
| **Hostinger `.htaccess`** | Belum ada | Belum ada | **Tersedia Lengkap (`public/.htaccess`)** |
| **Pustaka Tes IDB** | 14 tes | 20 tes | **20 tes lengkap + verifikasi browser** |

---

## Status Verifikasi Peramban & Mesin Suara

- **Pengujian Browser Headless (Playwright CLI)**:
  - Desktop 1440px: Berhasil diverifikasi.
  - Tablet 768px: Berhasil diverifikasi.
  - Large Mobile 430px: Berhasil diverifikasi.
  - Standard Mobile 390px: Berhasil diverifikasi.
  - Budget Mobile 360px: Berhasil diverifikasi dengan pelabelan responsif.
- **Service Worker Precache**: 43 berkas (2,058.93 KiB) ter-cache sempurna secara lokal.
- **Animal Welfare Check**: Suara desisan pertahanan tetap terkunci di balik modal peringatan stres kucing.
- **Singleton Audio**: 100% bebas dari tumpang tindih suara.
