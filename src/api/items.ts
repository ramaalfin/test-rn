import apiClient from './client';
import type { Item } from '../types/api.types';

/**
 * Fetch all items from JSONPlaceholder /posts endpoint
 * 
 * Requirements: 18.5, 18.6
 */
export const getItems = async (): Promise<Item[]> => {
    const response = await apiClient.get<Item[]>('/posts');
    return response.data;
};

/**
 * Fetch a single item by ID from JSONPlaceholder /posts/:id endpoint
 * 
 * Requirements: 18.5, 18.7
 */
export const getItemDetail = async (id: number): Promise<Item> => {
    const response = await apiClient.get<Item>(`/posts/${id}`);
    return response.data;
};
