<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trading Journal - Catat. Evaluasi. Menang.</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --bg-color: #121417;
            --surface-color: #1A1D22;
            --header-color: #212429;
            --primary-color: #00B06B;
            --text-color: #E0E0E0;
            --text-light: #B0B0B0;
            --border-color: #33363B;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
        }
        .container { max-width: 1140px; margin: 0 auto; padding: 0 20px; }
        section { padding: 80px 0; }
        .fade-in-element { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .fade-in-element.visible { opacity: 1; transform: translateY(0); }
        .btn { padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: inline-block; }
        .btn-primary { background-color: var(--primary-color); color: #FFFFFF; }
        .btn-primary:hover { background-color: #008c55; }
        .btn-secondary { background-color: transparent; border: 1px solid var(--border-color); color: var(--text-light); }
        .btn-secondary:hover { background-color: var(--surface-color); color: #FFFFFF; }
        .navbar { background-color: rgba(18, 20, 23, 0.7); backdrop-filter: blur(10px); padding: 15px 0; position: sticky; width: 100%; top: 0; z-index: 100; border-bottom: 1px solid var(--border-color); }
        .navbar .container { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 22px; font-weight: 700; }
        .logo span { color: var(--primary-color); }
        .nav-menu { display: flex; align-items: center; gap: 25px; }
        .nav-menu a { color: var(--text-light); text-decoration: none; font-weight: 600; }
        .nav-menu a:hover { color: #FFFFFF; }
        .nav-menu .btn { padding: 8px 16px; }
        .hero { min-height: 90vh; display: flex; align-items: center; text-align: center; background-image: radial-gradient(circle at 50% 30%, rgba(0, 176, 107, 0.15), transparent 50%); }
        .hero h1 { font-size: 64px; font-weight: 900; margin-bottom: 20px; line-height: 1.2; }
        .hero p { font-size: 18px; color: var(--text-light); max-width: 650px; margin: 0 auto 40px auto; }
        .hero-cta { display: flex; justify-content: center; gap: 15px; }
        .hero-mockup { margin-top: 60px; }
        .hero-mockup img { max-width: 80%; height: auto; border-radius: 10px; border: 1px solid var(--border-color); box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .features h2 { text-align: center; font-size: 40px; margin-bottom: 50px; }
        .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
        .feature-item { background-color: var(--surface-color); padding: 25px; border-radius: 8px; border: 1px solid var(--border-color); }
        .feature-item i { font-size: 28px; color: var(--primary-color); margin-bottom: 15px; }
        .feature-item h3 { font-size: 18px; margin-bottom: 10px; }
        .feature-item p { color: var(--text-light); font-size: 14px; }
        .demo-section h2 { text-align: center; font-size: 40px; margin-bottom: 50px; }
        .demo-layout { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 50px; }
        .demo-layout img { width: 100%; border-radius: 8px; }
        .demo-text h3 { font-size: 24px; margin-bottom: 15px; }
        .testimonials h2 { text-align: center; font-size: 40px; margin-bottom: 50px; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .testimonial-card { background-color: var(--surface-color); padding: 30px; border-radius: 8px; border: 1px solid var(--border-color); }
        .testimonial-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .testimonial-header img { width: 50px; height: 50px; border-radius: 50%; }
        .testimonial-header .name { font-weight: 700; }
        .testimonial-header .status { font-size: 14px; color: var(--text-light); }
        .testimonial-card .quote { font-style: italic; color: var(--text-light); }
        .cta-section { background-image: linear-gradient(45deg, var(--bg-color), var(--header-color)); border-radius: 12px; padding: 60px; text-align: center; }
        .cta-section h2 { font-size: 32px; margin-bottom: 10px; }
        .cta-section p { color: var(--text-light); margin-bottom: 30px; }
        .footer { background-color: #0C0F1A; padding: 60px 0 30px 0; }
        .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-bottom: 40px; }
        .footer-col h4 { font-size: 18px; margin-bottom: 20px; }
        .footer-col a { display: block; color: var(--text-light); text-decoration: none; margin-bottom: 10px; transition: color 0.3s; }
        .footer-col a:hover { color: #FFFFFF; }
        .footer-col .fa-brands { margin-right: 10px; width: 16px; text-align: center; }
        .footer-copyright { text-align: center; padding-top: 30px; border-top: 1px solid var(--border-color); font-size: 14px; color: var(--text-light); }
        @media (max-width: 768px) {
            section { padding: 60px 0; }
            .nav-menu { display: none; }
            .hero h1 { font-size: 40px; }
            .hero p { font-size: 16px; }
            .features-grid, .demo-layout, .testimonials-grid, .footer-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="container">
            <div class="logo">Trading<span>Journal</span></div>
            <nav class="nav-menu">
                <a href="#">Fitur</a>
                <a href="#">Keunggulan</a>
                <a href="#">Testimoni</a>
                <a href="#">FAQ</a>
                <a href="#" class="btn btn-secondary">Login</a>
                <a href="#" class="btn btn-primary">Daftar</a>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1 class="fade-in-element">Catat. Evaluasi. Menang.</h1>
                <p class="fade-in-element">Platform jurnal trading yang bantu kamu analisis performa dan konsisten profit.</p>
                <div class="hero-cta fade-in-element">
                    <a href="dashboard" class="btn btn-primary">Mulai Gratis</a>
                </div>
                <div class="hero-mockup fade-in-element">
                    <img src="https://placehold.co/800x450/1A1D22/E0E0E0?text=Aplikasi+Mockup" alt="Mockup Aplikasi Trading Journal">
                </div>
            </div>
        </section>

        <section class="features">
            <div class="container">
                <h2 class="fade-in-element">Fitur Unggulan Kami</h2>
                <div class="features-grid">
                    <div class="feature-item fade-in-element">
                        <i class="fa-solid fa-file-import"></i>
                        <h3>Catat Jurnal</h3>
                        <p>Catat setiap aksi yang anda lakukan.</p>
                    </div>
                    <div class="feature-item fade-in-element">
                        <i class="fa-solid fa-chart-pie"></i>
                        <h3>Analisis Winrate</h3>
                        <p>Bantu kamu evaluasi strategi trading.</p>
                    </div>
                    <div class="feature-item fade-in-element">
                        <i class="fa-solid fa-brain"></i>
                        <h3>Manajemen Emosi</h3>
                        <p>Disiplin bukan cuma soal teknikal.</p>
                    </div>
                    <div class="feature-item fade-in-element">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                        <h3>Export & Backup</h3>
                        <p>Portofolio bisa dicetak & aman tersimpan.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="demo-section">
            <div class="container">
                <div class="demo-layout fade-in-element">
                    <img src="https://placehold.co/600x400/1A1D22/00B06B?text=Grafik+ROI+%26+Tabel" alt="Screenshot dashboard">
                    <div class="demo-text">
                        <h3>Analisis Mendalam di Ujung Jari</h3>
                        <p>Lihat metrik penting seperti Average Win/Loss, Profit Factor, dan drawdown maksimal. Semua data disajikan dengan visual yang mudah dipahami untuk membantu pengambilan keputusan Anda.</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!--section class="testimonials">
            <div class="container">
                <h2 class="fade-in-element">Dipercaya oleh Ratusan Trader</h2>
                <div class="testimonials-grid">
                    <div class="testimonial-card fade-in-element">
                        <div class="testimonial-header">
                            <img src="https://i.pravatar.cc/150?u=trader1" alt="Avatar">
                            <div>
                                <div class="name">Fajar S.</div>
                                <div class="status">Swing Trader</div>
                            </div>
                        </div>
                        <p class="quote">“Setelah catat manual selama 1 tahun, akhirnya nemu tools ini. Lebih konsisten dan terarah.”</p>
                    </div>
                    <div class="testimonial-card fade-in-element">
                        <div class="testimonial-header">
                            <img src="https://i.pravatar.cc/150?u=trader2" alt="Avatar">
                            <div>
                                <div class="name">Citra W.</div>
                                <div class="status">Trader Harian</div>
                            </div>
                        </div>
                        <p class="quote">“Fitur analisisnya membuka mata. Saya jadi tahu strategi mana yang benar-benar profitabel.”</p>
                    </div>
                    <div class="testimonial-card fade-in-element">
                        <div class="testimonial-header">
                            <img src="https://i.pravatar.cc/150?u=trader3" alt="Avatar">
                            <div>
                                <div class="name">Gilang P.</div>
                                <div class="status">Scalper</div>
                            </div>
                        </div>
                        <p class="quote">“Sangat membantu untuk review mingguan. Data dari jurnal ini jadi bahan evaluasi utama saya.”</p>
                    </div>
                </div>
            </div>
        </section-->

        <section class="cta-section-wrapper">
            <div class="container">
                <div class="cta-section fade-in-element">
                    <h2>Mulai bangun disiplin trading hari ini.</h2>
                    <p>Gunakan gratis. Tidak butuh kartu kredit.</p>
                    <a href="dashboard" class="btn btn-primary">Buat Akun Sekarang</a>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <!--div class="footer-col">
                    <h4>Menu</h4>
                    <a href="#">Fitur</a>
                    <a href="#">Tentang</a>
                    <a href="#">Blog</a>
                    <a href="#">Kontak</a>
                </div-->
                <div class="footer-col">
                    <h4>Sosial</h4>
                    <a href="https://instagram.com/faris.a.y" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-instagram"></i> Instagram
                    </a>
                    <a href="https://threads.net/@faris.a.y" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-threads"></i> Threads
                    </a>
                    <!--a href="#" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-youtube"></i> YouTube
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-github"></i> GitHub
                    </a-->
                </div>
            </div>
            <div class="footer-copyright">
                © 2025 Trading Journal. Created by Faris AY.
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            const elementsToFadeIn = document.querySelectorAll('.fade-in-element');
            elementsToFadeIn.forEach(el => {
                observer.observe(el);
            });
        });
    </script>
</body>
</html>
