// Komentar: File ini bertanggung jawab untuk mengelola semua interaksi dengan antarmuka pengguna (UI).

// Mengimpor semua fungsi dari api.js untuk komunikasi dengan backend.
import * as api from './api.js';

// Variabel global untuk menyimpan instance chart agar bisa dihancurkan dan dibuat ulang.
let statisticChart = null;

// Fungsi untuk menampilkan data statistik dalam bentuk kartu dan pie chart.
export function displayStatisticData(data) {
    // Mengambil elemen wrapper untuk kartu statistik dan canvas untuk chart.
    const wrapper = document.querySelector('.statistic-cards-wrapper');
    const chartCanvas = document.getElementById('statisticPieChart');
    // Jika salah satu elemen tidak ditemukan, hentikan eksekusi.
    if (!wrapper || !chartCanvas) return;

    // Mengambil ringkasan data statistik.
    const summary = data.summary;
    // Mengisi wrapper kartu dengan data statistik menggunakan template literal.
    wrapper.innerHTML = `
        <div class="statistic-card">
            <h3>Total Profit</h3>
            <p class="value ${summary.totalProfit >= 0 ? 'profit' : 'loss'}">${summary.totalProfit.toFixed(2)}%</p>
        </div>
        <div class="statistic-card">
            <h3>Win Rate</h3>
            <p class="value">${summary.winRate.toFixed(2)}%</p>
            <p>(${summary.wins} menang dari ${summary.wins + summary.losses} trade)</p>
        </div>
        <div class="statistic-card">
            <h3>Avg. Profit / Loss</h3>
            <p><span class="profit">${summary.avgWin.toFixed(2)}%</span> / <span class="loss">${summary.avgLoss.toFixed(2)}%</span></p>
        </div>
    `;

    // Mendapatkan konteks rendering 2D dari canvas.
    const ctx = chartCanvas.getContext('2d');
    
    // Jika sudah ada chart sebelumnya, hancurkan untuk mencegah tumpang tindih.
    if (statisticChart) {
        statisticChart.destroy();
    }
    
    // Membuat instance pie chart baru menggunakan Chart.js.
    statisticChart = new Chart(ctx, {
        type: 'pie', // Tipe chart.
        data: {
            labels: ['Wins', 'Losses', 'Batal'], // Label untuk setiap bagian pie.
            datasets: [{
                label: 'Hasil Trade',
                data: [summary.wins, summary.losses, summary.batal], // Data untuk chart.
                backgroundColor: ['#4CAF50', '#f44336', '#757575'], // Warna latar belakang.
                borderColor: '#2c2c2c', // Warna border.
                borderWidth: 3 // Lebar border.
            }]
        },
        options: {
            responsive: true, // Membuat chart responsif.
            plugins: {
                legend: { position: 'top', labels: { color: '#e0e0e0' } }, // Konfigurasi legenda.
                title: { display: true, text: 'Distribusi Hasil Trade', color: '#fff', font: { size: 16 } } // Konfigurasi judul.
            }
        }
    });
}

