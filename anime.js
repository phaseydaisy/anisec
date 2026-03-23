


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
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=3`);
    const data = await res.json();
    if (data.data.length === 0) {
      animeGrid.innerHTML = '<div>No results found.</div>';
    } else {
      animeGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
    }
  } catch (e) {
    animeGrid.innerHTML = '<div>Search failed.</div>';
  }
}

searchButton.addEventListener('click', searchAnime);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchAnime(); });

loadFeaturedAnime();
