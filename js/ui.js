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

export function showPage(pageName, elements) {
    elements.pageViewOrders.classList.add('hidden');
    elements.pageArchiveOrders.classList.add('hidden');
    elements.pageAddOrder.classList.add('hidden');
    elements.navView.classList.remove('active');
    elements.navArchive.classList.remove('active');
    elements.navAdd.classList.remove('active');

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
	}
}

