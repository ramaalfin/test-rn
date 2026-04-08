import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../navigation/AppNavigator';
import useItemDetail from '../hooks/useItemDetail';
import CardItem from '../components/CardItem';
import {LoadingSkeleton, SkeletonCard} from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import useAppTheme from '../hooks/useAppTheme';

type DetailScreenProps = NativeStackScreenProps<AppStackParamList, 'Detail'>;

/**
 * DetailScreen Component
 * 
 * Displays detailed information about a single item from JSONPlaceholder API.
 * Replaces the old movie detail screen with a simpler, generic item detail view.
 * 
 * Requirements:
 * - 6.1: Navigate to detail screen with item ID
 * - 6.2: Fetch detailed data from Public API
 * - 6.3: Reuse CardItem component for consistency
 * - 6.4: Display skeleton loaders during loading
 * - 6.5: Display error state with retry button
 * - 6.6: Display empty state when no data
 * - 6.7: Structured layout with clear typography hierarchy
 * - 11.4: Clear typography hierarchy
 * - 11.7: Structured layout with visual hierarchy
 * - 18.7: Use generic item types and endpoints
 * 
 * Features:
 * - Uses useItemDetail hook for data fetching
 * - Displays LoadingSkeleton during loading (not ActivityIndicator)
 * - Displays ErrorState with retry functionality
 * - Displays EmptyState when no data returned
 * - Reuses CardItem component for consistent styling
 * - Clean, minimal layout focused on content
 */
const DetailScreen: React.FC<DetailScreenProps> = ({route}) => {
  const {itemId} = route.params;
  const theme = useAppTheme();

  const {data: item, isLoading, isError, error, refetch} = useItemDetail(itemId);

  /**
   * Loading State
   * Requirements: 6.4 - Display skeleton loaders during loading
   */
  if (isLoading) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={[styles.content, {padding: theme.spacing.lg}]}>
          <SkeletonCard />
        </View>
      </View>
    );
  }

  /**
   * Error State
   * Requirements: 6.5 - Display error state with retry button
   */
  if (isError) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <ErrorState
          message={error instanceof Error ? error.message : 'Failed to load item details'}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  /**
   * Empty State
   * Requirements: 6.6 - Display empty state when no data
   */
  if (!item) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <EmptyState
          message="Item not found"
          icon="🔍"
        />
      </View>
    );
  }

  /**
   * Success State
   * Requirements:
   * - 6.3: Reuse CardItem component for consistency
   * - 6.7: Structured layout with clear typography hierarchy
   * - 11.4: Clear typography hierarchy
   * - 11.7: Structured layout with visual hierarchy
   */
  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.content, {padding: theme.spacing.lg}]}>
        <CardItem
          item={item}
          onPress={() => {}} // No-op since we're already on detail screen
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default DetailScreen;
