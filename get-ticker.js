const indodax = require('./indodax-api.js');
const fs = require('fs'); // Modul untuk urusan file

const NAMA_FILE_JSON = 'data/data-ticker.json';

async function cekHargaBTC() {
  console.log("Mencoba mengambil data harga terbaru...");

  const dataBTC = await indodax.getTicker('btc_idr');

  if (dataBTC) {
    const waktuSekarang = new Date();
    const hargaTerakhir = Number(dataBTC.last);
    
    console.log(`----------------------------------------`);
    console.log(`Update pada: ${waktuSekarang.toLocaleString('id-ID')}`);
    console.log(`Harga Terakhir BTC: Rp ${hargaTerakhir.toLocaleString('id-ID')}`);
    
    simpanKeFile(waktuSekarang, hargaTerakhir);
    
    console.log(`----------------------------------------\n`);
  } else {
    console.log("Gagal mengambil data dari Indodax.\n");
  }
}

function simpanKeFile(waktu, harga) {
  let riwayatHarga = [];

  try {
    const dataLama = fs.readFileSync(NAMA_FILE_JSON, 'utf8');
    riwayatHarga = JSON.parse(dataLama);
  } catch (error) {
    // Kalau file belum ada, tidak apa-apa. Anggap saja riwayatnya masih kosong.
    console.log('File riwayat belum ada, akan dibuatkan yang baru.');
  }
  
  // B. Tambahkan data baru ke dalam daftar
  riwayatHarga.push({
    waktu: waktu.toISOString(), // Simpan dalam format standar
    harga: harga
  });

  // C. Ubah daftar (array) menjadi teks JSON yang rapi
  const dataUntukDisimpan = JSON.stringify(riwayatHarga, null, 2);

  // D. Tulis kembali semua data ke file
  fs.writeFileSync(NAMA_FILE_JSON, dataUntukDisimpan);
  console.log(`Data berhasil disimpan ke file ${NAMA_FILE_JSON}`);
}


// --- BAGIAN UTAMA (Tidak berubah) ---

console.log(`Memulai skrip pemantauan harga BTC/IDR.`);
console.log(`Data akan disimpan di file: ${NAMA_FILE_JSON}`);
console.log("Pengecekan akan dilakukan setiap 1 jam.\n");

cekHargaBTC();
setInterval(cekHargaBTC, 1000 * 60 * 10); // 10 menit sekali
