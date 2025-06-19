// === 1. MEMANGGIL SEMUA MODUL YANG DIBUTUHKAN ===
// Ini adalah alat-alat bawaan NodeJS yang kita perlukan.
const http = require('http');     // Untuk membuat server
const fs = require('fs');         // Untuk membaca dan menulis file (seperti data.json)
const path = require('path');     // Untuk mengelola lokasi file agar rapi
const crypto = require('crypto'); // Untuk membuat ID unik (UUID)


// === 2. PENGATURAN DASAR ===
const PORT = 3000; // Server akan berjalan di port 3000
const DATA_FILE = path.join(__dirname, 'data.json'); // Lokasi file database kita


// === 3. MEMBUAT SERVER ===
// Ini adalah "otak" dari aplikasi kita. Dia akan menunggu permintaan dari browser.
const server = http.createServer((req, res) => {

    // --- MENANGANI PERMINTAAN DARI BROWSER ---

    // Jika browser minta halaman utama (GET /)
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) { res.writeHead(500); res.end('Error server.'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    }

    // Jika browser minta file CSS
    else if (req.method === 'GET' && req.url === '/style.css') {
        fs.readFile(path.join(__dirname, 'style.css'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    }
    
    // Jika browser minta file JavaScript
    else if (req.method === 'GET' && req.url === '/script.js') {
        fs.readFile(path.join(__dirname, 'script.js'), (err, content) => {
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
    
    // Jika browser mengirim data order BARU (dari form)
    else if (req.method === 'POST' && req.url === '/api/data') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const newData = JSON.parse(body);
            // Tambahkan properti baru sebelum disimpan
            newData.id = crypto.randomUUID();        // Buat ID unik
            newData.timestamp = new Date().toISOString(); // Tambahkan waktu
            newData.status = 'Open';                 // Tambahkan status default "Open"

            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                let allData = [];
                if (!err && data) { allData = JSON.parse(data); }
                allData.push(newData); // Tambahkan order baru ke daftar
                fs.writeFile(DATA_FILE, JSON.stringify(allData, null, 2), (err) => {
                    if (err) { res.writeHead(500); res.end('Gagal menyimpan data.'); return; }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newData));
                });
            });
        });
    }
    
    // RUTE BARU: Jika browser minta untuk MENGUBAH STATUS order yang sudah ada
    else if (req.method === 'POST' && req.url === '/api/update-status') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { id, status } = JSON.parse(body); // Ambil ID dan status baru dari browser

            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                if (err) { res.writeHead(500); res.end('Gagal membaca data.'); return; }
                
                let allData = JSON.parse(data);
                
                // Cari order berdasarkan ID, lalu perbarui statusnya
                const updatedData = allData.map(order => {
                    if (order.id === id) { // Jika ID-nya cocok...
                        return { ...order, status: status }; // ...buat salinan order & ubah statusnya
                    }
                    return order; // Jika tidak, biarkan saja
                });
                
                // Tulis kembali seluruh data yang sudah diperbarui ke file
                fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), (err) => {
                    if (err) { res.writeHead(500); res.end('Gagal menyimpan pembaruan.'); return; }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Status berhasil diperbarui' }));
                });
            });
        });
    }
    
    // Jika halaman tidak ditemukan
    else {
        res.writeHead(404);
        res.end('Halaman tidak ditemukan');
    }
});


// === 4. MENJALANKAN SERVER ===
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    // Jika file data.json belum ada, buat file kosong agar tidak error
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        console.log('File data.json berhasil dibuat.');
    }
});
