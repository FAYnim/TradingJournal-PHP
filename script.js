document.addEventListener('DOMContentLoaded', () => {
    const journalForm = document.getElementById('journalForm');
    const tableBody = document.getElementById('tableBody');

    // Fungsi untuk memuat data dari server dan menampilkannya di tabel
    async function loadJournalData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();

            // Kosongkan isi tabel dulu
            tableBody.innerHTML = '';

            // Tampilkan data terbaru di paling atas
            data.reverse();

            // Looping setiap data dan buat baris tabel baru
            data.forEach(entry => {
                const row = document.createElement('tr');
                
                // Format tanggal agar lebih mudah dibaca
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

    // Fungsi untuk menangani saat form di-submit
    journalForm.addEventListener('submit', async (e) => {
        // Mencegah halaman refresh saat tombol submit diklik
        e.preventDefault();

        // Mengambil semua data dari form
        const formData = new FormData(journalForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // Kirim data ke server
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Jika berhasil, reset form dan muat ulang data tabel
                journalForm.reset();
                loadJournalData();
            } else {
                alert('Gagal menyimpan data.');
            }
        } catch (error) {
            console.error('Error saat mengirim data:', error);
        }
    });

    // Panggil fungsi untuk memuat data saat halaman pertama kali dibuka
    loadJournalData();
});
