<?php
// Mulai sesi
session_start();

// Sertakan file konfigurasi database
require_once 'config.php';
// Sertakan file database
require_once 'app/config/db.php';

// Buat koneksi database di awal
$db = new Database(DB_HOST, DB_NAME, DB_USER, DB_PASS); 

// Inisialisasi pesan notifikasi
$message = '';

// Jika user sudah login, arahkan ke dashboard
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}

// Tangani submit form POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil input form
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validasi input
    if (empty($username) || empty($password)) {
        $message = '<div class="alert error">Username dan password harus diisi.</div>';
    } else {
        // Ambil data user dari tabel tre_user berdasarkan username
        $user = $db->db_bind("SELECT id, username, password FROM tre_user WHERE username = ?", [$username]);

        // Verifikasi user dan password
        if ($user && password_verify($password, $user['password'])) {
            // Set variabel sesi
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            // Update is_auth menjadi 1 dan dupd ke waktu saat ini
            $db->db_query("UPDATE tre_user SET is_auth = 1, dupd = NOW() WHERE id = ?", [$user['id']]);

            // Arahkan pengguna ke halaman dashboard
            header('Location: dashboard.php');
            exit();
        } else {
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
    <link rel="stylesheet" href="public/css/style.css">
    <link rel="stylesheet" href="public/css/auth_styles.css">
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
