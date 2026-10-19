# Panduan Uji Manual Perangkat Fisik Android — My Cat V1.3 PWA

Dokumen ini memuat matriks pengujian manual yang dirancang khusus untuk verifikasi pada **perangkat fisik Android nyata** (menggunakan Google Chrome for Android dan Samsung Internet Browser).

> **PENTING**: Pengujian menggunakan emulator peramban desktop atau headless Chromium tidak dapat menggantikan interaksi fisik, manajemen memori latar belakang Android (*background tab throttling*), latensi audio Web Audio API pada chipset mobile, atau dialog instalasi PWA native Android.

---

## 1. Perangkat & Lingkungan Pengujian yang Disarankan

1. **Android Entry/Budget**: Layar ~360px lebar (misal: Samsung Galaxy A03 / A04 / A05, Xiaomi Redmi 9A/10A) dengan RAM 2GB-3GB.
2. **Android Mid-Range**: Layar ~390px - 412px lebar (misal: Samsung Galaxy A54, Redmi Note 12/13, Poco X5) dengan RAM 6GB-8GB.
3. **Android Flagship**: Layar ~412px - 430px lebar (misal: Google Pixel 7/8/9, Samsung Galaxy S23/S24 Ultra).
4. **Peramban**:
   - Google Chrome for Android (versi 120+)
   - Samsung Internet Browser (versi 23+)

---

## 2. Matriks Pengujian Manual Android

### Modul A: Tampilan Layar & Sentuhan (Responsive & Touch Targets)

| No | Kasus Uji | Langkah Pengujian | Hasil yang Diharapkan | Status Manual |
| :---: | :--- | :--- | :--- | :---: |
| A1 | **Lebar Sempit 360px** | Buka aplikasi pada ponsel Android layar 360px. Perhatikan bilah navigasi bawah (*Bottom Nav*). | Seluruh 6 tab terbaca jelas ("Beranda", "Suara", "Interaksi", "Akademi", "Kucing", "Setelan") tanpa teks terpotong atau tumpang tindih. | [ ] |
| A2 | **Touch Target Area** | Ketuk setiap tab navigasi dan tombol audio secara bergantian menggunakan ibu jari. | Tombol mudah diketuk (tinggi minimum >= 48px), responsif tanpa delay sentuh (*no double-tap zoom delay*). | [ ] |
| A3 | **Bilah Navigasi Android System Gesture** | Gunakan ponsel dengan navigasi gestur Android (garis bawah) dan navigasi 3 tombol tradisional. | Konten bawah tidak tertutup oleh bilah navigasi Android (`pb-safe` / `env(safe-area-inset-bottom)` berfungsi). | [ ] |
| A4 | **Rotasi Layar (Landscape)** | Putar ponsel dari orientasi portrait ke landscape lalu kembali ke portrait. | Tata letak menyesuaikan dengan mulus; modal dialog tetap dapat di-scroll vertikal dan tombol aksi tidak terpotong. | [ ] |

---

### Modul B: Audio & Kontrol Perangkat Fisik

| No | Kasus Uji | Langkah Pengujian | Hasil yang Diharapkan | Status Manual |
| :---: | :--- | :--- | :--- | :---: |
| B1 | **Pemutaran Suara Pertama** | Buka tab Suara, ketuk tombol putar pada suara "Panggilan Penasaran". | Suara langsung terdengar jernih melalui speaker ponsel tanpa terputus. | [ ] |
| B2 | **Volume Tombol Fisik Ponsel** | Tekan tombol volume fisik samping ponsel saat audio berputar. | Volume audio naik/turun sesuai tombol fisik perangkat. | [ ] |
| B3 | **Headphone & Bluetooth** | Hubungkan headset berkabel atau earphone Bluetooth TWS, lalu putar suara. | Suara beralih ke earphone secara instan tanpa crash audio engine. | [ ] |
| B4 | **Panggilan Masuk / Notifikasi** | Putar suara berdurasi panjang, lalu picu panggilan telepon atau alarm berbunyi. | Audio terhenti (*pause*) atau meredam (*ducking*) sesuai kebijakan sistem Android. | [ ] |
| B5 | **Layar Terkunci (*Screen Lock*)** | Putar audio lalu matikan layar ponsel. | Audio menyelesaikan pemutaran atau berhenti sesuai kebijakan browser mobile tanpa error aplikasi. | [ ] |

