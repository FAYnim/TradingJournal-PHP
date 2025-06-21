// Memanggil modul-modul bawaan NodeJS yang kita butuhkan
const http = require('http'); // Untuk membuat server
const fs = require('fs');     // Untuk mengelola file (baca/tulis)
const path = require('path'); // Untuk mengelola path/lokasi file
const crypto = require('crypto'); // Untuk membuat ID unik

// Pengaturan dasar
const PORT = 3000; // Alamat 'pintu' server kita
const DATA_FILE = path.join(__dirname, 'data.json'); // Lokasi file data kita

// Membuat server. Anggap server ini seperti seorang pelayan di restoran.
const server = http.createServer((req, res) => {
    // Setiap kali ada permintaan dari browser, kode di dalam ini akan berjalan.
    // 'req' adalah permintaan/pesanan dari browser.
    // 'res' adalah respons/jawaban yang akan kita kirim kembali.

    // === BAGIAN 1: MENANGANI PERMINTAAN HALAMAN (GET) ===
    // Pelayan mengecek pesanan dari browser.

    // Jika browser minta halaman utama ('/')
    if (req.method === 'GET' && req.url === '/') {
        // Pelayan mengambil file index.html dan mengirimkannya ke browser.
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) { res.writeHead(500); res.end('Error server.'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }

    // Jika browser minta file CSS untuk mempercantik tampilan
    else if (req.method === 'GET' && req.url === '/style.css') {
        fs.readFile(path.join(__dirname, 'style.css'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    }
    
    // Jika browser minta file JavaScript utama
    else if (req.method === 'GET' && req.url === '/script.js') {
        fs.readFile(path.join(__dirname, 'script.js'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
    }

    // =================================================================
    //         INI ADALAH BAGIAN YANG MEMPERBAIKI MASALAH ANDA
    // =================================================================
    // Kita perlu mengajari 'pelayan' cara mengambil file dari folder 'js'.

    // Jika browser minta file '/js/api.js'
    else if (req.method === 'GET' && req.url === '/js/api.js') {
        // Pelayan akan mencari file 'api.js' di dalam folder 'js'
        fs.readFile(path.join(__dirname, 'js', 'api.js'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
    }
    
    // Jika browser minta file '/js/ui.js'
    else if (req.method === 'GET' && req.url === '/js/ui.js') {
        // Pelayan akan mencari file 'ui.js' di dalam folder 'js'
        fs.readFile(path.join(__dirname, 'js', 'ui.js'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        });
    }
    // =================================================================
    //                          PERBAIKAN SELESAI
    // =================================================================

    // Jika browser minta semua data jurnal (untuk ditampilkan di tabel)
    else if (req.method === 'GET' && req.url === '/api/data') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('[]'); return; }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    
    // === BAGIAN 2: MENANGANI PENGIRIMAN DATA (POST) ===

    // Endpoint untuk MENAMBAH order baru
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
    
    // Endpoint untuk MEMPERBARUI status order
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
        console.log('File data.json berhasil dibuat.');
    }
});
