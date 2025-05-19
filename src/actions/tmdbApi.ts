"use server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Person {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  gender: number;
  known_for_department: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  imdb_id: string | null;
  homepage: string | null;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  last_air_date: string;
  episode_run_time: number[];
  number_of_episodes: number;
  number_of_seasons: number;
  vote_average: number;
  vote_count: number;
  status: string;
  type: string;
  tagline: string;
  genres: { id: number; name: string }[];
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    original_name: string;
    gender: number;
    profile_path: string | null;
  }[];
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }[];
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
  next_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string | null;
  } | null;
}

export interface WatchProvider {
  id: number;
  name: string;
  logo_path: string;
}

export interface Certification {
  certification: string;
  meaning: string;
  order: number;
}

export interface WatchProviders {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface MovieCredit {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
}

export interface TVCredit {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id: string;
  episode_count?: number;
  department?: string;
  job?: string;
}

export interface PersonCredits {
  cast: MovieCredit[];
  crew: MovieCredit[];
}

export interface PersonTVCredits {
  cast: TVCredit[];
  crew: TVCredit[];
}

export interface CombinedCredit {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  title?: string;
  name?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id: string;
  order?: number;
  episode_count?: number;
  department?: string;
  job?: string;
  media_type: 'movie' | 'tv';
}

export interface CombinedCredits {
  cast: CombinedCredit[];
  crew: CombinedCredit[];
}

export interface ExternalIds {
  id: number;
  freebase_mid: string | null;
  freebase_id: string | null;
  imdb_id: string | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  tiktok_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
}

export interface SearchResult {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title?: string;
  name?: string;
  original_language: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  genre_ids: number[];
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  profile_path?: string | null;
}

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

export interface TrendingResult {
  adult?: boolean;
  backdrop_path?: string | null;
  id: number;
  title?: string;
  name?: string;
  original_language?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  media_type: string;
  genre_ids?: number[];
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  profile_path?: string | null;
}

export interface TrendingResponse {
  page: number;
  results: TrendingResult[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie genres");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    throw new Error("Failed to fetch movie genres");
  }
}

export async function getTVGenres(): Promise<{ genres: Genre[] }> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/tv/list?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV genres");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    throw new Error("Failed to fetch TV genres");
  }
}

export async function getMovieDetails(id: string): Promise<Movie> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw new Error("Failed to fetch movie details");
  }
}

export async function getMovieCredits(id: string): Promise<Credits> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/credits?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie credits");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw new Error("Failed to fetch movie credits");
  }
}

export async function getPersonDetails(id: string): Promise<Person> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${id}?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch person details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person details:", error);
    throw new Error("Failed to fetch person details");
  }
}

export async function getTVShowDetails(id: string): Promise<TVShow> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV show details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    throw new Error("Failed to fetch TV show details");
  }
}

export async function getTVShowCredits(id: string): Promise<Credits> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/credits?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV show credits");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV show credits:", error);
    throw new Error("Failed to fetch TV show credits");
  }
}

export async function getMovieWatchProviders(id: string): Promise<WatchProviders | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}/watch/providers`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie watch providers");
    }

    const data = await response.json();
    return data.results.TR || null;
  } catch (error) {
    console.error("Error fetching movie watch providers:", error);
    return null;
  }
}

export async function getTVShowWatchProviders(id: string): Promise<WatchProviders | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${id}/watch/providers`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV show watch providers");
    }

    const data = await response.json();
    return data.results.TR || null;
  } catch (error) {
    console.error("Error fetching TV show watch providers:", error);
    return null;
  }
}

export async function getPersonMovieCredits(id: string): Promise<PersonCredits> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${id}/movie_credits?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch person movie credits");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person movie credits:", error);
    throw new Error("Failed to fetch person movie credits");
  }
}

export async function getPersonTVCredits(id: string): Promise<PersonTVCredits> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${id}/tv_credits?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch person TV credits");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person TV credits:", error);
    throw new Error("Failed to fetch person TV credits");
  }
}

export async function getPersonCombinedCredits(id: string): Promise<CombinedCredits> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${id}/combined_credits?language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch person combined credits");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person combined credits:", error);
    throw new Error("Failed to fetch person combined credits");
  }
}

export async function getPersonExternalIds(personId: string): Promise<ExternalIds> {
  const response = await fetch(
    `${TMDB_BASE_URL}/person/${personId}/external_ids`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      next: { revalidate: 60 * 60 * 24 }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch person external ids");
  }

  return response.json();
}

export async function searchMulti(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&page=${page}&language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw new Error("Failed to fetch search results");
  }
}

export async function getTrendingAll(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<TrendingResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/all/${timeWindow}?page=${page}&language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 1800
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch trending all");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching trending all:", error);
    throw new Error("Failed to fetch trending all");
  }
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<TrendingResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?page=${page}&language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 1800
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch trending movies");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw new Error("Failed to fetch trending movies");
  }
}

