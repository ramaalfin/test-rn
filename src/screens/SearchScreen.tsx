import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import useMovieSearch from '../hooks/useMovieSearch';
import useRecentSearches from '../hooks/useRecentSearches';
import theme from '../theme';
import type { Movie } from '../types/api.types';
import type { RootStackParamList } from '../navigation/RootNavigator';
import useAppTheme from '../hooks/useAppTheme';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Tabs'
>;

const SearchScreen: React.FC = () => {
  const theme = useAppTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading } = useMovieSearch(searchQuery);
  const { searches, addSearch, clearAll } = useRecentSearches();
  const navigation = useNavigation<SearchScreenNavigationProp>();

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Detail', { movieId: movie.id });
  };

  const handleSearch = () => {
    if (searchInput.trim().length > 0) {
      setSearchQuery(searchInput.trim());
      addSearch(searchInput.trim());
      setIsFocused(false);
      setHasSearched(true);
    }
  };

  const handleRecentSearchPress = (keyword: string) => {
    setSearchInput(keyword);
    setSearchQuery(keyword);
    setIsFocused(false);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setHasSearched(false);
  };

  const handleClearRecent = () => {
    clearAll();
  };

  const showRecentSearches = isFocused && !searchQuery && searches.length > 0;
  const showResults = searchQuery.length > 0 && hasSearched;
  const showEmptyState = showResults && !isLoading && data?.results.length === 0;
  const showLoading = isLoading && hasSearched;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      height: 40,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      ...theme.typography.body,
      color: theme.colors.text.primary,
    },
    clearButton: {
      marginLeft: theme.spacing.sm,
      padding: theme.spacing.sm,
    },
    clearButtonText: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
      fontSize: 18,
    },
    recentContainer: {
      backgroundColor: theme.colors.card,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    recentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    recentTitle: {
      ...theme.typography.label,
      fontWeight: '600',
    },
    clearText: {
      ...theme.typography.caption,
      color: theme.colors.secondary,
    },
    recentItem: {
      paddingVertical: theme.spacing.sm,
    },
    recentItemText: {
      ...theme.typography.body,
      color: theme.colors.text.primary,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    list: {
      paddingVertical: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor={theme.colors.text.secondary}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
          onFocus={() => setIsFocused(true)}
          returnKeyType="search"
        />
        {searchInput.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSearch}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showRecentSearches && (
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={handleClearRecent}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          {searches.map((keyword, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentItem}
              onPress={() => handleRecentSearchPress(keyword)}>
              <Text style={styles.recentItemText}>🔍 {keyword}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        </View>
      )}

      {showEmptyState && (
        <EmptyState
          message="No movies found. Try a different search term."
          icon="🔍"
        />
      )}

      {showResults && !isLoading && data && data.results.length > 0 && (
        <FlatList
          data={data.results}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={handleMoviePress} />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {!isLoading && !showResults && !showRecentSearches && (
        <EmptyState
          message="Search for your favorite movies"
          icon="🎬"
        />
      )}
    </View>
  );
};

export default SearchScreen;
