<?php
session_start();
require_once 'db.php';

$message = '';

// Jika user sudah login, redirect ke dashboard
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $message = '<div class="alert error">Username dan password harus diisi.</div>';
    } else {
        $db = new Database('localhost', 'nama_database_anda', 'username_anda', 'password_anda'); // Ganti dengan kredensial Anda
        
        $user = $db->db_bind("SELECT id, username, password FROM users WHERE username = ?", [$username]);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
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
    <link rel="stylesheet" href="style.css">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #2c2c2c; /* Latar belakang gelap */
            color: #e0e0e0; /* Warna teks terang */
        }
        .container {
            background-color: #3a3a3a; /* Kontainer gelap */
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Bayangan lebih gelap */
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        h2 {
            margin-bottom: 20px;
            color: #f0f0f0; /* Judul terang */
        }
        .form-group {
            margin-bottom: 15px;
            text-align: left;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #c0c0c0; /* Label terang */
            font-weight: bold;
        }
        .form-group input[type="text"],
        .form-group input[type="password"] {
            width: 100%; /* Full width */
            padding: 10px;
            border: 1px solid #555; /* Border input gelap */
            border-radius: 4px;
            font-size: 16px;
            background-color: #4a4a4a; /* Latar belakang input gelap */
            color: #e0e0e0; /* Teks input terang */
            box-sizing: border-box; /* Include padding and border in the element's total width and height */
        }
        .btn-primary {
            background-color: #007bff; /* Tetap biru atau sesuaikan */
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
            margin-top: 10px;
        }
        .btn-primary:hover {
            background-color: #0056b3;
        }
        .alert {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
            font-size: 14px;
        }
        .alert.error {
            background-color: #5c2c2c; /* Latar belakang error gelap */
            color: #ffcccc; /* Teks error terang */
            border: 1px solid #8a3d3d;
        }
        .alert.success {
            background-color: #3d5c3d; /* Latar belakang sukses gelap */
            color: #ccffcc; /* Teks sukses terang */
            border: 1px solid #5a8a5a;
        }
        .link-text {
            margin-top: 20px;
            font-size: 14px;
            color: #c0c0c0; /* Teks link terang */
        }
        .link-text a {
            color: #007bff; /* Warna link tetap biru atau sesuaikan */
            text-decoration: none;
        }
        .link-text a:hover {
            text-decoration: underline;
        }
    </style>
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
