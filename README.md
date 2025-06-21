# 📒 TradingJournal

Aplikasi Jurnal Trading berbasis web sederhana untuk mencatat, memantau, dan mengelola riwayat order trading Anda. Struktur repo ini sudah disiapkan agar mudah berkembang, memisahkan kode frontend dan backend secara jelas.

## ✨ Fitur

- 📝 **Catat Order Baru:** Input order trading (pair, harga entry, take profit, stop loss, timeframe, jenis order).
- 📊 **Riwayat Order:** Lihat daftar order aktif dan order yang sudah diarsipkan (selesai/batal).
- 🔄 **Update Status:** Tandai order sebagai selesai atau batal.
- 💹 **Live Harga:** Ambil harga pasar terkini dari API Indodax.
- 🛠️ **Arsitektur Sederhana & Modular:** Backend Node.js tanpa database, data disimpan di file JSON, struktur folder scalable.
- 📱 **Tampilan Responsive:** Menggunakan HTML, CSS modern, dan JavaScript modul.

## 🌳 Struktur Folder & File

```
TradingJournal/
├── backend/
│   ├── server.js            # Server & API backend Node.js
│   ├── indodax-api.js       # Modul fetch data Indodax
│   ├── data/
│   │   └── data.json        # Data jurnal trading
│   └── package.json         # Metadata & dependencies backend
│
├── frontend/
│   ├── public/
│   │   ├── index.html       # Main HTML
│   │   ├── style.css        # Style utama
│   │   └── assets/          # (optional, gambar/font)
│   │
│   └── src/
│       ├── script.js        # Entry point frontend
│       ├── js/
│       │   ├── api.js       # Modul API frontend
│       │   └── ui.js        # Modul UI frontend
│       └── components/      # (optional, komponen modular)
│
├── .gitignore
├── README.md
```

## 🚀 Cara Menjalankan

1. **Install dependency manager:**  
   Pastikan sudah terinstall [Node.js](https://nodejs.org/) dan [pnpm](https://pnpm.io/).

2. **Install dependencies backend:**
   ```bash
   cd backend
   pnpm install
   ```

3. **Jalankan server backend:**
   ```bash
   node server.js
   ```

4. **Buka aplikasi di browser:**
   ```
   http://localhost:3000
   ```

## ℹ️ Catatan Teknis

- Semua data order trading disimpan dalam `backend/data/data.json` secara lokal (bisa diupgrade ke database di masa depan).
- Server Node.js hanya untuk serving file statis dan REST API sederhana, tidak untuk deployment production.
- Fitur live harga menggunakan API publik dari Indodax.
- Struktur frontend bisa dikembangkan ke framework modern (React/Vue/Svelte) dengan mudah.

## 👤 Kredit

Dikembangkan oleh Faris  
Instagram: [@faris.a.y](https://instagram.com/faris.a.y)  
Threads: [@faris.a.y](https://threads.net/@faris.a.y)

---

**Lisensi:** ISC (lihat `backend/package.json`) 📄
