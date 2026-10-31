import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

async function fetchMovies(
  query: string,
  page: number,
): Promise<MoviesHttpResponse> {
  const myKey = import.meta.env.VITE_TMDB_TOKEN;

  const { data } = await axios.get<MoviesHttpResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    },
  );

  return data;
}

export default fetchMovies;
