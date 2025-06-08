document.addEventListener('DOMContentLoaded', function() {
    
    // ======================================================
    // PENGATURAN UTAMA
    // Ganti nilai di bawah ini dengan keyword utama Anda.
    // ======================================================
    const primaryKeyword = "home decor";


    const contentContainer = document.getElementById('auto-content-container');

    if (!contentContainer) {
        console.error("Elemen kontainer tidak ditemukan!");
        return;
    }

    /**
     * Fungsi utama untuk memulai pembuatan konten otomatis di homepage.
     * @param {string} keyword - Kata kunci utama untuk digenerate.
     */
    function generateHomePageContent(keyword) {
        if (!keyword) {
            contentContainer.innerHTML = '<div class="loading-placeholder">Keyword tidak valid.</div>';
            return;
        }

        // 1. Buat tag <script> secara dinamis untuk memanggil API Google Suggest
        const script = document.createElement('script');
        // `window.handleGoogleSuggest` adalah nama fungsi yang akan dipanggil saat data kembali
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=handleGoogleSuggest&hl=en&client=firefox&q=${encodeURIComponent(keyword)}`;
        
        // 2. Tambahkan script tersebut ke dalam <head> dokumen
        document.head.appendChild(script);

        // 3. Hapus script setelah selesai untuk kebersihan
        script.onload = () => {
            script.remove();
        };
        script.onerror = () => {
            contentContainer.innerHTML = '<div class="loading-placeholder">Gagal memuat data. Silakan coba lagi.</div>';
            script.remove();
        };
    }

    /**
     * Fungsi Callback yang akan dieksekusi oleh API Google Suggest.
     * Fungsi ini harus berada di scope global (window).
     * @param {Array} data - Data yang dikembalikan oleh Google.
     */
    window.handleGoogleSuggest = function(data) {
        const suggestions = data[1]; // suggestions adalah array of strings

        // Kosongkan kontainer dari placeholder "Loading..."
        contentContainer.innerHTML = '';

        if (suggestions.length === 0) {
            contentContainer.innerHTML = '<div class="loading-placeholder">Tidak ada inspirasi yang ditemukan untuk keyword ini.</div>';
            return;
        }

        // 4. Loop melalui setiap saran keyword dan buat kartu konten
        suggestions.forEach(term => {
            const encodedTerm = encodeURIComponent(term);
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
            // Link bisa diarahkan ke halaman pencarian internal jika ada
            suggestions.forEach(term => {
    const encodedTerm = encodeURIComponent(term);
    const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
    // UBAH BARIS DI BAWAH INI
    const linkUrl = `detail.html?q=${encodedTerm}`; // Arahkan ke detail.html

    const card = `
        <article class="content-card">
            {/* Arahkan ke linkUrl yang baru */}
            <a href="${linkUrl}"> 
                <img src="${imageUrl}" alt="${term}" loading="lazy">
                <div class="content-card-body">
                    <h3>${term}</h3>
                </div>
            </a>
        </article>
    `;
    
    contentContainer.innerHTML += card;
}); 

            const card = `
                <article class="content-card">
                    <a href="${linkUrl}">
                        <img src="${imageUrl}" alt="${term}" loading="lazy">
                        <div class="content-card-body">
                            <h3>${term}</h3>
                        </div>
                    </a>
                </article>
            `;
            
            // Tambahkan kartu ke dalam grid kontainer
            contentContainer.innerHTML += card;
        });
    };

    // Panggil fungsi utama untuk memulai proses
    generateHomePageContent(primaryKeyword);

});
