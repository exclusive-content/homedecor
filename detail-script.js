document.addEventListener('DOMContentLoaded', function() {

    // Ambil elemen-elemen dari halaman detail
    const detailTitle = document.getElementById('detail-title');
    const detailImageContainer = document.getElementById('detail-image-container');
    const detailBody = document.getElementById('detail-body');
    const relatedPostsContainer = document.getElementById('related-posts-container');

    // 1. Dapatkan keyword dari parameter URL (?q=...)
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('q');

    // Jika tidak ada keyword di URL, tampilkan pesan error
    if (!keyword) {
        detailTitle.textContent = 'Konten Tidak Ditemukan';
        detailBody.innerHTML = '<p>Maaf, kata kunci tidak ditemukan. Silakan kembali ke <a href="index.html">halaman utama</a>.</p>';
        relatedPostsContainer.style.display = 'none'; // Sembunyikan related posts
        return;
    }

    // --- FUNGSI UNTUK MENGISI KONTEN UTAMA ---
    function populateMainContent(term) {
        const decodedTerm = decodeURIComponent(term).replace(/\+/g, ' ');

        // Set judul halaman dan H1
        document.title = `${decodedTerm} | DekorInspirasi`;
        detailTitle.textContent = decodedTerm;

        // Set gambar utama dari Bing
        const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(decodedTerm)}&w=800&h=500&c=7&rs=1&p=0`;
        detailImageContainer.innerHTML = `<img src="${imageUrl}" alt="${decodedTerm}">`;

        // Buat paragraf artikel palsu
        detailBody.innerHTML = `
            <p>Selamat datang di galeri inspirasi kami yang membahas tentang <strong>${decodedTerm}</strong>. Menemukan ide yang tepat untuk ${decodedTerm} terkadang menjadi tantangan tersendiri. Di sini, kami telah mengumpulkan berbagai referensi visual terbaik untuk membantu Anda mendapatkan gambaran yang lebih jelas dan detail.</p>
            <p>Setiap detail dalam ${decodedTerm} memiliki peranan penting dalam menciptakan suasana yang Anda inginkan. Mulai dari pemilihan warna, tekstur, hingga penataan elemen, semua berkontribusi pada hasil akhir. Perhatikan bagaimana para ahli memadukan berbagai komponen untuk menghasilkan sebuah karya yang harmonis dan fungsional terkait ${decodedTerm}.</p>
            <p>Kami berharap koleksi gambar dan ide mengenai <strong>${decodedTerm}</strong> ini dapat memicu kreativitas Anda. Jangan ragu untuk menyimpan gambar yang Anda sukai sebagai referensi untuk proyek Anda selanjutnya. Selamat berkreasi!</p>
        `;
    }

    // --- FUNGSI UNTUK MENGISI RELATED POSTS ---
    function generateRelatedPosts(term) {
        // Logikanya sama persis dengan script di homepage
        const script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=handleRelatedSuggest&hl=en&client=firefox&q=${encodeURIComponent(term)}`;
        document.head.appendChild(script);
        
        script.onload = () => script.remove();
        script.onerror = () => {
            relatedPostsContainer.innerHTML = '<div class="loading-placeholder">Gagal memuat inspirasi terkait.</div>';
            script.remove();
        }
    }

    // Callback untuk related posts, harus di scope global (window)
    window.handleRelatedSuggest = function(data) {
        const suggestions = data[1];
        relatedPostsContainer.innerHTML = ''; // Kosongkan placeholder

        if (suggestions.length === 0) {
            relatedPostsContainer.style.display = 'none'; // Sembunyikan jika tidak ada
            return;
        }

        suggestions.forEach(relatedTerm => {
            if (relatedTerm.toLowerCase() === keyword.toLowerCase()) return; // Jangan tampilkan keyword yg sama

            const encodedTerm = encodeURIComponent(relatedTerm);
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
            // Link akan mengarah ke halaman detail lainnya, menciptakan loop Browse
            const linkUrl = `detail.html?q=${encodedTerm}`;

            const card = `
                <article class="content-card">
                    <a href="${linkUrl}">
                        <img src="${imageUrl}" alt="${relatedTerm}" loading="lazy">
                        <div class="content-card-body">
                            <h3>${relatedTerm}</h3>
                        </div>
                    </a>
                </article>
            `;
            relatedPostsContainer.innerHTML += card;
        });
    };

    // --- EKSEKUSI SEMUA FUNGSI ---
    populateMainContent(keyword);
    generateRelatedPosts(keyword);

});