// Fungsi untuk mengisi tabel (baik tabel aktif maupun arsip) dengan data.
export function populateTable(dataArray, targetTableBody, liveTickers) {
    // Mengosongkan isi tabel sebelum diisi data baru.
    targetTableBody.innerHTML = '';
    // Melakukan iterasi untuk setiap entri data.
    dataArray.forEach(entry => {
        // Membuat elemen baris (tr) baru.
        const row = document.createElement('tr');
        // Memformat tanggal menjadi format lokal Indonesia.
        const formattedDate = new Date(entry.timestamp).toLocaleString('id-ID');
        // Mengambil 8 karakter pertama dari ID untuk tampilan yang lebih ringkas.
        const shortId = entry.id ? entry.id.split('-')[0] : 'Lama';
        // Menentukan status order, defaultnya 'Open'.
        const status = entry.status || 'Open';
        // Menambahkan kelas CSS berdasarkan status untuk pewarnaan.
        const statusClass = `status-${status.toLowerCase()}`;
        // Membuat HTML untuk badge status.
        const statusHTML = `<span class="status-badge ${statusClass}">${status}</span>`;
        
        // Memformat harga entry, take profit, dan stop loss dengan format lokal.
        const entryPriceF = parseFloat(entry.entry).toLocaleString('id-ID');
        const tpPriceF = parseFloat(entry.takeProfit).toLocaleString('id-ID');
        const slPriceF = parseFloat(entry.stopLoss).toLocaleString('id-ID');
        // Membuat HTML untuk menampilkan tumpukan harga.
        const priceHTML = `<div class="price-stack"><div class="price-item price-entry">E: ${entryPriceF}</div><div class="price-item price-tp">TP: ${tpPriceF}</div><div class="price-item price-sl">SL: ${slPriceF}</div></div>`;

        // Inisialisasi HTML untuk sel profit.
        let profitCellHTML = 'N/A';
        // Variabel untuk menyimpan persentase profit live.
        let liveProfitPercentage = null;

        // Jika order memiliki final_profit (sudah ditutup).
        if (entry.final_profit !== undefined) {
            const savedProfit = parseFloat(entry.final_profit);
            const colorClass = savedProfit >= 0 ? 'profit' : 'loss';
            profitCellHTML = `<span class="${colorClass}">${savedProfit.toFixed(2)}%</span>`;
        } 
        // Jika status masih 'Open' dan ada data ticker live.
        else if (status === 'Open' && liveTickers) {
            // Mengonversi format pair agar sesuai dengan format API (e.g., BTCIDR -> btc_idr).
            const apiPair = entry.pair.toLowerCase().replace('idr', '_idr');
            const currentTicker = liveTickers[apiPair];
            // Jika data ticker untuk pair tersebut ditemukan.
            if (currentTicker) {
                const entryPrice = parseFloat(entry.entry);
                const livePrice = parseFloat(currentTicker.last);
                // Menghitung persentase profit/loss berdasarkan jenis order (Long/Short).
                let percentage = (entry.duration === 'Long')
                    ? ((livePrice - entryPrice) / entryPrice) * 100
                    : ((entryPrice - livePrice) / entryPrice) * 100;
                liveProfitPercentage = percentage;
                const colorClass = percentage >= 0 ? 'profit' : 'loss';
                profitCellHTML = `<span class="${colorClass}">${percentage.toFixed(2)}%</span>`;
            }
        }

        // Inisialisasi HTML untuk tombol aksi.
        let actionHTML = '';
        // Jika status order masih 'Open', tampilkan tombol 'Selesai' dan 'Batal'.
        if (status === 'Open') {
            actionHTML = `<div class="action-buttons"><button class="action-btn btn-selesai" data-id="${entry.id}" data-status="Selesai" data-profit="${liveProfitPercentage}">Selesai</button><button class="action-btn btn-batal" data-id="${entry.id}" data-status="Batal" data-profit="${liveProfitPercentage}">Batal</button></div>`;
        }
        
        // Mengisi baris dengan semua data yang telah diformat.
        row.innerHTML = `<td>${shortId}</td><td>${formattedDate}</td><td>${entry.pair}</td><td>${entry.duration}</td><td>${statusHTML}</td><td>${priceHTML}</td><td>${entry.timeframe}</td><td>${profitCellHTML}</td><td>${actionHTML}</td>`;
        // Menambahkan baris ke body tabel.
        targetTableBody.appendChild(row);
    });
}

// Fungsi untuk memulai cooldown pada tombol refresh untuk mencegah request berlebihan.
export function startRefreshCooldown(refreshBtn) {
    let secondsLeft = 30; // Durasi cooldown.
    refreshBtn.disabled = true; // Menonaktifkan tombol.
    const countdownInterval = setInterval(() => {
        secondsLeft--;
        refreshBtn.textContent = `Tunggu ${secondsLeft}s`; // Menampilkan waktu hitung mundur.
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval); // Menghentikan interval.
            refreshBtn.disabled = false; // Mengaktifkan kembali tombol.
            refreshBtn.textContent = 'Refresh Harga';
        }
    }, 1000);
}

// Fungsi untuk menampilkan halaman yang dipilih dan menyembunyikan yang lain.
export async function showPage(pageName, elements) {
    // Menyembunyikan semua halaman terlebih dahulu.
    elements.pageViewOrders.classList.add('hidden');
    elements.pageArchiveOrders.classList.add('hidden');
    elements.pageAddOrder.classList.add('hidden');
    elements.pageStatistic.classList.add('hidden');

    // Menghapus kelas 'active' dari semua item navigasi.
    elements.navView.classList.remove('active');
    elements.navArchive.classList.remove('active');
    elements.navAdd.classList.remove('active');
    elements.navStatistic.classList.remove('active');

    // Menampilkan halaman dan mengaktifkan item navigasi yang sesuai.
    if (pageName === 'view') {
        elements.pageViewOrders.classList.remove('hidden');
        elements.navView.classList.add('active');
    } else if (pageName === 'archive') {
        elements.pageArchiveOrders.classList.remove('hidden');
        elements.navArchive.classList.add('active');
    } else if (pageName === 'add') {
        elements.pageAddOrder.classList.remove('hidden');
        elements.navAdd.classList.add('active');
    } else if (pageName === 'statistic') {
        elements.pageStatistic.classList.remove('hidden');
        elements.navStatistic.classList.add('active');

        // Memuat data statistik saat halaman statistik ditampilkan.
        const statisticData = await api.getStatisticsData();
        if (statisticData) {
            displayStatisticData(statisticData); // Menampilkan data jika berhasil dimuat.
        } else {
            // Menampilkan pesan error jika gagal.
            document.querySelector('.statistic-cards-wrapper').innerHTML = 
                '<p>Gagal memuat data statistik.</p>';
        }
    }
}
