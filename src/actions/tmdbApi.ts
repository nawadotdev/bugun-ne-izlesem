"use server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

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
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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
          revalidate: 3600 // 1 saat cache
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

