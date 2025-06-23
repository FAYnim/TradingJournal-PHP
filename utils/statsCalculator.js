function calculatePortfolioStats(orders) {
    const summary = {
        totalTrades: 0, wins: 0, losses: 0, batal: 0,
        totalProfit: 0, winRate: 0, avgWin: 0, avgLoss: 0
    };
    let totalWinProfit = 0, totalLossProfit = 0;

    for (const order of orders) {
        if (order.status === 'Selesai') {
            const profit = parseFloat(order.final_profit);
            if (isNaN(profit)) continue;
            summary.totalProfit += profit;
            if (profit >= 0) {
                summary.wins++;
                totalWinProfit += profit;
            } else {
                summary.losses++;
                totalLossProfit += profit;
            }
        } else if (order.status === 'Batal') {
            summary.batal++;
        }
    }

    summary.totalTrades = summary.wins + summary.losses;
    if (summary.totalTrades > 0) summary.winRate = (summary.wins / summary.totalTrades) * 100;
    if (summary.wins > 0) summary.avgWin = totalWinProfit / summary.wins;
    if (summary.losses > 0) summary.avgLoss = totalLossProfit / summary.losses;

    return { summary };
}

// Ekspor fungsi agar bisa di-import di file lain
module.exports = {
    calculatePortfolioStats
};
