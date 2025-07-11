<?php
require_once __DIR__ . '/../config/db.php';

/**
 * Mendapatkan semua order dari database untuk pengguna tertentu.
 * @param Database $db Instance dari kelas Database.
 * @param int $user_id ID pengguna.
 * @return array Daftar semua order.
 */
function getAllOrders($db, $user_id)
{
    return $db->db_fetch("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [$user_id]);
}

/**
 * Menambahkan order baru ke database untuk pengguna tertentu.
 * @param Database $db Instance dari kelas Database.
 * @param array $data Data order yang akan ditambahkan.
 * @param int $user_id ID pengguna.
 * @return mixed ID dari order yang baru ditambahkan, atau false jika gagal.
 */
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

/**
 * Memperbarui status order di database.
 * @param Database $db Instance dari kelas Database.
 * @param int $id ID order yang akan diperbarui.
 * @param string $status Status baru order.
 * @param float|null $final_profit Keuntungan/kerugian final.
 * @param int $user_id ID pengguna.
 * @return bool True jika berhasil, false jika gagal.
 */
function updateOrderStatus($db, $id, $status, $final_profit = null, $user_id)
{
    $sql = "UPDATE orders SET status = ?, final_profit_percent = ? WHERE id = ? AND user_id = ?";
    return $db->db_query($sql, [$status, $final_profit, $id, $user_id]);
}

/**
 * Mendapatkan semua setup plan dari database untuk pengguna tertentu.
 * @param Database $db Instance dari kelas Database.
 * @param int $user_id ID pengguna.
 * @return array Daftar semua setup plan beserta kondisinya.
 */
function getSetupPlans($db, $user_id)
{
    $plans = $db->db_fetch("SELECT * FROM setup_plans WHERE user_id = ? ORDER BY created_at ASC", [$user_id]);
    foreach ($plans as &$plan) {
        $plan['conditions'] = $db->db_fetch("SELECT id, condition_text as text, is_checked as checked FROM plan_conditions WHERE plan_id = ? ORDER BY created_at ASC", [$plan['id']]);
    }
    return $plans;
}

/**
 * Menyimpan setup plan ke database untuk pengguna tertentu.
 * @param Database $db Instance dari kelas Database.
 * @param array $plans Data setup plan yang akan disimpan.
 * @param int $user_id ID pengguna.
 * @return bool True jika berhasil, false jika gagal.
 */
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
