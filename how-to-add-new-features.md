# Cara Menambahkan Fitur Baru

Dokumen ini menjelaskan langkah-langkah sederhana untuk menambahkan bagian atau fitur baru ke aplikasi Jurnal Trading ini.

## Alur Kerja Umum
Sebagian besar fitur di aplikasi ini bekerja dengan cara berikut:
1.  **Sidebar**: Pengguna mengklik link navigasi di sidebar.
2.  **JavaScript**: Memicu fungsi JavaScript untuk menampilkan "halaman" yang sesuai (sebenarnya hanya `div` yang ditampilkan/disembunyikan).
3.  **API Call (jika perlu)**: JavaScript memanggil `dashboard.php` dengan `action` tertentu (misal: `?action=view-orders`).
4.  **Backend PHP**: `dashboard.php` menerima `action`, memprosesnya (seringkali dengan meng-`include` file dari folder `includes/`), mengambil data dari file JSON di folder `data/`, lalu mengirimkannya kembali sebagai respons.
5.  **Tampilan**: JavaScript menerima data dan menampilkannya di halaman.

---

## Langkah 1: Rencanakan Fitur Anda

Sebelum coding, pikirkan:
*   **Tujuan Fitur**: Apa yang akan dilakukan? (Contoh: "Menampilkan daftar aset favorit atau Watchlist").
*   **Data yang Dibutuhkan**: Data apa yang terlibat? (Contoh: "Nama aset, simbol, catatan").
*   **Interaksi Pengguna**: Bagaimana pengguna menggunakannya? (Contoh: "Klik tombol di sidebar, lihat tabel, ada tombol tambah/hapus").

---

## Langkah 2: Buat Tampilan Awal (HTML)

Kerjakan bagian yang terlihat oleh pengguna terlebih dahulu.

### a. Tambah Link Navigasi di Sidebar
Buka `includes/sidebar.php` dan tambahkan link baru di dalam daftar navigasi.

```html
<!-- ... link navigasi lainnya ... -->
<li>
    <a href="#" class="nav-link" id="nav-watchlist" data-page="watchlist">
        <i class="fas fa-star"></i> Watchlist
    </a>
</li>
```
*   `id`: Beri ID unik, contoh `nav-watchlist`.
*   `data-page`: Nama unik untuk halaman konten Anda, contoh `watchlist`.

### b. Siapkan Konten Halaman di Dashboard
Buka `dashboard.php` dan di dalam `<main id="main-content">`, tambahkan `div` baru untuk halaman fitur Anda.

```html
<!-- ... div halaman lainnya ... -->

<div id="page-watchlist" class="page-content hidden">
    <h2>Watchlist</h2>
    <p>Daftar aset yang dipantau.</p>
    <!-- Nanti konten dinamis akan diisi di sini oleh JavaScript -->
    <div id="watchlist-container"></div>
</div>
```
*   `id`: Harus cocok dengan `data-page` dari sidebar, dengan prefix `page-`. Contoh: `page-watchlist`.
*   Pastikan `div` ini memiliki class `page-content` dan `hidden`.

---

## Langkah 3: Atur Logika Backend (PHP & Data)

Siapkan bagian yang mengurus data di server.

### a. Lapisan Data (JSON)
Proyek ini menggunakan file JSON di folder `data/` sebagai database.
1.  Jika fitur Anda butuh penyimpanan data baru, buat file JSON baru, misalnya `data/watchlist.json`.
2.  Isi dengan struktur data awal, contoh: `[]` (sebuah array kosong).
3.  Gunakan fungsi yang ada di `utils/operation.php` (seperti `get_data` dan `save_data`) untuk membaca dan menulis ke file ini.

### b. Buat File Logika Fitur
Di dalam folder `includes/`, buat file PHP baru untuk logika fitur Anda. Contoh: `includes/watchlist.php`.

File ini akan di-`include` oleh `dashboard.php` dan bertugas membaca atau memanipulasi data.

