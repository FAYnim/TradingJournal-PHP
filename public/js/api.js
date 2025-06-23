// js/api.js

export async function getAllTickers() {
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

export async function updateOrderStatus(id, status, final_profit) {
    try {
        const response = await fetch('/api/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, final_profit })
        });
        if (!response.ok) {
            alert('Gagal memperbarui status order.');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error saat update status:', error);
        return false;
    }
}

// ===== TAMBAHKAN FUNGSI BARU UNTUK MENGAMBIL DATA PORTOFOLIO =====
export async function getPortfolioData() {
    try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Gagal mengambil data portofolio:", error);
        // Memberitahu UI bahwa pengambilan data gagal
        return null;
    }
}
