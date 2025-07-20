# Cara Menambahkan Fitur Baru

Dokumen ini menjelaskan langkah-langkah sederhana untuk menambahkan bagian atau fitur baru ke aplikasi Jurnal Trading ini.

## 1. Rencanakan Fitur Anda

Sebelum mulai coding, pikirkan:
*   **Apa yang akan dilakukan fitur ini?** (Contoh: "Menampilkan daftar aset yang bisa ditradingkan")
*   **Data apa yang dibutuhkan?** (Contoh: "Nama aset, harga terakhir")
*   **Bagaimana pengguna akan berinteraksi dengannya?** (Contoh: "Ada tombol di sidebar, lalu menampilkan tabel")

## 2. Bagian Backend (PHP)

Ini adalah bagian yang mengurus data dan logika di server.

### a. `dashboard.php` (untuk API baru)

Jika fitur Anda butuh data dari server atau menyimpan data, Anda perlu menambahkan "action" baru di `dashboard.php`.

Cari bagian `switch ($_GET['action'])` dan tambahkan `case` baru:

```php
// ... kode lainnya ...

switch ($_GET['action']) {
    // ... case yang sudah ada ...

    case 'getNewFeatureData': // Nama action baru Anda
        // Panggil fungsi atau logika untuk fitur baru Anda
        // Contoh: $data = getNewFeatureDataFunction();
        // echo json_encode($data);
        break;

    // ... tambahkan case lain jika ada aksi POST/PUT/DELETE ...
}
```

### b. File Logika Baru (opsional, di `includes/`)

Jika logika fitur Anda cukup kompleks, buat file PHP baru di folder `includes/` (misal: `includes/new-feature-logic.php`). Lalu, panggil fungsi dari file ini di `dashboard.php`.

### c. Database (jika perlu)

Jika fitur baru Anda membutuhkan penyimpanan data permanen yang belum ada, Anda mungkin perlu:
*   Menambahkan tabel baru di database (jika menggunakan SQL). Anda bisa membuat file `.sql` baru di `data/` atau menambahkan perintah SQL ke `data/import.sql` jika itu adalah bagian dari setup awal.
*   Menambahkan kolom baru ke tabel yang sudah ada.

## 3. Bagian Frontend (HTML, JavaScript, CSS)

Ini adalah bagian yang dilihat dan diinteraksi oleh pengguna.

### a. HTML (`dashboard.php`)

1.  **Link Navigasi di Sidebar:**
    Buka `includes/sidebar.php`. Tambahkan link baru di dalam `<nav id="main-nav">`:

    ```html
    <!-- ... link navigasi lainnya ... -->
    <li><a href="#" data-page="new-feature-page-id"><i class="fas fa-lightbulb"></i> Fitur Baru</a></li>
    ```
    Ganti `new-feature-page-id` dengan ID unik untuk halaman Anda.

2.  **Konten Halaman:**
    Buka `dashboard.php`. Di dalam `<main id="main-content">`, tambahkan `div` baru untuk halaman fitur Anda:

    ```html
    <!-- ... halaman lainnya ... -->

    <div id="page-new-feature-page-id" class="page-content hidden">
        <h2>Judul Fitur Baru Anda</h2>
        <!-- Isi konten fitur Anda di sini (tabel, form, dll.) -->
        <p>Ini adalah halaman untuk fitur baru.</p>
    </div>
    ```
    Pastikan `id` cocok dengan `data-page` yang Anda buat di sidebar.

### b. JavaScript (`public/js/script.js`)

Ini adalah otak interaksi di sisi browser.

1.  **Perbarui `ui.showPage`:**
    Di dalam objek `ui`, tambahkan kondisi untuk memuat data atau inisialisasi fitur baru Anda saat halaman ditampilkan:

    ```javascript
    // ... kode lainnya ...

    showPage: function(pageId) {
        elements.$pages.addClass('hidden');
        $(`#page-${pageId}`).removeClass('hidden');
        elements.$navLinks.removeClass('active');
        $(`#nav-${pageId}`).addClass('active');

        if (pageId === 'statistic') this.loadStatistics();
        if (pageId === 'setup') this.loadSetupPlans();
        if (pageId === 'new-feature-page-id') this.loadNewFeatureData(); // Tambahkan ini
    },
    ```

2.  **Tambahkan Fungsi API Baru:**
    Di dalam objek `api`, tambahkan fungsi untuk memanggil `action` backend yang baru Anda buat:

    ```javascript
    // ... kode lainnya ...

    api: {
        // ... fungsi API lainnya ...
        getNewFeatureData: function() { return this._ajax('getNewFeatureData', 'GET'); },
        // Tambahkan fungsi lain jika ada aksi POST/PUT/DELETE
    },
    ```

3.  **Buat Fungsi UI Baru:**
    Di dalam objek `ui`, buat fungsi untuk memuat dan menampilkan data fitur baru Anda:

    ```javascript
    // ... kode lainnya ...

    ui: {
        // ... fungsi UI lainnya ...
        loadNewFeatureData: function() {
            api.getNewFeatureData().done(data => {
                // Logika untuk menampilkan data di halaman Anda
                console.log('Data fitur baru:', data);
                // Contoh: $('#new-feature-container').html(data.someProperty);
            }).fail(() => {
                console.error('Gagal memuat data fitur baru.');
            });
        }
    },
    ```

4.  **Tambahkan Event Handler (jika perlu):**
    Jika fitur Anda memiliki tombol, formulir, atau interaksi lain, tambahkan event handler di bagian `// --- Event Handlers ---` atau di dalam `$(document).ready(function() { ... });`.

    ```javascript
    // Contoh: Tombol di halaman fitur baru
    $('#page-new-feature-page-id').on('click', '#myNewFeatureButton', function() {
        alert('Tombol fitur baru diklik!');
        // Panggil fungsi API atau UI yang relevan
    });
    ```

### c. CSS (`public/css/style.css`)

Tambahkan gaya (styling) untuk elemen-elemen HTML baru Anda di file `public/css/style.css` agar tampilannya rapi.

```css
/* Contoh styling untuk fitur baru */
#page-new-feature-page-id {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.new-feature-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

/* ... gaya lainnya ... */
```

## 4. Pengujian

Setelah semua kode ditambahkan, buka aplikasi di browser Anda dan uji fitur baru secara menyeluruh. Pastikan semua interaksi berfungsi seperti yang diharapkan dan tidak ada error di konsol browser atau log server.
