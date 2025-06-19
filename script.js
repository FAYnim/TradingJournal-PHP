document.addEventListener('DOMContentLoaded', () => {
    // === 1. MENGAMBIL SEMUA ELEMEN HTML YANG DIBUTUHKAN ===
    const journalForm = document.getElementById('journalForm');
    const tableBody = document.getElementById('tableBody');
    const navView = document.getElementById('nav-view');
    const navAdd = document.getElementById('nav-add');
    const pageViewOrders = document.getElementById('page-view-orders');
    const pageAddOrder = document.getElementById('page-add-order');
    const refreshBtn = document.getElementById('refreshBtn');

    // === 2. FUNGSI-FUNGSI BANTU ===

    // Fungsi untuk mengambil data harga dari Indodax
    async function getAllTickers() {
        const url = 'https://indodax.com/api/tickers';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);
            const data = await response.json();
            return data.tickers;
        } catch (error) {
            console.error('Error di getAllTickers:', error);
            alert('Gagal mengambil data harga dari Indodax. Cek koneksi internet.');
            return null;
        }
    }

    // Fungsi untuk mengatur countdown tombol refresh
    function startRefreshCooldown() {
        let secondsLeft = 30;
        refreshBtn.disabled = true;
        const countdownInterval = setInterval(() => {
            secondsLeft--;
            refreshBtn.textContent = `Tunggu ${secondsLeft}s`;
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                refreshBtn.disabled = false;
                refreshBtn.textContent = 'Refresh Harga';
            }
        }, 1000);
    }

    // Fungsi untuk mengirim pembaruan status ke server
    async function updateOrderStatus(id, status) {
        try {
            const response = await fetch('/api/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (response.ok) {
                loadJournalData(); // Muat ulang tabel setelah berhasil update
            } else {
                alert('Gagal memperbarui status order.');
            }
        } catch (error) {
            console.error('Error saat update status:', error);
        }
    }

    // === 3. FUNGSI UTAMA: MEMUAT SEMUA DATA KE TABEL ===
    async function loadJournalData() {
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
                const shortId = entry.id ? entry.id.split('-')[0] : 'Lama';
                const status = entry.status || 'Open';
                
                const statusClass = `status-${status.toLowerCase()}`;
                const statusHTML = `<span class="status-badge ${statusClass}">${status}</span>`;

				const entryPrice = parseFloat(entry.entry);
				const takeProfitPrice = parseFloat(entry.takeProfit);
				const stopLossPrice = parseFloat(entry.stopLoss);

				const formattedEntry = !isNaN(entryPrice) ? entryPrice.toLocaleString('id-ID') : entry.entry;
                const formattedTP = !isNaN(takeProfitPrice) ? takeProfitPrice.toLocaleString('id-ID') : entry.takeProfit;
                const formattedSL = !isNaN(stopLossPrice) ? stopLossPrice.toLocaleString('id-ID') : entry.stopLoss;

                let profitCellHTML = 'N/A';
                if (liveTickers && (status === 'Open' || status === 'Selesai')) {
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

                let actionHTML = '';
                if (status === 'Open') {
                    actionHTML = `
                        <div class="action-buttons">
                            <button class="action-btn btn-selesai" data-id="${entry.id}" data-status="Selesai">Selesai</button>
                            <button class="action-btn btn-batal" data-id="${entry.id}" data-status="Batal">Batal</button>
                        </div>
                    `;
                }

                row.innerHTML = `
                    <td>${shortId}</td>
                    <td>${formattedDate}</td>
                    <td>${entry.pair}</td>
                    <td>${entry.duration}</td>
                    <td>${statusHTML}</td>
                    <td>${formattedEntry}</td>
                    <td>${formattedTP}</td>
                    <td>${formattedSL}</td>
                    <td>${entry.timeframe}</td>
                    <td>${profitCellHTML}</td>
                    <td>${actionHTML}</td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Gagal memuat data jurnal:', error);
            tableBody.innerHTML = `<tr><td colspan="11" style="text-align:center;">Gagal memuat data.</td></tr>`;
        }
    }

    // === 4. FUNGSI UNTUK NAVIGASI PINDAH HALAMAN ===
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

    // === 5. MENYAMBUNGKAN SEMUA FUNGSI KE EVENT CLICK ===

    // Event untuk navigasi
    navView.addEventListener('click', (e) => { e.preventDefault(); showPage('view'); });
    navAdd.addEventListener('click', (e) => { e.preventDefault(); showPage('add'); });

    // Event untuk tombol refresh
    refreshBtn.addEventListener('click', () => {
        loadJournalData();
        startRefreshCooldown();
    });

    // Event untuk tombol di dalam tabel (Selesai/Batal)
    tableBody.addEventListener('click', (e) => {
        if (e.target.matches('.action-btn')) {
            const id = e.target.dataset.id;
            const status = e.target.dataset.status;
            if (id && status) {
                if(status === 'Batal' && !confirm('Anda yakin ingin membatalkan order ini?')) {
                    return;
                }
                updateOrderStatus(id, status);
            }
        }
    });

    // Event untuk form submit
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

    // === 6. JALANKAN PERTAMA KALI SAAT HALAMAN DIBUKA ===
    loadJournalData();
});
