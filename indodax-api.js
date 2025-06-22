/**
 * Mengambil data ticker (harga terakhir, tertinggi, terendah, dll.) untuk satu pair.
 * @param {string} pair - Nama pair, contoh: 'btc_idr', 'eth_idr'. Defaultnya 'btc_idr'.
 * @returns {Promise<object>} Objek yang berisi data ticker.
 */
async function getTicker(pair = 'btc_idr') {
  const url = `https://indodax.com/api/${pair}/ticker`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.ticker; // Kita kembalikan isi 'ticker'-nya langsung
  } catch (error) {
    console.error(`Error di getTicker untuk pair ${pair}:`, error);
    return null; // Kembalikan null jika gagal
  }
}

/**
 * Mengambil data ticker untuk SEMUA pair yang ada di Indodax.
 * @returns {Promise<object>} Objek yang berisi data semua ticker.
 */
async function getAllTickers() {
  const url = 'https://indodax.com/api/tickers';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.tickers; // Kita kembalikan isi 'tickers'-nya langsung
  } catch (error) {
    console.error('Error di getAllTickers:', error);
    return null;
  }
}

/**
 * Mengambil riwayat transaksi (trades) terbaru untuk satu pair.
 * @param {string} pair - Nama pair, contoh: 'btc_idr'. Defaultnya 'btc_idr'.
 * @returns {Promise<Array>} Array (daftar) objek transaksi.
 */
async function getTrades(pair = 'btc_idr') {
  const url = `https://indodax.com/api/${pair}/trades`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // Datanya sudah berupa array
  } catch (error) {
    console.error(`Error di getTrades untuk pair ${pair}:`, error);
    return null;
  }
}

/**
 * Mengambil data order book (depth) untuk satu pair.
 * @param {string} pair - Nama pair, contoh: 'btc_idr'. Defaultnya 'btc_idr'.
 * @returns {Promise<object>} Objek yang berisi daftar 'buy' (penawaran beli) dan 'sell' (penawaran jual).
 */
async function getDepth(pair = 'btc_idr') {
  const url = `https://indodax.com/api/${pair}/depth`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error di getDepth untuk pair ${pair}:`, error);
    return null;
  }
}


// --- CONTOH PENGGUNAAN ---
// Kamu bisa hapus bagian ini jika hanya ingin menyimpan fungsinya saja.

/*(async () => {
  console.log("--- Menjalankan Contoh ---");
  
  // 1. Contoh memanggil ticker BTC/IDR
  const btcTicker = await getTicker('btc_idr');
  if (btcTicker) {
    console.log("Harga BTC terakhir:", btcTicker.last);
  }

  // 2. Contoh memanggil riwayat transaksi ETH/IDR
  const ethTrades = await getTrades('eth_idr');
  if (ethTrades) {
    console.log("Transaksi ETH terakhir:", ethTrades[0]); // Ambil transaksi paling baru
  }

  // 3. Contoh memanggil semua ticker
  const allTickers = await getAllTickers();
  if (allTickers) {
    console.log("Data ticker untuk DOGE/IDR:", allTickers.doge_idr);
  }
})();*/

// Tambahkan ini di bagian paling bawah file indodax-api.js

module.exports = {
  getTicker,
  getAllTickers,
  getTrades,
  getDepth
};
