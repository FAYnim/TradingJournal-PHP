<?php
// Memulai sesi untuk mengelola status pengguna
session_start();

// Memasukkan file koneksi database
require_once 'db.php';

// Inisialisasi variabel pesan untuk menampilkan notifikasi kepada pengguna
$message = '';

// Memeriksa apakah request yang diterima adalah POST (form disubmit)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Mengambil dan membersihkan input dari form
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Validasi input: memeriksa apakah semua field terisi
    if (empty($username) || empty($password) || empty($confirm_password)) {
        $message = '<div class="alert error">Semua field harus diisi.</div>';
    } 
    // Validasi input: memeriksa apakah password dan konfirmasi password cocok
    elseif ($password !== $confirm_password) {
        $message = '<div class="alert error">Konfirmasi password tidak cocok.</div>';
    }
    // Validasi input: memeriksa panjang password minimal 6 karakter
    elseif (strlen($password) < 6) {
        $message = '<div class="alert error">Password minimal 6 karakter.</div>';
    } 
    // Jika semua validasi awal berhasil
    else {
        // Membuat instance koneksi database
        // Ganti 'nama_database_anda', 'username_anda', 'password_anda' dengan kredensial database Anda
        $db = new Database('localhost', 'nama_database_anda', 'username_anda', 'password_anda'); 
        
        // Memeriksa apakah username sudah ada di database
        $existingUser = $db->db_bind("SELECT id FROM users WHERE username = ?", [$username]);
        if ($existingUser) {
            $message = '<div class="alert error">Username sudah terdaftar.</div>';
        } 
        // Jika username belum terdaftar, lanjutkan proses pendaftaran
        else {
            // Mengenkripsi password sebelum disimpan ke database
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // Memasukkan data pengguna baru ke tabel users
            $insertId = $db->db_query("INSERT INTO users (username, password) VALUES (?, ?)", [$username, $hashed_password]);

            // Memeriksa apakah pendaftaran berhasil
            if ($insertId) {
                $message = '<div class="alert success">Pendaftaran berhasil! Silakan <a href="login.php">Login</a>.</div>';
            } 
            // Jika pendaftaran gagal
            else {
                $message = '<div class="alert error">Pendaftaran gagal: ' . $db->getError() . '</div>';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="auth_styles.css">
</head>
<body>
    <div class="container">
        <h2>Daftar Akun Baru</h2>
        <?php echo $message; ?>
        <form action="register.php" method="POST">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <label for="confirm_password">Konfirmasi Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
            </div>
            <button type="submit" class="btn-primary">Daftar</button>
        </form>
        <p class="link-text">Sudah punya akun? <a href="login.php">Login di sini</a></p>
    </div>
</body>
</html>