import css from "./App.module.css";
import { useEffect, useState, type ComponentType } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";
import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [nameMovie, setNameMovie] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["movie", nameMovie, page],
    queryFn: () => fetchMovies(nameMovie!, page),
    enabled: nameMovie !== null,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  function handleSearch(query: string) {
    setNameMovie(query);
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
        {isSuccess && (
          <ReactPaginate
            pageCount={data.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        {isSuccess && (
          <MovieGrid onSelect={handleSelect} movies={data.results} />
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
