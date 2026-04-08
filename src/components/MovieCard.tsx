import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../theme';
import type { Movie } from '../types/api.types';
import RatingStars from './RatingStars';
import { formatDate } from '../utils/formatters';
import useAppTheme from '../hooks/useAppTheme';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;

  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.sm,
      padding: theme.spacing.md,
      ...theme.shadows.card,
    },
    poster: {
      width: 80,
      height: 120,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.skeleton,
    },
    info: {
      flex: 1,
      marginLeft: theme.spacing.md,
      justifyContent: 'center',
    },
    title: {
      ...theme.typography.subheading,
      marginBottom: theme.spacing.xs,
    },
    releaseDate: {
      ...theme.typography.caption,
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(movie)}
      activeOpacity={0.7}>
      <Image
        source={posterUrl ? { uri: posterUrl } : undefined}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <RatingStars rating={movie.vote_average} size={14} />
        <Text style={styles.releaseDate}>{formatDate(movie.release_date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;
