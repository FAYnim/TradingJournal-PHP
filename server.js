// Import modul Express untuk membuat server web.
const express = require('express');
// Import modul 'fs' (File System) untuk berinteraksi dengan sistem file.
const fs = require('fs');
// Import modul 'path' untuk menangani dan mengubah path file.
const path = require('path');
// Import modul 'crypto' untuk fungsionalitas kriptografi, seperti membuat ID unik.
const crypto = require('crypto');
// Mengimpor fungsi `calculatePortfolioStats` dari file `statsCalculator.js` di dalam direktori `utils`.
const { calculatePortfolioStats } = require('./utils/statsCalculator');

// Membuat instance aplikasi Express.
const app = express();
// Menentukan port yang akan digunakan oleh server.
const PORT = 3000;
// Menentukan path absolut ke file `data-order.json` untuk menyimpan data order.
const DATA_FILE = path.join(__dirname, 'data', 'data-order.json');

// Middleware untuk mem-parsing body request yang masuk sebagai JSON.
app.use(express.json()); 
// Middleware untuk menyajikan file statis (seperti HTML, CSS, JS) dari direktori 'public'.
app.use(express.static(path.join(__dirname, 'public')));

// Mendefinisikan route GET untuk endpoint '/api/data'.
app.get('/api/data', (req, res) => {
    // Membaca file data order secara asynchronous.
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        // Jika terjadi error saat membaca file (misalnya file tidak ada), kirim array kosong sebagai respons.
        if (err) return res.json([]);
        // Jika berhasil, parse konten file (string JSON) menjadi objek JavaScript dan kirim sebagai respons.
        res.json(JSON.parse(data));
    });
});

// Mendefinisikan route GET untuk endpoint '/api/statistics'.
app.get('/api/statistics', (req, res) => {
    // Membaca file data order.
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        // Jika gagal membaca file, kirim respons error 500.
        if (err) {
            return res.status(500).json({ message: 'Gagal memuat data order' });
        }
        try {
            // Parse data JSON dari file.
            const allOrders = JSON.parse(data);
            // Hitung statistik portofolio menggunakan fungsi yang diimpor.
            const portfolioData = calculatePortfolioStats(allOrders);
            // Kirim data statistik sebagai respons JSON.
            res.json(portfolioData);
        } catch (parseError) {
            // Jika terjadi error saat parsing JSON, kirim respons error 500.
            res.status(500).json({ message: 'Format data order tidak valid' });
        }
    });
});

// Mendefinisikan route POST untuk endpoint '/api/data' untuk menambahkan data baru.
app.post('/api/data', (req, res) => {
    // Mengambil data baru dari body request.
    const newData = req.body; 
    // Menambahkan ID unik ke data baru menggunakan UUID (Universally Unique Identifier).
    newData.id = crypto.randomUUID();
    // Menambahkan timestamp (waktu saat ini) dalam format ISO.
    newData.timestamp = new Date().toISOString();
    // Menetapkan status awal order menjadi 'Open'.
    newData.status = 'Open';

    // Membaca file data yang ada.
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        // Inisialisasi array untuk menampung semua data.
        let allData = [];
        // Jika tidak ada error dan file berisi data, parse data JSON tersebut.
        if (!err && data) allData = JSON.parse(data);
        // Tambahkan data baru ke dalam array.
        allData.push(newData);
        
        // Tulis kembali seluruh data (termasuk data baru) ke dalam file.
        fs.writeFile(DATA_FILE, JSON.stringify(allData, null, 2), (writeErr) => {
            // Jika terjadi error saat menulis, kirim respons error 500.
            if (writeErr) return res.status(500).json({ message: 'Gagal menyimpan data.' });
            // Jika berhasil, kirim respons status 201 (Created) beserta data baru yang ditambahkan.
            res.status(201).json(newData);
        });
    });
});

// Mendefinisikan route POST untuk endpoint '/api/update-status' untuk memperbarui status order.
app.post('/api/update-status', (req, res) => {
    // Mengambil id, status, dan final_profit dari body request.
    const { id, status, final_profit } = req.body;
    
    // Membaca file data order.
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        // Jika gagal membaca file, kirim respons error 500.
        if (err) return res.status(500).json({ message: 'Gagal membaca data.' });
        
        // Parse data JSON dari file.
        let allData = JSON.parse(data);
        // Flag untuk menandai apakah order ditemukan.
        let orderFound = false;
        // Iterasi melalui semua order untuk mencari dan memperbarui order yang sesuai.
        const updatedData = allData.map(order => {
            // Jika ID order cocok.
            if (order.id === id) {
                // Tandai bahwa order telah ditemukan.
                orderFound = true;
                // Perbarui status order.
                order.status = status;
                // Jika ada final_profit yang dikirim dan bukan 'null', perbarui juga.
                if (final_profit !== undefined && final_profit !== 'null') {
                    order.final_profit = final_profit;
                }
            }
            // Kembalikan order yang (mungkin) telah diperbarui.
            return order;
        });

        // Jika order dengan ID yang diberikan tidak ditemukan, kirim respons error 404.
        if (!orderFound) return res.status(404).json({ message: 'Order tidak ditemukan' });

        // Tulis data yang telah diperbarui kembali ke file.
        fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), (writeErr) => {
            // Jika terjadi error saat menulis, kirim respons error 500.
            if (writeErr) return res.status(500).json({ message: 'Gagal menyimpan pembaruan.' });
            // Jika berhasil, kirim pesan sukses.
            res.json({ message: 'Status berhasil diperbarui' });
        });
    });
});

// Menjalankan server pada port yang telah ditentukan.
app.listen(PORT, () => {
    // Menampilkan pesan di konsol bahwa server sedang berjalan.
    console.log(`Server Express berjalan di http://localhost:${PORT}`);
    // Memeriksa apakah file data sudah ada.
    if (!fs.existsSync(DATA_FILE)) {
        // Jika tidak ada, buat file `data-order.json` dengan array JSON kosong.
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        // Menampilkan pesan di konsol bahwa file berhasil dibuat.
        console.log('File data-order.json berhasil dibuat.');
    }
});
