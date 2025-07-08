<?php

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
        if (isset($order->status) && $order->status === 'Selesai') {
            $profit = isset($order->final_profit) ? (float)$order->final_profit : 0;
            if (is_nan($profit)) continue;

            $summary['totalProfit'] += $profit;
            if ($profit >= 0) {
                $summary['wins']++;
                $totalWinProfit += $profit;
            } else {
                $summary['losses']++;
                $totalLossProfit += $profit;
            }
        } elseif (isset($order->status) && $order->status === 'Batal') {
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
