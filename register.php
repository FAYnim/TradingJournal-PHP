<?php
// Mulai sesi
session_start();

// Sertakan file database
require_once 'db.php';

// Inisialisasi pesan notifikasi
$message = '';

// Tangani submit form POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil input form
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Validasi input
    if (empty($username) || empty($password) || empty($confirm_password)) {
        $message = '<div class="alert error">Semua field harus diisi.</div>';
    } elseif ($password !== $confirm_password) {
        $message = '<div class="alert error">Konfirmasi password tidak cocok.</div>';
    } elseif (strlen($password) < 6) {
        $message = '<div class="alert error">Password minimal 6 karakter.</div>';
    } else {
        // Buat koneksi database (ganti kredensial Anda)
        $db = new Database('localhost', 'nama_database_anda', 'username_anda', 'password_anda'); 
        
        // Cek username sudah terdaftar
        $existingUser = $db->db_bind("SELECT id FROM users WHERE username = ?", [$username]);
        if ($existingUser) {
            $message = '<div class="alert error">Username sudah terdaftar.</div>';
        } else {
            // Hash password dan simpan user baru
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $insertId = $db->db_query("INSERT INTO users (username, password) VALUES (?, ?)", [$username, $hashed_password]);

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
