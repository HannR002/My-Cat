# Checklist Pratinjau Web (Web Preview Gate) — My Cat V1.3

Dokumen ini merupakan panduan evaluasi berbasis bukti (*evidence-based checklist*) sebelum membuka akses pratinjau web pribadi (*private web preview*) bagi penguji internal dan pengguna terbatas.

---

## 1. Verifikasi Fungsionalitas 7 Layar Utama

| Layar / Modul | Rute / Tab | Item Verifikasi | Status | Catatan Pengujian |
| :--- | :--- | :--- | :---: | :--- |
| **Beranda** | `/?tab=home` | Hero banner, quick action button, kartu komitmen kesejahteraan hewan, metrik ringkas, dan pratinjau soundboard. | **LULUS** | Tata letak rapi di semua breakpoint (360px - 1440px). |
| **Pustaka Suara** | `/?tab=sounds` | Filter kategori, filter tipe (asli/sintetis/impor), input pencarian teks, kartu audio lengkap. | **LULUS** | Single audio playback singleton bekerja tanpa tumpang tindih. |
| **Interaksi Terpandu** | `/?tab=interact` | Alur 4 langkah: pilih kucing, pilih suara ramah, amati reaksi, simpan log. | **LULUS** | Filter ketat: suara defensif, AI fun, dan sintetis dilarang masuk wizard. |
| **Akademi Kucing** | `/?tab=academy` | Artikel edukasi bioakustik, kamus bahasa tubuh ekor/telinga/kumis, dan etika interaksi. | **LULUS** | Konten etologi feline akurat tanpa mitos terjemahan instan. |
| **Kucing Saya** | `/?tab=mycats` | Tambah profil, edit profil, hapus dengan modal in-app aman, opsi voluntary Milo demo. | **LULUS** | Database kosong secara default; Milo tidak diinjeksi diam-diam. |
| **Favorit** | `/?tab=favorites` | Akses cepat suara yang ditandai bintang/hati, pemutaran langsung, sinkronisasi IDB. | **LULUS** | Mengakses ID audio valid; otomatis terupdate saat audio impor dihapus. |
| **Pengaturan** | `/?tab=settings` | Ganti bahasa (ID/EN), impor MP3/WAV, ekspor/impor cadangan aman, tabel atribusi. | **LULUS** | Modal restore atomik; mode merge menjadi pilihan default aman. |

---

## 2. Verifikasi Audio & Kesejahteraan Hewan

- [x] **Singleton Playback**: Memutar audio baru otomatis menghentikan audio yang sedang berputar sebelumnya.
- [x] **Pemisahan Sumber Audio**: `audioPlayer.setSourceResolver` mampu memutar file statis bawaan (`/audio/*`) dan rekaman lokal IndexedDB (`Blob`) secara transparan.
- [x] **Peringatan Audio Defensif**: Suara desisan (`warning_growl_hiss.mp3`) menampilkan modal peringatan stres kucing sebelum diizinkan untuk didengarkan.
- [x] **Integritas Lisensi Audio**: Seluruh 15 audio bawaan memiliki atribusi pengarang, sumber Wikimedia Commons/Freesound, dan lisensi legal (CC0, CC BY 4.0, CC BY-SA 3.0, Public Domain). File berlisensi GFDL telah dibersihkan.
- [x] **Volume Mobile Notice**: Notifikasi transparan ditampilkan bahwa volume suara pada perangkat mobile dikontrol melalui tombol fisik perangkat pengguna.

---

## 3. Verifikasi PWA & Operasi Offline

- [x] **Web App Manifest**: File `/manifest.webmanifest` valid dengan `name`, `short_name`, `theme_color: #EA580C`, `background_color: #FFFDF9`, `display: standalone`, dan ikon 192x192, 512x512, serta maskable 512x512.
- [x] **Precache Service Worker**: 43 entri (termasuk semua file CSS, JS, HTML, SVG, dan seluruh MP3 bawaan) ter-precache secara otomatis oleh Workbox saat pertama kali diakses.
- [x] **Navigasi Offline**: Peramban yang berada dalam kondisi offline (mode pesawat / tanpa koneksi) tetap dapat membuka dan menavigasi seluruh 7 layar.
- [x] **Pemutaran Offline**: Seluruh suara bawaan dan rekaman suara impor tetap berbunyi saat offline karena diambil dari cache Workbox dan IndexedDB.
- [x] **Font Fallback**: Sistem font lokal (`system-ui, -apple-system, Segoe UI, Roboto`) aktif secara instan jika CDN Google Fonts tidak terjangkau.

---

## 4. Keamanan & Integritas Cadangan (Backup/Restore Gate)

- [x] **Ekspor Cadangan Penuh**: Menghasilkan JSON berisi data profil, sesi, pengaturan, dan biner audio yang di-encode Base64.
- [x] **Ekspor Metadata-Only**: Menghasilkan JSON ringan tanpa menyertakan biner audio.
- [x] **Validasi Skema Ketat**: Menolak JSON invalid, berkas dari aplikasi lain (`app !== 'My Cat'`), atau struktur profil rusak.
- [x] **Atomisitas Pemulihan**: Restore menggunakan 1 transaksi IDB tunggal (`readwrite` pada 5 object store). Jika terjadi error di tengah jalan, transaksi dibatalkan (`tx.abort()`) dan database ter-rollback utuh.
- [x] **Perlindungan Audio**: Mode replace pada cadangan metadata-only **tidak menghapus** file suara lokal pengguna.

---

## 5. Kesimpulan Web Preview Gate

Berdasarkan 20 unit/integrasi tes yang lulus 100%, verifikasi headless Chromium pada 5 ukuran viewport, dan integrasi `.htaccess` Hostinger, aplikasi **LULUS** kriteria Web Preview Gate.
