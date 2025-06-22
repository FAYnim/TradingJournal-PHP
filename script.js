import * as api from './js/api.js';
import * as ui from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // BAGIAN 1: Mengambil semua elemen HTML yang kita butuhkan
    // ==========================================================
    const elements = {
        // Elemen asli
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

        // Elemen baru untuk sidebar & header
        menuToggle: document.getElementById('menu-toggle'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        mainNav: document.getElementById('main-nav')
    };


    // ==========================================================
    // BAGIAN 2: Logika untuk membuka dan menutup sidebar
    // ==========================================================

    // Fungsi sederhana untuk menambah/menghapus class 'sidebar-open'
    // CSS akan menangani animasi buka-tutupnya
    function toggleSidebar() {
        document.body.classList.toggle('sidebar-open');
    }

    // Ketika tombol hamburger diklik, panggil fungsi toggleSidebar
    elements.menuToggle.addEventListener('click', toggleSidebar);

    // Ketika area gelap (overlay) diklik, panggil fungsi toggleSidebar untuk menutup
    elements.sidebarOverlay.addEventListener('click', toggleSidebar);

    // Ketika salah satu link navigasi di sidebar diklik
    elements.mainNav.addEventListener('click', (e) => {
        // Cek apakah yang diklik adalah sebuah link (tag <a>)
        if (e.target.tagName === 'A') {
            // Jika iya, langsung tutup sidebar
            toggleSidebar();
        }
    });


    // ==========================================================
    // BAGIAN 3: Logika utama aplikasi (tidak berubah)
    // ==========================================================

    // Fungsi untuk memuat semua data dari server dan menampilkannya di tabel
    async function loadJournalData() {
        elements.refreshBtn.textContent = 'Memuat...';
        try {
            const journalResponse = await fetch('/api/data');
            const allJournalData = await journalResponse.json();
            const liveTickers = await api.getAllTickers();

            const activeOrders = [];
            const archivedOrders = [];

            // Memisahkan data order aktif dan yang sudah diarsip
            allJournalData.forEach(order => {
                if (order.status === 'Open') activeOrders.push(order);
                else archivedOrders.push(order);
            });
            
            // Mengisi tabel dengan data yang sudah dipisah
            ui.populateTable(activeOrders.reverse(), elements.tableBody, liveTickers);
            ui.populateTable(archivedOrders.reverse(), elements.archiveTableBody, null);

        } catch (error) {
            console.error('Gagal memuat data jurnal:', error);
            elements.tableBody.innerHTML = '<tr><td colspan="9">Gagal memuat data.</td></tr>';
            elements.archiveTableBody.innerHTML = '<tr><td colspan="9">Gagal memuat data.</td></tr>';
        }
    }

    // Mengatur perpindahan halaman saat menu diklik
    elements.navView.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('view', elements); });
    elements.navArchive.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('archive', elements); });
    elements.navAdd.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('add', elements); });

    // Mengatur tombol refresh harga
    elements.refreshBtn.addEventListener('click', () => {
        loadJournalData();
        ui.startRefreshCooldown(elements.refreshBtn);
    });
    
    // Mengatur tombol "Selesai" dan "Batal" di dalam tabel
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

    // Mengatur form untuk menambah order baru
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

    // ==========================================================
    // BAGIAN 4: Memuat data pertama kali saat halaman dibuka
    // ==========================================================
    loadJournalData();
});
