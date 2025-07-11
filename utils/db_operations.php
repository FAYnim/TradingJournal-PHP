<?php
require_once __DIR__ . '/../config/db.php';

/**
 * Mendapatkan semua order dari database.
 * @param Database $db Instance dari kelas Database.
 * @return array Daftar semua order.
 */
function getAllOrders($db)
{
    return $db->db_fetch("SELECT * FROM orders ORDER BY created_at DESC");
}

/**
 * Menambahkan order baru ke database.
 * @param Database $db Instance dari kelas Database.
 * @param array $data Data order yang akan ditambahkan.
 * @return mixed ID dari order yang baru ditambahkan, atau false jika gagal.
 */
function addOrder($db, $data)
{
    $sql = "INSERT INTO orders (pair, entry_price, take_profit, stop_loss, timeframe, order_type) VALUES (?, ?, ?, ?, ?, ?)";
    $params = [
        $data['pair'],
        $data['entry'],
        $data['takeProfit'],
        $data['stopLoss'],
        $data['timeframe'],
        $data['duration']
    ];
    return $db->db_query($sql, $params);
}

/**
 * Memperbarui status order di database.
 * @param Database $db Instance dari kelas Database.
 * @param int $id ID order yang akan diperbarui.
 * @param string $status Status baru order.
 * @param float|null $final_profit Keuntungan/kerugian final.
 * @return bool True jika berhasil, false jika gagal.
 */
function updateOrderStatus($db, $id, $status, $final_profit = null)
{
    $sql = "UPDATE orders SET status = ?, final_profit_percent = ? WHERE id = ?";
    return $db->db_query($sql, [$status, $final_profit, $id]);
}

/**
 * Mendapatkan semua setup plan dari database.
 * @param Database $db Instance dari kelas Database.
 * @return array Daftar semua setup plan beserta kondisinya.
 */
function getSetupPlans($db)
{
    $plans = $db->db_fetch("SELECT * FROM setup_plans ORDER BY created_at ASC");
    foreach ($plans as &$plan) {
        $plan['conditions'] = $db->db_fetch("SELECT id, condition_text as text, is_checked as checked FROM plan_conditions WHERE plan_id = ? ORDER BY created_at ASC", [$plan['id']]);
    }
    return $plans;
}

/**
 * Menyimpan setup plan ke database.
 * @param Database $db Instance dari kelas Database.
 * @param array $plans Data setup plan yang akan disimpan.
 * @return bool True jika berhasil, false jika gagal.
 */
function saveSetupPlans($db, $plans)
{
    // Hapus semua plan dan kondisi yang ada untuk user ini (sederhana)
    // Untuk aplikasi multi-user, tambahkan WHERE user_id = ?
    $db->db_query("DELETE FROM plan_conditions WHERE plan_id IN (SELECT id FROM setup_plans)");
    $db->db_query("DELETE FROM setup_plans");

    foreach ($plans as $plan) {
        $planSql = "INSERT INTO setup_plans (title) VALUES (?)";
        $planId = $db->db_query($planSql, [$plan['title']]);

        if ($planId && !empty($plan['conditions'])) {
            foreach ($plan['conditions'] as $condition) {
                $conditionSql = "INSERT INTO plan_conditions (plan_id, condition_text, is_checked) VALUES (?, ?, ?)";
                $db->db_query($conditionSql, [$planId, $condition['text'], $condition['checked']]);
            }
        }
    }
    return true;
}
