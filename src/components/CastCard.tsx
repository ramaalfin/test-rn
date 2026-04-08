import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import theme from '../theme';
import type {Cast} from '../types/api.types';

interface CastCardProps {
  cast: Cast;
}

const CastCard: React.FC<CastCardProps> = ({cast}) => {
  const profileUrl = cast.profile_path
    ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
    : null;

  return (
    <View style={styles.container}>
      <Image
        source={
          profileUrl
            ? {uri: profileUrl}
            : {uri: "https://placeholder.pics/svg/300"}
        }
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name} numberOfLines={2}>
        {cast.name}
      </Text>
      <Text style={styles.character} numberOfLines={2}>
        {cast.character}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    marginRight: theme.spacing.md,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.skeleton,
    marginBottom: theme.spacing.xs,
  },
  name: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  character: {
    ...theme.typography.caption,
  },
});

export default CastCard;
