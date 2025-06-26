// Fungsi async untuk mengambil semua data ticker dari API Indodax.
export async function getAllTickers() {
    // URL endpoint API tickers Indodax.
    const url = 'https://indodax.com/api/tickers';
    try {
        // Melakukan request GET ke URL API menggunakan fetch.
        const response = await fetch(url);
        // Jika respons tidak OK (misal: status bukan 2xx), lemparkan error.
        if (!response.ok) throw new Error(`Gagal mengambil data: ${response.statusText}`);
        // Parse respons JSON menjadi objek JavaScript.
        const data = await response.json();
        // Mengembalikan objek tickers dari data yang diterima.
        return data.tickers;
    } catch (error) {
        // Menangkap dan menampilkan error di konsol jika terjadi masalah.
        console.error('Error di getAllTickers:', error);
        // Memberi tahu pengguna melalui alert bahwa pengambilan data gagal.
        alert('Gagal mengambil data harga dari Indodax.');
        // Mengembalikan null jika terjadi error.
        return null;
    }
}

// Fungsi async untuk memperbarui status order di server.
export async function updateOrderStatus(id, status, final_profit) {
    try {
        // Melakukan request POST ke endpoint '/api/update-status' di server lokal.
        const response = await fetch('/api/update-status', {
            method: 'POST', // Menggunakan metode POST.
            headers: { 'Content-Type': 'application/json' }, // Menentukan tipe konten sebagai JSON.
            body: JSON.stringify({ id, status, final_profit }) // Mengirim data ID, status, dan profit dalam format JSON.
        });
        // Jika respons dari server tidak OK, tampilkan alert.
        if (!response.ok) {
            alert('Gagal memperbarui status order.');
            return false; // Mengembalikan false menandakan kegagalan.
        }
        return true; // Mengembalikan true menandakan keberhasilan.
    } catch (error) {
        // Menangkap dan menampilkan error di konsol.
        console.error('Error saat update status:', error);
        // Mengembalikan false jika terjadi error.
        return false;
    }
}

// Fungsi async untuk mendapatkan data statistik dari server.
export async function getStatisticsData() {
    try {
        // Melakukan request GET ke endpoint '/api/statistics'.
        const response = await fetch('/api/statistics');
        // Jika respons tidak OK, lemparkan error.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse dan kembalikan data JSON dari respons.
        return await response.json();
    } catch (error) {
        // Menangkap dan menampilkan error di konsol.
        console.error("Gagal mengambil data statistik:", error);
        // Mengembalikan null jika terjadi error.
        return null;
    }
}

// Fungsi async untuk mengambil setup plans dari server
export async function getSetupPlans() {
    try {
        const response = await fetch('/api/setup-plans');
        if (!response.ok) {
            throw new Error('Gagal mengambil data setup plans');
        }
        return await response.json();
    } catch (error) {
        console.error('Error di getSetupPlans:', error);
        alert('Gagal memuat data checklist setup.');
        return [];
    }
}

// Fungsi async untuk menyimpan setup plans ke server
export async function saveSetupPlans(plans) {
    try {
        const response = await fetch('/api/setup-plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plans)
        });
        if (!response.ok) {
            throw new Error('Gagal menyimpan data setup plans');
        }
        return true;
    } catch (error) {
        console.error('Error di saveSetupPlans:', error);
        alert('Gagal menyimpan checklist setup.');
        return false;
    }
}
