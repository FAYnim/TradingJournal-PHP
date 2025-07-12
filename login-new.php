<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Trading Journal</title>
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
            <form class="auth-form" action="#">
                <h1>Login ke Akun Anda</h1>
                <div class="form-group">
                    <label for="username">Username atau Email</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <div class="form-footer">
                    <p>Belum punya akun? <a href="register.html">Daftar sekarang</a></p>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
