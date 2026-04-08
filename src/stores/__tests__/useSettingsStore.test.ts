import AsyncStorage from '@react-native-async-storage/async-storage';
import useSettingsStore from '../useSettingsStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

describe('useSettingsStore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset store state
        useSettingsStore.setState({
            isDarkMode: false,
            language: 'en-US',
            isLoading: true,
        });
    });

    describe('loadSettings', () => {
        it('should load settings from AsyncStorage', async () => {
            const mockSettings = {
                isDarkMode: true,
                language: 'id-ID',
            };
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
                JSON.stringify(mockSettings)
            );

            await useSettingsStore.getState().loadSettings();

            expect(AsyncStorage.getItem).toHaveBeenCalledWith('@settings');
            expect(useSettingsStore.getState().isDarkMode).toBe(true);
            expect(useSettingsStore.getState().language).toBe('id-ID');
            expect(useSettingsStore.getState().isLoading).toBe(false);
        });

        it('should use default settings when AsyncStorage is empty', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

            await useSettingsStore.getState().loadSettings();

            expect(useSettingsStore.getState().isDarkMode).toBe(false);
            expect(useSettingsStore.getState().language).toBe('en-US');
            expect(useSettingsStore.getState().isLoading).toBe(false);
        });

        it('should handle errors gracefully', async () => {
            (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
                new Error('Storage error')
            );
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await useSettingsStore.getState().loadSettings();

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error loading settings:',
                expect.any(Error)
            );
            expect(useSettingsStore.getState().isLoading).toBe(false);
            consoleSpy.mockRestore();
        });
    });

    describe('toggleDarkMode', () => {
        it('should toggle dark mode from false to true', async () => {
            useSettingsStore.setState({ isDarkMode: false, language: 'en-US' });

            await useSettingsStore.getState().toggleDarkMode();

            expect(useSettingsStore.getState().isDarkMode).toBe(true);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                '@settings',
                JSON.stringify({ isDarkMode: true, language: 'en-US' })
            );
        });

        it('should toggle dark mode from true to false', async () => {
            useSettingsStore.setState({ isDarkMode: true, language: 'en-US' });

            await useSettingsStore.getState().toggleDarkMode();

            expect(useSettingsStore.getState().isDarkMode).toBe(false);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                '@settings',
                JSON.stringify({ isDarkMode: false, language: 'en-US' })
            );
        });

        it('should handle errors gracefully', async () => {
            (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
                new Error('Storage error')
            );
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await useSettingsStore.getState().toggleDarkMode();

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error toggling dark mode:',
                expect.any(Error)
            );
            consoleSpy.mockRestore();
        });
    });

    describe('setLanguage', () => {
        it('should update language and persist to storage', async () => {
            (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
            useSettingsStore.setState({ isDarkMode: false, language: 'en-US' });

            await useSettingsStore.getState().setLanguage('id-ID');

            expect(useSettingsStore.getState().language).toBe('id-ID');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                '@settings',
                JSON.stringify({ isDarkMode: false, language: 'id-ID' })
            );
        });

        it('should preserve dark mode setting when changing language', async () => {
            (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
            useSettingsStore.setState({ isDarkMode: true, language: 'en-US' });

            await useSettingsStore.getState().setLanguage('id-ID');

            expect(useSettingsStore.getState().isDarkMode).toBe(true);
            expect(useSettingsStore.getState().language).toBe('id-ID');
        });

        it('should handle errors gracefully', async () => {
            (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
                new Error('Storage error')
            );
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            await useSettingsStore.getState().setLanguage('id-ID');

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error setting language:',
                expect.any(Error)
            );
            consoleSpy.mockRestore();
        });
    });
});
