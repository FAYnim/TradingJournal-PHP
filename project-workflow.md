# Alur Kerja File `dashboard.php`

File `dashboard.php` adalah halaman utama yang dilihat pengguna setelah berhasil login. Alur kerjanya dapat dibagi menjadi dua skenario utama: menampilkan halaman web dan menangani permintaan data di latar belakang (AJAX).

## Alur Umum

1.  **Memulai Sesi**: Setiap kali halaman diakses, `session_start()` dijalankan untuk mengaktifkan sesi PHP, yang memungkinkan situs mengingat informasi pengguna (seperti ID pengguna yang sudah login).

2.  **Pengecekan Login**:
    *   Sistem memeriksa apakah `$_SESSION['user_id']` tersimpan dalam sesi. Ini adalah penanda bahwa pengguna sudah login.
    *   **Jika tidak ada (belum login)**:
        *   Jika permintaan datang dari JavaScript (AJAX), sistem akan mengirimkan pesan error `401 Unauthorized`.
        *   Jika pengguna mencoba membuka halaman secara langsung di browser, mereka akan dialihkan ke halaman `login.php`.
    *   **Jika ada (sudah login)**: Eksekusi kode dilanjutkan.

3.  **Memuat Komponen Penting**:
    *   Kode akan memuat beberapa file PHP lain yang berisi fungsi-fungsi penting:
        *   `utils/statsCalculator.php`: Untuk menghitung statistik trading.
        *   `config/db.php`: Untuk konfigurasi dan koneksi ke database.
        *   `utils/db_operations.php`: Berisi fungsi untuk operasi database (tambah, baca, ubah data order).

4.  **Inisialisasi Database**: Sistem membuat objek koneksi database untuk berinteraksi dengan data.

## Skenario 1: Menampilkan Halaman Dashboard (Akses Normal)

Ini terjadi jika pengguna membuka halaman `dashboard.php` langsung dari browser tanpa parameter `action` di URL.

1.  **Struktur HTML**: Sistem akan menampilkan kerangka dasar halaman web (HTML).
2.  **Menyusun Tampilan**: Halaman dirakit dengan menyisipkan beberapa file dari folder `includes/`:
    *   `header.php`: Bagian kepala (navbar atas).
    *   `sidebar.php`: Menu navigasi di sisi kiri.
    *   `add_order.php`: Form untuk menambah data order baru.
    *   `view_orders.php`: Tabel untuk menampilkan order yang masih aktif.
    *   `archive_orders.php`: Tabel untuk menampilkan riwayat order yang sudah selesai.
    *   `statistics.php`: Konten untuk menampilkan data statistik.
    *   `setup.php`: Halaman untuk mengatur rencana trading.
3.  **Memuat Skrip**: Terakhir, `includes/scripts.php` dimuat. File ini berisi tag `<script>` yang menautkan ke file JavaScript, membuat halaman menjadi interaktif.

## Skenario 2: Menangani Permintaan Data (AJAX)

Ini terjadi jika JavaScript dari sisi browser mengirim permintaan ke `dashboard.php` dengan menambahkan `?action=...` pada URL. Ini digunakan untuk mengambil atau mengirim data tanpa perlu me-refresh seluruh halaman.

1.  **Identifikasi Aksi**: Sistem memeriksa nilai dari `$_GET['action']` untuk menentukan apa yang harus dilakukan.
2.  **Eksekusi Fungsi**: Berdasarkan nilai `action`, fungsi yang sesuai akan dijalankan:
    *   `getData`: Mengambil semua data order milik pengguna.
    *   `getStatistics`: Menghitung statistik performa trading.
    *   `addOrder`: Menyimpan data order baru yang dikirim dari form.
    *   `updateStatus`: Memperbarui status sebuah order (misalnya dari "open" menjadi "closed").
    *   `getSetupPlans`: Mengambil data rencana trading yang sudah disimpan.
    *   `saveSetupPlans`: Menyimpan perubahan pada rencana trading.
    *   `getTickers`: Mengambil data harga aset terbaru dari API eksternal (Indodax).
3.  **Mengirim Respon**: Hasil dari setiap aksi (biasanya dalam bentuk data) dikonversi ke format JSON dan dikirim kembali ke browser.
4.  **Menghentikan Proses**: `exit()` dipanggil untuk menghentikan eksekusi skrip PHP lebih lanjut, karena tugasnya sudah selesai.
