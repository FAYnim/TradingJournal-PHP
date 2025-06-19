// Memanggil modul-modul bawaan NodeJS
const http = require('http'); // Untuk membuat server
const fs = require('fs');     // Untuk membaca dan menulis file
const path = require('path'); // Untuk mengelola path file

const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'data.json');

// Membuat server
const server = http.createServer((req, res) => {

    // === MENANGANI PERMINTAAN DARI BROWSER ===

    // Jika browser minta halaman utama (GET /)
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error server.');
                return;
            }
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
    
    // Jika browser minta data jurnal (untuk ditampilkan di tabel)
    else if (req.method === 'GET' && req.url === '/api/data') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            // Jika file tidak ada atau error, kirim array kosong
            if (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end('[]');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }
    
    // Jika browser mengirim data baru (dari form)
    else if (req.method === 'POST' && req.url === '/api/data') {
        let body = '';
        
        // Kumpulkan data yang dikirim
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        // Setelah semua data diterima
        req.on('end', () => {
            const newData = JSON.parse(body);
            newData.timestamp = new Date().toISOString(); // Tambahkan timestamp

            // Baca data lama
            fs.readFile(DATA_FILE, 'utf8', (err, data) => {
                let allData = [];
                if (!err && data) {
                    allData = JSON.parse(data);
                }
                
                allData.push(newData); // Tambahkan data baru ke array
                
                // Tulis kembali semua data ke file
                fs.writeFile(DATA_FILE, JSON.stringify(allData, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Gagal menyimpan data.');
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newData));
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

// Jalankan server di port 3000
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    // Cek jika file data.json belum ada, maka buat file kosong
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        console.log('File data.json berhasil dibuat.');
    }
});
