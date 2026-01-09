const API_BASE =
    location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://wikirankingonline-production.up.railway.app';

async function loadRanking() {
    const res = await fetch(`${API_BASE}/api/ranking/top10`);
    const data = await res.json();

    const container = document.getElementById('rankingList');
    container.innerHTML = '';

    data.forEach((person, index) => {
        const div = document.createElement('div');
        div.className = 'rankingItem';

        div.innerHTML = `
            <span class="rank">${index + 1}.</span>
            <img src="${person.image_url}" alt="${person.name}">
            <span class="name">${person.name}</span>
            <span class="rating">${person.rating}</span>
        `;

        container.appendChild(div);
    });
}

loadRanking();
