// Di dalam file script.js (untuk homepage)

// ... (kode lainnya)

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

// ... (kode lainnya)
