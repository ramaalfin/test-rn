import { useQuery } from '@tanstack/react-query';
import { getItemDetail } from '../api/items';
import type { Item } from '../types/api.types';

/**
 * Query keys for item detail
 * Follows React Query best practices for key management
 */
export const itemDetailKeys = {
    detail: (id: number) => ['item', id] as const,
};

/**
 * Custom hook for fetching a single item from JSONPlaceholder /posts/:id endpoint
 * Replaces useMovieDetail hook from TMDB API integration
 * 
 * Uses React Query with:
 * - queryKey: ['item', id] for proper cache management
 * - enabled: Only fetches when id exists
 * - staleTime: 5 minutes (same as useItems for consistency)
 * - cacheTime: 10 minutes (same as useItems for consistency)
 * 
 * @param id - The item ID to fetch
 * @returns React Query result with loading, error, and data states
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 18.5, 18.7
 */
const useItemDetail = (id: number) => {
    return useQuery<Item>({
        queryKey: itemDetailKeys.detail(id),
        queryFn: () => getItemDetail(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });
};

export default useItemDetail;
