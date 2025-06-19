document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua elemen yang kita butuhkan
    const journalForm = document.getElementById('journalForm');
    const tableBody = document.getElementById('tableBody');
    const navView = document.getElementById('nav-view');
    const navAdd = document.getElementById('nav-add');
    const pageViewOrders = document.getElementById('page-view-orders');
    const pageAddOrder = document.getElementById('page-add-order');

    // --- LOGIKA NAVIGASI ---

    // Saat link "Lihat Riwayat" diklik
    navView.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah link pindah halaman
        showPage('view');
    });

    // Saat link "Tambah Order" diklik
    navAdd.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah link pindah halaman
        showPage('add');
    });

    // Fungsi untuk menampilkan halaman yang dipilih
    function showPage(pageName) {
        if (pageName === 'view') {
            // Tampilkan halaman riwayat
            pageViewOrders.classList.remove('hidden');
            pageAddOrder.classList.add('hidden');
            // Atur link aktif
            navView.classList.add('active');
            navAdd.classList.remove('active');
        } else if (pageName === 'add') {
            // Tampilkan halaman tambah order
            pageViewOrders.classList.add('hidden');
            pageAddOrder.classList.remove('hidden');
            // Atur link aktif
            navView.classList.remove('active');
            navAdd.classList.add('active');
        }
    }

    // --- LOGIKA DATA (Sama seperti sebelumnya dengan sedikit modifikasi) ---

    async function loadJournalData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            tableBody.innerHTML = '';
            data.reverse();
            data.forEach(entry => {
                const row = document.createElement('tr');
                const formattedDate = new Date(entry.timestamp).toLocaleString('id-ID');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${entry.pair}</td>
                    <td>${entry.duration}</td>
                    <td>${entry.entry}</td>
                    <td>${entry.takeProfit}</td>
                    <td>${entry.stopLoss}</td>
                    <td>${entry.timeframe}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Gagal memuat data:', error);
        }
    }

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
                await loadJournalData(); // Muat ulang data tabel
                showPage('view');      // **PENTING: Pindah ke halaman riwayat setelah berhasil**
            } else {
                alert('Gagal menyimpan data.');
            }
        } catch (error) {
            console.error('Error saat mengirim data:', error);
        }
    });

    // Muat data tabel saat pertama kali halaman dibuka
    loadJournalData();
});
