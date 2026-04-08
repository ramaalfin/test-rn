import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '../api/movies';
import type { Movie, PaginatedResponse } from '../types/api.types';

export const searchKeys = {
    all: ['search'] as const,
    movies: (query: string) => [...searchKeys.all, 'movies', query] as const,
};

const useMovieSearch = (query: string) => {
    return useQuery<PaginatedResponse<Movie>>({
        queryKey: searchKeys.movies(query),
        queryFn: () => searchMovies(query),
        enabled: query.length > 0,
    });
};

export default useMovieSearch;
