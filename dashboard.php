<?php
session_start();

// Cek jika pengguna belum login, arahkan ke halaman login
if (!isset($_SESSION['user_id'])) {
    // Jika ini adalah permintaan AJAX, kirim error 401
    if (isset($_GET['action'])) {
        header('Content-Type: application/json');
        http_response_code(401); // Unauthorized
        echo json_encode(['message' => 'Sesi tidak valid. Silakan login kembali.']);
    } else {
        // Jika ini adalah akses halaman langsung, redirect ke login
        header('Location: login.php');
    }
    exit();
}

require_once __DIR__ . '/utils/statsCalculator.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/utils/db_operations.php';

// --- Inisialisasi Koneksi Database ---
try {
    $db = new Database(); 
} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Koneksi database gagal: ' . $e->getMessage()]);
    exit;
}

// Simple Router for AJAX requests
if (isset($_GET['action'])) {
    header('Content-Type: application/json');

    $action = $_GET['action'];
    $user_id = $_SESSION['user_id'];

    switch ($action) {
        case 'getData':
            echo json_encode(getAllOrders($db, $user_id));
            break;

        case 'getStatistics':
            $allOrders = getAllOrders($db, $user_id);
            echo json_encode(calculatePortfolioStats($allOrders));
            break;

        case 'addOrder':
            $newData = json_decode(file_get_contents('php://input'), true);
            $orderId = addOrder($db, $newData, $user_id);
            if ($orderId) {
                $newOrderData = $db->db_bind("SELECT * FROM orders WHERE id = ? AND user_id = ?", [$orderId, $user_id]);
                echo json_encode($newOrderData);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Gagal menambahkan order']);
            }
            break;

        case 'updateStatus':
            $updateData = json_decode(file_get_contents('php://input'), true);
            $success = updateOrderStatus($db, $updateData['id'], $updateData['status'], $updateData['final_profit'], $user_id);
            if ($success) {
                echo json_encode(['message' => 'Status berhasil diperbarui']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Gagal memperbarui status']);
            }
            break;

        case 'getSetupPlans':
            echo json_encode(getSetupPlans($db, $user_id));
            break;

        case 'saveSetupPlans':
            $plans = json_decode(file_get_contents('php://input'), true);
            if (saveSetupPlans($db, $plans, $user_id)) {
                echo json_encode(['message' => 'Setup plan berhasil disimpan']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Gagal menyimpan setup plan']);
            }
            break;

        case 'getTickers':
            $url = 'https://indodax.com/api/tickers';
            $response = @file_get_contents($url);
            if ($response === FALSE) {
                http_response_code(500);
                echo json_encode(['message' => 'Gagal mengambil data dari Indodax']);
            } else {
                echo $response;
            }
            break;
    }
    exit; // Stop execution after handling AJAX
}

// Jika bukan request AJAX, tampilkan halaman HTML
?><!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jurnal Trading</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="public/css/style.css">
</head>
<body>

    <header class="main-header">
        <h1 class="header-title">Jurnal Trading</h1>
        <button id="menu-toggle" class="menu-toggle">
            <span></span><span></span><span></span>
        </button>
    </header>

    <aside id="sidebar" class="sidebar">
        <div class="sidebar-header"><h2>Menu</h2></div>
        <nav id="main-nav">
            <a href="#" id="nav-view" data-page="view-orders" class="active"><i class="fas fa-history"></i> Riwayat Aktif</a>
            <a href="#" id="nav-archive" data-page="archive-orders"><i class="fas fa-archive"></i> Arsip</a>
            <a href="#" id="nav-add" data-page="add-order"><i class="fas fa-plus-circle"></i> Tambah Order</a>
            <a href="#" id="nav-statistic" data-page="statistic"><i class="fas fa-chart-pie"></i> Statistik</a>
            <a href="#" id="nav-setup" data-page="setup"><i class="fas fa-cogs"></i> Setup</a>
        </nav>
        <div class="sidebar-footer">
            <a href="logout.php" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            <p>Dibuat oleh Faris</p>
            <p><a href="https://instagram.com/faris.a.y" target="_blank">Instagram</a> | <a href="https://threads.net/@faris.a.y" target="_blank">Threads</a></p>
        </div>
    </aside>

    <div id="sidebar-overlay" class="sidebar-overlay"></div>

    <main id="main-content" class="main-content">
        <div id="page-add-order" class="page-content hidden">
            <section class="input-section">
                <h2>Catat Order Baru</h2>
                <form id="journalForm">
                    <label for="pair">Pair</label>
                    <input type="text" id="pair" name="pair" value="BTCIDR" required>
                    <label for="entry">Harga Entry</label>
                    <input type="number" id="entry" name="entry" step="any" required>
                    <label for="takeProfit">Take Profit</label>
                    <input type="number" id="takeProfit" name="takeProfit" step="any" required>
                    <label for="stopLoss">Stop Loss</label>
                    <input type="number" id="stopLoss" name="stopLoss" step="any" required>
                    <label for="timeframe">Timeframe</label>
                    <input type="text" id="timeframe" name="timeframe" value="1H" required>
                    <label for="duration">Jenis Order</label>
                    <select id="duration" name="duration" required>
                        <option value="Long">Long</option>
                        <option value="Short">Short</option>
                    </select>
                    <button type="submit">Catat Order</button>
                </form>
            </section>
        </div>

        <div id="page-view-orders" class="page-content">
             <section class="table-section">
                <div class="table-header">
                    <h2>Riwayat Order Aktif</h2>
                    <button id="refreshBtn"><i class="fas fa-sync-alt"></i> Refresh Harga</button>
                </div>
                <div class="table-wrapper">
                    <table id="journalTable"><thead><tr><th>ID</th><th>Timestamp</th><th>Pair</th><th>Jenis</th><th>Status</th><th>Price</th><th>Timeframe</th><th>Profit</th><th>Action</th></tr></thead><tbody id="tableBody"></tbody></table>
                </div>
            </section>
        </div>

        <div id="page-archive-orders" class="page-content hidden">
             <section class="table-section">
                <h2>Arsip Order [Selesai/Batal]</h2>
                <div class="table-wrapper">
                    <table id="archiveTable"><thead><tr><th>ID</th><th>Timestamp</th><th>Pair</th><th>Jenis</th><th>Status</th><th>Price</th><th>Timeframe</th><th>Profit</th><th>Action</th></tr></thead><tbody id="archiveTableBody"></tbody></table>
                </div>
            </section>
        </div>

        <div id="page-statistic" class="page-content hidden">
        	<section class="statistic-section">
        		<h2>Statistik Trade</h2>
        		<div class="statistic-chart-wrapper"><canvas id="statisticPieChart"></canvas></div>
        		<div class="statistic-cards-wrapper"></div>
        	</section>
        </div>

        <div id="page-setup" class="page-content hidden">
            <section class="setup-section">
                <div class="setup-header">
                    <h2>Setup Trading</h2>
                    <button id="add-plan-btn" class="btn-primary"><i class="fas fa-plus"></i> Tambah</button>
                </div>
                <div id="setup-plans-container"></div>
                <div class="setup-actions"><button id="save-plans-btn"><i class="fas fa-save"></i> Simpan Perubahan</button></div>
            </section>
        </div>
    </main>
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="public/js/script.js"></script>
</body>
</html>