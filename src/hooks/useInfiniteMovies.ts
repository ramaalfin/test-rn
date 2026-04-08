import { useInfiniteQuery } from '@tanstack/react-query';
import { getPopularMovies } from '../api/movies';
import type { Movie, PaginatedResponse } from '../types/api.types';

export const movieKeys = {
    all: ['movies'] as const,
    popular: () => [...movieKeys.all, 'popular'] as const,
};

const useInfiniteMovies = () => {
    return useInfiniteQuery<PaginatedResponse<Movie>>({
        queryKey: movieKeys.popular(),
        queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam as number),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.total_pages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
    });
};

export default useInfiniteMovies;
