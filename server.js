const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { calculatePortfolioStats } = require('./utils/statsCalculator');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'data-order.json');

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.json([]);
        res.json(JSON.parse(data));
    });
});

app.get('/api/statistics', (req, res) => {
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

app.post('/api/data', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server Express berjalan di http://localhost:${PORT}`);
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
        console.log('File data-order.json berhasil dibuat.');
    }
});
