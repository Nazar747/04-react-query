import css from "./App.module.css";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  async function handleSearch(query: string) {
    setMovies([]);

    try {
      setIsLoading(true);
      setIsError(false);

      const data = await fetchMovies(query);

      if (data.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelect(movie: Movie) {
    setSelectedMovie(movie);
  }

  function handleClose() {
    setSelectedMovie(null);
  }

  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
        {movies.length > 0 && (
          <MovieGrid onSelect={handleSelect} movies={movies} />
        )}
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleClose} />
        )}
        <Toaster />
      </div>
    </>
  );
}

export default App;
