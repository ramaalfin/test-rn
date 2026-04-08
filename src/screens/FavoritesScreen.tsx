import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from '../theme';
import type { Movie } from '../types/api.types';
import type { RootStackParamList } from '../navigation/RootNavigator';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import useFavoritesStore from '../stores/useFavoritesStore';
import useAppTheme from '../hooks/useAppTheme';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Tabs'
>;

const FavoritesScreen: React.FC = () => {
  const theme = useAppTheme();
  const { favorites, loadFavorites, isLoading } = useFavoritesStore();
  const navigation = useNavigation<FavoritesScreenNavigationProp>();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Detail', { movieId: movie.id });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    list: {
      paddingVertical: theme.spacing.sm,
    },
  });

  if (!isLoading && favorites.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          message="No favorite movies yet. Start adding some!"
          icon="❤️"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={handleMoviePress} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default FavoritesScreen;
