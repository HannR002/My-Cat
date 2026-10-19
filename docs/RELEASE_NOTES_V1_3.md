# Catatan Rilis — My Cat V1.3.1: Hostinger Cache Configuration Hotfix & Web Preview

Tanggal Rilis: 19 Oktober 2026  
Status Rilis: **STABIL — SIAP PRATINJAU WEB (WEB PREVIEW GATE PASSED)**  
Target Platform: Web Modern (PWA), Android (Chrome / Samsung Internet), Desktop (Chrome / Edge / Safari / Firefox)

---

## Ringkasan Rilis V1.3.1

Rilis **My Cat V1.3.1** merupakan perbaikan konfigurasi hosting (*hosting configuration hotfix*) terfokus menyusul rilis V1.3. Fokus rilis ini adalah mengeliminasi potensi konflik *Cache-Control* pada berkas kontrol Service Worker, mencegah perulangan pengalihan (*redirect loop*) pada SSL Hostinger/reverse-proxy, menegaskan dukungan root subdomain khusus, serta merekonsiliasi inventaris berkas audio bawaan dan dokumentasi persistensi IndexedDB lokal.

---

## Pembaruan Utama (*Key Features & Improvements*)

### 1. Koreksi Tumpang Tindih Aturan Cache-Control (`public/.htaccess`)
- **Pemisahan Ketat Aset Ber-hash**: Caching 1 tahun (`public, max-age=31536000, immutable`) kini dibatasi secara spesifik hanya untuk aset fingerprinted Vite (`^.+-[A-Za-z0-9_-]{8,}\.(js|css)$`), tidak lagi menggunakan pola umum `\.(css|js)$` yang berisiko menimpa script di root.
- **Proteksi File Kontrol PWA**: Berkas `index.html`, `sw.js`, `registerSW.js`, `workbox-*.js`, dan `manifest.webmanifest` dievaluasi di urutan akhir dengan `Header set` berkebijakan `no-cache, no-store, must-revalidate` (menjamin pengguna selalu mendapatkan pembaruan aplikasi dan service worker terkini tanpa stale cache).
- **Aset Statis Bawaan**: File audio dan gambar diberi masa berlaku cache wajar 30 hari (`max-age=2592000`).

### 2. Pencegahan HTTPS Redirect Loop
- Penambahan kondisi ganda pada pengalihan HTTPS (`RewriteCond %{HTTPS} !=on` dan `RewriteCond %{HTTP:X-Forwarded-Proto} !https`). Hal ini mencegah terjadinya *infinite redirect loop* ketika Hostinger SSL atau reverse-proxy (seperti Cloudflare atau LiteSpeed Proxy) menangani enkripsi HTTPS di depan server web.

### 3. Rekonsiliasi Inventaris Audio & Dokumentasi Persistensi
- **Inventaris Audio Bawaan**: Ditegaskan secara faktual bahwa aplikasi memuat **13 berkas MP3 bawaan** (10 rekaman vokal kucing asli di `public/audio/real/` + 3 efek suara sintetis prosedural di `public/audio/ai/`), bukan 15 file.
- **Dokumentasi Persistensi Android**: Diperjelas pada panduan pengujian bahwa data yang dibuat saat offline tetap tersimpan utuh di IndexedDB lokal perangkat pengguna dan tidak disinkronkan secara otomatis ke server cloud atau perangkat lain (arsitektur 100% lokal berbasis privasi).
- **Dukungan Root Subdomain**: Didokumentasikan bahwa aplikasi siap dideploy pada root domain atau root subdomain khusus (misal: `https://kucing.domainanda.com`).

---

## Komparasi Versi

| Komponen | V1.2.1 | V1.3.0 | V1.3.1 (Versi Ini) |
| :--- | :--- | :--- | :--- |
| **Aturan Cache .htaccess** | Belum ada | Umum (berpotensi tumpang tindih pada `sw.js`) | **Aman & Non-overlapping (`sw.js` no-cache)** |
| **HTTPS Redirection** | Belum ada | `RewriteCond %{HTTPS} !=on` | **Anti-Loop (`X-Forwarded-Proto` safe)** |
| **Inventaris Audio di Docs** | 15 file (estimasi lama) | 15 file | **13 file rekonsiliasi (10 riil + 3 sintetis)** |
| **Navigasi Layar 360px** | Terpotong elipsis | Responsif `shortLabel` | **Responsif Penuh ("Kucing" & "Setelan")** |
| **Pustaka Tes IDB** | 20 tes | 20 tes | **20 tes lengkap + PWA build 43 precached** |

---

## Status Verifikasi & Kualitas

- **Node.js Native Test Runner (`node:test`)**: 20 / 20 tes lulus 100%.
- **TypeScript Compiler (`tsc --noEmit`)**: 0 error.
- **Vite Production Build**: Sukses, menghasilkan `dist/.htaccess` dengan aturan caching dan HTTPS yang telah diperbaiki.
