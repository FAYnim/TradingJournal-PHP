const indodax = require('./indodax-api.js');
const fs = require('fs');

async function cekHargaBTC() {
  console.log("Mencoba mengambil data harga terbaru...");
  const dataBTC = await indodax.getTicker('btc_idr');

  if (dataBTC) {
    const waktuSekarang = new Date().toLocaleString('id-ID');
    const hargaTerakhir = Number(dataBTC.last).toLocaleString('id-ID');
    
    console.log(`----------------------------------------`);
    console.log(`Update pada: ${waktuSekarang}`);
    console.log(`Harga Terakhir BTC: Rp ${hargaTerakhir}`);
    console.log(`----------------------------------------`);

    simpanKeJSON(dataBTC);

  } else {
    console.log("Gagal mengambil data dari Indodax.\n");
  }
}

function simpanKeJSON(dataBaru) {
  const namaFile = './riwayat_harga.json';
  let riwayat = [];

  try {
    const fileLama = fs.readFileSync(namaFile, 'utf8');
    riwayat = JSON.parse(fileLama);
  } catch (error) {
    console.log("File riwayat tidak ditemukan, akan dibuat baru.");
  }

  const catatanBaru = {
    waktu: new Date().toISOString(),
    ticker: dataBaru
  };

  riwayat.push(catatanBaru);

  const dataUntukDitulis = JSON.stringify(riwayat, null, 2);

  fs.writeFileSync(namaFile, dataUntukDitulis);
  console.log(`Data berhasil disimpan ke file ${namaFile}\n`);
}


console.log("Memulai skrip pemantauan harga BTC/IDR.");
console.log("Pengecekan akan dilakukan setiap 1 jam dan disimpan ke file.\n");

cekHargaBTC();
setInterval(cekHargaBTC, 1000 * 60 * 60);
