# My Cat — Connect, Play & Understand 🐱

[![CI Verification & Quality Gate](https://github.com/HannR002/My-Cat/actions/workflows/ci.yml/badge.svg)](https://github.com/HannR002/My-Cat/actions/workflows/ci.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-orange.svg)](https://github.com/HannR002/My-Cat)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests: 20 passed](https://img.shields.io/badge/tests-20%20passed-brightgreen.svg)](https://github.com/HannR002/My-Cat)

> **Connect, Play & Understand** — Aplikasi Web Progresif (PWA) modern untuk pecinta kucing yang menghadirkan pustaka suara kucing asli terverifikasi, pelacak interaksi terpandu dengan etika kesejahteraan hewan, modul edukasi bahasa tubuh feline, dan pencadangan data lokal yang aman tanpa ketergantungan server.

---

## 🌟 Fitur Utama

1. **Pustaka Suara Kucing Terverifikasi (Authentic Soundboard)**:
   - 15 suara kucing bawaan berkualitas tinggi (12 rekaman vokal asli dan 3 efek sintetis prosedural).
   - Seluruh file memiliki lisensi publik legal (CC0, CC BY 4.0, CC BY-SA 3.0, Public Domain) dengan atribusi lengkap. Bebas dari lisensi GFDL.
   - Peringatan kesejahteraan hewan (*Animal Welfare Alert*) wajib tampil sebelum memutar suara bernada defensif (desisan/geraman).

2. **Mode Interaksi Terpandu (Guided Interaction Tracking)**:
   - Alur 4 langkah interaktif: memilih kucing kesayangan, memutar suara ramah yang relevan, mengamati respons perilaku, dan menyimpan catatan observasi.
   - Algoritma pemfilteran ketat (`isSoundEligibleForInteraction`): suara sintetis, AI fun, dan rekaman defensif secara otomatis diblokir dari wizard interaksi demi kenyamanan psikologis kucing.

3. **Akademi Kucing (Feline Ethology Academy)**:
   - Artikel edukasi sains bioakustik kucing berbahasa Indonesia dan Inggris.
   - Kamus bahasa tubuh visual: ekor, telinga, mata, kumis, dan postur tubuh.
   - Panduan interaksi ramah kucing (*Finger Touch Test*, batas toleransi sentuhan).

4. **Profil Kucing Mandiri (Cat Profiles Manager)**:
   - Pencatatan profil tanpa rekayasa data bawaan (database kosong secara default, opsi contoh "Milo" bersifat voluntary).
   - Pengeditan dan penghapusan profil menggunakan modal dialog in-app yang aman (tanpa pemblokiran `window.confirm`).

5. **Sistem Pencadangan Atomik & Aman (Safe Backup & Restore)**:
   - **Cadangan Metadata (Ringan)**: Menyimpan profil, riwayat sesi, dan pengaturan dalam format JSON portabel.
   - **Cadangan Penuh (+Audio)**: Menyimpan seluruh rekaman audio impor pengguna yang dienkode dalam Base64 Data URL.
   - **Atomisitas Transaksi**: Pemulihan dieksekusi dalam satu transaksi tunggal IndexedDB dengan perlindungan rollback otomatis jika berkas rusak. Mode replace pada cadangan metadata tidak pernah menghapus file suara lokal pengguna.

6. **Progressive Web App (PWA) Luar Jaringan (100% Offline)**:
   - Siap dipasang (*installable*) ke layar utama Android, iOS, dan Desktop.
   - Service Worker Workbox meng-cache seluruh shell aplikasi dan file audio bawaan (43 entri ter-precache).
   - Pengoperasian penuh tanpa memerlukan sambungan internet.

---

## 🛠️ Tumpukan Teknologi (*Tech Stack*)

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite 8
- **Audio Engine**: HTML5 Audio & Web Audio API Singleton
- **Penyimpanan Lokal**: IndexedDB (Database terstruktur di sisi klien tanpa cloud)
- **PWA Tooling**: `vite-plugin-pwa`, Workbox Service Worker
- **Testing**: Node.js Native Test Runner (`node:test`), `fake-indexeddb`, Playwright CLI
- **CI/CD**: GitHub Actions (Ubuntu runner, Node 22)

---

## 🚀 Memulai Pengembangan Lokal

### Prasyarat
- Node.js versi 20+ atau 22 (LTS disarankan)
- npm versi 10+

### Instalasi & Menjalankan
```bash
# 1. Klon repositori
git clone https://github.com/HannR002/My-Cat.git
cd My-Cat

# 2. Pasang dependensi secara bersih sesuai lockfile
npm ci

# 3. Jalankan server pengembangan lokal (port 3000)
npm run dev
```
Buka peramban Anda di `http://localhost:3000`.

---

## 🧪 Rangkaian Pengujian & Validasi

```bash
# Menjalankan 20 unit & integrasi tes (termasuk tes transaksi IndexedDB)
npm test

# Menjalankan pemeriksaan tipe TypeScript
npm run lint

# Membangun bundel produksi dan service worker PWA
npm run build
```

---

## 📖 Dokumentasi Teknis

- [Panduan Deployment Hostinger](docs/DEPLOYMENT_HOSTINGER.md)
- [Checklist Pratinjau Web (Web Preview Gate)](docs/WEB_PREVIEW_CHECKLIST.md)
- [Panduan Uji Manual Perangkat Android Fisik](docs/ANDROID_MANUAL_TEST.md)
- [Catatan Rilis V1.3](docs/RELEASE_NOTES_V1_3.md)

---

## 📜 Lisensi & Atribusi

- **Kode Aplikasi**: Berlisensi [MIT](LICENSE).
- **Aset Audio**: Berlisensi di bawah Creative Commons (CC0, CC BY 4.0, CC BY-SA 3.0) dan Public Domain. Rincian pengarang dan tautan sumber dapat dilihat langsung di aplikasi pada menu **Pengaturan -> Lisensi Audio & Atribusi Lengkap**.
