// Mengimpor semua fungsi dari modul api.js dan ui.js.
import * as api from './js/api.js';
import * as ui from './js/ui.js';

// Menjalankan skrip setelah seluruh konten DOM (struktur HTML) selesai dimuat.
document.addEventListener('DOMContentLoaded', () => {

    // Objek untuk menyimpan semua elemen DOM yang sering digunakan agar mudah diakses.
    const elements = {
        journalForm: document.getElementById('journalForm'),
        tableBody: document.getElementById('tableBody'),
        archiveTableBody: document.getElementById('archiveTableBody'),
        navView: document.getElementById('nav-view'),
        navArchive: document.getElementById('nav-archive'),
        navAdd: document.getElementById('nav-add'),
        navStatistic: document.getElementById('nav-statistic'),
        navSetup: document.getElementById('nav-setup'),
        pageViewOrders: document.getElementById('page-view-orders'),
        pageArchiveOrders: document.getElementById('page-archive-orders'),
        pageAddOrder: document.getElementById('page-add-order'),
        pageStatistic: document.getElementById('page-statistic'),
        pageSetup: document.getElementById('page-setup'),
        refreshBtn: document.getElementById('refreshBtn'),
        menuToggle: document.getElementById('menu-toggle'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        mainNav: document.getElementById('main-nav')
    };

    // Fungsi untuk membuka atau menutup sidebar.
    function toggleSidebar() {
        // Menambah atau menghapus kelas 'sidebar-open' pada body.
        document.body.classList.toggle('sidebar-open');
    }

    // Menambahkan event listener ke tombol menu (hamburger) untuk memanggil fungsi toggleSidebar.
    elements.menuToggle.addEventListener('click', toggleSidebar);
    // Menambahkan event listener ke overlay sidebar untuk menutup sidebar saat diklik.
    elements.sidebarOverlay.addEventListener('click', toggleSidebar);

    // Menambahkan event listener pada navigasi utama.
    elements.mainNav.addEventListener('click', (e) => {
        // Jika elemen yang diklik adalah sebuah link (tag 'A').
        if (e.target.tagName === 'A') {
            // Tutup sidebar setelah link navigasi diklik (berguna di tampilan mobile).
            toggleSidebar();
        }
    });

    // Fungsi async untuk memuat data jurnal dari server.
    async function loadJournalData() {
        // Mengubah teks tombol refresh menjadi 'Memuat...' sebagai indikator.
        elements.refreshBtn.textContent = 'Memuat...';
        ui.showLoading('page-view-orders');
        ui.showLoading('page-archive-orders');
        try {
            // Mengambil data order dari endpoint /api/data.
            const journalResponse = await fetch('/api/data');
            const allJournalData = await journalResponse.json();
            // Mengambil data harga ticker terbaru dari Indodax melalui modul api.
            const liveTickers = await api.getAllTickers();

            // Memisahkan data menjadi order aktif dan order yang diarsip.
            const activeOrders = [];
            let archivedOrders = [];

            allJournalData.forEach(order => {
                if (order.status === 'Open') activeOrders.push(order);
                else archivedOrders.push(order);
            });
            
            // Tampilkan hanya 10 order arsip terakhir
            archivedOrders = archivedOrders.slice(-10);

            // Memanggil fungsi populateTable dari modul ui untuk menampilkan data di tabel.
            // Data dibalik (reverse) agar entri terbaru muncul di atas.
            ui.populateTable(activeOrders.reverse(), elements.tableBody, liveTickers);
            ui.populateTable(archivedOrders.reverse(), elements.archiveTableBody, null);

        } catch (error) {
            // Menangani error jika gagal memuat data.
            console.error('Gagal memuat data jurnal:', error);
            elements.tableBody.innerHTML = '<tr><td colspan="9">Gagal memuat data.</td></tr>';
            elements.archiveTableBody.innerHTML = '<tr><td colspan="9">Gagal memuat data.</td></tr>';
        } finally {
            ui.hideLoading('page-view-orders');
            ui.hideLoading('page-archive-orders');
        }
    }

    // Menambahkan event listener untuk setiap link navigasi untuk menampilkan halaman yang sesuai.
    elements.navView.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('view', elements); });
    elements.navArchive.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('archive', elements); });
    elements.navAdd.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('add', elements); });
    elements.navStatistic.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('statistic', elements); });
    elements.navSetup.addEventListener('click', (e) => { e.preventDefault(); ui.showPage('setup', elements); });

    // Menambahkan event listener ke tombol refresh.
    elements.refreshBtn.addEventListener('click', () => {
        loadJournalData(); // Memuat ulang data jurnal.
        ui.startRefreshCooldown(elements.refreshBtn); // Memulai cooldown pada tombol.
    });
    
    // Menambahkan event listener pada body tabel order aktif untuk menangani klik pada tombol aksi.
    elements.tableBody.addEventListener('click', async (e) => {
        // Mengecek apakah yang diklik adalah tombol dengan kelas 'action-btn'.
        if (e.target.matches('.action-btn')) {
            // Mengambil data dari atribut data-* pada tombol.
            const id = e.target.dataset.id;
            const status = e.target.dataset.status;
            const profit = e.target.dataset.profit;
            // Jika id dan status ada.
            if (id && status) {
                // Meminta konfirmasi jika statusnya adalah 'Batal'.
                if(status === 'Batal' && !confirm('Anda yakin ingin membatalkan order ini?')) return;
                
                // Memanggil fungsi updateOrderStatus dari modul api.
                const success = await api.updateOrderStatus(id, status, profit);
                // Jika update berhasil, muat ulang data jurnal untuk merefleksikan perubahan.
                if (success) loadJournalData();
            }
        }
    });

    // Menambahkan event listener untuk submit form order baru.
    elements.journalForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah perilaku default form (reload halaman).
        // Mengambil data dari form.
        const formData = new FormData(elements.journalForm);
        const data = Object.fromEntries(formData.entries());
        try {
            // Mengirim data form ke server melalui request POST.
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            // Jika respons OK (berhasil).
            if (response.ok) {
                elements.journalForm.reset(); // Mereset form.
                await loadJournalData(); // Memuat ulang data jurnal.
                ui.showPage('view', elements); // Pindah ke halaman lihat order.
            } else {
                // Jika gagal, tampilkan alert.
                alert('Gagal menyimpan data.');
            }
        } catch (error) {
            // Menangani error saat pengiriman data.
            console.error('Error saat mengirim data:', error);
        }
    });

    // Event listener untuk halaman setup
    elements.pageSetup.addEventListener('click', async (e) => {
        const plansContainer = document.getElementById('setup-plans-container');

        // Tambah Rencana Baru
        if (e.target.id === 'add-plan-btn') {
            const newPlan = {
                id: `plan-${Date.now()}`,
                title: 'Rencana Baru',
                conditions: []
            };
            const planCard = ui.createPlanCard(newPlan); // Asumsi createPlanCard ada di UI
            plansContainer.appendChild(planCard);
        }

        // Hapus Rencana
        if (e.target.classList.contains('delete-plan-btn')) {
            e.target.closest('.plan-card').remove();
        }

        // Tambah Kondisi Baru
        if (e.target.classList.contains('add-condition-btn')) {
            const newCondition = {
                id: `cond-${Date.now()}`,
                text: 'Kondisi baru',
                checked: false
            };
            const conditionList = e.target.previousElementSibling;
            const conditionItem = ui.createConditionItem(newCondition); // Asumsi createConditionItem ada di UI
            conditionList.appendChild(conditionItem);
        }

        // Hapus Kondisi
        if (e.target.classList.contains('delete-condition-btn')) {
            e.target.closest('.condition-item').remove();
        }
        
        // Simpan Semua Perubahan
        if (e.target.id === 'save-plans-btn') {
            const plans = [];
            document.querySelectorAll('.plan-card').forEach(card => {
                const plan = {
                    id: card.dataset.planId,
                    title: card.querySelector('.plan-title').value,
                    conditions: []
                };
                card.querySelectorAll('.condition-item').forEach(item => {
                    plan.conditions.push({
                        id: item.dataset.conditionId,
                        text: item.querySelector('.condition-text').value,
                        checked: item.querySelector('input[type="checkbox"]').checked
                    });
                });
                plans.push(plan);
            });

            const success = await api.saveSetupPlans(plans);
            if (success) {
                alert('Checklist rencana berhasil disimpan!');
            } else {
                alert('Gagal menyimpan checklist.');
            }
        }
    });

    // Memuat data jurnal untuk pertama kali saat halaman dimuat.
    loadJournalData();
});
