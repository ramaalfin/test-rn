import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../types/api.types';

const FAVORITES_KEY = '@favorites';

interface FavoritesState {
    favorites: Movie[];
    isLoading: boolean;
    addFavorite: (movie: Movie) => void;
    removeFavorite: (movieId: number) => void;
    isFavorite: (movieId: number) => boolean;
    loadFavorites: () => void;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favorites: [],
    isLoading: true,

    loadFavorites: async () => {
        try {
            const data = await AsyncStorage.getItem(FAVORITES_KEY);
            if (data) {
                const favorites = JSON.parse(data);
                set({ favorites, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            set({ isLoading: false });
        }
    },

    addFavorite: async (movie: Movie) => {
        try {
            const { favorites } = get();
            const updated = [...favorites, movie];
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
            set({ favorites: updated });
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    },

    removeFavorite: async (movieId: number) => {
        try {
            const { favorites } = get();
            const updated = favorites.filter(m => m.id !== movieId);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
            set({ favorites: updated });
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    },

    isFavorite: (movieId: number) => {
        const { favorites } = get();
        return favorites.some(m => m.id === movieId);
    },
}));

export default useFavoritesStore;
