import axios from "axios";

const JIKAN_BASE_URL = process.env.JIKAN_BASE_URL || "https://api.jikan.moe/v4";

const jikanClient = axios.create({
  baseURL: JIKAN_BASE_URL,
  timeout: 10000,
});

// Rate limiting - Jikan allows 3 requests per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 350; // ms

const rateLimitedRequest = async <T>(...args: Parameters<typeof jikanClient.get>) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return jikanClient.get<T>(...args);
};

export interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  type: string | null;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
  };
  duration: string | null;
  rating: string | null;
  score: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  studios: { name: string }[];
  genres: { name: string }[];
  source: string | null;
  url: string;
}

export interface AnimeListResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface AnimeDetailsResponse {
  data: Anime;
}

export interface Episode {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  title_romanized: string | null;
  aired: string | null;
  duration: string | null;
  summary: string | null;
  forum_url: string;
}

export interface EpisodesResponse {
  data: Episode[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
}

// API Functions

export const jikanApi = {
  /**
   * Search for anime
   * @param query - Search term
   * @param page - Page number (default: 1)
   * @param limit - Results per page (default: 25, max: 25)
   */
  searchAnime: async (query: string, page = 1, limit = 25) => {
    const response = await rateLimitedRequest<AnimeListResponse>("/anime", {
      params: {
        q: query,
        sfw: true, // Safe for work
        page,
        limit,
      },
    });
    return response.data;
  },

  /**
   * Get top anime list
   */
  getTopAnime: async (page = 1, limit = 25) => {
    const response = await rateLimitedRequest<AnimeListResponse>("/top/anime", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get currently airing anime
   */
  getCurrentSeason: async (page = 1, limit = 25) => {
    const response = await rateLimitedRequest<AnimeListResponse>("/seasons/now", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get anime details by ID
   */
  getAnimeDetails: async (id: number) => {
    const response = await rateLimitedRequest<AnimeDetailsResponse>(`/anime/${id}`);
    return response.data;
  },

  /**
   * Get episodes for an anime
   */
  getEpisodes: async (id: number, page = 1) => {
    const response = await rateLimitedRequest<EpisodesResponse>(`/anime/${id}/episodes`, {
      params: { page },
    });
    return response.data;
  },

  /**
   * Get episode details
   */
  getEpisodeDetails: async (animeId: number, episodeNumber: number) => {
    const response = await rateLimitedRequest<{ data: Episode }>(
      `/anime/${animeId}/episodes/${episodeNumber}`
    );
    return response.data;
  },

  /**
   * Get anime by genre
   */
  getAnimeByGenre: async (genreId: number, page = 1, limit = 25) => {
    const response = await rateLimitedRequest<AnimeListResponse>("/anime", {
      params: {
        genres: genreId,
        sfw: true,
        page,
        limit,
      },
    });
    return response.data;
  },
};

export default jikanApi;