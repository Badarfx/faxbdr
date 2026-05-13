# 🏆 BAINVES - Website Kuis Berhadiah

Website kuis berhadiah dengan sistem affiliate multi-level 10 dan integrasi Firebase.

## Fitur Lengkap

### 1. Landing Page
- Tampilan hadiah menarik: Mobil, Honda, Sepeda Listrik, Topi, Kacamata, Baju, Celana, Sepatu, Sandal, Saldo E-Wallet
- Tombol Masuk / Daftar

### 2. Auth (Firebase Authentication)
- Login & Registrasi dengan Email
- Sistem referral code otomatis
- Validasi input

### 3. Beranda
- **Paket Berlangganan**: Rp15.000 (1 bln), Rp60.000 (6 bln), Rp100.000 (1 thn)
- **Daftar Hadiah**: Grid hadiah dengan foto, nama, harga koin
- Detail hadiah + tombol tukar koin

### 4. Riwayat
- Riwayat soal yang sudah dijawab
- Riwayat hadiah ditukar
- Penghasilan poin hari ini

### 5. Kuis
- 10 soal pilihan ganda (A-E)
- Jawaban langsung ditampilkan + koin otomatis
- Riwayat jawaban muncul di bawah

### 6. Affiliate (Multi-Level 10 Level)
- Saldo affiliate + penarikan
- Link affiliate unik
- Stats: klik, bergabung, level, tim
- **Komisi 10 Level**:
  - Level 1: 10% dari harga paket
  - Level 2: 5% dari harga paket
  - Level 3-10: 2.5% dari harga paket
- Tampilan tree network affiliate

### 7. Profil
- Edit foto profil
- Edit nama, kata sandi, nomor WhatsApp
- Mode Gelap / Terang
- Pilihan Bahasa
- Tombol Keluar

## Cara Setup

### 1. Buat Project Supabase
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik **New Project**, isi nama dan password database
3. Tunggu hingga project selesai dibuat

### 2. Konfigurasi Supabase
Edit file `js/supabase-config.js` dan ganti dengan konfigurasi project Anda:

```js
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
```

**Cara mendapatkan URL & Anon Key:**
- Di dashboard Supabase, buka **Settings** → **API**
- Copy `Project URL` → tempel ke `SUPABASE_URL`
- Copy `anon` / `public` key → tempel ke `SUPABASE_ANON_KEY`

### 3. Setup Database (SQL)
1. Buka **SQL Editor** di dashboard Supabase
2. Buka file `supabase-setup.sql` yang sudah disertakan
3. Copy seluruh isinya dan paste ke SQL Editor
4. Klik **Run** untuk membuat tabel, fungsi RPC, dan RLS policies

### 4. Aktifkan Authentication
1. Di dashboard Supabase, buka **Authentication** → **Providers**
2. Pastikan **Email** diaktifkan
3. (Opsional) Nonaktifkan "Confirm email" agar registrasi langsung jadi

### 5. Jalankan
Buka `index.html` di browser atau upload ke hosting statis (Netlify, Vercel, GitHub Pages).

### 6. (Opsional) Setup Gemini AI untuk Soal Otomatis
Website ini bisa menggunakan **Google Gemini AI** untuk membuat soal kuis secara otomatis. Jika tidak diisi, akan menggunakan soal cadangan.

1. Buka [Google AI Studio](https://aistudio.google.com/apikey)
2. Klik **Get API Key** → **Create API Key**
3. Copy API Key yang didapat
4. Edit file `js/gemini-config.js`:
```js
const GEMINI_API_KEY = "API_KEY_ANDA"; // Ganti ini
const GEMINI_MODEL = "gemini-2.0-flash"; // atau gemini-1.5-flash
```

**Catatan:** Gemini API gratis dengan limit tertentu. Cocok untuk testing dan pengembangan.

## Teknologi
- HTML5 + CSS3 + JavaScript (Vanilla)
- Supabase (Auth, PostgreSQL, Storage)
- Google Gemini AI (Generate soal otomatis)
- Responsive Design (Mobile First)
