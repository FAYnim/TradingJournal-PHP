// Memanggil modul-modul bawaan NodeJS yang kita butuhkan
const http = require('http'); // Untuk membuat server
const fs = require('fs');     // Untuk mengelola file (baca/tulis)
const path = require('path'); // Untuk mengelola path/lokasi file
const crypto = require('crypto'); // Untuk membuat ID unik

// Pengaturan dasar
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json'); // Lokasi file data kita

// Membuat server utama
const server = http.createServer((req, res) => {

    // === MENANGANI PERMINTAAN GET (Minta Halaman/Data) ===

    // Jika browser minta halaman utama
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
    
    // === MENANGANI PERMINTAAN POST (Kirim Data Baru/Perubahan) ===

    // Endpoint untuk MENAMBAH order baru
    else if (req.method === 'POST' && req.url === '/api/data') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const newData = JSON.parse(body);
            
            // Tambahkan properti baru ke data sebelum disimpan
            newData.id = crypto.randomUUID();         // Buat ID unik
            newData.timestamp = new Date().toISOString(); // Tambahkan waktu saat ini
            newData.status = 'Open';                  // Beri status default "Open"

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
    
    // Endpoint untuk MEMPERBARUI status order (Selesai/Batal)
    else if (req.method === 'POST' && req.url === '/api/update-status') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            // Ambil ID, status baru, dan profit final dari browser
            const { id, status, final_profit } = JSON.parse(body);

            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                if (err) { res.writeHead(500); res.end('Gagal membaca data.'); return; }
                
                let allData = JSON.parse(data);
                
                // Cari order berdasarkan ID dan perbarui datanya
                const updatedData = allData.map(order => {
                    if (order.id === id) {
                        const updatedOrder = { ...order, status: status };
                        
                        // Jika ada data profit yang dikirim, simpan juga
                        if (final_profit !== undefined && final_profit !== null) {
                            updatedOrder.final_profit = final_profit;
                        }
                        
                        return updatedOrder;
                    }
                    return order;
                });
                
                // Tulis kembali semua data yang sudah diperbarui ke file
                fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), (err) => {
                    if (err) { res.writeHead(500); res.end('Gagal menyimpan pembaruan.'); return; }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Status berhasil diperbarui' }));
                });
            });
        });
    }
    
    // Jika halaman/endpoint tidak ditemukan
    else {
        res.writeHead(404);
        res.end('Halaman tidak ditemukan');
    }
});

// Menjalankan server
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    // Jika file data.json belum ada, buat file kosong agar tidak error
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        console.log('File data.json berhasil dibuat.');
    }
});
