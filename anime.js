const trendingGrid = document.querySelector('.trending-grid');
const continueGrid = document.querySelector('.continue-grid');
const recentGrid = document.querySelector('.recent-grid');
const featuredGrid = document.querySelector('.main-grid');
const seasonalGrid = document.querySelector('.seasonal-grid');
const topAiringGrid = document.querySelector('.top-airing-grid');
const topMoviesGrid = document.querySelector('.top-movies-grid');
const topOngoingGrid = document.querySelector('.top-ongoing-grid');

const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const genreDropdown = document.querySelector('.dropdown-menu');
const genreLinks = document.querySelectorAll('.dropdown-item');
const homeBtn = document.querySelector('a[href="#home"]');


function getAnimeCard(anime) {
  return `<div class="anime-card" data-anime-title="${encodeURIComponent(anime.title)}" data-anime-id="${anime.mal_id}" data-anime-image="${anime.images.jpg.image_url}">
    <img src="${anime.images.jpg.image_url}" alt="${anime.title}" style="width:100%;height:300px;object-fit:cover;border-radius:8px 8px 0 0;">
    <div class="anime-title">${anime.title}</div>
  </div>`;
}

const playerModal = document.getElementById('player-modal');
const playerModalClose = playerModal?.querySelector('.player-modal-close');
const playerModalTitle = playerModal?.querySelector('.player-modal-title');
const playerEpisodeSelect = playerModal?.querySelector('.player-episode-select');
const playerVideo = playerModal?.querySelector('.player-video');
const playerSource = playerVideo?.querySelector('source');
const playerError = playerModal?.querySelector('.player-modal-error');
let currentAnime = null;
let currentEpisodes = [];
let currentProvider = null;

function openPlayerModal(anime) {
  playerModalTitle.textContent = anime.title;
  playerError.style.display = 'none';
  playerEpisodeSelect.innerHTML = '<option>Loading...</option>';
  playerVideo.style.display = 'none';
  playerVideo.pause();
  playerSource.src = '';
  playerVideo.load();
  playerModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  fetchEpisodesWithFallback(anime.title)
}

function closePlayerModal() {
  playerModal.style.display = 'none';
  document.body.style.overflow = '';
  playerVideo.pause();
  playerSource.src = '';
  playerVideo.load();
}

if (playerModalClose) playerModalClose.onclick = closePlayerModal;
if (playerModal) playerModal.onclick = e => { if (e.target === playerModal) closePlayerModal(); };

async function fetchEpisodesWithFallback(title) {
  let result = null;
  let provider = null;
  try {
    result = await fetchVideasyEpisodes(title);
    provider = 'videasy';
    if (!result || !result.episodes?.length) throw new Error('No Videasy');
  } catch {
    try {
      result = await fetchVidsrcEpisodes(title);
      provider = 'vidsrc';
      if (!result || !result.episodes?.length) throw new Error('No Vidsrc');
    } catch {
      playerEpisodeSelect.innerHTML = '<option>No episodes found</option>';
      playerError.textContent = 'No streaming sources found for this anime.';
      playerError.style.display = 'block';
      return;
    }
  }
  currentEpisodes = result.episodes;
  currentProvider = provider;
  playerEpisodeSelect.innerHTML = '';
  for (let i = 0; i < currentEpisodes.length; i++) {
    const ep = currentEpisodes[i];
    playerEpisodeSelect.innerHTML += `<option value="${i}">Episode ${ep.number || i+1}</option>`;
  }
  playerEpisodeSelect.onchange = () => playEpisode(playerEpisodeSelect.value);
  playEpisode(0);
}

async function playEpisode(idx) {
  idx = parseInt(idx);
  const ep = currentEpisodes[idx];
  playerError.style.display = 'none';
  playerVideo.style.display = 'none';
  playerVideo.pause();
  playerSource.src = '';
  playerVideo.load();
  let streamUrl = '';
  try {
    if (currentProvider === 'videasy') {
      streamUrl = await fetchVideasyStream(ep.id);
    } else if (currentProvider === 'vidsrc') {
      streamUrl = await fetchVidsrcStream(ep.id);
    }
    if (!streamUrl) throw new Error('No stream');
    playerSource.src = streamUrl;
    playerVideo.load();
    playerVideo.style.display = 'block';
    playerVideo.play();
  } catch {
    playerError.textContent = 'Failed to load stream for this episode.';
    playerError.style.display = 'block';
  }
}


async function fetchVideasyEpisodes(title) {
    const res = await fetch(`https://api.videasy.pro/anime/search?query=${encodeURIComponent(title)}`);
  const data = await res.json();
  if (!data || !data.results?.length) return { episodes: [] };
  // Assume first result is the anime, and it has an id
  const animeId = data.results[0].id;
  const epRes = await fetch(`https://api.videasy.pro/anime/${animeId}/episodes`);
  const epData = await epRes.json();
  if (!epData || !epData.episodes) return { episodes: [] };
  return { episodes: epData.episodes.map(ep => ({ id: ep.id, number: ep.number })) };
}
async function fetchVideasyStream(epId) {
    const res = await fetch(`https://api.videasy.pro/episode/${encodeURIComponent(epId)}/stream`);
  const data = await res.json();
  return data?.streamUrl || '';
}
async function fetchVidsrcEpisodes(title) {
    const res = await fetch(`https://vidsrc-api.pro/anime/search?query=${encodeURIComponent(title)}`);
  const data = await res.json();
  if (!data || !data.results?.length) return { episodes: [] };
  const animeId = data.results[0].id;
  const epRes = await fetch(`https://vidsrc-api.pro/anime/${animeId}/episodes`);
  const epData = await epRes.json();
  if (!epData || !epData.episodes) return { episodes: [] };
  return { episodes: epData.episodes.map(ep => ({ id: ep.id, number: ep.number })) };
}
async function fetchVidsrcStream(epId) {
    const res = await fetch(`https://vidsrc-api.pro/episode/${encodeURIComponent(epId)}/stream`);
  const data = await res.json();
  return data?.streamUrl || '';
}


