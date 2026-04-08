import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
    RECENT_SEARCHES: '@recent_searches',
};

export const saveRecentSearch = async (keyword: string) => {
    try {
        const existing = await getRecentSearches();
        const filtered = existing.filter(item => item !== keyword);

        const updated = [keyword, ...filtered].slice(0, 5);
        await AsyncStorage.setItem(
            STORAGE_KEYS.RECENT_SEARCHES,
            JSON.stringify(updated),
        );
    } catch (error) {
        console.error('Error saving recent search:', error);
    }
};

export const getRecentSearches = async (): Promise<string[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting recent searches:', error);
        return [];
    }
};

export const clearRecentSearches = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (error) {
        console.error('Error clearing recent searches:', error);
    }
};
