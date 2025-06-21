import * as api from './js/api.js';
import * as ui from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => {

    const elements = {
        journalForm: document.getElementById('journalForm'),
        tableBody: document.getElementById('tableBody'),
        archiveTableBody: document.getElementById('archiveTableBody'),
        navView: document.getElementById('nav-view'),
        navArchive: document.getElementById('nav-archive'),
        navAdd: document.getElementById('nav-add'),
        pageViewOrders: document.getElementById('page-view-orders'),
        pageArchiveOrders: document.getElementById('page-archive-orders'),
        pageAddOrder: document.getElementById('page-add-order'),
        refreshBtn: document.getElementById('refreshBtn'),
    };

    async function loadJournalData() {
        elements.refreshBtn.textContent = 'Memuat...';
        try {
            const journalResponse = await fetch('/api/data');
            const allJournalData = await journalResponse.json();
            const liveTickers = await api.getAllTickers();

            const activeOrders = [];
            const archivedOrders = [];

            allJournalData.forEach(order => {
                if (order.status === 'Open') activeOrders.push(order);
                else archivedOrders.push(order);
            });
            
            ui.populateTable(activeOrders.reverse(), elements.tableBody, liveTickers);
            ui.populateTable(archivedOrders.reverse(), elements.archiveTableBody, null);

        } catch (error) {
            console.error('Gagal memuat data jurnal:', error);
            elements.tableBody.innerHTML = '<tr><td colspan="9">Gagal memuat data.</td></tr>';
            elements.archiveTableBody.innerHTML = '<tr><td colspan="9">Gagal memuat data.</td></tr>';
        }
    }

    elements.navView.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('view', elements); });
    elements.navArchive.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('archive', elements); });
    elements.navAdd.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('add', elements); });

    elements.refreshBtn.addEventListener('click', () => {
        loadJournalData();
        ui.startRefreshCooldown(elements.refreshBtn);
    });
    
    elements.tableBody.addEventListener('click', async (e) => {
        if (e.target.matches('.action-btn')) {
            const id = e.target.dataset.id;
            const status = e.target.dataset.status;
            const profit = e.target.dataset.profit;
            if (id && status) {
                if(status === 'Batal' && !confirm('Anda yakin ingin membatalkan order ini?')) return;
                
                const success = await api.updateOrderStatus(id, status, profit);
                if (success) loadJournalData();
            }
        }
    });

    elements.journalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(elements.journalForm);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                elements.journalForm.reset();
                await loadJournalData();
                ui.showPage('view', elements);
            } else {
                alert('Gagal menyimpan data.');
            }
        } catch (error) {
            console.error('Error saat mengirim data:', error);
        }
    });

    loadJournalData();
});
