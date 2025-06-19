document.addEventListener('DOMContentLoaded', () => {
    // === 1. MENGAMBIL SEMUA ELEMEN HTML YANG DIBUTUHKAN ===
    // Kita "pegang" semua elemen dari HTML agar bisa kita atur pakai JavaScript.
    const journalForm = document.getElementById('journalForm');
    const tableBody = document.getElementById('tableBody');
    const navView = document.getElementById('nav-view');
    const navAdd = document.getElementById('nav-add');
    const pageViewOrders = document.getElementById('page-view-orders');
    const pageAddOrder = document.getElementById('page-add-order');
    const refreshBtn = document.getElementById('refreshBtn');


    // === 2. FUNGSI UNTUK MENGAMBIL DATA HARGA DARI INDODAX ===
    // Fungsi ini tugasnya hanya satu: mengambil semua data harga terbaru dari Indodax.
    async function getAllTickers() {
        const url = 'https://indodax.com/api/tickers';
        try {
            // Minta data ke Indodax
            const response = await fetch(url);
            // Jika ada masalah (misal server Indodax error), hentikan dan beri tahu
            if (!response.ok) {
                throw new Error(`Gagal mengambil data: ${response.statusText}`);
            }
            // Ubah data mentah menjadi format JSON
            const data = await response.json();
            // Kembalikan hanya bagian 'tickers' nya saja
            return data.tickers;
        } catch (error) {
            // Jika ada error (misal: tidak ada internet), tampilkan pesan
            console.error('Error di getAllTickers:', error);
            alert('Gagal mengambil data harga dari Indodax. Cek koneksi internet.');
            return null; // Kembalikan null sebagai tanda gagal
        }
    }


    // === 3. FUNGSI UTAMA: MEMUAT DATA JURNAL DAN MENGHITUNG PROFIT ===
    // Fungsi ini yang paling sibuk. Dia mengambil data jurnalmu dan data harga live,
    // lalu menggabungkannya untuk ditampilkan di tabel.
    async function loadJournalData() {
        // Matikan tombol refresh dan ubah tulisannya agar pengguna tahu sedang loading.
        refreshBtn.textContent = 'Memuat...';
        refreshBtn.disabled = true;

        try {
            // Langkah A: Ambil data jurnal yang sudah kamu simpan
            const journalResponse = await fetch('/api/data');
            const journalData = await journalResponse.json();

            // Langkah B: Ambil data harga terbaru dari Indodax
            const liveTickers = await getAllTickers();

            // Kosongkan isi tabel sebelum diisi data baru
            tableBody.innerHTML = '';
            // Balik urutan data jurnal agar yang terbaru ada di paling atas
            journalData.reverse();

            // Langkah C: Looping setiap data jurnal untuk ditampilkan satu per satu
            journalData.forEach(entry => {
                const row = document.createElement('tr'); // Buat baris baru untuk tabel
                const formattedDate = new Date(entry.timestamp).toLocaleString('id-ID'); // Ubah format tanggal
                
                let profitCellHTML = 'N/A'; // Teks default untuk kolom profit
                
                // Hanya hitung profit jika data dari Indodax berhasil didapat
                if (liveTickers) {
                    // Ubah format pair agar cocok (misal: 'BTCIDR' -> 'btc_idr')
                    const apiPair = entry.pair.toLowerCase().replace('idr', '_idr');
                    const currentTicker = liveTickers[apiPair]; // Cari data untuk pair ini

                    // Jika data ticker untuk pair ini ditemukan...
                    if (currentTicker) {
                        const entryPrice = parseFloat(entry.entry);
                        const livePrice = parseFloat(currentTicker.last);
                        let percentage = 0;

                        // Hitung profit berdasarkan jenis order (Long atau Short)
                        if (entry.duration === 'Long') {
                            percentage = ((livePrice - entryPrice) / entryPrice) * 100;
                        } else { // Short
                            percentage = ((entryPrice - livePrice) / entryPrice) * 100;
                        }
                        
                        // Tentukan warna teks (hijau untuk profit, merah untuk rugi)
                        const colorClass = percentage >= 0 ? 'profit' : 'loss';
                        // Buat HTML untuk sel profit dengan angka dan warnanya
                        profitCellHTML = `<span class="${colorClass}">${percentage.toFixed(2)}%</span>`;
                    }
                }
                
                // Masukkan semua data ke dalam baris tabel yang tadi dibuat
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
                // Tambahkan baris yang sudah jadi ini ke dalam tabel di HTML
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Gagal memuat data jurnal:', error);
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Gagal memuat data.</td></tr>';
        } finally {
            // Apapun hasilnya (sukses atau gagal), kembalikan tombol refresh ke keadaan normal.
            refreshBtn.textContent = 'Refresh Harga';
            refreshBtn.disabled = false;
        }
    }


    // === 4. FUNGSI UNTUK NAVIGASI PINDAH HALAMAN ===
    // Fungsi ini mengatur tampilan, mana yang disembunyikan dan mana yang ditampilkan.
    function showPage(pageName) {
        if (pageName === 'view') {
            // Tampilkan halaman riwayat, sembunyikan halaman form
            pageViewOrders.classList.remove('hidden');
            pageAddOrder.classList.add('hidden');
            // Tandai link "Lihat Riwayat" sebagai aktif
            navView.classList.add('active');
            navAdd.classList.remove('active');
        } else if (pageName === 'add') {
            // Tampilkan halaman form, sembunyikan halaman riwayat
            pageViewOrders.classList.add('hidden');
            pageAddOrder.classList.remove('hidden');
            // Tandai link "Tambah Order" sebagai aktif
            navView.classList.remove('active');
            navAdd.classList.add('active');
        }
    }


    // === 5. MENYAMBUNGKAN FUNGSI KE EVENT (SAAT DIKLIK) ===
    
    // Saat link "Lihat Riwayat" diklik, jalankan fungsi showPage('view')
    navView.addEventListener('click', (e) => { e.preventDefault(); showPage('view'); });

    // Saat link "Tambah Order" diklik, jalankan fungsi showPage('add')
    navAdd.addEventListener('click', (e) => { e.preventDefault(); showPage('add'); });

    // Saat tombol "Refresh Harga" diklik, jalankan fungsi loadJournalData
    refreshBtn.addEventListener('click', loadJournalData);

    // Saat tombol "Catat Order" di form di-submit...
    journalForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Cegah halaman refresh
        const formData = new FormData(journalForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // Kirim data baru ke server untuk disimpan
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                journalForm.reset(); // Kosongkan form
                await loadJournalData(); // Muat ulang data tabel
                showPage('view');      // Pindah kembali ke halaman riwayat
            } else {
                alert('Gagal menyimpan data.');
            }
        } catch (error) {
            console.error('Error saat mengirim data:', error);
        }
    });


    // === 6. JALANKAN PERTAMA KALI ===
    // Saat halaman pertama kali dimuat, langsung jalankan fungsi ini
    // agar tabel tidak kosong.
    loadJournalData();
});
