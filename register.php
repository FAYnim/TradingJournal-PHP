<?php
// Mulai sesi
session_start();

// Sertakan file database
require_once 'config/db.php';

// Buat koneksi database
$db = new Database();

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
        $message = '<div style="color: #ff4d4d; background-color: #2a2020; border: 1px solid #ff4d4d; padding: 10px; border-radius: 6px; margin-bottom: 20px;">Semua field harus diisi.</div>';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = '<div style="color: #ff4d4d; background-color: #2a2020; border: 1px solid #ff4d4d; padding: 10px; border-radius: 6px; margin-bottom: 20px;">Format email tidak valid.</div>';
    } elseif ($password !== $confirm_password) {
        $message = '<div style="color: #ff4d4d; background-color: #2a2020; border: 1px solid #ff4d4d; padding: 10px; border-radius: 6px; margin-bottom: 20px;">Konfirmasi password tidak cocok.</div>';
    } elseif (strlen($password) < 6) {
        $message = '<div style="color: #ff4d4d; background-color: #2a2020; border: 1px solid #ff4d4d; padding: 10px; border-radius: 6px; margin-bottom: 20px;">Password minimal 6 karakter.</div>';
    } else {
        // Cek username atau email sudah terdaftar
        $existingUser = $db->db_bind("SELECT id FROM users WHERE username = ? OR email = ?", [$username, $email]);
        if ($existingUser) {
            $message = '<div style="color: #ff4d4d; background-color: #2a2020; border: 1px solid #ff4d4d; padding: 10px; border-radius: 6px; margin-bottom: 20px;">Username atau Email sudah terdaftar.</div>';
        } else {
            // Hash password dan simpan user baru
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            $insertId = $db->db_query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [$username, $email, $hashed_password]);

            if ($insertId) {
                $message = '<div style="color: #00B06B; background-color: #1a2b25; border: 1px solid #00B06B; padding: 10px; border-radius: 6px; margin-bottom: 20px;">Pendaftaran berhasil! Silakan <a href="login.php" style="color: #00B06B; font-weight: 600;">Login</a>.</div>';
            } else {
                $message = '<div style="color: #ff4d4d; background-color: #2a2020; border: 1px solid #ff4d4d; padding: 10px; border-radius: 6px; margin-bottom: 20px;">Pendaftaran gagal: ' . $db->getError() . '</div>';
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
    <title>Daftar - Trading Journal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --bg-color: #121417; --surface-color: #1A1D22; --header-color: #212429; --primary-color: #00B06B; --text-color: #E0E0E0; --text-light: #B0B0B0; --border-color: #33363B;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-color); }
        .container { max-width: 1140px; margin: 0 auto; padding: 0 20px; }
        .auth-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 40px 0; }
        .auth-container { max-width: 450px; width: 100%; padding: 40px; background-color: var(--surface-color); border: 1px solid var(--border-color); border-radius: 8px; }
        .auth-form h1 { text-align: center; margin-bottom: 30px; font-size: 28px; }
        .auth-form .form-group { margin-bottom: 20px; }
        .auth-form label { display: block; margin-bottom: 8px; font-weight: 600; }
        .auth-form input { width: 100%; background-color: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); padding: 12px; border-radius: 6px; font-family: 'Inter', sans-serif; transition: border-color 0.3s; }
        .auth-form input:focus { outline: none; border-color: var(--primary-color); }
        .btn { padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: inline-block; cursor: pointer; width: 100%; border: none; }
        .btn-primary { background-color: var(--primary-color); color: #FFFFFF; }
        .btn-primary:hover { background-color: #008c55; }
        .form-footer { text-align: center; margin-top: 25px; font-size: 14px; color: var(--text-light); }
        .form-footer a { color: var(--primary-color); text-decoration: none; font-weight: 600; }
        .form-footer a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="auth-page">
        <div class="auth-container">
            <form class="auth-form" action="register.php" method="POST">
                <h1>Buat Akun Baru</h1>
                <?php echo $message; ?>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="email">Alamat Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="confirm_password">Konfirmasi Password</label>
                    <input type="password" id="confirm_password" name="confirm_password" required>
                </div>
                <button type="submit" class="btn btn-primary">Daftar</button>
                <div class="form-footer">
                    <p>Sudah punya akun? <a href="login.php">Login di sini</a></p>
                </div>
            </form>
        </div>
    </div>
</body>
</html>