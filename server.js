// server.js (disesuaikan untuk modul http bawaan)

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'data-order.json');
// ===== File data-portfolio.json tidak lagi kita perlukan =====
// const PORTFOLIO_DATA_FILE = path.join(__dirname, 'data', 'data-portfolio.json');

// ===== FUNGSI BARU UNTUK MENGHITUNG STATISTIK PORTOFOLIO =====
function calculatePortfolioStats(orders) {
    const summary = {
        totalTrades: 0,
        wins: 0,
        losses: 0,
        batal: 0,
        totalProfit: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0
    };

    let totalWinProfit = 0;
    let totalLossProfit = 0;

    // Loop melalui setiap order yang sudah selesai atau batal
    for (const order of orders) {
        if (order.status === 'Selesai') {
            const profit = parseFloat(order.final_profit);
            // Lanjutkan hanya jika final_profit adalah angka yang valid
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

    // Hitung statistik turunan setelah loop selesai
    summary.totalTrades = summary.wins + summary.losses;

    if (summary.totalTrades > 0) {
        summary.winRate = (summary.wins / summary.totalTrades) * 100;
    }
    if (summary.wins > 0) {
        summary.avgWin = (totalWinProfit / summary.wins).toFixed(2);
    }
    if (summary.losses > 0) {
        summary.avgLoss = (totalLossProfit / summary.losses).toFixed(2);
    }

    // Kembalikan objek dengan format yang sama seperti yang diharapkan frontend
    return { summary };
}

const server = http.createServer((req, res) => {
    // ... (Kode untuk menyajikan file HTML, CSS, JS tetap sama) ...
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) { res.writeHead(500); res.end('Error server.'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }
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
    else if (req.method === 'GET' && req.url === '/api/data') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('[]'); return; }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }

    // ===== MODIFIKASI ENDPOINT /api/portfolio =====
    else if (req.method === 'GET' && req.url === '/api/portfolio') {
        // 1. Baca file data order, bukan data portofolio
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                console.error('Gagal membaca file data order untuk portofolio:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Gagal memuat data order' }));
                return;
            }
            try {
                const allOrders = JSON.parse(data);
                // 2. Lakukan kalkulasi berdasarkan data order
                const portfolioData = calculatePortfolioStats(allOrders);
                // 3. Kirim hasil kalkulasi sebagai respons
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(portfolioData));
            } catch (parseError) {
                console.error('Gagal mem-parsing data order:', parseError);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Format data order tidak valid' }));
            }
        });
    }
    
    // ... (Kode untuk POST /api/data dan POST /api/update-status tetap sama) ...
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
    
    else {
        res.writeHead(404);
        res.end('Halaman tidak ditemukan');
    }
});

server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        console.log('File data-order.json berhasil dibuat.');
    }
    // ===== Logika untuk membuat data-portfolio.json sudah dihapus karena tidak relevan =====
});
