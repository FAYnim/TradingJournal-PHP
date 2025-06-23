import * as api from './api.js';

let portfolioChart = null;

export function displayPortfolioData(data) {
    const wrapper = document.querySelector('.portofolio-wrapper');
    const chartCanvas = document.getElementById('portfolioPieChart');
    if (!wrapper || !chartCanvas) return;

    const summary = data.summary;
    wrapper.innerHTML = `
        <div class="portfolio-card">
            <h3>Total Profit</h3>
            <p class="value ${summary.totalProfit >= 0 ? 'profit' : 'loss'}">${summary.totalProfit.toFixed(2)}%</p>
        </div>
        <div class="portfolio-card">
            <h3>Win Rate</h3>
            <p class="value">${summary.winRate.toFixed(2)}%</p>
            <p>(${summary.wins} menang dari ${summary.wins + summary.losses} trade)</p>
        </div>
        <div class="portfolio-card">
            <h3>Avg. Profit / Loss</h3>
            <p><span class="profit">${summary.avgWin}%</span> / <span class="loss">${summary.avgLoss}%</span></p>
        </div>
    `;

    const ctx = chartCanvas.getContext('2d');
    
    if (portfolioChart) {
        portfolioChart.destroy();
    }
    
    portfolioChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Wins', 'Losses', 'Batal'],
            datasets: [{
                label: 'Hasil Trade',
                data: [summary.wins, summary.losses, summary.batal],
                backgroundColor: [
                    '#4CAF50',
                    '#f44336',
                    '#757575'
                ],
                borderColor: '#2c2c2c',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#e0e0e0'
                    }
                },
                title: {
                    display: true,
                    text: 'Distribusi Hasil Trade',
                    color: '#fff',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

export function populateTable(dataArray, targetTableBody, liveTickers) {
    targetTableBody.innerHTML = '';
    dataArray.forEach(entry => {
        const row = document.createElement('tr');
        const formattedDate = new Date(entry.timestamp).toLocaleString('id-ID');
        const shortId = entry.id ? entry.id.split('-')[0] : 'Lama';
        const status = entry.status || 'Open';
        const statusClass = `status-${status.toLowerCase()}`;
        const statusHTML = `<span class="status-badge ${statusClass}">${status}</span>`;
        
        const entryPriceF = parseFloat(entry.entry).toLocaleString('id-ID');
        const tpPriceF = parseFloat(entry.takeProfit).toLocaleString('id-ID');
        const slPriceF = parseFloat(entry.stopLoss).toLocaleString('id-ID');
        const priceHTML = `<div class="price-stack"><div class="price-item price-entry">E: ${entryPriceF}</div><div class="price-item price-tp">TP: ${tpPriceF}</div><div class="price-item price-sl">SL: ${slPriceF}</div></div>`;

        let profitCellHTML = 'N/A';
        let liveProfitPercentage = null;

        if (entry.final_profit !== undefined) {
            const savedProfit = parseFloat(entry.final_profit);
            const colorClass = savedProfit >= 0 ? 'profit' : 'loss';
            profitCellHTML = `<span class="${colorClass}">${savedProfit.toFixed(2)}%</span>`;
        } else if (status === 'Open' && liveTickers) {
            const apiPair = entry.pair.toLowerCase().replace('idr', '_idr');
            const currentTicker = liveTickers[apiPair];
            if (currentTicker) {
                const entryPrice = parseFloat(entry.entry);
                const livePrice = parseFloat(currentTicker.last);
                let percentage = 0;
                if (entry.duration === 'Long') {
                    percentage = ((livePrice - entryPrice) / entryPrice) * 100;
                } else {
                    percentage = ((entryPrice - livePrice) / entryPrice) * 100;
                }
                liveProfitPercentage = percentage;
                const colorClass = percentage >= 0 ? 'profit' : 'loss';
                profitCellHTML = `<span class="${colorClass}">${percentage.toFixed(2)}%</span>`;
            }
        }

        let actionHTML = '';
        if (status === 'Open') {
            actionHTML = `<div class="action-buttons"><button class="action-btn btn-selesai" data-id="${entry.id}" data-status="Selesai" data-profit="${liveProfitPercentage}">Selesai</button><button class="action-btn btn-batal" data-id="${entry.id}" data-status="Batal" data-profit="${liveProfitPercentage}">Batal</button></div>`;
        }
        
        row.innerHTML = `<td>${shortId}</td><td>${formattedDate}</td><td>${entry.pair}</td><td>${entry.duration}</td><td>${statusHTML}</td><td>${priceHTML}</td><td>${entry.timeframe}</td><td>${profitCellHTML}</td><td>${actionHTML}</td>`;
        targetTableBody.appendChild(row);
    });
}

export function startRefreshCooldown(refreshBtn) {
    let secondsLeft = 30;
    refreshBtn.disabled = true;
    const countdownInterval = setInterval(() => {
        secondsLeft--;
        refreshBtn.textContent = `Tunggu ${secondsLeft}s`;
        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            refreshBtn.disabled = false;
            refreshBtn.textContent = 'Refresh Harga';
        }
    }, 1000);
}

export async function showPage(pageName, elements) {
    elements.pageViewOrders.classList.add('hidden');
    elements.pageArchiveOrders.classList.add('hidden');
    elements.pageAddOrder.classList.add('hidden');
    elements.pagePortfolio.classList.add('hidden');

    elements.navView.classList.remove('active');
    elements.navArchive.classList.remove('active');
    elements.navAdd.classList.remove('active');
    elements.navPortfolio.classList.remove('active');

    if (pageName === 'view') {
        elements.pageViewOrders.classList.remove('hidden');
        elements.navView.classList.add('active');
    } else if (pageName === 'archive') {
        elements.pageArchiveOrders.classList.remove('hidden');
        elements.navArchive.classList.add('active');
    } else if (pageName === 'add') {
        elements.pageAddOrder.classList.remove('hidden');
        elements.navAdd.classList.add('active');
    } else if (pageName === 'portfolio') {
        elements.pagePortfolio.classList.remove('hidden');
        elements.navPortfolio.classList.add('active');

        const portfolioData = await api.getPortfolioData();
        if (portfolioData) {
            displayPortfolioData(portfolioData);
        } else {
            document.querySelector('.portofolio-wrapper').innerHTML = 
                '<p>Gagal memuat data portofolio.</p>';
        }
    }
}
