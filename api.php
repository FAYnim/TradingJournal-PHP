<?php
require_once __DIR__ . '/utils/statsCalculator.php';

header('Content-Type: application/json');

$DATA_FILE = __DIR__ . '/data/data-order.json';
$SETUP_PLANS_FILE = __DIR__ . '/data/setup-plans.json';

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '/';

// Initialize data files if they don't exist
if (!file_exists($DATA_FILE)) {
    file_put_contents($DATA_FILE, '[]');
}
if (!file_exists($SETUP_PLANS_FILE)) {
    file_put_contents($SETUP_PLANS_FILE, '[]');
}

switch ($path) {
    case '/api/data':
        if ($method === 'GET') {
            echo file_get_contents($DATA_FILE);
        } elseif ($method === 'POST') {
            $newData = json_decode(file_get_contents('php://input'));
            $newData->id = uniqid();
            $newData->timestamp = date('c');
            $newData->status = 'Open';

            $allData = json_decode(file_get_contents($DATA_FILE));
            $allData[] = $newData;
            file_put_contents($DATA_FILE, json_encode($allData, JSON_PRETTY_PRINT));
            echo json_encode($newData);
        }
        break;

    case '/api/statistics':
        if ($method === 'GET') {
            $allOrders = json_decode(file_get_contents($DATA_FILE));
            $portfolioData = calculatePortfolioStats($allOrders);
            echo json_encode($portfolioData);
        }
        break;

    case '/api/update-status':
        if ($method === 'POST') {
            $updateData = json_decode(file_get_contents('php://input'));
            $allData = json_decode(file_get_contents($DATA_FILE));
            $orderFound = false;

            foreach ($allData as $order) {
                if ($order->id === $updateData->id) {
                    $orderFound = true;
                    $order->status = $updateData->status;
                    if (isset($updateData->final_profit) && $updateData->final_profit !== 'null') {
                        $order->final_profit = $updateData->final_profit;
                    }
                    break;
                }
            }

            if ($orderFound) {
                file_put_contents($DATA_FILE, json_encode($allData, JSON_PRETTY_PRINT));
                echo json_encode(['message' => 'Status berhasil diperbarui']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Order tidak ditemukan']);
            }
        }
        break;

    case '/api/setup-plans':
        if ($method === 'GET') {
            echo file_get_contents($SETUP_PLANS_FILE);
        } elseif ($method === 'POST') {
            $plans = json_decode(file_get_contents('php://input'));
            file_put_contents($SETUP_PLANS_FILE, json_encode($plans, JSON_PRETTY_PRINT));
            echo json_encode(['message' => 'Setup plan berhasil disimpan']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint tidak ditemukan']);
        break;
}
