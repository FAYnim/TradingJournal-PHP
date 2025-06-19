document.addEventListener('DOMContentLoaded', () => {
    // === 1. MENGAMBIL SEMUA ELEMEN HTML YANG DIBUTUHKAN ===
    const journalForm = document.getElementById('journalForm');
    const tableBody = document.getElementById('tableBody');
    const navView = document.getElementById('nav-view');
    const navAdd = document.getElementById('nav-add');
    const pageViewOrders = document.getElementById('page-view-orders');
    const pageAddOrder = document.getElementById('page-add-order');
    const refreshBtn = document.getElementById('refreshBtn');


    // === 2. FUNGSI UNTUK MENGAMBIL DATA HARGA DARI INDODAX ===
    async function getAllTickers() {
        const url = 'https://indodax.com/api/tickers';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Gagal mengambil data: ${response.statusText}`);
            }
            const data = await response.json();
            return data.tickers;
        } catch (error) {
            console.error('Error di getAllTickers:', error);
            alert('Gagal mengambil data harga dari Indodax. Cek koneksi internet.');
            return null;
        }
    }


    // === 3. FUNGSI UTAMA: MEMUAT DATA JURNAL DAN MENGHITUNG PROFIT ===
    async function loadJournalData() {
        // Hanya ubah tulisan jadi "Memuat...", tombol sudah dinonaktifkan oleh countdown
        refreshBtn.textContent = 'Memuat...';

        try {
            const journalResponse = await fetch('/api/data');
            const journalData = await journalResponse.json();
            const liveTickers = await getAllTickers();

            tableBody.innerHTML = '';
            journalData.reverse();

            journalData.forEach(entry => {
                const row = document.createElement('tr');
                const formattedDate = new Date(entry.timestamp).toLocaleString('id-ID');
                
                let profitCellHTML = 'N/A';
                
                if (liveTickers) {
                    const apiPair = entry.pair.toLowerCase().replace('idr', '_idr');
                    const currentTicker = liveTickers[apiPair];

                    if (currentTicker) {
                        const entryPrice = parseFloat(entry.entry);
                        const livePrice = parseFloat(currentTicker.last);
                        let percentage = 0;

                        if (entry.duration === 'Long') {
                            percentage = ((livePrice - entryPrice) / entryPrice) * 100;
                        } else {
                            percentage = ((entryPrice - livePrice) / entryPrice) * 100;
                        }
                        
                        const colorClass = percentage >= 0 ? 'profit' : 'loss';
                        profitCellHTML = `<span class="${colorClass}">${percentage.toFixed(2)}%</span>`;
                    }
                }
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${entry.pair}</td>
                    <td>${entry.duration}</td>
                    <td>${entry.entry}</td>
                    <td>${entry.takeProfit}</td>
                    <td>${entry.stopLoss}</td>
                    <td>${entry.timeframe}</td>
                    <td>${profitCellHTML}</td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Gagal memuat data jurnal:', error);
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Gagal memuat data.</td></tr>';
        }
        // Bagian "finally" kita hapus, karena status tombol sekarang diatur oleh countdown
    }


    // === 4. FUNGSI BARU: MENGATUR COUNTDOWN UNTUK TOMBOL REFRESH ===
    // Fungsi ini yang akan mengontrol tombol selama 30 detik.
    function startRefreshCooldown() {
        let secondsLeft = 30; // Atur waktu tunggu
        
        // Langsung nonaktifkan tombol
        refreshBtn.disabled = true;

        // Buat timer yang berjalan setiap 1 detik (1000 milidetik)
        const countdownInterval = setInterval(() => {
            // Kurangi waktu tersisa
            secondsLeft--;
            // Perbarui teks tombol
            refreshBtn.textContent = `Tunggu ${secondsLeft}s`;

            // Jika waktu sudah habis...
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval); // Hentikan timernya
                refreshBtn.disabled = false;      // Aktifkan kembali tombolnya
                refreshBtn.textContent = 'Refresh Harga'; // Kembalikan teks aslinya
            }
        }, 1000);
    }


    // === 5. FUNGSI UNTUK NAVIGASI PINDAH HALAMAN (Tidak Berubah) ===
    function showPage(pageName) {
        if (pageName === 'view') {
            pageViewOrders.classList.remove('hidden');
            pageAddOrder.classList.add('hidden');
            navView.classList.add('active');
            navAdd.classList.remove('active');
        } else if (pageName === 'add') {
            pageViewOrders.classList.add('hidden');
            pageAddOrder.classList.remove('hidden');
            navView.classList.remove('active');
            navAdd.classList.add('active');
        }
    }


    // === 6. MENYAMBUNGKAN FUNGSI KE EVENT (SAAT DIKLIK) ===
    navView.addEventListener('click', (e) => { e.preventDefault(); showPage('view'); });
    navAdd.addEventListener('click', (e) => { e.preventDefault(); showPage('add'); });
    
    // --> INI BAGIAN YANG DIUBAH <--
    // Saat tombol "Refresh Harga" diklik...
    refreshBtn.addEventListener('click', () => {
        // 1. Jalankan fungsi untuk memuat data
        loadJournalData();
        // 2. Langsung jalankan juga fungsi countdown
        startRefreshCooldown();
    });

    journalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(journalForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                journalForm.reset();
                await loadJournalData();
                showPage('view');
            } else {
                alert('Gagal menyimpan data.');
            }
        } catch (error) {
            console.error('Error saat mengirim data:', error);
        }
    });


    // === 7. JALANKAN PERTAMA KALI ===
    loadJournalData();
});
