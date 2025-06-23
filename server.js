// server.js (disesuaikan untuk modul http bawaan)

// Memanggil modul-modul bawaan NodeJS yang kita butuhkan
const http = require('http'); // Untuk membuat server
const fs = require('fs');     // Untuk mengelola file (baca/tulis)
const path = require('path'); // Untuk mengelola path/lokasi file
const crypto = require('crypto'); // Untuk membuat ID unik

// Pengaturan dasar
const PORT = 3000; // Alamat 'pintu' server kita
const DATA_FILE = path.join(__dirname, 'data', 'data-order.json'); // Lokasi file data order
// ===== TAMBAHKAN PATH UNTUK FILE DATA PORTOFOLIO =====
const PORTFOLIO_DATA_FILE = path.join(__dirname, 'data', 'data-portfolio.json');

// Membuat server. Anggap server ini seperti seorang pelayan di restoran.
const server = http.createServer((req, res) => {
    // Setiap kali ada permintaan dari browser, kode di dalam ini akan berjalan.
    // 'req' adalah permintaan/pesanan dari browser.
    // 'res' adalah respons/jawaban yang akan kita kirim kembali.

    // === BAGIAN 1: MENANGANI PERMINTAAN HALAMAN (GET) ===
    // Pelayan mengecek pesanan dari browser.

    // Jika browser minta halaman utama ('/')
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) { res.writeHead(500); res.end('Error server.'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }

    // ... (kode untuk /style.css, /script.js, /js/api.js, /js/ui.js tidak berubah) ...
    else if (req.method === 'GET' && req.url === '/style.css') {
        fs.readFile(path.join(__dirname, 'style.css'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    }
    else if (req.method === 'GET' && req.url === '/script.js') {
        fs.readFile(path.join(__dirname, 'script.js'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
    }
    else if (req.method === 'GET' && req.url === '/js/api.js') {
        fs.readFile(path.join(__dirname, 'js', 'api.js'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
    }
    else if (req.method === 'GET' && req.url === '/js/ui.js') {
        fs.readFile(path.join(__dirname, 'js', 'ui.js'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
    }
    // Jika browser minta semua data jurnal (untuk ditampilkan di tabel)
    else if (req.method === 'GET' && req.url === '/api/data') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('[]'); return; }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }

    // ===== TAMBAHKAN ENDPOINT BARU UNTUK DATA PORTOFOLIO =====
    // Jika browser minta data portofolio (untuk halaman statistik)
    else if (req.method === 'GET' && req.url === '/api/portfolio') {
        fs.readFile(PORTFOLIO_DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error('Gagal membaca file data portofolio:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Gagal memuat data portofolio' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    
    // ... (kode untuk POST /api/data dan POST /api/update-status tidak berubah) ...
    else if (req.method === 'POST' && req.url === '/api/data') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const newData = JSON.parse(body);
            newData.id = crypto.randomUUID();
            newData.timestamp = new Date().toISOString();
            newData.status = 'Open';

            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                let allData = [];
                if (!err && data) { allData = JSON.parse(data); }
                allData.push(newData);
                
                fs.writeFile(DATA_FILE, JSON.stringify(allData, null, 2), (err) => {
                    if (err) { res.writeHead(500); res.end('Gagal menyimpan data.'); return; }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newData));
                });
            });
        });
    }
    else if (req.method === 'POST' && req.url === '/api/update-status') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { id, status, final_profit } = JSON.parse(body);
            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                if (err) { res.writeHead(500); res.end('Gagal membaca data.'); return; }
                let allData = JSON.parse(data);
                const updatedData = allData.map(order => {
                    if (order.id === id) {
                        const updatedOrder = { ...order, status: status };
                        if (final_profit !== undefined && final_profit !== 'null') {
                            updatedOrder.final_profit = final_profit;
                        }
                        return updatedOrder;
                    }
                    return order;
                });
                fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), (err) => {
                    if (err) { res.writeHead(500); res.end('Gagal menyimpan pembaruan.'); return; }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Status berhasil diperbarui' }));
                });
            });
        });
    }
    
    // Jika browser minta halaman yang tidak ada
    else {
        res.writeHead(404);
        res.end('Halaman tidak ditemukan');
    }
});

// Menjalankan server agar 'pelayan' mulai bekerja
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    // Jika file data.json belum ada, buat file kosong agar tidak error
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        console.log('File data-order.json berhasil dibuat.');
    }
    
    // ===== TAMBAHKAN LOGIKA UNTUK MEMBUAT FILE PORTOFOLIO =====
    // Jika file data-portfolio.json belum ada, buat file dengan data contoh
    if (!fs.existsSync(PORTFOLIO_DATA_FILE)) {
        const defaultPortfolioData = {
            "summary": { "totalTrades": 0, "wins": 0, "losses": 0, "batal": 0, "totalProfit": 0, "winRate": 0, "avgWin": 0, "avgLoss": 0 },
            "performanceByPair": {}
        };
        fs.writeFileSync(PORTFOLIO_DATA_FILE, JSON.stringify(defaultPortfolioData, null, 2), 'utf8');
        console.log('File data-portfolio.json berhasil dibuat.');
    }
});