async function loadTrendingAnime() {
  trendingGrid.innerHTML = '<div>Loading trending anime...</div>';
  try {
    const res = await fetch('https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/top/anime?filter=bypopularity&limit=16');
    const data = await res.json();
    trendingGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
  } catch (e) {
    trendingGrid.innerHTML = '<div>Failed to load trending anime.</div>';
  }
}

if (homeBtn) {
  homeBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadTrendingAnime();
    loadRecentAnime();
    loadFeaturedAnime();
    loadContinueWatching();
    if (searchInput) searchInput.value = '';
    closePlayerModal();
  });
}

async function loadRecentAnime() {
  recentGrid.innerHTML = '<div>Loading recently added anime...</div>';
  try {
    const res = await fetch('https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/seasons/now?sort=start_date&order=desc&limit=16');
    const data = await res.json();
    recentGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
  } catch (e) {
    recentGrid.innerHTML = '<div>Failed to load recently added anime.</div>';
  }
}

async function loadFeaturedAnime() {
  featuredGrid.innerHTML = '<div>Loading featured anime...</div>';
  try {
    const res = await fetch('https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/top/anime?limit=3');
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
    const genreMap = {
      'action': 1, 'adventure': 2, 'comedy': 4, 'drama': 8, 'fantasy': 10, 'romance': 22, 'sci-fi': 24, 'sports': 30, 'slice of life': 36, 'horror': 14
    };
    const genreId = genreMap[genre.toLowerCase()];
    if (!genreId) {
      trendingGrid.innerHTML = '<div>Genre not found.</div>';
      return;
    }
    const res = await fetch(`https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/anime?genres=${genreId}&order_by=popularity&limit=8`);
    const data = await res.json();
    trendingGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
  } catch (e) {
    trendingGrid.innerHTML = '<div>Failed to load genre anime.</div>';
  }
}

function loadContinueWatching() {
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
    const res = await fetch(`https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=15`);
    const data = await res.json();
    if (data.data.length === 0) {
      trendingGrid.innerHTML = '<div>No results found.</div>';
    } else {
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

genreLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const genre = link.getAttribute('data-genre');
    loadGenreAnime(genre);
  });
});


document.addEventListener('click', function(e) {
  const card = e.target.closest('.anime-card');
  if (card && card.dataset.animeTitle) {
    openPlayerModal({
      title: decodeURIComponent(card.dataset.animeTitle),
      id: card.dataset.animeId,
      image: card.dataset.animeImage
    });
  }
});


function addHorizontalScroll(grid) {
  if (grid) {
    grid.style.overflowX = 'auto';
    grid.style.whiteSpace = 'nowrap';
    Array.from(grid.children).forEach(card => {
      card.style.display = 'inline-block';
      card.style.verticalAlign = 'top';
      card.style.width = '200px';
      card.style.marginRight = '1rem';
    });
  }
}

async function loadSeasonalAnime() {
  if (!seasonalGrid) return;
  seasonalGrid.innerHTML = '<div>Loading...</div>';
  try {
    const res = await fetch('https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/seasons/now?sort=popularity&limit=16');
    const data = await res.json();
    seasonalGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
    addHorizontalScroll(seasonalGrid);
  } catch (e) {
    seasonalGrid.innerHTML = '<div>Failed to load.</div>';
  }
}

async function loadTopAiringAnime() {
  if (!topAiringGrid) return;
  topAiringGrid.innerHTML = '<div>Loading...</div>';
  try {
    const res = await fetch('https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/top/anime?filter=airing&limit=16');
    const data = await res.json();
    topAiringGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
    addHorizontalScroll(topAiringGrid);
  } catch (e) {
    topAiringGrid.innerHTML = '<div>Failed to load.</div>';
  }
}

async function loadTopMoviesAnime() {
  if (!topMoviesGrid) return;
  topMoviesGrid.innerHTML = '<div>Loading...</div>';
  try {
    const res = await fetch('https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/top/anime?type=movie&limit=12');
    const data = await res.json();
    topMoviesGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
    addHorizontalScroll(topMoviesGrid);
  } catch (e) {
    topMoviesGrid.innerHTML = '<div>Failed to load.</div>';
  }
}

async function loadTopOngoingAnime() {
  if (!topOngoingGrid) return;
  topOngoingGrid.innerHTML = '<div>Loading...</div>';
  try {
    const res = await fetch('https://anime-proxy.kaidenlorse1.workers.dev/proxy/api.jikan.moe/v4/anime?status=airing&order_by=popularity&limit=16');
    const data = await res.json();
    topOngoingGrid.innerHTML = data.data.map(anime => getAnimeCard(anime)).join('');
    addHorizontalScroll(topOngoingGrid);
  } catch (e) {
    topOngoingGrid.innerHTML = '<div>Failed to load.</div>';
  }
}

loadTrendingAnime();
loadRecentAnime();
loadFeaturedAnime();
loadContinueWatching();
loadSeasonalAnime();
loadTopAiringAnime();
loadTopMoviesAnime();
loadTopOngoingAnime();
