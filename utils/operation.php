<?php
require_once __DIR__ . '/../config/db.php';

function calculatePortfolioStats($orders) {
    $summary = [
        'totalTrades' => 0,
        'wins' => 0,
        'losses' => 0,
        'batal' => 0,
        'totalProfit' => 0,
        'winRate' => 0,
        'avgWin' => 0,
        'avgLoss' => 0
    ];
    $totalWinProfit = 0;
    $totalLossProfit = 0;

    foreach ($orders as $order) {
        if (isset($order['status']) && $order['status'] === 'Selesai') {
            $profit = isset($order['final_profit_percent']) ? (float)$order['final_profit_percent'] : 0;
            if (is_nan($profit)) continue;

            $summary['totalProfit'] += $profit;
            if ($profit >= 0) {
                $summary['wins']++;
                $totalWinProfit += $profit;
            } else {
                $summary['losses']++;
                $totalLossProfit += $profit;
            }
        } elseif (isset($order['status']) && $order['status'] === 'Batal') {
            $summary['batal']++;
        }
    }

    $summary['totalTrades'] = $summary['wins'] + $summary['losses'];
    if ($summary['totalTrades'] > 0) {
        $summary['winRate'] = ($summary['wins'] / $summary['totalTrades']) * 100;
    }
    if ($summary['wins'] > 0) {
        $summary['avgWin'] = $totalWinProfit / $summary['wins'];
    }
    if ($summary['losses'] > 0) {
        $summary['avgLoss'] = $totalLossProfit / $summary['losses'];
    }

    return ['summary' => $summary];
}

function getAllOrders($db, $user_id)
{
    return $db->db_fetch("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [$user_id]);
}

function addOrder($db, $data, $user_id)
{
    $sql = "INSERT INTO orders (user_id, pair, entry_price, take_profit, stop_loss, timeframe, order_type) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $params = [
        $user_id,
        $data['pair'],
        $data['entry'],
        $data['takeProfit'],
        $data['stopLoss'],
        $data['timeframe'],
        $data['duration']
    ];
    return $db->db_query($sql, $params);
}

function updateOrderStatus($db, $id, $status, $final_profit = null, $user_id)
{
    $sql = "UPDATE orders SET status = ?, final_profit_percent = ? WHERE id = ? AND user_id = ?";
    return $db->db_query($sql, [$status, $final_profit, $id, $user_id]);
}

function getSetupPlans($db, $user_id)
{
    $plans = $db->db_fetch("SELECT * FROM setup_plans WHERE user_id = ? ORDER BY created_at ASC", [$user_id]);
    foreach ($plans as &$plan) {
        $plan['conditions'] = $db->db_fetch("SELECT id, condition_text as text, is_checked as checked FROM plan_conditions WHERE plan_id = ? ORDER BY created_at ASC", [$plan['id']]);
    }
    return $plans;
}

function saveSetupPlans($db, $plans, $user_id)
{
    // Hapus semua plan dan kondisi yang ada untuk user ini
    $db->db_query("DELETE FROM plan_conditions WHERE plan_id IN (SELECT id FROM setup_plans WHERE user_id = ?)", [$user_id]);
    $db->db_query("DELETE FROM setup_plans WHERE user_id = ?", [$user_id]);

    foreach ($plans as $plan) {
        $planSql = "INSERT INTO setup_plans (user_id, title) VALUES (?, ?)";
        $planId = $db->db_query($planSql, [$user_id, $plan['title']]);

        if ($planId && !empty($plan['conditions'])) {
            foreach ($plan['conditions'] as $condition) {
                $conditionSql = "INSERT INTO plan_conditions (plan_id, condition_text, is_checked) VALUES (?, ?, ?)";
                $db->db_query($conditionSql, [$planId, $condition['text'], $condition['checked'] ? 1 : 0]);
            }
        }
    }
    return true;
}
