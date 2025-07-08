<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selamat Datang di Jurnal Trading</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <style>
        /* Landing Page Specific Styles */
        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .landing-header {
            background-color: var(--header-color);
            padding: 0 20px;
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            width: 100%;
        }
        .landing-main {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 20px;
        }
        .hero-section {
            max-width: 800px;
        }
        .hero-section h1 {
            font-size: 3em;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 0.5em;
        }
        .hero-section p {
            font-size: 1.2em;
            color: var(--text-light);
            margin-bottom: 1.5em;
        }
        .cta-button {
            display: inline-block;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.1em;
            font-weight: 600;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .cta-button:hover {
            background-color: #008c56; /* Darker shade of primary color */
            transform: translateY(-3px);
        }
        .features-section {
            padding: 40px 20px;
            background-color: var(--surface-color);
            width: 100%;
            text-align: center;
        }
        .features-section h2 {
            margin-bottom: 40px;
            font-size: 2em;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .feature-card {
            background-color: var(--bg-color);
            padding: 25px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }
        .feature-card i {
            font-size: 2.5em;
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        .feature-card h3 {
            font-size: 1.3em;
            margin-bottom: 10px;
            color: var(--text-color);
        }
        .feature-card p {
            color: var(--text-light);
        }
        .landing-footer {
            text-align: center;
            padding: 20px;
            background-color: var(--header-color);
            border-top: 1px solid var(--border-color);
            color: var(--text-light);
        }
        .landing-footer a {
            color: var(--secondary-color);
            text-decoration: none;
        }
        .landing-footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <header class="landing-header">
        <h1 class="header-title">Jurnal Trading</h1>
    </header>

    <main class="landing-main">
        <section class="hero-section">
            <h1>Jurnal Trading Modern Anda</h1>
            <p>Catat, analisis, dan tingkatkan performa trading Anda dengan alat yang simpel dan efektif.</p>
            <a href="dashboard.php" class="cta-button">Mulai Sekarang <i class="fas fa-arrow-right"></i></a>
        </section>
    </main>

    <section class="features-section">
        <h2>Fitur Utama</h2>
        <div class="features-grid">
            <div class="feature-card">
                <i class="fas fa-book-open"></i>
                <h3>Pencatatan Mudah</h3>
                <p>Catat setiap order trading Anda dengan detail lengkap, termasuk entry, take profit, dan stop loss.</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-chart-pie"></i>
                <h3>Statistik Performa</h3>
                <p>Dapatkan wawasan mendalam dari statistik performa seperti win rate, total profit, dan rata-rata keuntungan.</p>
            </div>
            <div class="feature-card">
                <i class="fas fa-sync-alt"></i>
                <h3>Data Real-time</h3>
                <p>Pantau profit/loss dari order yang sedang berjalan dengan data harga real-time dari market.</p>
            </div>
        </div>
    </section>

    <footer class="landing-footer">
        <p>Dibuat oleh Faris</p>
        <p><a href="https://instagram.com/faris.a.y" target="_blank">Instagram</a> | <a href="https://threads.net/@faris.a.y" target="_blank">Threads</a></p>
    </footer>

</body>
</html>