# Panduan Penggunaan dan Pengembangan Jurnal Trading PHP

Dokumen ini menjelaskan alur kerja aplikasi Jurnal Trading dan panduan untuk menambahkan fitur baru.

## 1. Alur Kerja (Workflow) Proyek

Aplikasi Jurnal Trading dirancang untuk membantu Anda mencatat dan menganalisis performa trading. Berikut adalah alur kerja dasar aplikasi ini:

### 1.1. Halaman Awal (index.php)

*   Ketika pengguna pertama kali mengakses aplikasi, mereka akan diarahkan ke `index.php`.
*   Ini adalah halaman selamat datang yang menampilkan informasi singkat tentang aplikasi.
*   Terdapat tombol "Mulai Sekarang" yang akan mengarahkan pengguna ke `dashboard.php`.

### 1.2. Autentikasi (login.php & register.php)

*   Jika pengguna belum login dan mencoba mengakses `dashboard.php`, sistem akan secara otomatis mengarahkan mereka ke `login.php`.
*   **Login (login.php)**: Pengguna memasukkan username dan password. Jika kredensial valid, sesi pengguna akan dimulai dan mereka akan diarahkan ke `dashboard.php`.
*   **Register (register.php)**: Pengguna dapat membuat akun baru dengan mengisi username, email, dan password. Setelah pendaftaran berhasil, pengguna akan diminta untuk login.

### 1.3. Dashboard Utama (dashboard.php)

*   Ini adalah halaman inti aplikasi setelah pengguna berhasil login.
*   **Struktur Halaman**:
    *   **Header (`includes/header.php`)**: Berisi judul aplikasi ("Jurnal Trading") dan tombol untuk membuka/menutup sidebar (menu navigasi).
    *   **Sidebar (`includes/sidebar.php`)**: Berfungsi sebagai menu navigasi utama. Setiap item di sidebar (misalnya, "Riwayat Aktif", "Tambah Order", "Statistik") akan menampilkan bagian konten yang berbeda di area utama dashboard.
    *   **Konten Utama (`<main id="main-content">`)**: Area ini adalah tempat semua informasi dan fungsionalitas aplikasi ditampilkan. Konten dimuat dari berbagai file PHP yang di-include:
        *   **Riwayat Aktif (`includes/view_orders.php`)**: Menampilkan daftar order trading yang sedang berjalan atau aktif.
        *   **Arsip (`includes/archive_orders.php`)**: Menampilkan daftar order trading yang sudah selesai atau diarsipkan.
        *   **Tambah Order (`includes/add_order.php`)**: Form untuk mencatat detail order trading baru (pair, harga entry, take profit, stop loss, timeframe, jenis order).
        *   **Statistik (`includes/statistics.php`)**: Menampilkan ringkasan statistik performa trading pengguna (misalnya, win rate, total profit).
        *   **Setup (`includes/setup.php`)**: Bagian untuk mengelola setup plan atau konfigurasi lainnya.
*   **Interaksi Data (AJAX)**: `dashboard.php` juga bertindak sebagai *backend endpoint* untuk permintaan AJAX dari frontend (JavaScript). Ini memungkinkan aplikasi untuk mengambil data (misalnya, daftar order, statistik, harga real-time dari Indodax) atau melakukan aksi (menambah order, memperbarui status order, menyimpan setup plan) tanpa perlu me-reload seluruh halaman.
*   **Logout (logout.php)**: Terdapat tombol "Logout" di bagian bawah sidebar yang akan mengakhiri sesi pengguna dan mengarahkan kembali ke halaman login.

## 2. Cara Menambahkan Fitur Baru (Sidebar & Section Baru)

Menambahkan fitur baru yang memiliki bagiannya sendiri di sidebar adalah proses yang terstruktur. Ikuti langkah-langkah berikut:

### Langkah 1: Buat File Konten untuk Fitur Baru

1.  Buat file PHP baru di dalam direktori `includes/`. Beri nama yang deskriptif, misalnya `includes/nama_fitur_baru.php`.
2.  Di dalam file `nama_fitur_baru.php` ini, tulis kode HTML dan PHP yang akan menjadi tampilan dan logika untuk fitur baru Anda.
3.  **Penting**: Pastikan elemen `div` utama untuk konten fitur Anda memiliki `id` yang unik dan kelas `page-content hidden`. Contoh:
    ```html
    <div id="page-nama-fitur-baru" class="page-content hidden">
        <h2>Ini adalah Fitur Baru Saya!</h2>
        <p>Di sini Anda bisa menambahkan konten dan fungsionalitas untuk fitur baru Anda.</p>
        <!-- Tambahkan form, tabel, atau elemen lain di sini -->
    </div>
    ```
    *   `id="page-nama-fitur-baru"`: ID ini akan digunakan oleh JavaScript untuk menampilkan/menyembunyikan bagian ini.
    *   `class="page-content hidden"`: Kelas `page-content` menandakan ini adalah bagian konten utama, dan `hidden` memastikan bagian ini tersembunyi secara default.

### Langkah 2: Sertakan File Konten Baru di Dashboard

