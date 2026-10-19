# Panduan Deployment Statis Hostinger — My Cat V1.3.1 PWA

Dokumen ini menjelaskan prosedur deployment produksi aplikasi **My Cat V1.3.1 PWA** ke akun hosting web **Hostinger** (Shared Hosting, Cloud Hosting, atau VPS dengan web server Apache / LiteSpeed).

---

## 1. Arsitektur Deployment & Batasan URL

Aplikasi **My Cat** dirancang sebagai *Client-Side Single Page Application (SPA)* berbasis React 19, TypeScript, Vite, dan Workbox Service Worker.

- **Karakteristik**: 100% statis (*zero server-side Node.js runtime required* saat melayani pengguna di hosting).
- **Penyimpanan Data**: IndexedDB lokal pada peramban perangkat pengguna (tanpa server database eksternal).
- **Direktori Output Build**: `dist/`
- **Direktori Target Hostinger**:
  - **Root Domain Utama**: `public_html/` (misal: `https://domainanda.com`)
  - **Root Subdomain Khusus (Disarankan)**: `public_html/kucing/` atau folder subdomain Hostinger (misal: `https://kucing.domainanda.com` atau `https://mycat.domainanda.com`).
- **PENTING (Batasan Subdirektori)**:
  Aplikasi ini terbundel dengan path root-relative (`/`). Aplikasi **harus dideploy pada root virtual host** (baik root domain utama maupun root subdomain khusus). Jangan mendepoloy aplikasi ke dalam arbitrary subfolder tanpa subdomain (seperti `https://domainanda.com/aplikasi/kucing/`) tanpa memperbarui `base` pada `vite.config.ts` dan `RewriteBase` pada `.htaccess`.

---

## 2. Persyaratan Hosting di Hostinger

