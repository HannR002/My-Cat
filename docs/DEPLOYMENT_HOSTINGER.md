# Panduan Deployment Statis Hostinger — My Cat V1.3 PWA

Dokumen ini menjelaskan prosedur deployment produksi aplikasi **My Cat V1.3 PWA** ke akun hosting web **Hostinger** (Shared Hosting, Cloud Hosting, atau VPS dengan web server Apache / LiteSpeed).

---

## 1. Arsitektur Deployment

Aplikasi **My Cat** dirancang sebagai *Client-Side Single Page Application (SPA)* berbasis React 19, TypeScript, Vite, dan Workbox Service Worker.

- **Karakteristik**: 100% statis (*zero server-side Node.js runtime required* saat melayani pengguna di hosting).
- **Penyimpanan Data**: IndexedDB lokal pada peramban pengguna (tanpa server database eksternal).
- **Direktori Output Build**: `dist/`
- **Direktori Target Hostinger**: `public_html/` (untuk domain utama) atau `public_html/subdomain/` (untuk subdomain).

---

## 2. Persyaratan Hosting di Hostinger

1. **Paket Hosting**: Hostinger Single, Premium, Business, atau Cloud Hosting (cPanel / hPanel).
2. **Sertifikat SSL**: **Wajib Aktif** (Let's Encrypt SSL gratis via hPanel).
   - *Catatan Penting*: Fitur PWA (Service Worker dan Web App Manifest) **hanya dapat berjalan di lingkungan HTTPS**.
3. **Web Server**: Apache atau LiteSpeed Web Server (standar bawaan Hostinger).
4. **Modul Apache**: `mod_rewrite`, `mod_headers`, `mod_deflate`, `mod_mime` (semuanya aktif secara default di Hostinger).

---

## 3. Konfigurasi `public/.htaccess`

File `public/.htaccess` telah disertakan dalam repositori dan otomatis disalin ke dalam `dist/.htaccess` saat menjalankan `npm run build`. File ini menangani:

1. **SPA Routing Fallback**: Mengarahkan seluruh rute dinamis (seperti deep-link atau refresh halaman) ke `index.html` agar tidak memicu error *404 Not Found*.
2. **Force HTTPS**: Otomatis mengalihkan lalu lintas HTTP ke HTTPS.
3. **PWA Cache Invalidation**: Mencegah caching berlebihan pada `index.html`, `sw.js`, dan `manifest.webmanifest` agar pembaruan rilis langsung diterima pengguna saat membuka aplikasi.
4. **Long-term Asset Caching**: Caching 1 tahun (`immutable`) untuk aset ber-hash (`dist/assets/*.js`, `dist/assets/*.css`).
5. **MIME Types**: Memastikan tipe MIME `application/manifest+json`, `audio/mpeg`, dan `font/woff2` terkirim dengan benar.
6. **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`.

---

## 4. Langkah-Langkah Deployment

### Langkah A: Build Produksi Lokal
Jalankan perintah berikut di lingkungan pengembangan:
```bash
npm ci
npm test
npm run lint
npm run build
```
Pastikan folder `dist/` telah terisi dengan:
- `index.html`
- `.htaccess`
- `manifest.webmanifest`
- `sw.js` & `workbox-*.js`
- `assets/` (kumpulan JS dan CSS terbundel)
- `audio/` (berkas rekaman kucing bawaan)
- `favicon.ico`, `icon.svg`, `pwa-*.png`

### Langkah B: Kompresi File Build
Kompres seluruh isi folder `dist/` menjadi file ZIP (misal: `mycat-v1.3-dist.zip`):
```bash
cd dist && zip -r ../mycat-v1.3-dist.zip . && cd ..
```

### Langkah C: Unggah ke Hostinger via File Manager
1. Masuk ke **hPanel Hostinger** (`https://hpanel.hostinger.com`).
2. Pilih menu **Websites** -> pilih domain Anda -> klik **Dashboard**.
3. Buka **File Manager** (Files -> File Manager).
4. Navigasikan ke folder `public_html/` (atau folder subdomain Anda).
5. Jika ada file default Hostinger (seperti `default.php`), hapus atau arsipkan file tersebut.
6. Klik tombol **Upload** (ikon panah atas) dan pilih file `mycat-v1.3-dist.zip`.
7. Klik kanan pada `mycat-v1.3-dist.zip` -> pilih **Extract** -> ekstrak langsung ke `public_html/`.
8. Pastikan `index.html` dan `.htaccess` berada tepat di dalam `public_html/` (bukan bersarang di dalam subfolder `dist/`).
9. Hapus file `mycat-v1.3-dist.zip` dari server untuk menghemat ruang disk.

### Langkah D: Verifikasi SSL & HTTPS
1. Pada hPanel, buka menu **Security** -> **SSL**.
2. Pastikan status SSL adalah **Active**.
3. Aktifkan opsi **Force HTTPS** di hPanel jika belum aktif.

---

## 5. Prosedur Uji Pasca-Deployment

Buka browser dan akses URL domain Anda:
1. **Pemeriksaan Konsol Browser (F12)**:
   - Pastikan tidak ada error 404 pada file CSS, JS, audio, atau manifest.
   - Periksa tab **Application** -> **Service Workers**: Pastikan `sw.js` berstatus *Activated and is running*.
   - Periksa tab **Application** -> **Manifest**: Pastikan identitas `My Cat`, ikon 192x192, 512x512, dan maskable terdeteksi valid.
2. **Pemeriksaan Refresh SPA**:
   - Buka `https://domain-anda.com/?tab=academy` lalu tekan Ctrl+F5 (Refresh keras).
   - Pastikan halaman tidak menampilkan error 404 (membuktikan `.htaccess` rewrite bekerja).
3. **Pemeriksaan Offline PWA**:
   - Di Chrome DevTools -> tab **Network** -> centang **Offline**.
   - Navigasikan antar tab (Beranda, Suara, Interaksi, Akademi, Kucing, Setelan).
   - Putar salah satu suara bawaan (misal: "Panggilan Penasaran"). Audio harus tetap berbunyi tanpa koneksi internet.

---

## 6. Prosedur Rollback Cepat

Jika ditemukan anomali tak terduga pada rilis:
1. Di File Manager Hostinger, arsipkan folder `public_html/` yang bermasalah.
2. Unggah file ZIP build stabil versi sebelumnya (misal: build V1.2.1).
3. Ekstrak file build sebelumnya ke `public_html/`.
4. Berkat konfigurasi `Cache-Control: no-cache` pada `sw.js` di `.htaccess`, peramban pengguna akan mendeteksi `sw.js` lama dan kembali ke versi stabil saat aplikasi dibuka ulang.
