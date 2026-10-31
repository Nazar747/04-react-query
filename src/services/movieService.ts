import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
  results: Movie[];
}

async function fetchMovies(query: string): Promise<Movie[]> {
  const myKey = import.meta.env.VITE_TMDB_TOKEN;

  const { data } = await axios.get<MoviesHttpResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    },
  );

  return data.results;
}

export default fetchMovies;
