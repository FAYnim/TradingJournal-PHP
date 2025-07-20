// =================================================================================
// script.js
//
// File JavaScript utama untuk halaman dashboard Jurnal Trading.
// File ini bertanggung jawab untuk:
// 1.  Mengelola navigasi dan tampilan antar halaman (View, Add, Statistic, Setup).
// 2.  Mengambil (fetch) dan mengirim data ke backend (dashboard.php) via AJAX.
// 3.  Memuat dan menampilkan data order trading (aktif dan arsip) secara dinamis.
// 4.  Menangani interaksi pengguna seperti menambah order, mengubah status, dan me-refresh data.
// 5.  Memuat dan menampilkan data statistik dalam bentuk kartu dan diagram lingkaran (pie chart).
// 6.  Mengelola fungsionalitas untuk membuat, menyimpan, dan mengubah checklist rencana trading.
// 7.  Mengontrol elemen UI seperti sidebar, tombol refresh, dan formulir.
//
// Menggunakan: jQuery untuk manipulasi DOM dan AJAX, Chart.js untuk diagram.
// =================================================================================

$(document).ready(function() {
    // --- Globals ---
    let statisticChart = null;

    // --- Element Cache ---
    const elements = {
        $navLinks: $('#main-nav a'),
        $pages: $('.page-content'),
        $journalForm: $('#journalForm'),
        $tableBody: $('#tableBody'),
        $archiveTableBody: $('#archiveTableBody'),
        $refreshBtn: $('#refreshBtn'),
        $menuToggle: $('#menu-toggle'),
        $sidebarOverlay: $('#sidebar-overlay'),
        $statisticCardsWrapper: $('.statistic-cards-wrapper'),
        $statisticPieChart: $('#statisticPieChart'),
        $setupPlansContainer: $('#setup-plans-container'),
    };

    // --- API Abstraction (using jQuery AJAX) ---
    const api = {
        _ajax: function(action, method, data) {
            return $.ajax({
                url: `dashboard.php?action=${action}`,
                type: method,
                contentType: 'application/json',
                data: data ? JSON.stringify(data) : null,
                dataType: 'json'
            });
        },
        getData: function() { return this._ajax('getData', 'GET'); },
        getStatistics: function() { return this._ajax('getStatistics', 'GET'); },
        addOrder: function(data) { return this._ajax('addOrder', 'POST', data); },
        updateStatus: function(id, status, profit) { return this._ajax('updateStatus', 'POST', { id, status, final_profit: profit }); },
        getSetupPlans: function() { return this._ajax('getSetupPlans', 'GET'); },
        saveSetupPlans: function(plans) { return this._ajax('saveSetupPlans', 'POST', plans); },
        getTickers: function() { return this._ajax('getTickers', 'GET'); }
    };

    // --- UI Functions ---
    const ui = {
        showPage: function(pageId) {
            elements.$pages.addClass('hidden');
            $(`#page-${pageId}`).removeClass('hidden');
            elements.$navLinks.removeClass('active');
            $(`#nav-${pageId}`).addClass('active');

            if (pageId === 'statistic') this.loadStatistics();
            if (pageId === 'setup') this.loadSetupPlans();
        },

        toggleSidebar: function() {
            $('body').toggleClass('sidebar-open');
        },

        startRefreshCooldown: function() {
            let secondsLeft = 30;
            elements.$refreshBtn.prop('disabled', true);
            const interval = setInterval(() => {
                elements.$refreshBtn.html(`<i class="fas fa-sync-alt"></i> Tunggu ${--secondsLeft}s`);
                if (secondsLeft <= 0) {
                    clearInterval(interval);
                    elements.$refreshBtn.prop('disabled', false).html('<i class="fas fa-sync-alt"></i> Refresh Harga');
                }
            }, 1000);
        },

        populateTable: function($tableBody, dataArray, liveTickers) {
            $tableBody.empty();
            if (dataArray.length === 0) {
                $tableBody.html('<tr><td colspan="9">Tidak ada data.</td></tr>');
                return;
            }
            dataArray.forEach(entry => {
                const formattedDate = new Date(entry.created_at).toLocaleString('id-ID');
                const shortId = entry.id;
                const statusClass = `status-${entry.status.toLowerCase()}`;
                const statusHTML = `<span class="status-badge ${statusClass}">${entry.status}</span>`;
                const priceHTML = `<div class="price-stack"><div class="price-item price-entry">E: ${parseFloat(entry.entry_price).toLocaleString('id-ID')}</div><div class="price-item price-tp">TP: ${parseFloat(entry.take_profit).toLocaleString('id-ID')}</div><div class="price-item price-sl">SL: ${parseFloat(entry.stop_loss).toLocaleString('id-ID')}</div></div>`;
                
                let profitCellHTML = 'N/A';
                let liveProfitPercentage = null;

                if (entry.final_profit_percent !== null) {
                    const savedProfit = parseFloat(entry.final_profit_percent);
                    profitCellHTML = `<span class="${savedProfit >= 0 ? 'profit' : 'loss'}">${savedProfit.toFixed(2)}%</span>`;
                } else if (entry.status === 'Open' && liveTickers) {
                    const apiPair = entry.pair.toLowerCase().replace('idr', '_idr');
                    const ticker = liveTickers[apiPair];
                    if (ticker) {
                        const percentage = (entry.order_type === 'Long')
                            ? ((ticker.last - entry.entry_price) / entry.entry_price) * 100
                            : ((entry.entry_price - ticker.last) / entry.entry_price) * 100;
                        liveProfitPercentage = percentage;
                        profitCellHTML = `<span class="${percentage >= 0 ? 'profit' : 'loss'}">${percentage.toFixed(2)}%</span>`;
                    }
                }

                const actionHTML = entry.status === 'Open'
                    ? `<div class="action-buttons"><button class="action-btn btn-selesai" data-id="${entry.id}" data-status="Selesai" data-profit="${liveProfitPercentage}"><i class="fas fa-check"></i></button><button class="action-btn btn-batal" data-id="${entry.id}" data-status="Batal"><i class="fas fa-times"></i></button></div>`
                    : '';

                $tableBody.append(`<tr><td>${shortId}</td><td>${formattedDate}</td><td>${entry.pair}</td><td>${entry.order_type}</td><td>${statusHTML}</td><td>${priceHTML}</td><td>${entry.timeframe}</td><td>${profitCellHTML}</td><td>${actionHTML}</td></tr>`);
            });
        },

        loadStatistics: function() {
            api.getStatistics().done(data => {
                const summary = data.summary;
                elements.$statisticCardsWrapper.html(`
                    <div class="statistic-card"><h3>Total Profit</h3><p class="value ${summary.totalProfit >= 0 ? 'profit' : 'loss'}">${summary.totalProfit.toFixed(2)}%</p></div>
                    <div class="statistic-card"><h3>Win Rate</h3><p class="value">${summary.winRate.toFixed(2)}%</p><p>(${summary.wins} menang dari ${summary.totalTrades} trade)</p></div>
                    <div class="statistic-card"><h3>Avg. Profit / Loss</h3><p><span class="profit">${summary.avgWin.toFixed(2)}%</span> / <span class="loss">${summary.avgLoss.toFixed(2)}%</span></p></div>
                `);
                
                if (statisticChart) statisticChart.destroy();
                statisticChart = new Chart(elements.$statisticPieChart[0].getContext('2d'), {
                    type: 'pie',
                    data: { labels: ['Wins', 'Losses', 'Batal'], datasets: [{ data: [summary.wins, summary.losses, summary.batal], backgroundColor: ['#4CAF50', '#f44336', '#757575'], borderWidth: 1 }] },
                    options: { responsive: true, plugins: { legend: { position: 'top' } } }
                });
            }).fail(() => elements.$statisticCardsWrapper.html('<p>Gagal memuat data statistik.</p>'));
        },

        loadSetupPlans: function() {
            api.getSetupPlans().done(plans => {
                elements.$setupPlansContainer.empty();
                if (plans.length === 0) {
                    elements.$setupPlansContainer.html('<p>Belum ada rencana.</p>');
                    return;
                }
                plans.forEach(plan => elements.$setupPlansContainer.append(this.createPlanCard(plan)));
            });
        },

        createPlanCard: function(plan) {
            const conditionsHTML = plan.conditions.map(cond => this.createConditionItem(cond)).join('');
            return `<div class="plan-card">
                        <div class="plan-header"><input type="text" class="plan-title" value="${plan.title}"><button class="delete-plan-btn"><i class="fas fa-trash-alt"></i></button></div>
                        <div class="plan-body"><ul class="condition-list">${conditionsHTML}</ul><button class="add-condition-btn"><i class="fas fa-plus"></i> Tambah Kondisi</button></div>
                    </div>`;
        },

        createConditionItem: function(condition) {
            return `<li class="condition-item">
                        <input type="checkbox" ${condition.checked ? 'checked' : ''}>
                        <input type="text" class="condition-text" value="${condition.text}">
                        <button class="delete-condition-btn"><i class="fas fa-times"></i></button>
                    </li>`;
        }
    };

    // --- Main Logic ---
    function loadJournalData() {
        elements.$refreshBtn.html('<i class="fas fa-sync-alt fa-spin"></i> Memuat...').prop('disabled', true);
        
        $.when(api.getData(), api.getTickers()).done(function(journalRes, tickerRes) {
            const allJournalData = journalRes[0];
            const liveTickers = tickerRes[0].tickers;

            const activeOrders = allJournalData.filter(o => o.status === 'Open').reverse();
            const archivedOrders = allJournalData.filter(o => o.status !== 'Open').slice(-10).reverse();

            ui.populateTable(elements.$tableBody, activeOrders, liveTickers);
            ui.populateTable(elements.$archiveTableBody, archivedOrders, null);

        }).fail(function() {
            elements.$tableBody.html('<tr><td colspan="9">Gagal memuat data.</td></tr>');
        }).always(function() {
            elements.$refreshBtn.prop('disabled', false).html('<i class="fas fa-sync-alt"></i> Refresh Harga');
        });
    }

    // --- Event Handlers ---
    elements.$navLinks.on('click', function(e) {
        e.preventDefault();
        const pageId = $(this).data('page'); // Use data-page attribute
        ui.showPage(pageId);
        if (window.innerWidth <= 768) ui.toggleSidebar();
    });

    elements.$menuToggle.on('click', ui.toggleSidebar);
    elements.$sidebarOverlay.on('click', ui.toggleSidebar);
    elements.$refreshBtn.on('click', function() {
        loadJournalData();
        ui.startRefreshCooldown();
    });

    elements.$journalForm.on('submit', function(e) {
        e.preventDefault();
        const formData = $(this).serializeArray();
        const data = {};
        formData.forEach(item => data[item.name] = item.value);
        
        api.addOrder(data).done(() => {
            this.reset();
            loadJournalData();
            ui.showPage('view-orders'); // Corrected page ID
        }).fail(() => alert('Gagal menyimpan data.'));
    });

    $('#page-view-orders').on('click', '.action-btn', function() {
        const $btn = $(this);
        const id = $btn.data('id');
        const status = $btn.data('status');
        const profit = $btn.data('profit');

        if (status === 'Batal' && !confirm('Anda yakin ingin membatalkan order ini?')) return;

        api.updateStatus(id, status, profit).done(() => {
            loadJournalData();
        }).fail(() => alert('Gagal memperbarui status.'));
    });

    // Setup Page Delegated Events
    $('#page-setup').on('click', '#add-plan-btn', function() {
        const newPlan = { id: `plan-${Date.now()}`, title: 'Rencana Baru', conditions: [] };
        elements.$setupPlansContainer.append(ui.createPlanCard(newPlan));
    }).on('click', '.delete-plan-btn', function() {
        $(this).closest('.plan-card').remove();
    }).on('click', '.add-condition-btn', function() {
        const newCondition = { id: `cond-${Date.now()}`, text: 'Kondisi baru', checked: false };
        $(this).siblings('.condition-list').append(ui.createConditionItem(newCondition));
    }).on('click', '.delete-condition-btn', function() {
        $(this).closest('.condition-item').remove();
    }).on('click', '#save-plans-btn', function() {
        const plans = [];
        $('.plan-card').each(function() {
            const $card = $(this);
            const plan = { title: $card.find('.plan-title').val(), conditions: [] };
            $card.find('.condition-item').each(function() {
                const $item = $(this);
                plan.conditions.push({ text: $item.find('.condition-text').val(), checked: $item.find('input[type="checkbox"]').is(':checked') });
            });
            plans.push(plan);
        });
        api.saveSetupPlans(plans).done(() => alert('Checklist berhasil disimpan!')).fail(() => alert('Gagal menyimpan checklist.'));
    });

    // --- Initial Load ---
    loadJournalData();
});