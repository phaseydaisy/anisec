



// Section grids
const trendingGrid = document.querySelector('.trending-grid');
const continueGrid = document.querySelector('.continue-grid');
const recentGrid = document.querySelector('.recent-grid');
const featuredGrid = document.querySelector('.main-grid');

const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const genreDropdown = document.querySelector('.dropdown-menu');
const genreLinks = document.querySelectorAll('.dropdown-item');

function getAnimeCard(anime) {
  return `<div class="anime-card">
    <a href="${anime.url}" target="_blank" rel="noopener">
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" style="width:100%;height:300px;object-fit:cover;border-radius:8px 8px 0 0;">
    </a>
    <div class="anime-title">${anime.title}</div>
  </div>`;
}


async function loadTrendingAnime() {
  trendingGrid.innerHTML = '<div>Loading trending anime...</div>';
  try {
    const res = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=8');
    const data = await res.json();
    trendingGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
  } catch (e) {
    trendingGrid.innerHTML = '<div>Failed to load trending anime.</div>';
  }
}

async function loadRecentAnime() {
  recentGrid.innerHTML = '<div>Loading recently added anime...</div>';
  try {
    const res = await fetch('https://api.jikan.moe/v4/seasons/now?limit=8');
    const data = await res.json();
    recentGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
  } catch (e) {
    recentGrid.innerHTML = '<div>Failed to load recently added anime.</div>';
  }
}

async function loadFeaturedAnime() {
  featuredGrid.innerHTML = '<div>Loading featured anime...</div>';
  try {
    const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=3');
    const data = await res.json();
    featuredGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
  } catch (e) {
    featuredGrid.innerHTML = '<div>Failed to load anime.</div>';
  }
}

async function loadGenreAnime(genre) {
  trendingGrid.innerHTML = '<div>Loading...</div>';
  recentGrid.innerHTML = '';
  featuredGrid.innerHTML = '';
  continueGrid.innerHTML = '';
  try {
    // Jikan genre IDs: https://docs.api.jikan.moe/#tag/genres/operation/getAnimeGenres
    const genreMap = {
      'action': 1, 'adventure': 2, 'comedy': 4, 'drama': 8, 'fantasy': 10, 'romance': 22, 'sci-fi': 24, 'sports': 30, 'slice of life': 36, 'horror': 14
    };
    const genreId = genreMap[genre.toLowerCase()];
    if (!genreId) {
      trendingGrid.innerHTML = '<div>Genre not found.</div>';
      return;
    }
    const res = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=popularity&limit=8`);
    const data = await res.json();
    trendingGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
  } catch (e) {
    trendingGrid.innerHTML = '<div>Failed to load genre anime.</div>';
  }
}

function loadContinueWatching() {
  // Placeholder: In a real app, this would use localStorage or backend
  continueGrid.innerHTML = '<div>Sign in to track your anime and continue watching!</div>';
}

async function searchAnime() {
  const query = searchInput.value.trim();
  if (!query) return;
  trendingGrid.innerHTML = '<div>Searching...</div>';
  recentGrid.innerHTML = '';
  featuredGrid.innerHTML = '';
  continueGrid.innerHTML = '';
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=15`);
    const data = await res.json();
    if (data.data.length === 0) {
      trendingGrid.innerHTML = '<div>No results found.</div>';
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
      trendingGrid.innerHTML = sorted.slice(0, 8).map(anime => getAnimeCard(anime)).join('');
    }
  } catch (e) {
    trendingGrid.innerHTML = '<div>Search failed.</div>';
  }
}


searchButton.addEventListener('click', searchAnime);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchAnime(); });

// Genre dropdown interactivity
genreLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const genre = link.getAttribute('data-genre');
    loadGenreAnime(genre);
  });
});

// Initial load
loadTrendingAnime();
loadRecentAnime();
loadFeaturedAnime();
loadContinueWatching();
