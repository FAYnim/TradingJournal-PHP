<?php
// Mulai sesi
session_start();

// Sertakan file konfigurasi database
require_once 'config.php';
// Sertakan file database
require_once 'config/db.php';

// Buat koneksi database di awal
$db = new Database(DB_HOST, DB_NAME, DB_USER, DB_PASS); 

// Inisialisasi pesan notifikasi
$message = '';

// Tangani submit form POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil input form
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Validasi input
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        $message = '<div class="alert error">Semua field harus diisi.</div>';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = '<div class="alert error">Format email tidak valid.</div>';
    } elseif ($password !== $confirm_password) {
        $message = '<div class="alert error">Konfirmasi password tidak cocok.</div>';
    } elseif (strlen($password) < 6) {
        $message = '<div class="alert error">Password minimal 6 karakter.</div>';
    } else {
        // Cek username atau email sudah terdaftar
        $existingUser = $db->db_bind("SELECT id FROM tre_user WHERE username = ? OR email = ?", [$username, $email]);
        if ($existingUser) {
            $message = '<div class="alert error">Username atau Email sudah terdaftar.</div>';
        } else {
            // Hash password dan simpan user baru
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // is_auth = 0 (belum login), dins dan dupd = waktu saat ini
            $insertId = $db->db_query("INSERT INTO tre_user (username, email, password, is_auth, dins, dupd) VALUES (?, ?, ?, ?, NOW(), NOW())", [$username, $email, $hashed_password, 0]);

            if ($insertId) {
                $message = '<div class="alert success">Pendaftaran berhasil! Silakan <a href="login.php">Login</a>.</div>';
            } else {
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
    <link rel="stylesheet" href="public/css/style.css">
    <link rel="stylesheet" href="public/css/auth_styles.css">
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
                <label for="email">Email:</label>
                <input type="text" id="email" name="email" required>
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
