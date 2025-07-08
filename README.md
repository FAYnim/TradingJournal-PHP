# TradingJournal

Aplikasi **Jurnal Trading** berbasis web untuk mencatat, memantau, dan menganalisis hasil trading Anda. Mendukung pencatatan order, arsip, portofolio, serta visualisasi statistik performa trading secara real-time menggunakan data harga dari Indodax.

---

## 🚀 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (jQuery, Chart.js)
- **Backend:** PHP (Native)
- **Database:** JSON file (default, bisa dikembangkan)
- **API Market Data:** [Indodax Public API](https://indodax.com/downloads/BITCOINCOID-API-DOCUMENTATION.pdf)

---

## 📋 Requirements

- PHP 7.4 atau lebih baru
- Koneksi internet (untuk fetch harga live dari Indodax)
- OS: Windows, Linux, atau MacOS

---

## 🛠️ Cara Instalasi & Menjalankan Lokal

1. **Clone repository:**
    ```sh
    git clone https://github.com/FAYnim/TradingJournal.git
    cd TradingJournal
    ```

2. **Jalankan server lokal:**
    Buka terminal di direktori proyek dan jalankan perintah berikut:
    ```sh
    php -S localhost:8000
    ```

3. **Akses aplikasi di browser:**
    ```
    http://localhost:8000
    ```

---

## 📂 Struktur Folder & File

```
TradingJournal/
├── data/
│   ├── data-order.json
│   └── setup-plans.json
├── utils/
│   └── statsCalculator.php
├── index.php
├── script.js
├── style.css
└── README.md
```

---

## 🐞 Troubleshooting

- **Port 8000 sudah digunakan:**  
  Gunakan port lain (misal: `php -S localhost:8080`) atau matikan aplikasi lain yang memakai port tersebut.

- **Error fetch harga Indodax:**  
  - Pastikan koneksi internet stabil.
  - Cek apakah endpoint Indodax tidak down/blokir.
  - Pastikan ekstensi PHP `allow_url_fopen` diaktifkan di `php.ini` Anda.

- **Data tidak tersimpan:**  
  - Pastikan folder `data/` ada dan memiliki izin tulis.
  - Jalankan server dengan hak akses yang cukup.

- **Perubahan kode tidak muncul di browser:**  
  Refresh browser, atau restart server jika mengubah kode PHP.

---

## 🙌 Credit

**Dibuat oleh:**  
Faris A. Y.  
- [Instagram](https://instagram.com/faris.a.y)
- [Threads](https://threads.net/@faris.a.y)
- [GitHub](https://github.com/FAYnim)

---

Happy journaling & trading!