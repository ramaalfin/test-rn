import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import theme from '../theme';
import type {Review} from '../types/api.types';
import {formatDate} from '../utils/formatters';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({review}) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200;
  const shouldTruncate = review.content.length > maxLength;

  const displayContent = expanded
    ? review.content
    : review.content.slice(0, maxLength);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.author}>{review.author}</Text>
        {review.author_details.rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>
              ⭐ {review.author_details.rating}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.date}>{formatDate(review.created_at)}</Text>
      <Text style={styles.content}>
        {displayContent}
        {shouldTruncate && !expanded && '...'}
      </Text>
      {shouldTruncate && (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMore}>
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  author: {
    ...theme.typography.subheading,
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  ratingText: {
    ...theme.typography.caption,
    color: theme.colors.rating,
    fontWeight: '600',
  },
  date: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.md,
  },
  content: {
    ...theme.typography.body,
    lineHeight: 20,
  },
  readMore: {
    ...theme.typography.body,
    color: theme.colors.secondary,
    marginTop: theme.spacing.sm,
    fontWeight: '600',
  },
});

export default ReviewCard;