1.  Buka file `dashboard.php`.
2.  Cari bagian `<main id="main-content" class="main-content">`.
3.  Di dalam tag `<main>`, tambahkan baris `include` untuk file fitur baru Anda, sejajar dengan `include` lainnya.
    ```php
    <main id="main-content" class="main-content">
        <?php include 'includes/add_order.php'; ?>
        <?php include 'includes/view_orders.php'; ?>
        <?php include 'includes/archive_orders.php'; ?>
        <?php include 'includes/statistics.php'; ?>
        <?php include 'includes/setup.php'; ?>
        <?php include 'includes/nama_fitur_baru.php'; // Tambahkan baris ini ?>
    </main>
    ```

### Langkah 3: Tambahkan Item Navigasi di Sidebar

1.  Buka file `includes/sidebar.php`.
2.  Di dalam tag `<nav id="main-nav">`, tambahkan elemen `<a>` baru untuk fitur Anda.
3.  **Penting**:
    *   Atribut `data-page` harus sama dengan bagian `id` dari `div` konten Anda, tetapi tanpa awalan `page-`. Jadi, jika ID div Anda adalah `page-nama-fitur-baru`, `data-page` harus `nama-fitur-baru`.
    *   Gunakan ikon Font Awesome yang relevan dengan fitur Anda (ganti `fas fa-lightbulb`). Anda bisa mencari ikon di [Font Awesome](https://fontawesome.com/icons).
    ```html
    <nav id="main-nav">
        <a href="#" id="nav-view" data-page="view-orders" class="active"><i class="fas fa-history"></i> Riwayat Aktif</a>
        <!-- ... item sidebar lainnya ... -->
        <a href="#" id="nav-nama-fitur-baru" data-page="nama-fitur-baru"><i class="fas fa-lightbulb"></i> Nama Fitur Baru</a>
    </nav>
    ```

### Langkah 4: Perbarui JavaScript (public/js/script.js) - (Biasanya Tidak Perlu Jika Logika Sudah Generik)

*   Buka file `public/js/script.js`.
*   Proyek ini kemungkinan besar sudah memiliki logika JavaScript generik yang menangani tampilan/penyembunyian halaman berdasarkan atribut `data-page` pada link sidebar.
*   Cari fungsi atau event listener yang bertanggung jawab untuk ini. Biasanya, ada kode yang:
    1.  Menyembunyikan semua elemen dengan kelas `page-content`.
    2.  Menampilkan elemen dengan `id` yang sesuai dengan `data-page` yang diklik.
    3.  Mengatur kelas `active` pada link sidebar yang sedang aktif.
*   **Jika logika sudah generik (seperti contoh di bawah), Anda TIDAK perlu melakukan perubahan pada `script.js`**. Sistem akan otomatis mengenali fitur baru Anda.
    ```javascript
    // Contoh logika generik di public/js/script.js
    $(document).ready(function() {
        // Fungsi untuk menampilkan halaman yang dipilih
        function showPage(pageId) {
            $('.page-content').addClass('hidden'); // Sembunyikan semua halaman
            $('#page-' + pageId).removeClass('hidden'); // Tampilkan halaman yang dipilih
            $('#main-nav a').removeClass('active'); // Hapus kelas active dari semua link
            $('#nav-' + pageId).addClass('active'); // Tambahkan kelas active ke link yang dipilih
        }

        // Event listener untuk klik navigasi sidebar
        $('#main-nav a').on('click', function(e) {
            e.preventDefault();
            var page = $(this).data('page');
            showPage(page);
            // Tutup sidebar di mobile jika terbuka
            if ($('body').hasClass('sidebar-open')) {
                $('body').removeClass('sidebar-open');
            }
        });

        // Tampilkan halaman default saat pertama kali load (misal: view-orders)
        showPage('view-orders'); // Pastikan ini menampilkan halaman default yang Anda inginkan
    });
    ```
*   Jika `script.js` memiliki logika spesifik untuk setiap halaman (misalnya, `if (page === 'add-order') { ... }`), maka Anda perlu menambahkan blok `else if` baru untuk `nama-fitur-baru` Anda.

### Langkah 5: Tambahkan Logika Backend (Opsional, Jika Diperlukan)

*   Jika fitur baru Anda memerlukan interaksi dengan database (misalnya, menyimpan data baru, mengambil data spesifik), Anda perlu:
    1.  **Perbarui `dashboard.php`**: Tambahkan blok `else if` baru di bagian router permintaan AJAX (`if (isset($_GET['action'])) { ... }`) untuk menangani `action` baru yang akan Anda kirim dari frontend.
        ```php
        } else if ($action === 'getNamaFiturBaruData') {
            // Panggil fungsi dari db_operations.php atau lakukan query langsung
            echo json_encode(['message' => 'Data fitur baru berhasil diambil']);
        }
        ```
    2.  **Perbarui `utils/db_operations.php`**: Buat fungsi-fungsi PHP baru di `utils/db_operations.php` untuk menangani operasi database yang terkait dengan fitur baru Anda (misalnya, `getNamaFiturBaruData($db, $user_id)`, `saveNamaFiturBaru($db, $data, $user_id)`).

Dengan mengikuti langkah-langkah ini, Anda dapat dengan mudah menambahkan fitur baru ke aplikasi Jurnal Trading ini.
