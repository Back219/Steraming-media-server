import fetch from 'node-fetch';
import { TMDB_API_KEY } from '../config';

export interface Metadata {
  title?: string;
  overview?: string;
  poster?: string;
  release_date?: string;
  tmdb_id?: number;
}

/**
 * Query TMDB for a movie/series by title (best-effort).
 * Requires TMDB_API_KEY environment variable set.
 */
export async function fetchMetadataByTitle(title: string): Promise<Metadata | null> {
  if (!TMDB_API_KEY) return null;
  const query = encodeURIComponent(title);
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${query}&include_adult=false`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data && data.results && data.results.length > 0) {
    const first = data.results[0];
    return {
      title: first.title || first.name,
      overview: first.overview,
      poster: first.poster_path ? `https://image.tmdb.org/t/p/w500${first.poster_path}` : undefined,
      release_date: first.release_date || first.first_air_date,
      tmdb_id: first.id
    };
  }
  return null;
}
