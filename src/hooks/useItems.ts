import { useQuery } from '@tanstack/react-query';
import { getItems } from '../api/items';
import type { Item } from '../types/api.types';

/**
 * Query keys for items
 * Follows React Query best practices for key management
 */
export const itemKeys = {
    all: ['items'] as const,
};

/**
 * Custom hook for fetching items from JSONPlaceholder /posts endpoint
 * Replaces useMovies hook from TMDB API integration
 * 
 * Uses React Query with:
 * - staleTime: 5 minutes (data considered fresh for 5 minutes)
 * - cacheTime: 10 minutes (cached data kept in memory for 10 minutes)
 * 
 * Returns loading, error, and data states managed by React Query
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 18.5, 18.6
 */
const useItems = () => {
    return useQuery<Item[]>({
        queryKey: itemKeys.all,
        queryFn: getItems,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};

export default useItems;
