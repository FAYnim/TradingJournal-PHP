// script.js

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
        mainNav: document.getElementById('main-nav'),

        // ===== TAMBAHKAN ELEMEN PORTOFOLIO DI SINI =====
        navPortfolio: document.getElementById('nav-portofolio'),
        pagePortfolio: document.getElementById('page-portfolio')
    };

    // ==========================================================
    // BAGIAN 2: Logika untuk membuka dan menutup sidebar
    // ==========================================================
    
    // ... (kode di bagian ini tidak ada perubahan) ...
    function toggleSidebar() {
        document.body.classList.toggle('sidebar-open');
    }
    elements.menuToggle.addEventListener('click', toggleSidebar);
    elements.sidebarOverlay.addEventListener('click', toggleSidebar);
    elements.mainNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            toggleSidebar();
        }
    });

    // ==========================================================
    // BAGIAN 3: Logika utama aplikasi
    // ==========================================================

    // ... (kode fungsi loadJournalData tidak ada perubahan) ...
    async function loadJournalData() { /* ... */ }

    // Mengatur perpindahan halaman saat menu diklik
    elements.navView.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('view', elements); });
    elements.navArchive.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('archive', elements); });
    elements.navAdd.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('add', elements); });
    // ===== TAMBAHKAN EVENT LISTENER PORTOFOLIO DI SINI =====
    elements.navPortfolio.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('portfolio', elements); });


    // ... (sisa kode tidak ada perubahan) ...

    // ==========================================================
    // BAGIAN 4: Memuat data pertama kali saat halaman dibuka
    // ==========================================================
    loadJournalData();
});
