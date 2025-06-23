// ===== 1. Memanggil Modul yang Dibutuhkan =====
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ===== 2. Inisialisasi Aplikasi Express =====
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'data-order.json');

// ===== 3. Penggunaan Middleware =====
// Middleware untuk mem-parsing body request JSON secara otomatis
app.use(express.json()); 
// Middleware untuk menyajikan file statis (HTML, CSS, JS) dari direktori root
app.use(express.static(__dirname)); 

// ===== 4. Fungsi Helper (tidak berubah) =====
function calculatePortfolioStats(orders) {
    const summary = {
        totalTrades: 0, wins: 0, losses: 0, batal: 0,
        totalProfit: 0, winRate: 0, avgWin: 0, avgLoss: 0
    };
    let totalWinProfit = 0, totalLossProfit = 0;

    for (const order of orders) {
        if (order.status === 'Selesai') {
            const profit = parseFloat(order.final_profit);
            if (isNaN(profit)) continue;
            summary.totalProfit += profit;
            if (profit >= 0) {
                summary.wins++;
                totalWinProfit += profit;
            } else {
                summary.losses++;
                totalLossProfit += profit;
            }
        } else if (order.status === 'Batal') {
            summary.batal++;
        }
    }

    summary.totalTrades = summary.wins + summary.losses;
    if (summary.totalTrades > 0) summary.winRate = (summary.wins / summary.totalTrades) * 100;
    if (summary.wins > 0) summary.avgWin = totalWinProfit / summary.wins;
    if (summary.losses > 0) summary.avgLoss = totalLossProfit / summary.losses;

    return { summary };
}

// ===== 5. Definisi Rute (API Endpoints) =====

// GET: Mengambil semua data order
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.json([]); // Kirim array kosong jika file tidak ada/error
        res.json(JSON.parse(data));
    });
});

// GET: Mengambil data portofolio yang sudah dihitung
app.get('/api/portfolio', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal memuat data order' });
        }
        try {
            const allOrders = JSON.parse(data);
            const portfolioData = calculatePortfolioStats(allOrders);
            res.json(portfolioData);
        } catch (parseError) {
            res.status(500).json({ message: 'Format data order tidak valid' });
        }
    });
});

// POST: Menambah order baru
app.post('/api/data', (req, res) => {
    // Middleware express.json() sudah mengisi req.body untuk kita
    const newData = req.body; 
    newData.id = crypto.randomUUID();
    newData.timestamp = new Date().toISOString();
    newData.status = 'Open';

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let allData = [];
        if (!err && data) allData = JSON.parse(data);
        allData.push(newData);
        
        fs.writeFile(DATA_FILE, JSON.stringify(allData, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ message: 'Gagal menyimpan data.' });
            res.status(201).json(newData);
        });
    });
});

// POST: Memperbarui status order
app.post('/api/update-status', (req, res) => {
    const { id, status, final_profit } = req.body;
    
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Gagal membaca data.' });
        
        let allData = JSON.parse(data);
        let orderFound = false;
        const updatedData = allData.map(order => {
            if (order.id === id) {
                orderFound = true;
                order.status = status;
                if (final_profit !== undefined && final_profit !== 'null') {
                    order.final_profit = final_profit;
                }
            }
            return order;
        });

        if (!orderFound) return res.status(404).json({ message: 'Order tidak ditemukan' });

        fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ message: 'Gagal menyimpan pembaruan.' });
            res.json({ message: 'Status berhasil diperbarui' });
        });
    });
});


// ===== 6. Menjalankan Server =====
app.listen(PORT, () => {
    console.log(`Server Express berjalan di http://localhost:${PORT}`);
    // Logika untuk membuat file data jika belum ada (tidak berubah)
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        console.log('File data-order.json berhasil dibuat.');
    }
});
