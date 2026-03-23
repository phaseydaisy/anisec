


const animeGrid = document.querySelector('.anime-grid');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

function getAnimeCard(anime) {
  return `<div class="anime-card">
    <a href="${anime.url}" target="_blank" rel="noopener">
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" style="width:100%;height:300px;object-fit:cover;border-radius:8px 8px 0 0;">
    </a>
    <div class="anime-title">${anime.title}</div>
  </div>`;
}

async function loadFeaturedAnime() {
  animeGrid.innerHTML = '<div>Loading featured anime...</div>';
  try {
    const res = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=3');
    const data = await res.json();
    animeGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
  } catch (e) {
    animeGrid.innerHTML = '<div>Failed to load anime.</div>';
  }
}

async function searchAnime() {
  const query = searchInput.value.trim();
  if (!query) return;
  animeGrid.innerHTML = '<div>Searching...</div>';
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=15`);
    const data = await res.json();
    if (data.data.length === 0) {
      animeGrid.innerHTML = '<div>No results found.</div>';
    } else {
      // Sort by relevancy: exact title match > startsWith > includes > popularity > score
      const q = query.toLowerCase();
      const sorted = data.data.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle === q && bTitle !== q) return -1;
        if (bTitle === q && aTitle !== q) return 1;
        if (aTitle.startsWith(q) && !bTitle.startsWith(q)) return -1;
        if (bTitle.startsWith(q) && !aTitle.startsWith(q)) return 1;
        if (aTitle.includes(q) && !bTitle.includes(q)) return -1;
        if (bTitle.includes(q) && !aTitle.includes(q)) return 1;
        if (b.members !== a.members) return b.members - a.members;
        return (b.score || 0) - (a.score || 0);
      });
      animeGrid.innerHTML = sorted.slice(0, 6).map(anime => getAnimeCard(anime)).join('');
    }
  } catch (e) {
    animeGrid.innerHTML = '<div>Search failed.</div>';
  }
}

searchButton.addEventListener('click', searchAnime);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchAnime(); });

loadFeaturedAnime();