1. **Paket Hosting**: Hostinger Single, Premium, Business, atau Cloud Hosting (cPanel / hPanel).
2. **Sertifikat SSL**: **Wajib Aktif** (Let's Encrypt SSL gratis via hPanel).
   - *Catatan Penting*: Fitur PWA (Service Worker dan Web App Manifest) **hanya dapat berjalan di lingkungan HTTPS**.
3. **Web Server**: Apache atau LiteSpeed Web Server (standar bawaan Hostinger).
4. **Modul Apache**: `mod_rewrite`, `mod_headers`, `mod_deflate`, `mod_mime` (semuanya aktif secara default di Hostinger).

---

## 3. Konfigurasi `public/.htaccess` (Hotfix V1.3.1)

File `public/.htaccess` telah disertakan dalam repositori dan otomatis disalin ke dalam `dist/.htaccess` saat menjalankan `npm run build`. File ini telah diaudit dan diperbaiki dari potensi konflik caching:

1. **Anti-Loop HTTPS Redirection**:
   Menggunakan pemeriksaan ganda (`RewriteCond %{HTTPS} !=on` dan `RewriteCond %{HTTP:X-Forwarded-Proto} !https`) agar tidak terjadi perulangan pengalihan (*redirect loop / ERR_TOO_MANY_REDIRECTS*) saat Hostinger SSL atau reverse-proxy (Cloudflare / LiteSpeed) mengelola enkripsi HTTPS di depan server web.
2. **Aturan Cache-Control Tanpa Tumpang Tindih (*Non-overlapping Cache Rules*)**:
   - **File Kontrol PWA & Entrypoint (`index.html`, `sw.js`, `registerSW.js`, `workbox-*.js`, `manifest.webmanifest`)**:
     Diberi header `no-cache, no-store, must-revalidate` dan diletakkan pada urutan evaluasi terakhir dengan `Header set`. Hal ini menjamin file kontrol PWA tidak akan pernah tertimpa oleh aturan caching jangka panjang.
   - **Aset Produksi Ber-hash (`^.+-[A-Za-z0-9_-]{8,}\.(js|css)$`)**:
     Caching 1 tahun (`public, max-age=31536000, immutable`) **dibatasi secara ketat hanya untuk file bundel Vite yang memiliki fingerprint hash** (misal: `assets/index-B8ezyA4Z.js`), sehingga tidak akan menyentuh script di root.
   - **Aset Statis Bawaan (Gambar & 13 Audio MP3)**:
     Diberi header `public, max-age=2592000` (30 hari).
3. **SPA Routing Fallback**: Mengarahkan seluruh rute dinamis klien ke `index.html`.
4. **MIME Types**: Memastikan tipe MIME `application/manifest+json`, `audio/mpeg`, dan `font/woff2` terkirim dengan benar.
5. **Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`.

---

## 4. Langkah-Langkah Deployment

### Langkah A: Build Produksi Lokal
Jalankan perintah berikut di lingkungan pengembangan:
```bash
npm test
npm run lint
npm run build
```
Pastikan folder `dist/` telah terisi dengan:
- `index.html`
- `.htaccess`
- `manifest.webmanifest`
- `sw.js` & `workbox-*.js`
- `assets/` (kumpulan JS dan CSS terbundel dengan fingerprint hash)
- `audio/` (13 berkas audio bawaan: 10 rekaman kucing asli di `real/` + 3 efek sintetis di `ai/`)
- `favicon.ico`, `icon.svg`, `pwa-*.png`

### Langkah B: Kompresi File Build
Kompres seluruh isi folder `dist/` menjadi file ZIP (misal: `mycat-v1.3.1-dist.zip`):
```bash
cd dist && zip -r ../mycat-v1.3.1-dist.zip . && cd ..
```

### Langkah C: Unggah ke Hostinger via File Manager
1. Masuk ke **hPanel Hostinger** (`https://hpanel.hostinger.com`).
2. Pilih menu **Websites** -> pilih domain atau subdomain Anda -> klik **Dashboard**.
3. Buka **File Manager** (Files -> File Manager).
4. Navigasikan ke root direktori web domain/subdomain (`public_html/` atau folder root subdomain Anda).
5. Jika ada file default Hostinger (seperti `default.php`), hapus atau arsipkan file tersebut.
6. Klik tombol **Upload** (ikon panah atas) dan pilih file `mycat-v1.3.1-dist.zip`.
7. Klik kanan pada `mycat-v1.3.1-dist.zip` -> pilih **Extract** -> ekstrak langsung ke direktori tersebut.
8. Pastikan `index.html` dan `.htaccess` berada tepat di root direktori domain/subdomain (bukan bersarang di dalam subfolder `dist/`).
9. Hapus file `mycat-v1.3.1-dist.zip` dari server untuk menghemat ruang disk.

### Langkah D: Verifikasi SSL & HTTPS
1. Pada hPanel, buka menu **Security** -> **SSL**.
2. Pastikan status SSL adalah **Active**.
3. Aktifkan opsi **Force HTTPS** di hPanel jika belum aktif.

---

## 5. Prosedur Uji Pasca-Deployment

Buka browser dan akses URL domain/subdomain Anda:
1. **Pemeriksaan Konsol Browser (F12)**:
   - Pastikan tidak ada error 404 pada file CSS, JS, audio, atau manifest.
   - Periksa tab **Network**: Periksa respons header untuk `sw.js` dan `index.html` — pastikan memuat `Cache-Control: no-cache, no-store, must-revalidate`.
   - Periksa tab **Application** -> **Service Workers**: Pastikan `sw.js` berstatus *Activated and is running*.
   - Periksa tab **Application** -> **Manifest**: Pastikan identitas `My Cat`, ikon 192x192, 512x512, dan maskable terdeteksi valid.
2. **Pemeriksaan Refresh SPA**:
   - Buka `https://kucing.domainanda.com/?tab=academy` lalu tekan Ctrl+F5 (Refresh keras).
   - Pastikan halaman tidak menampilkan error 404 (membuktikan `.htaccess` rewrite bekerja).
3. **Pemeriksaan Offline PWA**:
   - Di Chrome DevTools -> tab **Network** -> centang **Offline**.
   - Navigasikan antar tab (Beranda, Suara, Interaksi, Akademi, Kucing, Setelan).
   - Putar salah satu suara bawaan (misal: "Panggilan Penasaran"). Audio harus tetap berbunyi tanpa koneksi internet.

---

## 6. Prosedur Rollback Cepat

Jika ditemukan anomali tak terduga pada rilis:
1. Di File Manager Hostinger, arsipkan folder web yang bermasalah.
2. Unggah file ZIP build stabil versi sebelumnya.
3. Ekstrak file build sebelumnya ke root folder domain/subdomain.
4. **Mekanisme Update Klien**: Karena `sw.js` memiliki kebijakan `no-cache`, peramban klien akan mendeteksi `sw.js` rilis sebelumnya pada kunjungan berikutnya, mengaktifkannya, dan fungsi Workbox `cleanupOutdatedCaches()` akan otomatis menghapus cache versi bermasalah dari penyimpanan lokal pengguna.
