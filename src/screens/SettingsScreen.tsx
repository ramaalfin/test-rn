import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQueryClient} from '@tanstack/react-query';
import useFavoritesStore from '../stores/useFavoritesStore';
import useSettingsStore from '../stores/useSettingsStore';
import useAppTheme from '../hooks/useAppTheme';
import useAuth from '../features/auth/hooks/useAuth';

const APP_VERSION = '0.0.1';

const SettingsScreen: React.FC = () => {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const {favorites, loadFavorites} = useFavoritesStore();
  const {isDarkMode, language, toggleDarkMode, setLanguage, loadSettings} =
    useSettingsStore();
  const {logout, user} = useAuth();
  const [localDarkMode, setLocalDarkMode] = useState(isDarkMode);

  useEffect(() => {
    loadSettings();
    loadFavorites();
  }, [loadSettings, loadFavorites]);

  useEffect(() => {
    setLocalDarkMode(isDarkMode);
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setLocalDarkMode(!localDarkMode);
    toggleDarkMode();
  };

  const handleLanguageChange = async (lang: 'en-US' | 'id-ID') => {
    await setLanguage(lang);
    queryClient.invalidateQueries();
  };

  const handleClearFavorites = () => {
    if (favorites.length === 0) {
      Alert.alert('No Favorites', 'You have no favorite movies to clear.');
      return;
    }

    Alert.alert(
      'Clear All Favorites',
      `Are you sure you want to remove all ${favorites.length} favorite movies?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const {removeFavorite} = useFavoritesStore.getState();
            for (const movie of favorites) {
              removeFavorite(movie.id);
            }
            Alert.alert('Success', 'All favorites have been cleared.');
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Clear React Query cache on logout
              queryClient.clear();
            } catch (error) {
              Alert.alert(
                'Logout Failed',
                'An error occurred while logging out. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.label,
      fontWeight: '600',
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.card,
    },
    settingInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingLabel: {
      ...theme.typography.body,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    settingDescription: {
      ...theme.typography.caption,
    },
    languageOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.card,
    },
    languageOptionActive: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.secondary,
    },
    languageText: {
      ...theme.typography.body,
      fontWeight: '500',
    },
    languageTextActive: {
      color: theme.colors.secondary,
      fontWeight: '600',
    },
    checkmark: {
      ...theme.typography.subheading,
      color: theme.colors.secondary,
      fontWeight: '700',
    },
    dangerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.error,
      ...theme.shadows.card,
    },
    dangerButtonText: {
      ...theme.typography.body,
      color: theme.colors.error,
      fontWeight: '600',
    },
    countBadge: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      minWidth: 24,
      alignItems: 'center',
    },
    countText: {
      ...theme.typography.caption,
      color: theme.colors.text.inverse,
      fontWeight: '700',
    },
    infoItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.card,
    },
    infoLabel: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
    },
    infoValue: {
      ...theme.typography.body,
      fontWeight: '600',
    },
    logoutButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.error,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.card,
    },
    logoutButtonText: {
      ...theme.typography.body,
      color: theme.colors.text.inverse,
      fontWeight: '600',
    },
    userInfo: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.card,
    },
    userEmail: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Enable dark theme
            </Text>
          </View>
          <Switch
            value={localDarkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.secondary,
            }}
            thumbColor={theme.colors.card}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <TouchableOpacity
          style={[
            styles.languageOption,
            language === 'en-US' && styles.languageOptionActive,
          ]}
          onPress={() => handleLanguageChange('en-US')}>
          <Text
            style={[
              styles.languageText,
              language === 'en-US' && styles.languageTextActive,
            ]}>
            🇺🇸 English
          </Text>
          {language === 'en-US' && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageOption,
            language === 'id-ID' && styles.languageOptionActive,
          ]}
          onPress={() => handleLanguageChange('id-ID')}>
          <Text
            style={[
              styles.languageText,
              language === 'id-ID' && styles.languageTextActive,
            ]}>
            🇮🇩 Indonesian
          </Text>
          {language === 'id-ID' && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClearFavorites}>
          <Text style={styles.dangerButtonText}>Clear All Favorites</Text>
          {favorites.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>{APP_VERSION}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>API</Text>
          <Text style={styles.infoValue}>TMDB</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
