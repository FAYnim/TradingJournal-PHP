<?php
// Memulai sesi untuk mengelola status pengguna
session_start();

// Memasukkan file koneksi database
require_once 'db.php';

// Inisialisasi variabel pesan untuk menampilkan notifikasi kepada pengguna
$message = '';

// Memeriksa apakah pengguna sudah login
if (isset($_SESSION['user_id'])) {
    // Jika sudah login, arahkan ke halaman dashboard
    header('Location: dashboard.php');
    exit();
}

// Memeriksa apakah request yang diterima adalah POST (form disubmit)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Mengambil dan membersihkan input dari form
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validasi input: memeriksa apakah username dan password terisi
    if (empty($username) || empty($password)) {
        $message = '<div class="alert error">Username dan password harus diisi.</div>';
    } 
    // Jika validasi awal berhasil
    else {
        // Membuat instance koneksi database
        // Ganti 'nama_database_anda', 'username_anda', 'password_anda' dengan kredensial database Anda
        $db = new Database('localhost', 'nama_database_anda', 'username_anda', 'password_anda'); 
        
        // Mengambil data pengguna dari database berdasarkan username
        $user = $db->db_bind("SELECT id, username, password FROM users WHERE username = ?", [$username]);

        // Memeriksa apakah pengguna ditemukan dan password cocok
        if ($user && password_verify($password, $user['password'])) {
            // Jika login berhasil, set variabel sesi
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            // Arahkan pengguna ke halaman dashboard
            header('Location: dashboard.php');
            exit();
        } 
        // Jika username atau password salah
        else {
            $message = '<div class="alert error">Username atau password salah.</div>';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="auth_styles.css">
</head>
<body>
    <div class="container">
        <h2>Login</h2>
        <?php echo $message; ?>
        <form action="login.php" method="POST">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn-primary">Login</button>
        </form>
        <p class="link-text">Belum punya akun? <a href="register.php">Daftar di sini</a></p>
    </div>
</body>
</html>