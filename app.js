// File Logika Utama - app.js
// Mengontrol homepage dan halaman detail secara cerdas.

document.addEventListener('DOMContentLoaded', function() {

    // ======================================================
    // FUNGSI BERSAMA (SHARED FUNCTIONS)
    // ======================================================

    /**
     * Membuat HTML untuk satu kartu konten.
     * @param {string} term - Kata kunci untuk kartu.
     * @returns {string} - String HTML untuk satu kartu.
     */
    function createCardHTML(term) {
        const encodedTerm = encodeURIComponent(term);
        const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
        const linkUrl = `detail.html?q=${encodedTerm}`;

        return `
            <article class="content-card">
                <a href="${linkUrl}">
                    <img src="${imageUrl}" alt="${term}" loading="lazy">
                    <div class="content-card-body">
                        <h3>${term}</h3>
                    </div>
                </a>
            </article>
        `;
    }

    /**
     * Mengambil data dari Google Suggest dan menampilkannya sebagai grid konten.
     * @param {string} keyword - Kata kunci untuk dicari.
     * @param {HTMLElement} container - Elemen DOM untuk menampung grid.
     */
    function generateContentGrid(keyword, container) {
        // Callback function harus unik untuk setiap pemanggilan agar tidak tumpang tindih
        const callbackName = 'handleSuggest' + new Date().getTime();

        window[callbackName] = function(data) {
            const suggestions = data[1];
            container.innerHTML = ''; // Kosongkan placeholder

            if (suggestions.length === 0) {
                container.innerHTML = '<div class="loading-placeholder">Tidak ada inspirasi ditemukan.</div>';
                return;
            }

            suggestions.forEach(term => {
                if (term.toLowerCase() === keyword.toLowerCase()) return;
                container.innerHTML += createCardHTML(term);
            });
            
            // Hapus fungsi callback setelah digunakan
            delete window[callbackName];
        };

        const script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=${callbackName}&hl=en&client=firefox&q=${encodeURIComponent(keyword)}`;
        script.onerror = () => {
            container.innerHTML = '<div class="loading-placeholder">Gagal memuat data. Periksa koneksi internet.</div>';
            delete window[callbackName];
        };
        document.head.appendChild(script).remove();
    }

    /**
     * Membuat menu navigasi dari file config.js.
     * @param {string} activeKeyword - Keyword yang sedang aktif (untuk styling).
     */
    function generateNav(activeKeyword = '') {
        const navContainer = document.getElementById('main-nav');
        let navHTML = '<ul>';
        AppConfig.keywords.forEach(keyword => {
            const isActive = keyword.toLowerCase() === activeKeyword.toLowerCase() ? 'class="active"' : '';
            navHTML += `<li><a href="detail.html?q=${encodeURIComponent(keyword)}" ${isActive}>${keyword}</a></li>`;
        });
        navHTML += '</ul>';
        navContainer.innerHTML = navHTML;
    }
    
    /**
     * Mengisi elemen-elemen umum seperti nama situs dan footer.
     */
     function populateCommonElements() {
        document.getElementById('site-name-logo').textContent = AppConfig.siteName;
        document.getElementById('main-footer').innerHTML = `<div class="container"><p>${AppConfig.footerText}</p></div>`;
     }


    // ======================================================
    // LOGIKA SPESIFIK PER HALAMAN (ROUTER)
    // ======================================================
    
    populateCommonElements();

    // Cek apakah ini HOMEPAGE
    if (document.getElementById('homepage-content-container')) {
        const homepageKeyword = AppConfig.keywords[0]; // Ambil keyword pertama sebagai default
        
        // Isi SEO dan Hero Section
        document.title = `${AppConfig.siteName} | ${AppConfig.homepage.title}`;
        document.querySelector('meta[name="description"]').setAttribute('content', AppConfig.homepage.description);
        document.getElementById('hero-title').textContent = homepageKeyword;
        document.getElementById('hero-description').textContent = AppConfig.homepage.description;

        generateNav(homepageKeyword);
        generateContentGrid(homepageKeyword, document.getElementById('homepage-content-container'));
    }

    // Cek apakah ini HALAMAN DETAIL
    else if (document.getElementById('detail-title')) {
        const params = new URLSearchParams(window.location.search);
        const keyword = params.get('q');

        if (!keyword) {
            document.getElementById('detail-title').textContent = 'Konten Tidak Ditemukan';
            return;
        }

        const decodedKeyword = decodeURIComponent(keyword).replace(/\+/g, ' ');
        
        // Isi Konten Utama
        document.title = `${decodedKeyword} | ${AppConfig.siteName}`;
        document.getElementById('detail-title').textContent = decodedKeyword;
        
        const mainImageUrl = `https://tse1.mm.bing.net/th?q=${keyword}&w=800&h=500&c=7&rs=1&p=0`;
        document.getElementById('detail-image-container').innerHTML = `<img src="${mainImageUrl}" alt="${decodedKeyword}">`;
        
        document.getElementById('detail-body').innerHTML = `
            <p>Selamat datang di galeri inspirasi kami yang membahas tentang <strong>${decodedKeyword}</strong>. Menemukan ide yang tepat untuk ${decodedKeyword} terkadang menjadi tantangan tersendiri. Di sini, kami telah mengumpulkan berbagai referensi visual terbaik untuk membantu Anda mendapatkan gambaran yang lebih jelas dan detail.</p>
            <p>Setiap detail dalam ${decodedKeyword} memiliki peranan penting dalam menciptakan suasana yang Anda inginkan. Mulai dari pemilihan warna, tekstur, hingga penataan elemen, semua berkontribusi pada hasil akhir. Perhatikan bagaimana para ahli memadukan berbagai komponen untuk menghasilkan sebuah karya yang harmonis dan fungsional terkait ${decodedKeyword}.</p>
        `;
        
        generateNav(decodedKeyword);
        generateContentGrid(keyword, document.getElementById('related-posts-container'));
    }
});