**Contoh isi `includes/watchlist.php`:**
```php
<?php
// Pastikan file ini tidak diakses langsung
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    http_response_code(403);
    die('Akses Ditolak');
}

// Include helper untuk operasi file
require_once '../utils/operation.php';

// Ambil data dari file JSON
$watchlist_data = get_data('../data/watchlist.json');

// Kirim data sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($watchlist_data);
```

### c. Daftarkan "Action" di `dashboard.php`
Buka `dashboard.php` dan cari bagian `switch ($_GET['action'])`. Tambahkan `case` baru untuk memanggil file logika yang baru Anda buat.

```php
// ... kode lainnya ...

switch ($_GET['action'] ?? '') {
    // ... case yang sudah ada ...

    case 'view-watchlist':
        include 'includes/watchlist.php';
        break;

    // Tambahkan case lain jika ada aksi simpan/update/delete
    // case 'add-to-watchlist':
    //     include 'includes/add-to-watchlist.php';
    //     break;

    default:
        // Opsional: tindakan default jika tidak ada action
        break;
}
```

---

## Langkah 4: Hubungkan Semuanya dengan JavaScript

Ini adalah bagian "lem" yang membuat semuanya interaktif. Buka `public/js/script.js`.

### a. Tambahkan Fungsi API
Di dalam objek `api`, tambahkan fungsi untuk memanggil `action` backend yang baru.

```javascript
// ... di dalam var api = { ... };
api: {
    // ... fungsi API lainnya ...
    getWatchlist: function() {
        return this._ajax('view-watchlist', 'GET');
    },
    // addWatchlistItem: function(data) {
    //     return this._ajax('add-to-watchlist', 'POST', data);
    // }
},
```

### b. Buat Fungsi untuk Menampilkan Data (UI)
Di dalam objek `ui`, buat fungsi untuk memuat dan menampilkan data fitur baru Anda.

```javascript
// ... di dalam var ui = { ... };
ui: {
    // ... fungsi UI lainnya ...
    loadWatchlist: function() {
        // Tampilkan loading spinner jika ada
        const container = $('#watchlist-container');
        container.html('Memuat data...');

        api.getWatchlist().done(function(data) {
            if (!data || data.length === 0) {
                container.html('<p>Belum ada aset di watchlist.</p>');
                return;
            }

            // Buat tabel atau list dari data
            let table = '<table class="table table-bordered"><thead><tr><th>Simbol</th><th>Catatan</th></tr></thead><tbody>';
            data.forEach(item => {
                table += `<tr><td>${item.symbol}</td><td>${item.note}</td></tr>`;
            });
            table += '</tbody></table>';
            container.html(table);

        }).fail(function() {
            container.html('<p class="text-danger">Gagal memuat data watchlist.</p>');
        });
    }
},
```

### c. Panggil Fungsi UI Saat Halaman Dibuka
Di dalam fungsi `ui.showPage`, tambahkan kondisi untuk memanggil fungsi `load` Anda.

```javascript
// ... di dalam ui.showPage ...
showPage: function(pageId) {
    // ... kode untuk menyembunyikan/menampilkan halaman ...

    // Tambahkan kondisi ini
    if (pageId === 'watchlist') {
        this.loadWatchlist();
    }
    // ... kondisi lainnya ...
},
```

### d. Tambahkan Event Handler (jika perlu)
Jika fitur Anda punya tombol atau form, tambahkan event handler di bagian `// --- Event Handlers ---`.

```javascript
// Contoh: event handler untuk klik link sidebar
$(document).on('click', '.nav-link', function(e) {
    e.preventDefault();
    const pageId = $(this).data('page');
    if (pageId) {
        ui.showPage(pageId);
    }
});
```

---

## Langkah 5: Styling (CSS)

Jika perlu, tambahkan style untuk elemen-elemen baru Anda di `public/css/style.css` agar tampilannya rapi.

```css
/* Contoh styling untuk fitur watchlist */
#page-watchlist .table {
    margin-top: 20px;
}
```

---

## Langkah 6: Uji Coba
Buka aplikasi di browser, klik link fitur baru Anda, dan pastikan semuanya berjalan sesuai harapan. Periksa juga _Console_ di _Developer Tools_ browser untuk melihat apakah ada error.