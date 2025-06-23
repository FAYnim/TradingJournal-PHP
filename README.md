# TradingJournal

Aplikasi **Jurnal Trading** berbasis web untuk mencatat, memantau, dan menganalisis hasil trading Anda. Mendukung pencatatan order, arsip, portofolio, serta visualisasi statistik performa trading secara real-time menggunakan data harga dari Indodax.

---

## 🚀 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules), Chart.js
- **Backend:** Node.js (Express)
- **Database:** JSON file (default, bisa dikembangkan)
- **API Market Data:** [Indodax Public API](https://indodax.com/downloads/BITCOINCOID-API-DOCUMENTATION.pdf)
- **Package Manager:** [pnpm](https://pnpm.io/)


---

## 📋 Requirements

- Node.js v16 atau lebih baru
- pnpm (alternatif: npm/yarn, namun pnpm direkomendasikan)
- Koneksi internet (untuk fetch harga live dari Indodax)
- OS: Windows, Linux, atau MacOS

---

## 🛠️ Cara Instalasi & Menjalankan Lokal

1. **Clone repository:**
    ```sh
    git clone https://github.com/FAYnim/TradingJournal.git
    cd TradingJournal
    ```

2. **Install dependencies dengan PNPM:**
    ```sh
    pnpm install
    ```

3. **Jalankan server lokal:**
    ```sh
    pnpm start
    ```
   Atau jika tidak ada script start, gunakan:
    ```sh
    node server.js
    ```

4. **Akses aplikasi di browser:**
    ```
    http://localhost:3000
    ```

---

## 📂 Struktur Folder & File

```
TradingJournal/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── js/
│       ├── api.js
│       └── ui.js
├── utils/
│   └── statsCalculator.js
├── data/
│   └── journal.json
├── server.js
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 🐞 Troubleshooting

- **Port 3000 sudah digunakan:**  
  Ubah port di `server.js` atau matikan aplikasi lain yang memakai port tersebut.

- **Error fetch harga Indodax:**  
  - Pastikan koneksi internet stabil.
  - Cek apakah endpoint Indodax tidak down/blokir.

- **Data tidak tersimpan:**  
  - Pastikan folder `data/` ada dan memiliki izin tulis.
  - Jalankan server dengan hak akses yang cukup.

- **Tidak bisa install pnpm:**  
  Instal pnpm global:  
  ```sh
  npm install -g pnpm
  ```

- **Perubahan kode tidak muncul di browser:**  
  Refresh browser, atau restart server jika mengubah kode backend.

---

## 🙌 Credit

**Dibuat oleh:**  
Faris A. Y.  
- [Instagram](https://instagram.com/faris.a.y)
- [Threads](https://threads.net/@faris.a.y)
- [GitHub](https://github.com/FAYnim)

---

Happy journaling & trading! 🚀