export async function getTrendingTV(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<TrendingResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/tv/${timeWindow}?page=${page}&language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 1800
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch trending TV shows");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching trending TV shows:", error);
    throw new Error("Failed to fetch trending TV shows");
  }
}

export async function getTrendingPersons(timeWindow: 'day' | 'week' = 'day', page: number = 1): Promise<TrendingResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/person/${timeWindow}?page=${page}&language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 1800
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch trending persons");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching trending persons:", error);
    throw new Error("Failed to fetch trending persons");
  }
}

export async function getNowPlayingMovies() {
  const cacheKey = 'now_playing_movies';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/now_playing?language=tr-TR&region=tr`,
    { 
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}

export async function getPopularMovies() {
  const cacheKey = 'popular_movies';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?language=tr-TR&region=tr`,
    { 
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}

export async function getUpcomingMovies() {
  const cacheKey = 'upcoming_movies';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/upcoming?language=tr-TR&region=tr`,
    { 
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}

export async function getTopRatedMovies() {
  const cacheKey = 'top_rated_movies';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${TMDB_BASE_URL}/movie/top_rated?language=tr-TR&region=tr`,
    { 
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}

export async function getAiringTodayTVShows() {
  const cacheKey = 'airing_today_tv';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/airing_today?language=tr-TR`,
    { 
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}

export async function getOnTheAirTVShows() {
  const cacheKey = 'on_the_air_tv';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/on_the_air?language=tr-TR`,
    { 
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}

export async function getPopularTVShows() {
  const cacheKey = 'popular_tv';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/popular?language=tr-TR`,
    { 
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}

export async function getTopRatedTVShows() {
  const cacheKey = 'top_rated_tv';
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await fetch(
    `${TMDB_BASE_URL}/tv/top_rated?language=tr-TR`,
    { 
      next: { revalidate: 3600 },
      headers: {
        'Authorization': `Bearer ${TMDB_API_KEY}`,
        'accept': 'application/json'
      }
    }
  );
  const data = await response.json();
  setCachedData(cacheKey, data);
  return data;
}

export interface DiscoverFilters {
  media_type?: 'movie' | 'tv';
  sort_by?: string;
  with_genres?: string;
  with_original_language?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  'vote_average.gte'?: number;
  vote_count_gte?: number;
  year?: number;
  with_cast?: string;
  page?: number;
  with_status?: string;
  with_type?: string;
  primary_release_year?: number;
  first_air_date_year?: number;
  release_date_gte?: string;
  release_date_lte?: string;
  air_date_gte?: string;
  air_date_lte?: string;
}

export async function getWatchProviders(mediaType: 'movie' | 'tv'): Promise<{ results: WatchProvider[] }> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/watch/providers/${mediaType}?language=tr-TR&watch_region=TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${mediaType} watch providers`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${mediaType} watch providers:`, error);
    throw new Error(`Failed to fetch ${mediaType} watch providers`);
  }
}

export async function getMovieCertifications(): Promise<{ certifications: { [key: string]: Certification[] } }> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/certification/movie/list`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie certifications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie certifications:", error);
    throw new Error("Failed to fetch movie certifications");
  }
}

export async function discoverMovies(filters: DiscoverFilters = {}) {
  const queryParams = new URLSearchParams();
  
  queryParams.append('language', 'tr-TR');
  queryParams.append('region', 'tr');
  queryParams.append('include_adult', 'false');
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {

      if (typeof value === 'boolean') {
        queryParams.append(key, value.toString());
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  if (filters.year) {
    if (filters.media_type === 'movie') {
      queryParams.append('primary_release_year', filters.year.toString());
    } else if (filters.media_type === 'tv') {
      queryParams.append('first_air_date_year', filters.year.toString());
    }
  }

  const mediaType = filters.media_type || 'movie';
  const url = `${TMDB_BASE_URL}/discover/${mediaType}?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch discover ${mediaType}`);
  }

  return response.json();
}

export interface PersonSearchResult {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  known_for: Array<{
    adult: boolean;
    backdrop_path: string | null;
    id: number;
    title?: string;
    name?: string;
    original_language: string;
    original_title?: string;
    original_name?: string;
    overview: string;
    poster_path: string | null;
    media_type: string;
    genre_ids: number[];
    popularity: number;
    release_date?: string;
    first_air_date?: string;
    video?: boolean;
    vote_average: number;
    vote_count: number;
  }>;
}

export interface PersonSearchResponse {
  page: number;
  results: PersonSearchResult[];
  total_pages: number;
  total_results: number;
}

export async function searchPerson(query: string, page: number = 1): Promise<PersonSearchResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/person?query=${encodeURIComponent(query)}&page=${page}&language=tr-TR`,
      {
        headers: {
          "Authorization": `Bearer ${TMDB_API_KEY}`,
          "accept": "application/json"
        },
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch person search results");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching person search results:", error);
    throw new Error("Failed to fetch person search results");
  }
} 

