import { useQuery } from '@tanstack/react-query';
import { getPopularMovies } from '../api/movies';
import type { Movie, PaginatedResponse } from '../types/api.types';

export const movieKeys = {
  all: ['movies'] as const,
  popular: () => [...movieKeys.all, 'popular'] as const,
};

const useMovies = () => {
  return useQuery<PaginatedResponse<Movie>>({
    queryKey: movieKeys.popular(),
    queryFn: getPopularMovies,
  });
};

export default useMovies;
