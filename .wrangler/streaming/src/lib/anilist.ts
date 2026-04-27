import axios from "axios";

const ANILIST_API_URL = process.env.ANILIST_API_URL || "https://graphql.anilist.co";

const anilistClient = axios.create({
  baseURL: ANILIST_API_URL,
  timeout: 10000,
});

export interface AniListAnime {
  id: number;
  idMal: number | null;
  title: {
    romaji: string;
    english: string | null;
    native: string | null;
  };
  coverImage: {
    large: string;
    medium: string;
    color: string | null;
  };
  description: string | null;
  type: string | null;
  episodes: number | null;
  status: string;
  duration: number | null;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  endDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  season: string | null;
  seasonYear: number | null;
  averageScore: number | null;
  meanScore: number | null;
  popularity: number;
  favourites: number;
  studios: {
    nodes: { name: string }[];
  };
  genres: string[];
  source: string | null;
  siteUrl: string;
}

export interface AniListResponse<T> {
  data: T;
}

// GraphQL Queries

const GET_ANIME_BY_ID = `
  query GetAnimeById($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      idMal
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
        color
      }
      description
      type
      episodes
      status
      duration
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      season
      seasonYear
      averageScore
      meanScore
      popularity
      favourites
      studios {
        nodes {
          name
        }
      }
      genres
      source
      siteUrl
    }
  }
`;

const SEARCH_ANIME = `
  query SearchAnime($query: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(search: $query, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
          color
        }
        description
        type
        episodes
        status
        duration
        season
        seasonYear
        averageScore
        popularity
        genres
        siteUrl
      }
    }
  }
`;

const GET_TRENDING = `
  query GetTrending($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
          color
        }
        type
        episodes
        status
        averageScore
        popularity
        genres
        siteUrl
      }
    }
  }
`;

const GET_POPULAR = `
  query GetPopular($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
          color
        }
        type
        episodes
        status
        averageScore
        popularity
        genres
        siteUrl
      }
    }
  }
`;

// API Functions

export const anilistApi = {
  /**
   * Get anime by AniList ID
   */
  getAnimeById: async (id: number) => {
    const response = await anilistClient.post<AniListResponse<{ Media: AniListAnime }>>("", {
      query: GET_ANIME_BY_ID,
      variables: { id },
    });
    return response.data.data.Media;
  },

  /**
   * Search anime by query
   */
  searchAnime: async (query: string, page = 1, perPage = 25) => {
    const response = await anilistClient.post<AniListResponse<{
      Page: {
        pageInfo: { total: number; currentPage: number; lastPage: number; hasNextPage: boolean; perPage: number };
        media: Omit<AniListAnime, "description" | "duration" | "startDate" | "endDate" | "season" | "meanScore" | "favourites" | "studios" | "source">[];
      };
    }>>("", {
      query: SEARCH_ANIME,
      variables: { query, page, perPage },
    });
    return response.data.data.Page;
  },

  /**
   * Get trending anime
   */
  getTrending: async (page = 1, perPage = 25) => {
    const response = await anilistClient.post<AniListResponse<{
      Page: {
        pageInfo: { total: number; currentPage: number; lastPage: number; hasNextPage: boolean; perPage: number };
        media: Omit<AniListAnime, "description" | "duration" | "startDate" | "endDate" | "season" | "meanScore" | "favourites" | "studios" | "source">[];
      };
    }>>("", {
      query: GET_TRENDING,
      variables: { page, perPage },
    });
    return response.data.data.Page;
  },

  /**
   * Get popular anime
   */
  getPopular: async (page = 1, perPage = 25) => {
    const response = await anilistClient.post<AniListResponse<{
      Page: {
        pageInfo: { total: number; currentPage: number; lastPage: number; hasNextPage: boolean; perPage: number };
        media: Omit<AniListAnime, "description" | "duration" | "startDate" | "endDate" | "season" | "meanScore" | "favourites" | "studios" | "source">[];
      };
    }>>("", {
      query: GET_POPULAR,
      variables: { page, perPage },
    });
    return response.data.data.Page;
  },
};

export default anilistApi;