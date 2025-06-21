document.addEventListener('DOMContentLoaded', () => {

    // === BAGIAN 1: MENGAMBIL SEMUA ELEMEN DARI HTML ===
    const journalForm = document.getElementById('journalForm');
    const tableBody = document.getElementById('tableBody');
    const archiveTableBody = document.getElementById('archiveTableBody');
    const navView = document.getElementById('nav-view');
    const navArchive = document.getElementById('nav-archive');
    const navAdd = document.getElementById('nav-add');
    const pageViewOrders = document.getElementById('page-view-orders');
    const pageArchiveOrders = document.getElementById('page-archive-orders');
    const pageAddOrder = document.getElementById('page-add-order');
    const refreshBtn = document.getElementById('refreshBtn');

    // === BAGIAN 2: FUNGSI-FUNGSI BANTU ===

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
            alert('Gagal mengambil data harga dari Indodax.');
            return null;
        }
    }

    // Fungsi untuk countdown tombol refresh
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
    async function updateOrderStatus(id, status, final_profit) {
        try {
            const response = await fetch('/api/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, final_profit })
            });
            if (response.ok) {
                loadJournalData();
            } else {
                alert('Gagal memperbarui status order.');
            }
        } catch (error) {
            console.error('Error saat update status:', error);
        }
    }
    
    // Fungsi untuk mengisi baris tabel
    function populateTable(dataArray, targetTableBody, liveTickers) {
        dataArray.forEach(entry => {
            const row = document.createElement('tr');
            const formattedDate = new Date(entry.timestamp).toLocaleString('id-ID');
            const shortId = entry.id ? entry.id.split('-')[0] : 'Lama';
            const status = entry.status || 'Open';
            const statusClass = `status-${status.toLowerCase()}`;
            const statusHTML = `<span class="status-badge ${statusClass}">${status}</span>`;

            // Membuat tumpukan harga
            const entryPriceF = parseFloat(entry.entry).toLocaleString('id-ID');
            const tpPriceF = parseFloat(entry.takeProfit).toLocaleString('id-ID');
            const slPriceF = parseFloat(entry.stopLoss).toLocaleString('id-ID');
            const priceHTML = `
                <div class="price-stack">
                    <div class="price-item price-entry">E: ${entryPriceF}</div>
                    <div class="price-item price-tp">TP: ${tpPriceF}</div>
                    <div class="price-item price-sl">SL: ${slPriceF}</div>
                </div>
            `;

            let profitCellHTML = 'N/A';
            let liveProfitPercentage = null;

            if (entry.final_profit !== undefined) {
                const savedProfit = parseFloat(entry.final_profit);
                const colorClass = savedProfit >= 0 ? 'profit' : 'loss';
                profitCellHTML = `<span class="${colorClass}">${savedProfit.toFixed(2)}%</span>`;
            } else if (status === 'Open' && liveTickers) {
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
                    liveProfitPercentage = percentage;
                    const colorClass = percentage >= 0 ? 'profit' : 'loss';
                    profitCellHTML = `<span class="${colorClass}">${percentage.toFixed(2)}%</span>`;
                }
            }

            let actionHTML = '';
            if (status === 'Open') {
                actionHTML = `<div class="action-buttons">
                    <button class="action-btn btn-selesai" data-id="${entry.id}" data-status="Selesai" data-profit="${liveProfitPercentage}">Selesai</button>
                    <button class="action-btn btn-batal" data-id="${entry.id}" data-status="Batal" data-profit="${liveProfitPercentage}">Batal</button>
                </div>`;
            }
            
            row.innerHTML = `
                <td>${shortId}</td>
                <td>${formattedDate}</td>
                <td>${entry.pair}</td>
                <td>${entry.duration}</td>
                <td>${statusHTML}</td>
                <td>${priceHTML}</td>
                <td>${entry.timeframe}</td>
                <td>${profitCellHTML}</td>
                <td>${actionHTML}</td>
            `;
            targetTableBody.appendChild(row);
        });
    }

    // === BAGIAN 3: FUNGSI UTAMA (MEMUAT DAN MEMISAHKAN DATA) ===
    async function loadJournalData() {
        refreshBtn.textContent = 'Memuat...';
        try {
            const journalResponse = await fetch('/api/data');
            const allJournalData = await journalResponse.json();
            const liveTickers = await getAllTickers();

            tableBody.innerHTML = '';
            archiveTableBody.innerHTML = '';
            
            const activeOrders = [];
            const archivedOrders = [];

            allJournalData.forEach(order => {
                if (order.status === 'Open') {
                    activeOrders.push(order);
                } else {
                    archivedOrders.push(order);
                }
            });
            
            populateTable(activeOrders.reverse(), tableBody, liveTickers);
            populateTable(archivedOrders.reverse(), archiveTableBody, null);

        } catch (error) {
            console.error('Gagal memuat data jurnal:', error);
            tableBody.innerHTML = '<tr><td colspan="9">Gagal memuat data.</td></tr>';
            archiveTableBody.innerHTML = '<tr><td colspan="9">Gagal memuat data.</td></tr>';
        }
    }

    // === BAGIAN 4: FUNGSI NAVIGASI ===
    function showPage(pageName) {
        pageViewOrders.classList.add('hidden');
        pageArchiveOrders.classList.add('hidden');
        pageAddOrder.classList.add('hidden');
        navView.classList.remove('active');
        navArchive.classList.remove('active');
        navAdd.classList.remove('active');

        if (pageName === 'view') {
            pageViewOrders.classList.remove('hidden');
            navView.classList.add('active');
        } else if (pageName === 'archive') {
            pageArchiveOrders.classList.remove('hidden');
            navArchive.classList.add('active');
        } else if (pageName === 'add') {
            pageAddOrder.classList.remove('hidden');
            navAdd.classList.add('active');
        }
    }

    // === BAGIAN 5: MENYAMBUNGKAN FUNGSI KE TOMBOL (EVENT LISTENERS) ===
    navView.addEventListener('click', (e) => { e.preventDefault(); showPage('view'); });
    navArchive.addEventListener('click', (e) => { e.preventDefault(); showPage('archive'); });
    navAdd.addEventListener('click', (e) => { e.preventDefault(); showPage('add'); });

    refreshBtn.addEventListener('click', () => {
        loadJournalData();
        startRefreshCooldown();
    });
    
    tableBody.addEventListener('click', (e) => {
        if (e.target.matches('.action-btn')) {
            const id = e.target.dataset.id;
            const status = e.target.dataset.status;
            const profit = e.target.dataset.profit;
            if (id && status) {
                if(status === 'Batal' && !confirm('Anda yakin ingin membatalkan order ini?')) return;
                updateOrderStatus(id, status, profit);
            }
        }
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

    // === BAGIAN 6: JALANKAN PERTAMA KALI SAAT HALAMAN DIBUKA ===
    loadJournalData();
});