---

### Modul C: Instalasi PWA & Web App Manifest

| No | Kasus Uji | Langkah Pengujian | Hasil yang Diharapkan | Status Manual |
| :---: | :--- | :--- | :--- | :---: |
| C1 | **Prompt Instalasi PWA** | Buka aplikasi melalui Google Chrome di Android. Perhatikan banner atau tombol "Pasang PWA" di header. | Muncul opsi "Tambahkan My Cat ke Layar Utama" / "Install App". | [ ] |
| C2 | **Ikon Layar Utama (*Homescreen*)** | Selesaikan proses instalasi PWA, lalu kembali ke menu utama ponsel Android. | Ikon kucing oranye My Cat muncul di layar utama dengan nama "My Cat", beresolusi tajam tanpa distorsi. | [ ] |
| C3 | **Mode Standalone (Tanpa URL Bar)** | Buka aplikasi langsung melalui ikon di layar utama ponsel. | Aplikasi terbuka dalam mode layar penuh (*standalone app*) tanpa bilah alamat URL peramban Chrome. | [ ] |
| C4 | **Warna Tema Status Bar** | Perhatikan warna bilah status sistem (*Android status bar*) di bagian paling atas ponsel. | Status bar berwarna oranye `#EA580C` sesuai spesifikasi `theme_color`. | [ ] |

---

### Modul D: Operasi Luar Jaringan (*True Offline Test*)

| No | Kasus Uji | Langkah Pengujian | Hasil yang Diharapkan | Status Manual |
| :---: | :--- | :--- | :--- | :---: |
| D1 | **Mode Pesawat (*Airplane Mode*)** | Aktifkan Mode Pesawat pada ponsel Android (matikan Wi-Fi dan Data Seluler). | Indikator *Offline Banner* ("Mode Offline") muncul lembut di bagian atas. | [ ] |
| D2 | **Buka Ulang Saat Offline** | Tutup aplikasi PWA dari multitasking Android (*swipe kill*), lalu buka kembali dari homescreen saat Mode Pesawat aktif. | Aplikasi terbuka seketika (*instant launch*) dari Service Worker lokal tanpa pesan "No Internet". | [ ] |
| D3 | **Putar Audio Bawaan Offline** | Saat Mode Pesawat aktif, buka tab Suara dan putar "Panggilan Ramah" dan "Dengkuran Tenang". | Suara berbunyi normal karena telah ter-precache oleh Service Worker. | [ ] |
| D4 | **Pencatatan Sesi Offline** | Tambah profil kucing baru ("Chiki") dan catat 1 sesi interaksi di tab Interaksi. | Profil dan riwayat sesi tersimpan ke IndexedDB lokal tanpa memerlukan koneksi jaringan. | [ ] |
| D5 | **Kembali Online** | Matikan Mode Pesawat (koneksi pulih). | Banner offline otomatis menghilang; data lokal tetap utuh dan tersinkronisasi. | [ ] |

---

### Modul E: Impor Audio & Cadangan Data di Android

| No | Kasus Uji | Langkah Pengujian | Hasil yang Diharapkan | Status Manual |
| :---: | :--- | :--- | :--- | :---: |
| E1 | **Pilih File Audio Lokal** | Buka Setelan -> Impor Berkas MP3/WAV -> Pilih file rekaman kucing asli dari penyimpanan internal ponsel. | File pemilih file bawaan Android terbuka, file tervalidasi ukuran (< 10MB) dan tersimpan ke IndexedDB. | [ ] |
| E2 | **Unduh Cadangan JSON** | Ketuk "Unduh Cadangan Penuh (+Audio)" di menu Setelan. | File `my_cat_full_backup_*.json` terunduh ke folder *Downloads* Android. | [ ] |
| E3 | **Pulihkan Cadangan dari File** | Buka file JSON yang baru saja diunduh melalui tombol "Pilih Berkas Cadangan". | Dialog pratinjau ringkasan muncul (jumlah profil, sesi, audio), dan pemulihan sukses saat dikonfirmasi. | [ ] |
