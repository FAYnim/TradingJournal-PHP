<?php
session_start();

// Cek login pengguna
if (!isset($_SESSION['user_id'])) {
    // Permintaan AJAX
    if (isset($_GET['action'])) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['message' => 'Sesi tidak valid. Silakan login kembali.']);
    } else {
        // Akses halaman langsung
        header('Location: login.php');
    }
    exit();
}

require_once __DIR__ . '/utils/statsCalculator.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/utils/db_operations.php';

// Inisialisasi database
try {
    $db = new Database(); 
} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Koneksi database gagal: ' . $e->getMessage()]);
    exit;
}

// Router permintaan AJAX
if (isset($_GET['action'])) {
    header('Content-Type: application/json');

    $action = $_GET['action'];
    $user_id = $_SESSION['user_id'];

    if ($action === 'getData') {
        echo json_encode(getAllOrders($db, $user_id));
    } else if ($action === 'getStatistics') {
        $allOrders = getAllOrders($db, $user_id);
        echo json_encode(calculatePortfolioStats($allOrders));
    } else if ($action === 'addOrder') {
        $newData = json_decode(file_get_contents('php://input'), true);
        $orderId = addOrder($db, $newData, $user_id);
        if ($orderId) {
            $newOrderData = $db->db_bind("SELECT * FROM orders WHERE id = ? AND user_id = ?", [$orderId, $user_id]);
            echo json_encode($newOrderData);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal menambahkan order']);
        }
    } else if ($action === 'updateStatus') {
        $updateData = json_decode(file_get_contents('php://input'), true);
        $success = updateOrderStatus($db, $updateData['id'], $updateData['status'], $updateData['final_profit'], $user_id);
        if ($success) {
            echo json_encode(['message' => 'Status berhasil diperbarui']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal memperbarui status']);
        }
    } else if ($action === 'getSetupPlans') {
        echo json_encode(getSetupPlans($db, $user_id));
    } else if ($action === 'saveSetupPlans') {
        $plans = json_decode(file_get_contents('php://input'), true);
        if (saveSetupPlans($db, $plans, $user_id)) {
            echo json_encode(['message' => 'Setup plan berhasil disimpan']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal menyimpan setup plan']);
        }
    } else if ($action === 'getTickers') {
        $url = 'https://indodax.com/api/tickers';
        $response = @file_get_contents($url);
        if ($response === FALSE) {
            http_response_code(500);
            echo json_encode(['message' => 'Gagal mengambil data dari Indodax']);
        } else {
            echo $response;
        }
    }
    exit; // Hentikan eksekusi
}

// Tampilkan halaman HTML
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

    <?php include 'includes/header.php'; ?>

    <?php include 'includes/sidebar.php'; ?>

    <main id="main-content" class="main-content">
        <?php include 'includes/add_order.php'; ?>
        <?php include 'includes/view_orders.php'; ?>
        <?php include 'includes/archive_orders.php'; ?>
        <?php include 'includes/statistics.php'; ?>
        <?php include 'includes/setup.php'; ?>
    </main>
    
    <?php include 'includes/scripts.php'; ?>
</body>
</html>